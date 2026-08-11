/**
 * Google OAuth 2.0 PKCE flow for Gemini API access.
 *
 * Setup (DSR AI Lab maintainers):
 *   1. Go to console.cloud.google.com → APIs & Services → Credentials
 *   2. Create OAuth 2.0 Client ID → Desktop app → name "DSR CoDesign"
 *   3. Enable "Generative Language API" for the project
 *   4. Set GOOGLE_OAUTH_CLIENT_ID below to the issued client_id
 *
 * Desktop-type OAuth clients do not use a client_secret (PKCE replaces it).
 * The redirect URI is always a localhost loopback — no external callback needed.
 */

import { createHash, randomBytes } from 'node:crypto';
import { CodesignError, ERROR_CODES } from '@dsr-codesign/shared';

// TODO: Replace with a real client_id registered for DSR CoDesign at
//       console.cloud.google.com (Desktop app type, Generative Language API enabled).
export const GOOGLE_OAUTH_CLIENT_ID =
  process.env['DSR_GOOGLE_OAUTH_CLIENT_ID'] ?? 'CONFIGURE_GOOGLE_OAUTH_CLIENT_ID';

export const GOOGLE_AUTH_BASE = 'https://accounts.google.com';
export const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo';
export const GEMINI_SCOPE = 'https://www.googleapis.com/auth/generativelanguage';

export function isClientIdConfigured(): boolean {
  return (
    GOOGLE_OAUTH_CLIENT_ID !== 'CONFIGURE_GOOGLE_OAUTH_CLIENT_ID' &&
    GOOGLE_OAUTH_CLIENT_ID.length > 0
  );
}

export interface PkcePair {
  verifier: string;
  challenge: string;
}

export function generatePkce(): PkcePair {
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export interface AuthorizeUrlOpts {
  redirectUri: string;
  state: string;
  challenge: string;
}

export function buildAuthorizeUrl(opts: AuthorizeUrlOpts): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: opts.redirectUri,
    scope: `openid email profile ${GEMINI_SCOPE}`,
    code_challenge: opts.challenge,
    code_challenge_method: 'S256',
    state: opts.state,
    access_type: 'offline',
    prompt: 'consent', // force refresh_token issuance
  });
  return `${GOOGLE_AUTH_BASE}/o/oauth2/v2/auth?${params.toString()}`;
}

export interface TokenSet {
  accessToken: string;
  refreshToken: string | null;
  idToken: string;
  expiresAt: number;
}

type TokenResponse = Record<string, unknown>;

function tokenParseError(
  kind: 'exchange' | 'refresh',
  detail: string,
  cause?: unknown,
): CodesignError {
  return new CodesignError(
    `Google OAuth ${kind} returned an invalid token response: ${detail}`,
    ERROR_CODES.CODEX_TOKEN_PARSE_FAILED,
    { cause },
  );
}

function asTokenResponse(value: unknown, kind: 'exchange' | 'refresh'): TokenResponse {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw tokenParseError(kind, 'response body must be a JSON object');
  }
  return value as TokenResponse;
}

function readRequiredString(
  response: TokenResponse,
  field: string,
  kind: 'exchange' | 'refresh',
): string {
  const value = response[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw tokenParseError(kind, `${field} must be a non-empty string`);
  }
  return value.trim();
}

function readExpiresIn(response: TokenResponse, kind: 'exchange' | 'refresh'): number {
  const value = response['expires_in'];
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw tokenParseError(kind, 'expires_in must be a positive number');
  }
  return value;
}

async function postToken(
  body: URLSearchParams,
  kind: 'exchange' | 'refresh',
): Promise<TokenResponse> {
  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new CodesignError(
      `Google OAuth ${kind} failed: ${res.status} ${text.slice(0, 300)}`,
      ERROR_CODES.PROVIDER_ERROR,
    );
  }
  let json: unknown;
  try {
    json = await res.json();
  } catch (cause) {
    throw tokenParseError(kind, 'response body must be valid JSON', cause);
  }
  return asTokenResponse(json, kind);
}

export async function exchangeCode(
  code: string,
  verifier: string,
  redirectUri: string,
): Promise<TokenSet> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    code_verifier: verifier,
  });
  const response = await postToken(body, 'exchange');
  const expiresIn = readExpiresIn(response, 'exchange');
  const refreshToken = response['refresh_token'];
  return {
    accessToken: readRequiredString(response, 'access_token', 'exchange'),
    refreshToken: typeof refreshToken === 'string' && refreshToken.length > 0 ? refreshToken : null,
    idToken: readRequiredString(response, 'id_token', 'exchange'),
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenSet> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    refresh_token: refreshToken,
  });
  const response = await postToken(body, 'refresh');
  const expiresIn = readExpiresIn(response, 'refresh');
  const newRefreshToken = response['refresh_token'];
  return {
    accessToken: readRequiredString(response, 'access_token', 'refresh'),
    refreshToken:
      typeof newRefreshToken === 'string' && newRefreshToken.length > 0
        ? newRefreshToken
        : refreshToken,
    idToken: typeof response['id_token'] === 'string' ? response['id_token'] : '',
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

export async function fetchGoogleEmail(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown>;
    const email = json['email'];
    return typeof email === 'string' && email.length > 0 ? email : null;
  } catch {
    return null;
  }
}
