import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { CodesignError, ERROR_CODES } from '@dsr-codesign/shared';
import { refreshAccessToken, type TokenSet } from './oauth';

export interface StoredGoogleAuth {
  schemaVersion: 1;
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
  email: string | null;
  updatedAt: number;
}

export interface GoogleTokenStoreOptions {
  filePath: string;
  refreshFn?: (refreshToken: string) => Promise<TokenSet>;
  now?: () => number;
}

const EXPIRY_BUFFER_MS = 5 * 60 * 1000;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isPositiveFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function isStoredGoogleAuth(value: unknown): value is StoredGoogleAuth {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    v['schemaVersion'] === 1 &&
    isNonEmptyString(v['accessToken']) &&
    isNonEmptyString(v['refreshToken']) &&
    isPositiveFiniteNumber(v['expiresAt']) &&
    (v['email'] === null || isNonEmptyString(v['email'])) &&
    isPositiveFiniteNumber(v['updatedAt'])
  );
}

export class GoogleTokenStore {
  private readonly filePath: string;
  private readonly refreshFn: (rt: string) => Promise<TokenSet>;
  private readonly now: () => number;
  private cache: StoredGoogleAuth | null | undefined = undefined;

  constructor(opts: GoogleTokenStoreOptions) {
    this.filePath = opts.filePath;
    this.refreshFn = opts.refreshFn ?? refreshAccessToken;
    this.now = opts.now ?? (() => Date.now());
  }

  async read(): Promise<StoredGoogleAuth | null> {
    if (this.cache !== undefined) return this.cache;
    try {
      const raw = await readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      const stored = isStoredGoogleAuth(parsed) ? parsed : null;
      this.cache = stored;
      return stored;
    } catch {
      this.cache = null;
      return null;
    }
  }

  async write(stored: StoredGoogleAuth): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(stored, null, 2), { mode: 0o600 });
    try {
      await rename(tmp, this.filePath);
    } catch (err) {
      await unlink(tmp).catch(() => undefined);
      throw err;
    }
    this.cache = stored;
  }

  async clear(): Promise<void> {
    this.cache = null;
    try {
      await unlink(this.filePath);
    } catch {
      // already gone
    }
  }

  async getValidAccessToken(): Promise<string> {
    const stored = await this.read();
    if (stored === null) {
      throw new CodesignError(
        'Not signed in with Google. Please sign in via Settings.',
        ERROR_CODES.PROVIDER_AUTH_MISSING,
      );
    }
    const now = this.now();
    if (stored.expiresAt - EXPIRY_BUFFER_MS > now) {
      return stored.accessToken;
    }
    // Token expired — refresh
    let next: TokenSet;
    try {
      next = await this.refreshFn(stored.refreshToken);
    } catch (err) {
      throw new CodesignError(
        `Google access token refresh failed: ${err instanceof Error ? err.message : String(err)}`,
        ERROR_CODES.PROVIDER_ERROR,
        { cause: err },
      );
    }
    const refreshed: StoredGoogleAuth = {
      ...stored,
      accessToken: next.accessToken,
      refreshToken: next.refreshToken ?? stored.refreshToken,
      expiresAt: next.expiresAt,
      updatedAt: now,
    };
    await this.write(refreshed);
    return refreshed.accessToken;
  }
}
