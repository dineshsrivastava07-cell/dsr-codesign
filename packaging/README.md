# Distribution channels

Canonical sources for DSR CoDesign's package manager manifests. The `packaging/` tree is the source of truth; after each stable tag push `release.yml` runs `update-shas.sh` and commits the synced manifests back to `main`.

Windows releases publish both NSIS setup exes and portable zip archives. winget uses the setup exes. Scoop uses the zip archives so installation does not depend on unpacking electron-builder's nested NSIS payload; older releases without zip assets use the manifest's legacy NSIS fallback.

Artifacts are still **unsigned** as of v0.2.0. Each channel's README / caveats explains the Gatekeeper or SmartScreen workaround.

## Layout

```
packaging/
├── homebrew/
│   └── Casks/dsr-codesign.rb
├── winget/
│   └── manifests/o/DSR-AI-Lab/DSRCoDesign/<version>/
│       ├── DSR-AI-Lab.DSRCoDesign.yaml
│       ├── DSR-AI-Lab.DSRCoDesign.installer.yaml
│       └── DSR-AI-Lab.DSRCoDesign.locale.en-US.yaml
├── scoop/
│   └── bucket/dsr-codesign.json
├── flatpak/
│   └── ai.dsrailab.codesign.yaml
└── update-shas.sh
```

## Release flow

1. Push a `vX.Y.Z` tag. `release.yml` builds + publishes the installers.
2. After `publish` succeeds, the **`bump-manifests`** job auto-runs `update-shas.sh`: it pulls `SHA256SUMS.txt` from the release, rewrites versions / URLs / checksums across all four channels (and auto-creates the new winget version directory by copying from the previous one), then commits the diff back to `main` as `chore(release): sync manifests to vX.Y.Z`.
3. The **`scoop`** job copies the generated Scoop manifest into `DSR-AI-Lab/scoop-bucket` when `SCOOP_BUCKET_TOKEN` is configured.
4. The **`homebrew`** job copies the generated cask into `DSR-AI-Lab/homebrew-tap` when `HOMEBREW_TAP_TOKEN` is configured.
5. The **`winget`** job submits future bumps after Microsoft accepts the initial package. The v0.2.0 winget PR is microsoft/winget-pkgs#372310.

To run the sync manually (e.g. to backfill a past release or test script changes):

```sh
./packaging/update-shas.sh              # uses apps/desktop/package.json version
./packaging/update-shas.sh 0.2.0        # override version
./packaging/update-shas.sh 0.2.0 ./dist # hash local artifacts instead of downloading
PACKAGING_CHANNEL=scoop ./packaging/update-shas.sh 0.2.0
```

The script derives the mac `.app` bundle name and Windows `.exe` from `productName` in `apps/desktop/electron-builder.yml`, so renaming productName propagates into the cask's `app` field and the scoop `bin` automatically.

## Channel-specific mirroring

### SourceForge mirror

The SourceForge mirror is a public convenience mirror, not the primary release source. GitHub Releases remains the source of truth for version numbers, release notes, checksums, SBOMs, and provenance files.

Mirror hygiene checklist after each stable release:

1. Confirm the latest version appears under `https://sourceforge.net/projects/dsr-codesign.mirror/files/`.
2. Confirm the visible description still points users back to the GitHub repository and website.
3. Download one mirrored binary and verify it against the `SHA256SUMS.txt` attached to the matching GitHub release.
4. Check that screenshots and project summary still match the current release line.

If SourceForge lags, keep public docs wording as "mirror" rather than "official package manager" and point users to GitHub Releases for checksums.

### Homebrew Cask — `DSR-AI-Lab/homebrew-tap`

The tap is a separate public repo. For v0.2.0 it is live at `DSR-AI-Lab/homebrew-tap`. The release workflow updates it when `HOMEBREW_TAP_TOKEN` is configured. Manual backfill is still a copy, commit, and push:

```sh
# Create the tap repo once:
gh repo create DSR-AI-Lab/homebrew-tap --public \
  --description "Homebrew tap for DSR CoDesign and friends"
git clone git@github.com:DSR-AI-Lab/homebrew-tap.git /tmp/homebrew-tap
mkdir -p /tmp/homebrew-tap/Casks
cp packaging/homebrew/Casks/dsr-codesign.rb /tmp/homebrew-tap/Casks/
cd /tmp/homebrew-tap && git add -A && \
  git commit -m "dsr-codesign 0.2.0" && git push
```

Users install with:

```sh
brew tap DSR-AI-Lab/tap
brew install --cask dsr-codesign
```

### winget — `microsoft/winget-pkgs`

Microsoft's monorepo. The initial v0.2.0 package PR is microsoft/winget-pkgs#372310 and is waiting for review. Until Microsoft accepts the package, `winget install DSR-AI-Lab.DSRCoDesign` may not resolve. For a first submission, fork `microsoft/winget-pkgs`, copy `packaging/winget/manifests/o/DSR-AI-Lab/DSRCoDesign/<version>/` into the same path in the fork, open a PR, and run `wingetcreate validate` first:

```sh
wingetcreate validate packaging/winget/manifests/o/DSR-AI-Lab/DSRCoDesign/0.2.0
```

Users install with:

```pwsh
winget install DSR-AI-Lab.DSRCoDesign
```

### Scoop — `DSR-AI-Lab/scoop-bucket`

Separate public bucket repo. For v0.2.0 it is live at `DSR-AI-Lab/scoop-bucket`. Once `SCOOP_BUCKET_TOKEN` is configured with `contents:write` access to that repo, `release.yml` copies `packaging/scoop/bucket/dsr-codesign.json` into its `bucket/` directory after each stable tag publish. Manual backfill is still just a copy:

```sh
gh repo create DSR-AI-Lab/scoop-bucket --public \
  --description "Scoop bucket for DSR CoDesign"
git clone git@github.com:DSR-AI-Lab/scoop-bucket.git /tmp/scoop-bucket
mkdir -p /tmp/scoop-bucket/bucket
cp packaging/scoop/bucket/dsr-codesign.json /tmp/scoop-bucket/bucket/
cd /tmp/scoop-bucket && git add -A && \
  git commit -m "dsr-codesign 0.2.0" && git push
```

Users install with:

```pwsh
scoop bucket add dsrailab https://github.com/DSR-AI-Lab/scoop-bucket
scoop install dsrailab/dsr-codesign
```

## Signing status

- macOS: **unsigned / not notarized**. On first launch Gatekeeper shows "damaged, move to Trash". Users run `xattr -cr "/Applications/DSR CoDesign.app"` after installing. Older 0.1.2 and earlier builds used `/Applications/dsr-codesign.app`. Caveat text in the cask surfaces this.
- Windows: **unsigned**. SmartScreen will warn; users click "More info" → "Run anyway". No workaround needed beyond that.
- Linux AppImage: runs as-is.

Code signing + notarization is tracked for Stage 2 (Apple Developer ID + Windows EV cert). Once wired up, drop the Gatekeeper caveat from the cask and the SmartScreen note from the Windows READMEs.
