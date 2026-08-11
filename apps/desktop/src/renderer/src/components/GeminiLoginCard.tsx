import { useT } from '@dsr-codesign/i18n';
import { Button } from '@dsr-codesign/ui';
import { Globe, Loader2, LogOut } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GoogleOAuthStatus } from '../../../preload/index';
import { useCodesignStore } from '../store';

export interface GeminiLoginCardProps {
  /** Called after a successful login or logout so the parent can refresh its provider list. */
  onStatusChange?: () => void | Promise<void>;
}

export type GeminiViewState = 'not-logged-in' | 'loading' | 'logged-in' | 'not-configured';

export function resolveGeminiViewState(
  status: GoogleOAuthStatus | null,
  loading: boolean,
): GeminiViewState {
  if (loading) return 'loading';
  if (status !== null && !status.clientIdConfigured) return 'not-configured';
  if (status?.loggedIn) return 'logged-in';
  return 'not-logged-in';
}

interface GoogleOAuthApi {
  status(): Promise<GoogleOAuthStatus>;
  login(): Promise<GoogleOAuthStatus>;
  cancelLogin(): Promise<boolean>;
  logout(): Promise<GoogleOAuthStatus>;
}

function isGoogleLoginCancelledError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return /Google login cancelled|Google OAuth callback aborted/.test(err.message);
}

export function GeminiLoginCard({ onStatusChange }: GeminiLoginCardProps) {
  const t = useT();
  const pushToast = useCodesignStore((s) => s.pushToast);
  const [status, setStatus] = useState<GoogleOAuthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!window.codesign) return;
    const api: GoogleOAuthApi = window.codesign.googleOAuth;
    api
      .status()
      .then((s) => {
        if (mountedRef.current) setStatus(s);
      })
      .catch((err: unknown) => {
        if (!mountedRef.current) return;
        setStatus(null);
        pushToast({
          variant: 'error',
          title: t('settings.providers.geminiLogin.statusFailedTitle'),
          description:
            err instanceof Error ? err.message : t('settings.providers.geminiLogin.unknownError'),
        });
      });
  }, [pushToast, t]);

  const handleLogin = useCallback(async () => {
    if (!window.codesign) return;
    const api: GoogleOAuthApi = window.codesign.googleOAuth;
    setLoading(true);
    try {
      const next = await api.login();
      if (mountedRef.current) setStatus(next);
      await onStatusChange?.();
    } catch (err) {
      if (isGoogleLoginCancelledError(err)) return;
      pushToast({
        variant: 'error',
        title: t('settings.providers.geminiLogin.loginFailedTitle'),
        description:
          err instanceof Error ? err.message : t('settings.providers.geminiLogin.unknownError'),
      });
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [onStatusChange, pushToast, t]);

  const handleCancel = useCallback(async () => {
    if (!window.codesign) return;
    const cancelled = await window.codesign.googleOAuth.cancelLogin();
    if (!cancelled && mountedRef.current) setLoading(false);
  }, []);

  const handleLogout = useCallback(async () => {
    if (!window.codesign) return;
    if (!window.confirm(t('settings.providers.geminiLogin.confirmLogout'))) return;
    const api: GoogleOAuthApi = window.codesign.googleOAuth;
    try {
      const next = await api.logout();
      if (mountedRef.current) setStatus(next);
      await onStatusChange?.();
    } catch (err) {
      pushToast({
        variant: 'error',
        title: t('settings.providers.geminiLogin.logoutFailedTitle'),
        description:
          err instanceof Error ? err.message : t('settings.providers.geminiLogin.unknownError'),
      });
    }
  }, [onStatusChange, pushToast, t]);

  const viewState = resolveGeminiViewState(status, loading);

  if (viewState === 'not-configured') {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-3)] py-[var(--space-2_5)]">
        <div className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
          {t('settings.providers.geminiLogin.title')}
        </div>
        <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mt-[var(--space-0_5)] leading-[var(--leading-body)]">
          {t('settings.providers.geminiLogin.notConfigured')}
        </p>
      </div>
    );
  }

  if (viewState === 'logged-in' && status) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] border-l-[var(--size-accent-stripe)] border-l-[var(--color-accent)] bg-[var(--color-accent-tint)] px-[var(--space-3)] py-[var(--space-2_5)] flex items-center gap-[var(--space-3)]">
        <div className="min-w-0 flex-1 flex items-center gap-[var(--space-2)] flex-wrap">
          <span className="inline-flex items-center gap-[var(--space-1)] px-[var(--space-1_5)] py-[var(--space-0_5)] rounded-full border border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent text-[var(--font-size-badge)] font-medium leading-none">
            <Globe className="w-[var(--size-icon-xs)] h-[var(--size-icon-xs)]" />
            {t('settings.providers.geminiLogin.loggedInBadge')}
          </span>
          {status.email !== null && status.email.length > 0 && (
            <span className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate">
              {status.email}
            </span>
          )}
        </div>
        <div className="shrink-0">
          <Button variant="secondary" size="sm" onClick={() => void handleLogout()}>
            <LogOut className="w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]" />
            {t('settings.providers.geminiLogin.logout')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-3)] py-[var(--space-2_5)] flex items-start gap-[var(--space-3)]">
      <div className="min-w-0 flex-1">
        <div className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
          {t('settings.providers.geminiLogin.title')}
        </div>
        <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mt-[var(--space-0_5)] leading-[var(--leading-body)]">
          {t('settings.providers.geminiLogin.description')}
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-[var(--space-2)]">
        {viewState === 'loading' ? (
          <>
            <Button variant="primary" size="sm" disabled>
              <Loader2 className="w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] animate-spin" />
              {t('settings.providers.geminiLogin.inProgress')}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => void handleCancel()}>
              {t('common.cancel')}
            </Button>
          </>
        ) : (
          <Button variant="primary" size="sm" onClick={() => void handleLogin()}>
            <Globe className="w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]" />
            {t('settings.providers.geminiLogin.signIn')}
          </Button>
        )}
      </div>
    </div>
  );
}
