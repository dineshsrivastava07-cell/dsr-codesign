import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import { type CallbackServer, startCallbackServer } from '@dsr-codesign/providers/codex';
import {
  buildAuthorizeUrl,
  exchangeCode,
  fetchGoogleEmail,
  GoogleTokenStore,
  generatePkce,
  isClientIdConfigured,
  type StoredGoogleAuth,
} from '@dsr-codesign/providers/google';
import {
  CodesignError,
  type Config,
  ERROR_CODES,
  GOOGLE_GEMINI_PROVIDER_ID,
  hydrateConfig,
  type ProviderEntry,
} from '@dsr-codesign/shared';
import { configDir, writeConfig } from './config';
import { ipcMain, shell } from './electron-runtime';
import { getLogger } from './logger';
import { getCachedConfig, setCachedConfig } from './onboarding-ipc';

const logger = getLogger('google-oauth-ipc');

export interface GoogleOAuthStatus {
  loggedIn: boolean;
  email: string | null;
  expiresAt: number | null;
  clientIdConfigured: boolean;
}

export { GOOGLE_GEMINI_PROVIDER_ID };

const GOOGLE_GEMINI_DEFAULT_MODEL = 'models/gemini-2.0-flash';
const GOOGLE_GEMINI_MODELS = [
  'models/gemini-2.5-pro',
  'models/gemini-2.5-flash',
  'models/gemini-2.0-flash',
  'models/gemini-2.0-flash-lite',
  'models/gemini-1.5-pro',
  'models/gemini-1.5-flash',
];

const GOOGLE_GEMINI_PROVIDER: ProviderEntry = {
  id: GOOGLE_GEMINI_PROVIDER_ID,
  name: 'Google Gemini (signed in)',
  builtin: false,
  wire: 'openai-chat',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
  modelsHint: GOOGLE_GEMINI_MODELS,
  requiresApiKey: false,
  capabilities: {
    supportsKeyless: true,
    supportsModelsEndpoint: true,
    supportsReasoning: false,
    requiresClaudeCodeIdentity: false,
    modelDiscoveryMode: 'static-hint',
  },
};

let tokenStoreSingleton: GoogleTokenStore | null = null;
let activeLoginAbortController: AbortController | null = null;
let activeLoginPromise: Promise<GoogleOAuthStatus> | null = null;

export function getGoogleTokenStore(): GoogleTokenStore {
  if (tokenStoreSingleton === null) {
    tokenStoreSingleton = new GoogleTokenStore({
      filePath: join(configDir(), 'google-auth.json'),
    });
  }
  return tokenStoreSingleton;
}

export function __resetGoogleTokenStoreForTests(): void {
  tokenStoreSingleton = null;
  activeLoginAbortController = null;
  activeLoginPromise = null;
}

function toStatus(stored: StoredGoogleAuth | null): GoogleOAuthStatus {
  return {
    loggedIn: stored !== null,
    email: stored?.email ?? null,
    expiresAt: stored?.expiresAt ?? null,
    clientIdConfigured: isClientIdConfigured(),
  };
}

async function runStatus(): Promise<GoogleOAuthStatus> {
  const stored = await getGoogleTokenStore().read();
  return toStatus(stored);
}

async function persistProviderMutation(
  mutate: (providers: Record<string, ProviderEntry>) => Record<string, ProviderEntry>,
): Promise<void> {
  const cfg = getCachedConfig();
  const prevProviders: Record<string, ProviderEntry> = cfg?.providers ?? {};
  const nextProviders = mutate({ ...prevProviders });
  const next: Config = hydrateConfig({
    version: 3,
    activeProvider: cfg?.activeProvider ?? '',
    activeModel: cfg?.activeModel ?? '',
    secrets: cfg?.secrets ?? {},
    providers: nextProviders,
    ...(cfg?.designSystem !== undefined ? { designSystem: cfg.designSystem } : {}),
    ...(cfg?.imageGeneration !== undefined ? { imageGeneration: cfg.imageGeneration } : {}),
  });
  await writeConfig(next);
  setCachedConfig(next);
}

async function claimActiveProviderIfUnset(): Promise<void> {
  const cfg = getCachedConfig();
  if (cfg === null) return;
  const current = cfg.activeProvider;
  const hasValidActive =
    current !== undefined &&
    current !== null &&
    current !== '' &&
    cfg.providers[current] !== undefined;
  if (hasValidActive) return;
  const next: Config = hydrateConfig({
    version: 3,
    activeProvider: GOOGLE_GEMINI_PROVIDER_ID,
    activeModel: GOOGLE_GEMINI_PROVIDER.defaultModel,
    secrets: cfg.secrets,
    providers: cfg.providers,
    ...(cfg.designSystem !== undefined ? { designSystem: cfg.designSystem } : {}),
    ...(cfg.imageGeneration !== undefined ? { imageGeneration: cfg.imageGeneration } : {}),
  });
  await writeConfig(next);
  setCachedConfig(next);
}

async function runLoginFlow(abortController: AbortController): Promise<GoogleOAuthStatus> {
  if (!isClientIdConfigured()) {
    throw new CodesignError(
      'Google OAuth client ID not configured. Set DSR_GOOGLE_OAUTH_CLIENT_ID or contact DSR AI Lab.',
      ERROR_CODES.PROVIDER_ERROR,
    );
  }

  const pkce = generatePkce();
  const state = randomBytes(16).toString('hex');
  let server: CallbackServer | null = null;

  try {
    server = await startCallbackServer();
    const authorizeUrl = buildAuthorizeUrl({
      redirectUri: server.redirectUri,
      state,
      challenge: pkce.challenge,
    });
    await shell.openExternal(authorizeUrl);
    logger.info('google.oauth.login.started', { redirectUri: server.redirectUri });

    const { code } = await server.waitForCode(state, abortController.signal);
    const tokenSet = await exchangeCode(code, pkce.verifier, server.redirectUri);

    const email = await fetchGoogleEmail(tokenSet.accessToken);
    const stored: StoredGoogleAuth = {
      schemaVersion: 1,
      accessToken: tokenSet.accessToken,
      refreshToken: tokenSet.refreshToken ?? '',
      idToken: tokenSet.idToken,
      expiresAt: tokenSet.expiresAt,
      email,
      updatedAt: Date.now(),
    };
    await getGoogleTokenStore().write(stored);
    await persistProviderMutation((providers) => {
      providers[GOOGLE_GEMINI_PROVIDER_ID] = { ...GOOGLE_GEMINI_PROVIDER };
      return providers;
    });
    await claimActiveProviderIfUnset();
    logger.info('google.oauth.login.ok', { hasEmail: email !== null });
    return toStatus(stored);
  } catch (err) {
    if (abortController.signal.aborted) {
      logger.info('google.oauth.login.cancelled');
      throw new CodesignError('Google login cancelled', ERROR_CODES.PROVIDER_ABORTED, {
        cause: err,
      });
    }
    logger.error('google.oauth.login.fail', {
      message: err instanceof Error ? err.message : String(err),
    });
    if (err instanceof CodesignError) throw err;
    throw new CodesignError(
      `Google sign-in failed: ${err instanceof Error ? err.message : String(err)}`,
      ERROR_CODES.PROVIDER_ERROR,
      { cause: err },
    );
  } finally {
    server?.close();
  }
}

async function runLogin(): Promise<GoogleOAuthStatus> {
  if (activeLoginPromise !== null) return activeLoginPromise;
  const abortController = new AbortController();
  activeLoginAbortController = abortController;
  const promise = runLoginFlow(abortController);
  const tracked = promise.finally(() => {
    if (activeLoginAbortController === abortController) activeLoginAbortController = null;
    if (activeLoginPromise === tracked) activeLoginPromise = null;
  });
  activeLoginPromise = tracked;
  return tracked;
}

async function runCancelLogin(): Promise<boolean> {
  if (activeLoginAbortController === null || activeLoginAbortController.signal.aborted)
    return false;
  activeLoginAbortController.abort();
  return true;
}

async function runLogout(): Promise<GoogleOAuthStatus> {
  await getGoogleTokenStore().clear();
  const cfg = getCachedConfig();
  if (
    cfg !== null &&
    (cfg.providers[GOOGLE_GEMINI_PROVIDER_ID] !== undefined ||
      cfg.activeProvider === GOOGLE_GEMINI_PROVIDER_ID)
  ) {
    const nextProviders = { ...cfg.providers };
    delete nextProviders[GOOGLE_GEMINI_PROVIDER_ID];
    const activeWasGoogle = cfg.activeProvider === GOOGLE_GEMINI_PROVIDER_ID;
    const next: Config = hydrateConfig({
      version: 3,
      activeProvider: activeWasGoogle ? '' : cfg.activeProvider,
      activeModel: activeWasGoogle ? '' : cfg.activeModel,
      secrets: cfg.secrets,
      providers: nextProviders,
      ...(cfg.designSystem !== undefined ? { designSystem: cfg.designSystem } : {}),
      ...(cfg.imageGeneration !== undefined ? { imageGeneration: cfg.imageGeneration } : {}),
    });
    await writeConfig(next);
    setCachedConfig(next);
  }
  logger.info('google.oauth.logout.ok');
  return {
    loggedIn: false,
    email: null,
    expiresAt: null,
    clientIdConfigured: isClientIdConfigured(),
  };
}

export function registerGoogleOAuthIpc(): void {
  ipcMain.handle('google-oauth:v1:status', async (): Promise<GoogleOAuthStatus> => runStatus());
  ipcMain.handle('google-oauth:v1:login', async (): Promise<GoogleOAuthStatus> => runLogin());
  ipcMain.handle('google-oauth:v1:cancel-login', async (): Promise<boolean> => runCancelLogin());
  ipcMain.handle('google-oauth:v1:logout', async (): Promise<GoogleOAuthStatus> => runLogout());
}
