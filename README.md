# DSR CoDesign

> Your prompts. Your model. Your laptop.
>
> Turn prompts into polished artifacts — locally, with Ollama + Gemma models. Developed by DSR AI Lab.

[Website](https://dsrailab.github.io/dsr-codesign/) · [Quickstart](#quickstart) · [What's new](https://github.com/dineshsrivastava07-cell/dsr-codesign/releases) · [Changelog](./CHANGELOG.md) · [Discussions](https://github.com/dineshsrivastava07-cell/dsr-codesign/discussions) · [Docs](https://dsrailab.github.io/dsr-codesign/quickstart) · [Contributing](./CONTRIBUTING.md) · [Security](./SECURITY.md)

**Open-source alternative to:** [Claude Design](https://dsrailab.github.io/dsr-codesign/claude-design-alternative) · [v0 by Vercel](https://dsrailab.github.io/dsr-codesign/v0-alternative) · [Lovable](https://dsrailab.github.io/dsr-codesign/lovable-alternative) · [Bolt.new](https://dsrailab.github.io/dsr-codesign/bolt-alternative) · [Figma AI](https://dsrailab.github.io/dsr-codesign/figma-ai-alternative)

<p align="center">
  <img src="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/product-hero.png" alt="DSR CoDesign — prompt on the left, live artifact on the right" width="1000" />
</p>

<p align="center">
  <a href="https://github.com/dineshsrivastava07-cell/dsr-codesign/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/dineshsrivastava07-cell/dsr-codesign?label=release&color=c96442" /></a>
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
  <sub><code>claude-code</code> · <code>claude-design-alternative</code> · <code>v0-alternative</code> · <code>bolt-alternative</code> · <code>lovable-alternative</code> · <code>figma-alternative</code> · <code>ai-design</code> · <code>design-to-code</code> · <code>prompt-to-design</code> · <code>ai-prototyping</code> · <code>desktop-design-tool</code> · <code>byok</code> · <code>local-first</code> · <code>multi-model</code> · <code>electron</code></sub>
</p>

---

## What's new

- **`feat/decompose-to-ui-kit`** *(branch)* — Image -> componentized `ui_kits/<slug>/` bundle for coding-agent handoff · Boolean-per-dimension visual parity judge (12 standard checks) · Verify-and-iterate loop · Per-decompose cost row · See [BENCHMARKS.md](./BENCHMARKS.md). Refs [#225](https://github.com/dineshsrivastava07-cell/dsr-codesign/issues/225).
- **v0.2.0** *(2026-05-09)* — Agentic Design: workspace-backed sessions · permissioned local tools · Files panel upgrades · provider diagnostics · security hardening · `DESIGN.md` design systems
- **v0.1.4** *(2026-04-23)* — AI image generation · ChatGPT Plus/Codex subscription support · CLIProxyAPI one-click import · API config hardening
- **v0.1.3** *(2026-04-21)* — Gemini `models/` prefix fix · OpenAI-compatible relay "instructions required" fix · third-party relay SSE-truncation hint
- **v0.1.2** *(2026-04-21)* — Release pipeline · Homebrew / winget / Scoop packaging manifests

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

- **Runs on your laptop** — no mandatory cloud workspace
- **Works with your model** — Claude, GPT, Gemini, Ollama, OpenRouter, and more
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
| Models | ✅ 20+ (Claude, GPT, Gemini, Ollama…) | Claude only | GPT-4o | Multi-LLM |
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
      <p><b>Comment, don’t retype.</b><br/>Click any element, drop a pin, and let the model rewrite only that region.</p>
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

**Requires:** one API key, ChatGPT subscription sign-in, or local Ollama

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

**Or direct download** from the [v0.2.0 GitHub Release](https://github.com/dineshsrivastava07-cell/dsr-codesign/releases/tag/v0.2.0):

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

After each stable tag push, CI syncs SHAs back into `packaging/` and publishes downstream Homebrew/Scoop updates when the repo secrets are configured. The first winget submission is in review; once Microsoft accepts the package, future winget bumps can be automated from the release workflow. Every `packaging/*/README.md` documents its own channel.
</details>

> **Unsigned installer note:** installers are not notarized or Authenticode-signed yet. On **macOS Sequoia 15+** right-click → Open no longer bypasses Gatekeeper, and "Open Anyway" in System Settings often fails. Reliable one-liner:
>
> ```sh
> xattr -cr "/Applications/DSR CoDesign.app"
> ```
>
> Then double-click normally. (Older 0.1.x builds are installed as `/Applications/dsr-codesign.app`.)
> On **Windows**: SmartScreen → More info → Run anyway.
>
> Want a verified build? Compile from source — see [CONTRIBUTING.md](./CONTRIBUTING.md).

### 2. Add a provider

On first launch, DSR CoDesign opens the Settings page. Pick the path that matches how you already use models:

- **ChatGPT subscription** — sign in with ChatGPT to use Codex models without pasting an API key.
- **API key** — paste Anthropic (`sk-ant-...`), OpenAI (`sk-...`), Google Gemini, OpenRouter, SiliconFlow, DeepSeek, or another supported provider key.
- **Local / keyless** — use Ollama or an IP-allowlisted OpenAI-compatible gateway.

Credentials stay in `~/.config/dsr-codesign/config.toml` and the ChatGPT OAuth token store under the app config directory. Nothing leaves your machine unless your chosen model route requires it.

### 3. Type your first prompt

Pick one of **fifteen built-in demos** — landing page, dashboard, pitch slide, pricing, mobile app, chat UI, event calendar, blog article, receipt/invoice, portfolio, settings panel, and more — or describe your own. A sandboxed prototype appears in seconds.

---

## Bring your stack

Already using Claude Code or Codex? API-key provider configs import in one click, with no copy-paste and no need to re-enter settings. If you use Codex through ChatGPT subscription login, sign in directly from Settings:

![Import from Claude Code or Codex in one click](https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/demos/claude-code-import.gif)

---

## Built-in taste

Generic AI tools tend to produce generic output. DSR CoDesign ships with **twelve built-in design skill modules** — slide decks, dashboards, landing pages, SVG charts, glassmorphism, editorial typography, heroes, pricing, footers, chat UIs, data tables, and calendars — plus a built-in taste layer that steers the model toward considered typography, purposeful whitespace, and meaningful color.

Every skill is available in every generation. Before the model writes a line of CSS, it selects the skills that fit the brief and reasons through layout intent, design-system coherence, and contrast, bringing higher-quality design behavior to whichever model you choose.

Add a `SKILL.md` to any project to teach the model your own taste.

---

## What you get

### Models and providers
- **Unified provider model** — Anthropic, OpenAI, Gemini, DeepSeek, OpenRouter, SiliconFlow, local Ollama, or any OpenAI-compatible relay; keyless (IP-allowlisted) proxies supported
- **One-click import and sign-in** — bring Claude Code / Codex API-key provider configs across, or sign in with ChatGPT subscription for Codex models
- **Dynamic model picker** — every provider exposes its real model catalogue, not a hardcoded shortlist

### Generation and editing
- **Prompt → HTML or JSX/React component** prototype, rendered in a sandboxed iframe (vendored React 18 + Babel on-device)
- **Fifteen built-in demos + twelve design skill modules** — ready-to-edit starting points for common design briefs
- **Live agent panel** — watch tool calls stream in real time as the model edits files
- **AI image generation** — opt-in bitmap assets for heroes, product shots, backgrounds, and illustrations via OpenAI, OpenRouter, or signed-in ChatGPT subscription
- **AI-generated sliders** — the model emits the parameters worth tweaking (color, spacing, font)
- **Comment mode** — click any element in the preview to drop a pin, leave a note, and let the model rewrite only that region
- **Decompose to UI Kit** — one click in the chat sidebar emits a `ui_kits/<slug>/` folder (`index.html` + `components/*.tsx` + `tokens.css` + `manifest.json` + `README.md`) shaped for coding-agent handoff. Built-in deterministic + vision verifiers self-check parity using a 12-question boolean rubric (no floating-point arbitrary scores) and re-iterate on gaps. Per-decompose cost surfaces inline as a toast. See [BENCHMARKS.md](./BENCHMARKS.md).

  ![Decompose to UI Kit — source image vs agent-emitted ui_kit, side-by-side parity check](https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/screenshots/decompose-to-ui-kit.png)
  <sub>Source image (gpt-image input) on the left, agent-emitted <code>ui_kit</code> rendered headlessly on the right. Parity score and status are derived deterministically — <code>parityScore = passCount / totalChecks</code> — from the 12-check boolean rubric. Numbers are from a real <code>e2e-opus-final</code> run, not a mock.</sub>

  ![Iter-0 → iter-1 reconcile loop with honest score drift](https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/demos/decompose-iter-reel.gif)
  <sub>4-frame reel from the <code>e2e-nodebench-iter</code> run: source → iter-0 (parityScore 0.82, 6 gaps) → iter-1 (parityScore 0.78, 5 gaps) → honest verdict. The agent fixed some gaps and introduced new layout drift; the boolean rubric exposes the regression instead of hiding it. <a href="https://raw.githubusercontent.com/dineshsrivastava07-cell/dsr-codesign/main/website/public/demos/decompose-iter-reel.mp4">MP4 version</a>.</sub>
- **Generation cancellation** — stop mid-stream without losing prior turns

### Preview and workflow
- **Phone / tablet / desktop preview** — true responsive frames, switch with one click
- **Files panel** — inspect multi-file artifacts (HTML, CSS, JS) before export
- **Instant design switching** — the last five designs keep their preview iframes alive, so Hub ↔ Workspace and sidebar navigation stay zero-delay
- **Connection diagnostic panel** — one-click test for any provider, with actionable errors
- **Per-generation token counter** — see exactly how many tokens each run cost in the sidebar
- **Settings with four tabs** — Models, Appearance, Storage, and Advanced
- **Light + dark themes**, EN / ES / PT-BR UI with live toggle

### Export and packaging
- **Five export formats** — HTML (inlined CSS), PDF (local Chrome), PPTX, ZIP, Markdown
- **GitHub Release pipeline** — unsigned DMG (macOS), EXE (Windows), AppImage (Linux). Code-signing lands in v0.5 along with opt-in auto-update

---

## Roadmap

Current release: v0.2.0. The current release theme is **Agentic Design**.

### Now — v0.2.0 shipped

v0.2 turns DSR CoDesign from a one-shot generator into a local design agent with a real workspace:

- **Design as session** — every design is a pi session with JSONL history and a workspace folder on disk
- **Permissioned agent loop** — pi built-ins for read, write, edit, bash, grep, find, and ls, gated by DSR CoDesign's permission UI
- **Design tools on demand** — `ask`, `scaffold`, `skill`, `preview`, `gen_image`, `tweaks`, `todos`, and `done`
- **`DESIGN.md` as shared memory** — brand tokens and design-system decisions become editable files, not model memory
- **v0.1 migration path** — existing SQLite designs migrate into workspaces and session history

### Previous — v0.1.4

- **AI image generation** — opt-in bitmap assets through OpenAI image models or OpenRouter image models
- **ChatGPT Plus / Codex subscription login** — one-click OAuth for users who do not want to paste an API key
- **CLIProxyAPI one-click import** — auto-detect a running local proxy and bring it into Settings
- **API config hardening** — clearer relay diagnostics for timeouts, SSE truncation, missing `/models`, and incompatible Messages APIs

### Later — v0.2.x and beyond

- Renderer polish for the new `ask`, `preview`, tweaks, and process-management surfaces
- Cost transparency — pre-generation estimate + weekly budget (per-generation token count already shipped)
- Version snapshots + side-by-side diff
- Three-style parallel exploration
- Codebase → design system (token extraction)
- Code-signing (Apple ID + Authenticode) + opt-in auto-update — v0.5
- Figma layer export — post-1.0

Have a different priority in mind? [Open an issue](https://github.com/dineshsrivastava07-cell/dsr-codesign/issues/new/choose) or 👍 an existing one — we do read them.

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

Join the conversation in [GitHub Discussions](https://github.com/dineshsrivastava07-cell/dsr-codesign/discussions) or open an issue for questions and feedback.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md). Open an issue before writing code and run `pnpm lint && pnpm typecheck && pnpm test` before a PR.

## License

MIT — fork it, ship it, sell it. Third-party notices remain in [NOTICE](./NOTICE).

## Cite this project

If you reference DSR CoDesign in a paper, article, or product comparison, please cite the repository as:

```bibtex
@misc{open_codesign_github,
  author       = {DSR-AI-Lab Contributors},
  title        = {DSR CoDesign: An Open-Source Desktop AI Design Tool},
  year         = {2026},
  howpublished = {\url{https://github.com/dineshsrivastava07-cell/dsr-codesign}},
  note         = {GitHub repository}
}
````

Or the machine-readable `CITATION.cff` at the repo root.
