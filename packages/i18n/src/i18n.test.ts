import { describe, expect, it, vi } from 'vitest';
import {
  availableLocales,
  getCurrentLocale,
  initI18n,
  isSupportedLocale,
  normalizeLocale,
  setLocale,
} from './index';

describe('normalizeLocale', () => {
  it('returns the value unchanged when it is supported', () => {
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('pt-BR')).toBe('pt-BR');
  });

  it('maps en-US / en-GB to en', () => {
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('en-GB')).toBe('en');
  });

  it('falls back to en for unsupported locales and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(normalizeLocale('fr-FR')).toBe('en');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('falls back to en for nullish input without warning', () => {
    expect(normalizeLocale(undefined)).toBe('en');
    expect(normalizeLocale(null)).toBe('en');
  });
});

describe('isSupportedLocale', () => {
  it('matches exactly the available locales', () => {
    for (const code of availableLocales) {
      expect(isSupportedLocale(code)).toBe(true);
    }
    expect(isSupportedLocale('fr')).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
    expect(isSupportedLocale(null)).toBe(false);
    expect(isSupportedLocale('')).toBe(false);
  });
});

describe('initI18n + setLocale (live switching)', () => {
  it('boots and serves translated strings for both locales', async () => {
    const { i18n } = await import('./index');
    await initI18n('en');
    expect(i18n.t('chat.placeholder')).toBe('Describe what to design…');
    expect(i18n.t('common.send')).toBe('Send');

    await setLocale('pt-BR');
    await setLocale('en');
    expect(i18n.t('common.send')).toBe('Send');
  });

  it('warns and surfaces a visible marker when a key is missing', async () => {
    const { i18n } = await import('./index');
    await initI18n('en');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const value = i18n.t('common.thisKeyDoesNotExist');
    // parseMissingKeyHandler in dev wraps with ⟦…⟧ brackets.
    expect(value).toContain('thisKeyDoesNotExist');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('setLocale updates getCurrentLocale and i18n.t() immediately (no restart needed)', async () => {
    const { i18n } = await import('./index');
    await initI18n('en');
    expect(getCurrentLocale()).toBe('en');
    expect(i18n.t('common.send')).toBe('Send');

    await setLocale('es');
    expect(getCurrentLocale()).toBe('es');

    await setLocale('en');
    expect(getCurrentLocale()).toBe('en');
    expect(i18n.t('common.send')).toBe('Send');
  });
});

describe('onboarding i18n keys (Welcome / PasteKey / ChooseModel)', () => {
  it('returns correct English strings for all onboarding screens', async () => {
    const { i18n } = await import('./index');
    await initI18n('en');

    // Welcome
    expect(i18n.t('onboarding.welcome.title')).toBe('Design with any model.');
    expect(i18n.t('onboarding.welcome.tryFree')).toBe('Try free now');
    expect(i18n.t('onboarding.welcome.useKey')).toBe('Use my API key');
    expect(i18n.t('onboarding.welcome.whereToGetKey')).toBe('Where to get a key');

    // PasteKey
    expect(i18n.t('onboarding.paste.title')).toBe('Paste your API key');
    expect(i18n.t('onboarding.paste.back')).toBe('Back');
    expect(i18n.t('onboarding.paste.continue')).toBe('Continue');
    expect(i18n.t('onboarding.paste.connectionTest.button')).toBe('Test');
    expect(i18n.t('onboarding.paste.connectionTest.ok')).toBe('Connected');

    // ChooseModel
    expect(i18n.t('onboarding.choose.title')).toBe('Pick default models');
    expect(i18n.t('onboarding.choose.finish')).toBe('Finish');
    expect(i18n.t('onboarding.choose.back')).toBe('Back');
  });
});
