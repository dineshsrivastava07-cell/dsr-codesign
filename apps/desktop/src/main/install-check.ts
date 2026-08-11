import { app, dialog, shell } from './electron-runtime';
import { getLogger } from './logger';

/**
 * Installation sanity checks that run before anything else at boot.
 *
 * The main case we care about: on macOS, users frequently double-click the
 * app icon inside the mounted DMG instead of dragging it to /Applications
 * first. That launches the binary from `/Volumes/DSR CoDesign/...` — a
 * read-only mount whose identity Electron can't use to establish a stable
 * keychain entry, so `safeStorage.isEncryptionAvailable()` returns false
 * and every "save API key" / "decrypt API key" path fails hard.
 *
 * Rather than let the user hit that wall minutes later with a cryptic
 * error, we detect the condition at startup and offer a one-click fix:
 * open the Applications folder, quit, and let them drag-install properly.
 */

const log = getLogger('install-check');

function isRunningFromDmgMount(): boolean {
  if (process.platform !== 'darwin') return false;
  // Apps launched from a mounted DMG always have an exec path somewhere
  // under /Volumes/. Apps dragged to /Applications live under
  // /Applications/... and never match. Dev builds from pnpm run from
  // node_modules/electron/dist and also don't match.
  return process.execPath.startsWith('/Volumes/');
}

/**
 * If the app is running from a DMG mount, show an explanatory dialog.
 * When the user clicks the primary action we open Finder at the
 * Applications folder and quit the app — they can then drag the app
 * across and relaunch from the correct location.
 *
 * Returns true when the app should stop booting (user chose to quit),
 * false to continue normally.
 */
export async function maybeAbortIfRunningFromDmg(): Promise<boolean> {
  if (!isRunningFromDmgMount()) return false;
  log.warn('boot.blocked', { reason: 'running_from_dmg', execPath: process.execPath });

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'DSR CoDesign is not installed yet',
    message: 'Please drag DSR CoDesign to your Applications folder first',
    detail: [
      'You are running DSR CoDesign directly from the DMG. macOS cannot create a',
      'Keychain entry for apps launched from a disk image, so your API keys cannot',
      'be encrypted and config imports will fail.',
      '',
      'Steps to fix:',
      '1. Click "Open Applications Folder" below',
      '2. Drag DSR CoDesign.app from the DMG into Applications',
      '3. Launch from the Applications folder',
      '',
      'On first launch from Applications, macOS may show a "downloaded from the internet"',
      'confirmation — click Open to proceed.',
    ].join('\n'),
    buttons: ['Open Applications Folder and Quit', 'Run from DMG anyway (not recommended)'],
    defaultId: 0,
    cancelId: 1,
  });

  if (response === 0) {
    try {
      await shell.openPath('/Applications');
    } catch (err) {
      log.warn('openPath.applications.fail', {
        message: err instanceof Error ? err.message : String(err),
      });
    }
    app.quit();
    return true;
  }

  log.warn('boot.continued_from_dmg_despite_warning');
  return false;
}
