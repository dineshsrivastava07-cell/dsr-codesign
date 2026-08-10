import { describe, expect, it } from 'vitest';
import { EXAMPLES, getExample, getExamples } from './index';
import { enExamples } from './locales/en';

describe('examples gallery', () => {
  it('ships the expanded curated example library', () => {
    expect(EXAMPLES.length).toBe(84);
  });

  it('every example has a unique id', () => {
    const ids = EXAMPLES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers scaffold, skill, and brand-reference stress scenarios', () => {
    const ids = new Set(EXAMPLES.map((e) => e.id));
    for (const id of [
      'watch-run-coach',
      'foldable-travel-planner',
      'vision-pro-spatial-gallery',
      'safari-product-tour',
      'terminal-release-monitor',
      'vscode-extension-marketplace',
      'drawer-inspector',
      'toast-notification-center',
      'skeleton-loading-dashboard',
      'empty-state-library',
      'cjk-editorial-longform',
      'stripe-brand-checkout',
      'linear-roadmap',
      'raycast-launcher',
    ]) {
      expect(ids.has(id), `missing coverage scenario: ${id}`).toBe(true);
    }
  });

  it('every example has a non-trivial prompt and inline SVG thumbnail', () => {
    for (const ex of EXAMPLES) {
      expect(ex.prompt.length).toBeGreaterThan(40);
      expect(ex.thumbnail).toMatch(/^<svg /);
    }
  });

  it('getExamples returns localized content', () => {
    const en = getExamples('en');
    expect(en.length).toBeGreaterThan(0);
  });

  it('locales without prompt coverage fall back to the English source prompt', () => {
    const es = getExamples('es');
    const launchEs = es.find((e) => e.id === 'product-launch-page');
    const launchEn = getExample('product-launch-page', 'en');
    expect(launchEs?.title).toBe(launchEn?.title);
    expect(launchEs?.prompt).toBe(launchEn?.prompt);
  });

  it('getExamples falls back to en for unknown locales', () => {
    const fallback = getExamples('fr-FR');
    expect(fallback[0]?.title).toBe(getExamples('en')[0]?.title);
  });

  it('getExample looks up by id', () => {
    const ex = getExample('dashboard', 'en');
    expect(ex?.category).toBe('dashboard');
    expect(getExample('does-not-exist')).toBeUndefined();
  });

  it('getExamples throws when a locale entry is missing in every registry', () => {
    const id = EXAMPLES[0]?.id ?? 'cosmic-animation';
    const enBackup = enExamples[id];
    delete enExamples[id];
    try {
      expect(() => getExamples('en')).toThrow(/missing localized content/);
    } finally {
      if (enBackup) enExamples[id] = enBackup;
    }
  });
});
