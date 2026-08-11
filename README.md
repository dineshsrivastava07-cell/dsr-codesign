# DSR CoDesign

> Your prompts. Your model. Your laptop.
>
> Turn prompts into polished artifacts — locally, with Ollama + Gemma 4 models by default. Developed by DSR AI Lab.

[Website](https://dsrailab.github.io/dsr-codesign/) · [Quickstart](#quickstart) · [What's new](https://github.com/dineshsrivastava07-cell/dsr-codesign/releases) · [Changelog](./CHANGELOG.md) · [Discussions](https://github.com/dineshsrivastava07-cell/dsr-codesign/discussions) · [Docs](https://dsrailab.github.io/dsr-codesign/quickstart) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md)

**Open-source alternative to:** [Claude Design](https://dsrailab.github.io/dsr-codesign/claude-design-alternative) · [v0 by Vercel](https://dsrailab.github.io/dsr-codesign/v0-alternative) · [Lovable](https://dsrailab.github.io/dsr-codesign/lovable-alternative) · [Bolt.new](https://dsrailab.github.io/dsr-codesign/bolt-alternative) · [Figma AI](https://dsrailab.github.io/dsr-codesign/figma-ai-alternative)

<p align="center">
  <img src="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/product-hero.png" alt="DSR CoDesign — prompt on the left, live artifact on the right" width="1000" />
</p>

<p align="center">
  <a href="https://github.com/dineshsrivastava07-cell/dsr-codesign/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/dineshsrivastava07-cell/dsr-codesign?label=release&color=1E6FFF" /></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://github.com/dineshsrivastava07-cell/dsr-codesign/actions"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/dineshsrivastava07-cell/dsr-codesign/ci.yml?label=CI" /></a>
  <a href="https://github.com/dineshsrivastava07-cell/dsr-codesign/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/dineshsrivastava07-cell/dsr-codesign?style=social" /></a>
</p>

<p align="center">
  <a href="https://github.com/dineshsrivastava07-cell/dsr-codesign/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/dineshsrivastava07-cell/dsr-codesign?label=last%20commit&color=40b4a1" /></a>
  <a href="https://github.com/dineshsrivastava07-cell/dsr-codesign/pulse"><img alt="Commit activity" src="https://img.shields.io/github/commit-activity/m/dineshsrivastava07-cell/dsr-codesign?label=commits%2Fmonth" /></a>
  <a href="https://github.com/dineshsrivastava07-cell/dsr-codesign/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/dineshsrivastava07-cell/dsr-codesign" /></a>
  <a href="https://github.com/dineshsrivastava07-cell/dsr-codesign/releases"><img alt="Downloads" src="https://img.shields.io/github/downloads/dineshsrivastava07-cell/dsr-codesign/total?label=downloads&color=6c5ce7" /></a>
</p>

<p align="center">
  <sub><code>ollama</code> · <code>gemma4</code> · <code>local-first</code> · <code>claude-design-alternative</code> · <code>v0-alternative</code> · <code>bolt-alternative</code> · <code>lovable-alternative</code> · <code>figma-alternative</code> · <code>ai-design</code> · <code>design-to-code</code> · <code>byok</code> · <code>multi-model</code> · <code>electron</code></sub>
</p>

---

## What's new

- **v0.2.1** *(2026-08-11)* — English-only UI · Google Gemini OAuth sign-in · Ollama + Gemma 4 set as default on fresh install · Settings simplified to Ollama + Gemini + Custom providers · New DSR AI Lab logo · All Chinese locale content removed
- **`feat/decompose-to-ui-kit`** *(branch)* — Image → componentized `ui_kits/<slug>/` bundle for coding-agent handoff · Boolean-per-dimension visual parity judge (12 checks) · See [BENCHMARKS.md](./BENCHMARKS.md). Refs [#225](https://github.com/dineshsrivastava07-cell/dsr-codesign/issues/225).
- **v0.2.0** *(2026-05-09)* — Agentic Design: workspace-backed sessions · permissioned local tools · Files panel upgrades · provider diagnostics · `DESIGN.md` design systems

[Full release history →](https://github.com/dineshsrivastava07-cell/dsr-codesign/releases) · [Changelog →](./CHANGELOG.md)

---

## What it is

Turn a prompt into a polished prototype, slide deck, or marketing asset, locally, with the model you already use.

**DSR CoDesign is an open-source AI design tool by DSR AI Lab** — built for people who want the speed of AI-native design tools without subscription lock-in or cloud-only workflows. An MIT-licensed desktop app, local-first from day one, powered by **Ollama + Gemma 4 models** running on your own hardware. Supports any OpenAI-compatible endpoint (Claude, GPT, Gemini, DeepSeek, or any local Ollama model). Gets you running in under 90 seconds.

---

## See it generate

From a blank prompt to a finished artifact, the agent plans, writes, self-checks, and ships something with hover states, tabs, and empty states already wired up:

![Generate a design from scratch](https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/demos/generate-from-scratch.gif)

---

## Why people star it

- **Runs on your laptop** — Ollama + Gemma 4 by default, no mandatory cloud
- **Works with your model** — Google Gemini, GPT, Claude, OpenRouter, and more via API key or OAuth
- **Exports real files** — HTML, PDF, PPTX, ZIP, Markdown
- **Shows its work** — live agent activity, visible tool calls, interruptible generation

---

## Why DSR CoDesign?

Open source, desktop-native, and built for people who do not want their design workflow locked to one model or one cloud.

| | **DSR CoDesign** | Claude Design | v0 by Vercel | Lovable |
|---|:---:|:---:|:---:|:---:|
| Open source | ✅ MIT | ❌ Closed | ❌ Closed | ❌ Closed |
| Desktop native | ✅ Electron | ❌ Web only | ❌ Web only | ❌ Web only |
| Bring your own key | ✅ Any provider | ❌ Anthropic only | ❌ Vercel only | ⚠️ Limited |
| Local / offline | ✅ Fully local app | ❌ Cloud | ❌ Cloud | ❌ Cloud |
| Models | ✅ 20+ (Ollama, Gemini, GPT, Claude…) | Claude only | GPT-4o | Multi-LLM |
| Default model | ✅ Ollama + Gemma 4 (no key needed) | Claude only | GPT-4o | Multi-LLM |
| Version history | ✅ Local sessions + workspace files | ❌ | ❌ | ❌ |
| Data privacy | ✅ On-device app state | ❌ Cloud-processed | ❌ Cloud | ❌ Cloud |
| Editable export | ✅ HTML, PDF, PPTX, ZIP, Markdown | ⚠️ Limited | ⚠️ Limited | ⚠️ Limited |
| Price | ✅ Free app, provider/subscription cost only | 💳 Subscription | 💳 Subscription | 💳 Subscription |

---

## Highlights

<table>
  <tr>
    <td width="50%">
      <a href="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/comment-mode.png">
        <img src="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/comment-mode.png" alt="Click any element, leave a pin, let the model rewrite that region" />
      </a>
      <p><b>Comment, don't retype.</b><br/>Click any element, drop a pin, and let the model rewrite only that region.</p>
    </td>
    <td width="50%">
      <a href="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/tweaks-sliders.png">
        <img src="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/tweaks-sliders.png" alt="AI-emitted tweaks panel with color pickers and RGB inputs" />
      </a>
      <p><b>AI-tuned sliders.</b><br/>The model surfaces the parameters worth tweaking, so you can refine color, spacing, and typography without another full prompt.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <a href="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/hub-your-designs.png">
        <img src="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/hub-your-designs.png" alt="Your Designs hub, filled with real generated artifacts" />
      </a>
      <p><b>Every iteration, kept.</b><br/>Designs are saved locally, with instant switching between recent versions.</p>
    </td>
    <td width="50%">
      <a href="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/agent-panel.png">
        <img src="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/agent-panel.png" alt="Live agent panel showing todos and streaming tool calls" />
      </a>
      <p><b>Watch the agent work.</b><br/>Todos, tool calls, and live progress stay visible and interruptible throughout generation.</p>
    </td>
  </tr>
</table>

---

## Quickstart

**Time to first artifact:** about 3 minutes

**Default (no key needed):** Install [Ollama](https://ollama.com/download), pull `gemma4:26b`, launch DSR CoDesign — it auto-detects Ollama and sets it as your provider.

**Runs on:** macOS 12+ (Monterey or later), Windows 10+, Linux (glibc ≥ 2.31)

### 1. Install

**Package manager** (recommended):

```bash
# macOS
brew install --cask dsrailab/tap/dsr-codesign

# Windows — Scoop
scoop bucket add dsrailab https://github.com/DSR-AI-Lab/scoop-bucket
scoop install dsrailab/dsr-codesign
```

**Or direct download** from the [latest GitHub Release](https://github.com/dineshsrivastava07-cell/dsr-codesign/releases):

| Platform | File |
|---|---|
| macOS (Apple Silicon) | `dsr-codesign-*-arm64.dmg` |
| macOS (Intel) | `dsr-codesign-*-x64.dmg` |
| Windows (x64) | `dsr-codesign-*-x64-setup.exe` |
| Windows (ARM64) | `dsr-codesign-*-arm64-setup.exe` |
| Linux (x64, AppImage) | `dsr-codesign-*-x64.AppImage` |
| Linux (x64, Debian/Ubuntu) | `dsr-codesign-*-x64.deb` |
| Linux (x64, Fedora/RHEL) | `dsr-codesign-*-x64.rpm` |

Each release ships with `SHA256SUMS.txt` and a CycloneDX SBOM (`*-sbom.cdx.json`) so you can verify what you downloaded.

<details>
<summary><b>More package managers</b></summary>

| Manager | Command | Status |
|---|---|---|
| Homebrew Cask (macOS) | `brew install --cask dsrailab/tap/dsr-codesign` | 🟢 Live |
| Scoop (Windows) | `scoop bucket add dsrailab https://github.com/DSR-AI-Lab/scoop-bucket && scoop install dsrailab/dsr-codesign` | 🟢 Live |
| winget (Windows) | `winget install DSR-AI-Lab.DSRCoDesign` | 🟡 PR submitted; waiting for Microsoft review |
| Flathub (Linux) | `flatpak install flathub ai.dsrailab.codesign` | ⏸ Deferred; needs signed build + AppStream metadata |
| Snap (Linux) | `snap install --dangerous dsr-codesign-*.snap` | 🟡 Attached to releases best-effort; Snap Store publish not yet wired |
</details>

> **Unsigned installer note:** installers are not notarized or Authenticode-signed yet. On **macOS Sequoia 15+** right-click → Open no longer bypasses Gatekeeper. Reliable one-liner:
>
> ```sh
> xattr -cr "/Applications/DSR CoDesign.app"
> ```
>
> Then double-click normally. On **Windows**: SmartScreen → More info → Run anyway.
>
> Want a verified build? Compile from source — see [CONTRIBUTING.md](./CONTRIBUTING.md).

### 2. Choose your model source

On first launch, **Ollama is configured automatically** if you have it installed. No sign-in or key needed. Open Settings → Models to switch or add another:

| Path | How |
|---|---|
| **Ollama (local, default)** | Install [Ollama](https://ollama.com/download), pull a model (`ollama pull gemma4:26b`). DSR CoDesign auto-connects. |
| **Google Gemini (OAuth)** | Click "Sign in with Google" in Settings → Models. No API key needed — OAuth via your Google account. |
| **API key** | Paste any key: Google Gemini, OpenAI, Anthropic, OpenRouter, DeepSeek, SiliconFlow, or any OpenAI-compatible relay. |
| **Custom endpoint** | Enter a base URL + optional key for any local or self-hosted OpenAI-compatible server. |

Credentials stay in `~/.config/dsr-codesign/config.toml`. Nothing leaves your machine unless your chosen model route requires it.

### 3. Type your first prompt

Pick one of **fifteen built-in demos** — landing page, dashboard, pitch slide, pricing, mobile app, chat UI, event calendar, blog article, receipt/invoice, portfolio, settings panel, and more — or describe your own. A sandboxed prototype appears in seconds.

---

## What you get

### Models and providers
- **Ollama + Gemma 4 by default** — `gemma4:26b` at `localhost:11434`, zero API key required, auto-configured on fresh install
- **Google Gemini OAuth** — sign in with your Google account, no key to paste; supports Gemini 2.5 Pro/Flash and 2.0 Flash
- **Unified provider model** — any OpenAI-compatible endpoint: OpenAI, Anthropic, DeepSeek, OpenRouter, SiliconFlow, or custom relay
- **Dynamic model picker** — every provider exposes its real model catalogue, not a hardcoded shortlist

### Generation and editing
- **Prompt → HTML or JSX/React component** prototype, rendered in a sandboxed iframe (vendored React 18 + Babel on-device)
- **Fifteen built-in demos + twelve design skill modules** — ready-to-edit starting points for common design briefs
- **Live agent panel** — watch tool calls stream in real time as the model edits files
- **AI image generation** — opt-in bitmap assets for heroes, product shots, backgrounds, and illustrations
- **AI-generated sliders** — the model emits the parameters worth tweaking (color, spacing, font)
- **Comment mode** — click any element in the preview to drop a pin, leave a note, and let the model rewrite only that region
- **Decompose to UI Kit** — one click emits a `ui_kits/<slug>/` folder (`index.html` + `components/*.tsx` + `tokens.css` + `manifest.json` + `README.md`) shaped for coding-agent handoff. Built-in deterministic + vision verifiers self-check parity using a 12-question boolean rubric. See [BENCHMARKS.md](./BENCHMARKS.md).
- **Generation cancellation** — stop mid-stream without losing prior turns

### Preview and workflow
- **Phone / tablet / desktop preview** — true responsive frames, switch with one click
- **Files panel** — inspect multi-file artifacts (HTML, CSS, JS) before export
- **Instant design switching** — the last five designs keep their preview iframes alive
- **Connection diagnostic panel** — one-click test for any provider, with actionable errors
- **Per-generation token counter** — see exactly how many tokens each run cost in the sidebar
- **Settings with four tabs** — Models, Appearance, Storage, and Advanced
- **Light + dark themes**, English UI

### Export and packaging
- **Five export formats** — HTML (inlined CSS), PDF (local Chrome), PPTX, ZIP, Markdown
- **GitHub Release pipeline** — unsigned DMG (macOS), EXE (Windows), AppImage (Linux)

---

## Roadmap

Current release: v0.2.1.

### v0.2.1 — shipped 2026-08-11

- English-only UI (removed zh-CN locale)
- Google Gemini OAuth sign-in (no API key required)
- Ollama + Gemma 4 auto-configured on fresh install
- Settings simplified: Ollama, Gemini OAuth, and Custom endpoint only
- New DSR AI Lab horizontal logo

### v0.2.0 — Agentic Design

- **Design as session** — every design is a pi session with JSONL history and a workspace folder on disk
- **Permissioned agent loop** — pi built-ins for read, write, edit, bash, grep, find, and ls
- **Design tools on demand** — `ask`, `scaffold`, `skill`, `preview`, `gen_image`, `tweaks`, `todos`, `done`
- **`DESIGN.md` as shared memory** — brand tokens and design-system decisions become editable files

### Later — v0.2.x and beyond

- Renderer polish for `ask`, `preview`, tweaks, and process-management surfaces
- Cost transparency — pre-generation estimate + weekly budget
- Version snapshots + side-by-side diff
- Three-style parallel exploration
- Codebase → design system (token extraction)
- Code-signing (Apple ID + Authenticode) + opt-in auto-update — v0.5
- Figma layer export — post-1.0

Have a different priority in mind? [Open an issue](https://github.com/dineshsrivastava07-cell/dsr-codesign/issues/new/choose) or 👍 an existing one.

---

## Star History

<p align="center">
  <a href="https://star-history.com/#dineshsrivastava07-cell/dsr-codesign&Date">
    <img
      alt="Star History Chart"
      src="https://api.star-history.com/image?repos=dineshsrivastava07-cell/dsr-codesign&type=Date"
      width="720"
    />
  </a>
</p>

---

## Built on

- Electron + React 19 + Vite 6 + Tailwind v4
- `@mariozechner/pi-ai` and `pi-coding-agent` (model/provider and agent-loop primitives)
- Ollama (local inference — Gemma 4 by default)
- `electron-builder`

## Reporting issues

Found a bug or have a feature request?

1. **Search** [existing issues](https://github.com/dineshsrivastava07-cell/dsr-codesign/issues) first.
2. **Generate a diagnostics bundle** — Settings → Storage → Export diagnostics (API keys and prompts are redacted automatically).
3. **Open a new issue** using our [bug report](https://github.com/dineshsrivastava07-cell/dsr-codesign/issues/new?template=bug_report.yml) or [feature request](https://github.com/dineshsrivastava07-cell/dsr-codesign/issues/new?template=feature_request.yml) template.
4. For security vulnerabilities, see [SECURITY.md](./SECURITY.md).

## More from DSR-AI-Lab

If you like DSR CoDesign, you may also want to check out our earlier project, [Open Cowork](https://github.com/DSR-AI-Lab/open-cowork), an open-source AI agent desktop app for Windows and macOS with one-click install, multi-model support, sandbox isolation, and built-in skills.

## Community

- **[GitHub Discussions](https://github.com/dineshsrivastava07-cell/dsr-codesign/discussions)** — share your designs in Show & Tell, ask questions in Q&A, and propose features in Ideas.
- **GitHub Issues** — [bug reports and reproducible problems](https://github.com/dineshsrivastava07-cell/dsr-codesign/issues).

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md). Open an issue before writing code and run `pnpm lint && pnpm typecheck && pnpm test` before a PR.

## License

MIT — fork it, ship it, sell it. Third-party notices remain in [NOTICE](./NOTICE).

## Cite this project

If you reference DSR CoDesign in a paper, article, or product comparison, please cite the repository as:

```bibtex
@misc{dsr_codesign_github,
  author       = {DSR-AI-Lab Contributors},
  title        = {DSR CoDesign: An Open-Source Desktop AI Design Tool},
  year         = {2026},
  howpublished = {\url{https://github.com/dineshsrivastava07-cell/dsr-codesign}},
  note         = {GitHub repository}
}
```

Or the machine-readable `CITATION.cff` at the repo root.
