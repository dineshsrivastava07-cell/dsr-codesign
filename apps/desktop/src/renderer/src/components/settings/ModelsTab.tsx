import { useT } from '@dsr-codesign/i18n';
import type { WireApi } from '@dsr-codesign/shared';
import {
  isSupportedOnboardingProvider,
  PROVIDER_SHORTLIST as SHORTLIST,
} from '@dsr-codesign/shared';
import { Button } from '@dsr-codesign/ui';
import { Check, Loader2, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ProviderRow } from '../../../../preload/index';
import { recordAction } from '../../lib/action-timeline';
import { useCodesignStore } from '../../store';
import { AddCustomProviderModal } from '../AddCustomProviderModal';
import { GeminiLoginCard } from '../GeminiLoginCard';
import { cleanIpcError, ImportBanner, ProviderCard, SectionTitle } from './primitives';

const DISMISSED_BANNER_PREFIX = 'dsr-codesign:settings:dismissed-import-banner:';

function readDismissed(kind: 'gemini' | 'opencode'): boolean {
  try {
    return window.localStorage.getItem(DISMISSED_BANNER_PREFIX + kind) === '1';
  } catch {
    return false;
  }
}
function writeDismissed(kind: 'gemini' | 'opencode'): void {
  try {
    window.localStorage.setItem(DISMISSED_BANNER_PREFIX + kind, '1');
  } catch {
    // localStorage may be unavailable in tests; non-fatal
  }
}

interface AddProviderMenuProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  hasOllamaImported: boolean;
  onAddOllama: () => void;
  onAddCustom: () => void;
}

function AddProviderMenu({
  open,
  setOpen,
  hasOllamaImported,
  onAddOllama,
  onAddCustom,
}: AddProviderMenuProps) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  const items: Array<{
    key: string;
    label: string;
    desc: string;
    disabled: boolean;
    onClick: () => void;
  }> = [
    {
      key: 'ollama',
      label: t('settings.providers.import.ollamaMenu'),
      desc: t('settings.providers.import.ollamaMenuDesc'),
      disabled: hasOllamaImported,
      onClick: onAddOllama,
    },
    {
      key: 'custom',
      label: t('settings.providers.import.customMenu', { defaultValue: 'Custom provider' }),
      desc: t('settings.providers.import.customMenuDesc', {
        defaultValue: 'Enter API key and URL manually',
      }),
      disabled: false,
      onClick: onAddCustom,
    },
  ];

  return (
    <div ref={rootRef} className="relative">
      <Button variant="secondary" size="sm" onClick={() => setOpen(!open)}>
        <Plus className="w-3.5 h-3.5" />
        {t('settings.providers.addProvider')}
      </Button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full mt-[6px] z-50 w-[260px] rounded-[10px] border border-[var(--color-border-muted)] bg-[var(--color-surface-elevated)] shadow-[0_8px_28px_rgba(0,0,0,0.1)] overflow-hidden"
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={item.onClick}
              className="w-full text-left px-[14px] py-[10px] flex flex-col gap-[2px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[var(--color-surface-hover)]"
            >
              <span className="flex items-center gap-[6px] text-[13px] font-medium text-[var(--color-text-primary)]">
                {item.label}
                {item.disabled ? (
                  <Check className="w-[12px] h-[12px] text-[var(--color-accent)]" />
                ) : null}
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)] leading-[1.4]">
                {item.disabled
                  ? t('settings.providers.import.alreadyImported', {
                      defaultValue: 'Already imported',
                    })
                  : item.desc}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ModelsTab() {
  const t = useT();
  const config = useCodesignStore((s) => s.config);
  const setConfig = useCodesignStore((s) => s.completeOnboarding);
  const pushToast = useCodesignStore((s) => s.pushToast);
  const reportableErrorToast = useCodesignStore((s) => s.reportableErrorToast);
  const [rows, setRows] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [externalConfigs, setExternalConfigs] = useState<{
    gemini?:
      | {
          hasApiKey: boolean;
          apiKeySource: 'gemini-env' | 'home-env' | 'shell-env' | 'none';
          keyPath: string | null;
          warnings: string[];
          blocked: boolean;
        }
      | undefined;
    opencode?:
      | { count: number; providerLabels: string[]; warnings: string[]; blocked: boolean }
      | undefined;
  } | null>(null);
  const [customProviderPreset, setCustomProviderPreset] = useState<
    | {
        name: string;
        baseUrl: string;
        wire: WireApi;
        defaultModel?: string;
      }
    | undefined
  >(undefined);
  const [editingRow, setEditingRow] = useState<ProviderRow | null>(null);

  function handleEdit(row: ProviderRow) {
    setEditingRow(row);
  }

  useEffect(() => {
    if (!window.codesign) return;
    void window.codesign.settings
      .listProviders()
      .then(setRows)
      .catch((err) => {
        pushToast({
          variant: 'error',
          title: t('settings.providers.toast.loadFailed'),
          description: cleanIpcError(err) || t('settings.common.unknownError'),
        });
      })
      .finally(() => setLoading(false));
    void window.codesign.config
      .detectExternalConfigs()
      .then((detected) => {
        const dismissedGemini = readDismissed('gemini');
        const dismissedOpencode = readDismissed('opencode');
        setExternalConfigs({
          ...(detected.gemini !== undefined && !dismissedGemini
            ? {
                gemini: {
                  hasApiKey: detected.gemini.hasApiKey,
                  apiKeySource: detected.gemini.apiKeySource,
                  keyPath: detected.gemini.keyPath,
                  warnings: detected.gemini.warnings ?? [],
                  blocked: detected.gemini.blocked,
                },
              }
            : {}),
          ...(detected.opencode !== undefined && !dismissedOpencode
            ? {
                opencode: {
                  count: detected.opencode.providers.length,
                  providerLabels: detected.opencode.providers.map((p) => p.name),
                  warnings: detected.opencode.warnings ?? [],
                  blocked: detected.opencode.blocked,
                },
              }
            : {}),
        });
      })
      .catch(() => {
        // non-fatal; banner just doesn't appear
      });
  }, [pushToast, t]);

  async function reloadRows() {
    if (!window.codesign) return;
    const [nextRows, state] = await Promise.all([
      window.codesign.settings.listProviders(),
      window.codesign.onboarding.getState(),
    ]);
    setRows(nextRows);
    setConfig(state);
  }

  async function handleAddOllama() {
    if (!window.codesign) return;
    try {
      await window.codesign.settings.addProvider({
        provider: 'ollama',
        apiKey: '',
        modelPrimary: SHORTLIST.ollama.defaultPrimary,
      });
      await reloadRows();
      pushToast({ variant: 'success', title: t('settings.providers.import.ollamaDone') });
    } catch (err) {
      reportableErrorToast({
        code: 'OLLAMA_ADD_FAILED',
        scope: 'settings',
        title: t('settings.providers.toast.saveFailed'),
        description: err instanceof Error ? err.message : t('settings.common.unknownError'),
        ...(err instanceof Error && err.stack !== undefined ? { stack: err.stack } : {}),
      });
    }
  }

  async function handleImportGemini() {
    if (!window.codesign) return;
    const geminiWarnings = externalConfigs?.gemini?.warnings ?? [];
    try {
      await window.codesign.config.importGeminiConfig();
      setExternalConfigs((prev) => (prev === null ? null : { ...prev, gemini: undefined }));
      await reloadRows();
      const description =
        geminiWarnings.length > 0 ? geminiWarnings.slice(0, 2).join('\n') : undefined;
      pushToast({
        variant: 'success',
        title: t('settings.providers.import.geminiDone'),
        ...(description !== undefined ? { description } : {}),
      });
    } catch (err) {
      reportableErrorToast({
        code: 'GEMINI_IMPORT_FAILED',
        scope: 'onboarding',
        title: t('settings.providers.import.failed'),
        description: cleanIpcError(err) || t('settings.common.unknownError'),
        reportable: false,
        ...(err instanceof Error && err.stack !== undefined ? { stack: err.stack } : {}),
      });
    }
  }

  async function handleImportOpencode() {
    if (!window.codesign) return;
    const skippedSummary = externalConfigs?.opencode?.warnings ?? [];
    try {
      await window.codesign.config.importOpencodeConfig();
      setExternalConfigs((prev) => (prev === null ? null : { ...prev, opencode: undefined }));
      await reloadRows();
      const description =
        skippedSummary.length > 0
          ? skippedSummary.slice(0, 3).join('\n') +
            (skippedSummary.length > 3 ? `\n+${skippedSummary.length - 3} more` : '')
          : undefined;
      pushToast({
        variant: 'success',
        title: t('settings.providers.import.opencodeDone'),
        ...(description !== undefined ? { description } : {}),
      });
    } catch (err) {
      reportableErrorToast({
        code: 'OPENCODE_IMPORT_FAILED',
        scope: 'onboarding',
        title: t('settings.providers.import.failed'),
        description: cleanIpcError(err) || t('settings.common.unknownError'),
        reportable: false,
        ...(err instanceof Error && err.stack !== undefined ? { stack: err.stack } : {}),
      });
    }
  }

  async function handleDelete(provider: string) {
    if (!window.codesign) return;
    try {
      const next = await window.codesign.settings.deleteProvider(provider);
      setRows(next);
      const newState = await window.codesign.onboarding.getState();
      setConfig(newState);
      pushToast({ variant: 'success', title: t('settings.providers.toast.removed') });
    } catch (err) {
      reportableErrorToast({
        code: 'PROVIDER_DELETE_FAILED',
        scope: 'settings',
        title: t('settings.providers.toast.deleteFailed'),
        description: cleanIpcError(err) || t('settings.common.unknownError'),
        ...(err instanceof Error && err.stack !== undefined ? { stack: err.stack } : {}),
      });
    }
  }

  async function handleActivate(provider: string) {
    if (!window.codesign) return;
    const sl = isSupportedOnboardingProvider(provider) ? SHORTLIST[provider] : null;
    const currentRow = rows.find((r) => r.provider === provider);
    const defaultModel =
      currentRow?.defaultModel || sl?.defaultPrimary || config?.modelPrimary || '';
    const label = sl?.label ?? currentRow?.label ?? provider;
    if (defaultModel.length === 0) {
      pushToast({
        variant: 'error',
        title: t('settings.providers.toast.activateFailed'),
        description: t('settings.providers.toast.missingModel'),
      });
      return;
    }
    try {
      const next = await window.codesign.settings.setActiveProvider({
        provider,
        modelPrimary: defaultModel,
      });
      recordAction({
        type: 'provider.switch',
        data: { provider, modelId: defaultModel },
      });
      setConfig(next);
      const updatedRows = await window.codesign.settings.listProviders();
      setRows(updatedRows);
      pushToast({
        variant: 'success',
        title: t('settings.providers.toast.switchedTo', { label }),
      });
    } catch (err) {
      reportableErrorToast({
        code: 'PROVIDER_ACTIVATE_FAILED',
        scope: 'settings',
        title: t('settings.providers.toast.switchFailed'),
        description: cleanIpcError(err) || t('settings.common.unknownError'),
        ...(err instanceof Error && err.stack !== undefined ? { stack: err.stack } : {}),
      });
    }
  }

  return (
    <>
      {showAddCustom && (
        <AddCustomProviderModal
          onSave={async () => {
            setShowAddCustom(false);
            setCustomProviderPreset(undefined);
            await reloadRows();
            pushToast({ variant: 'success', title: t('settings.providers.toast.saved') });
          }}
          onClose={() => {
            setShowAddCustom(false);
            setCustomProviderPreset(undefined);
          }}
          {...(customProviderPreset !== undefined ? { initialValues: customProviderPreset } : {})}
        />
      )}

      {editingRow !== null && (
        <AddCustomProviderModal
          onSave={async () => {
            setEditingRow(null);
            await reloadRows();
            pushToast({ variant: 'success', title: t('settings.providers.toast.saved') });
          }}
          onClose={() => setEditingRow(null)}
          editTarget={{
            id: editingRow.provider,
            name: editingRow.name,
            baseUrl: editingRow.baseUrl ?? '',
            wire: editingRow.wire,
            defaultModel: editingRow.defaultModel,
            builtin: editingRow.builtin,
            lockEndpoint: editingRow.builtin,
            ...(editingRow.maskedKey.length > 0 ? { keyMask: editingRow.maskedKey } : {}),
            ...(editingRow.tlsRejectUnauthorized === true ? { tlsRejectUnauthorized: true } : {}),
          }}
          initialSetAsActive={false}
        />
      )}

      <div className="space-y-[var(--space-3)]">
        <GeminiLoginCard onStatusChange={reloadRows} />
        {externalConfigs !== null &&
          (externalConfigs.gemini !== undefined || externalConfigs.opencode !== undefined) && (
            <div className="space-y-2">
              {externalConfigs.opencode !== undefined &&
                (() => {
                  const oc = externalConfigs.opencode;
                  const dismiss = () => {
                    writeDismissed('opencode');
                    setExternalConfigs((prev) =>
                      prev === null ? null : { ...prev, opencode: undefined },
                    );
                  };
                  if (oc.blocked) {
                    return (
                      <ImportBanner
                        label={oc.warnings[0] ?? t('settings.providers.import.opencodeBlocked')}
                        onDismiss={dismiss}
                      />
                    );
                  }
                  const head = oc.providerLabels.slice(0, 3).join(', ');
                  const overflow = oc.providerLabels.length - 3;
                  const providerSummary = overflow > 0 ? `${head} +${overflow} more` : head;
                  return (
                    <ImportBanner
                      label={t('settings.providers.import.opencodeFound', {
                        count: oc.count,
                        providers: providerSummary,
                      })}
                      onImport={handleImportOpencode}
                      onDismiss={dismiss}
                    />
                  );
                })()}
              {externalConfigs.gemini !== undefined &&
                (() => {
                  const g = externalConfigs.gemini;
                  const dismiss = () => {
                    writeDismissed('gemini');
                    setExternalConfigs((prev) =>
                      prev === null ? null : { ...prev, gemini: undefined },
                    );
                  };
                  if (g.blocked) {
                    return (
                      <ImportBanner
                        label={g.warnings[0] ?? t('settings.providers.import.geminiBlocked')}
                        onDismiss={dismiss}
                      />
                    );
                  }
                  const label = g.hasApiKey
                    ? t('settings.providers.import.geminiFound')
                    : t('settings.providers.import.geminiNoKey');
                  return (
                    <ImportBanner
                      label={label}
                      {...(g.hasApiKey ? { onImport: handleImportGemini } : {})}
                      onDismiss={dismiss}
                    />
                  );
                })()}
            </div>
          )}
        <div className="flex items-center justify-between gap-[var(--space-3)] min-h-[var(--size-control-sm)]">
          <SectionTitle>{t('settings.providers.sectionTitle')}</SectionTitle>
          <AddProviderMenu
            open={showAddMenu}
            setOpen={setShowAddMenu}
            hasOllamaImported={rows.some((r) => r.provider === 'ollama')}
            onAddOllama={() => {
              setShowAddMenu(false);
              void handleAddOllama();
            }}
            onAddCustom={() => {
              setShowAddMenu(false);
              setShowAddCustom(true);
            }}
          />
        </div>

        {loading && (
          <div className="flex items-center gap-2 py-4 text-[var(--text-sm)] text-[var(--color-text-muted)]">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('settings.common.loading')}
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-6 text-center text-[var(--text-sm)] text-[var(--color-text-muted)]">
            {t('settings.providers.empty')}
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div className="space-y-2">
            {rows.map((row) => (
              <ProviderCard
                key={row.provider}
                row={row}
                config={config}
                onDelete={handleDelete}
                onActivate={handleActivate}
                onEdit={handleEdit}
                onRowChanged={(next) =>
                  setRows((prev) => prev.map((r) => (r.provider === next.provider ? next : r)))
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
