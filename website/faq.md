---
title: FAQ
titleTemplate: Frequently Asked Questions — DSR CoDesign
description: Common questions about DSR CoDesign — the open-source desktop AI design tool. Alternative to Claude Design, v0, Bolt.new, Lovable, and Figma AI. BYOK, local-first, MIT licensed.
head:
  - - meta
    - property: og:type
      content: article
---

# Frequently Asked Questions

Answers to the questions people most often ask about DSR CoDesign. If your question isn't here, check the [Quickstart](/quickstart) or open a [GitHub Discussion](https://github.com/DSR-AI-Lab/dsr-codesign/discussions).

## What is DSR CoDesign?

DSR CoDesign is an open-source desktop AI design tool. It turns natural-language prompts into HTML prototypes, React components, slide decks, PDFs, and marketing assets. It is the open-source alternative to Anthropic's Claude Design, Vercel's v0, StackBlitz's Bolt.new, and Lovable — but it runs entirely on your laptop with your own API key, local model endpoint, or ChatGPT subscription login.

## Is DSR CoDesign an open-source alternative to Claude Design?

Yes. DSR CoDesign is the MIT-licensed, open-source alternative to Anthropic Claude Design. It runs entirely on your desktop, supports any AI model via BYOK (bring your own key), local endpoints, or ChatGPT subscription login, and requires no DSR-AI-Lab hosted account. The repository is at [github.com/DSR-AI-Lab/dsr-codesign](https://github.com/DSR-AI-Lab/dsr-codesign).

## How does DSR CoDesign compare to v0 by Vercel?

DSR CoDesign generates React / JSX components and HTML prototypes from prompts — the same core capability as v0. The differences:

- **Open source vs closed source.** DSR CoDesign is MIT-licensed. v0 is closed source.
- **Your models vs their models.** DSR CoDesign works with Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen, Ollama, and any OpenAI-compatible endpoint. v0 uses Vercel-hosted OpenAI models only.
- **Local vs cloud.** DSR CoDesign runs entirely on your desktop. v0 runs in Vercel's cloud.
- **Files you own vs previews on their platform.** DSR CoDesign produces exportable HTML / React / PDF / PPTX / ZIP files. v0 produces previews tied to the Vercel platform.

## How does DSR CoDesign compare to Bolt.new?

Bolt.new is a browser-based full-stack app builder running on StackBlitz's WebContainer. DSR CoDesign is a desktop app focused on design artifacts (prototypes, slide decks, marketing assets). The differences:

- **Desktop app with persistent local storage** (DSR CoDesign) vs **browser sandbox** (Bolt.new).
- **Any LLM via BYOK** (DSR CoDesign) vs **Anthropic Claude only** (Bolt.new).
- **Design artifacts** (DSR CoDesign) vs **full runnable apps** (Bolt.new).
- **Files on your disk** (DSR CoDesign) vs **files inside the WebContainer** (Bolt.new).

## How does DSR CoDesign compare to Lovable?

- **Open source** (DSR CoDesign, MIT) vs **closed source** (Lovable).
- **Local-first** (DSR CoDesign) vs **cloud-hosted** (Lovable).
- **Provider or existing subscription cost only** (DSR CoDesign) vs **usage-priced subscription** (Lovable).
- **Design-first prototypes** (DSR CoDesign) vs **end-to-end product creation with Supabase** (Lovable).

## How does DSR CoDesign compare to Figma AI / Figma Make?

They serve different surfaces. Figma AI operates inside the Figma canvas and produces design frames. DSR CoDesign produces code-native artifacts — HTML, React / JSX, PDF, PPTX — outside any proprietary design surface. They are complementary, not direct replacements. If you need designs that hand off cleanly to engineering, DSR CoDesign's output is already code.

## Is DSR CoDesign free?

Yes. DSR CoDesign is MIT licensed. The app itself is free to download, use, modify, and redistribute. You only pay the model route you choose, such as provider token cost or your existing ChatGPT subscription — there is no subscription and no per-token surcharge from us.

## Can I use my Claude Code or Codex setup with DSR CoDesign?

Yes. DSR CoDesign reads your existing `~/.claude/settings.json` and `~/.codex/config.toml` and imports API-key providers, models, and keys in one click. If Codex is using ChatGPT subscription login, use DSR CoDesign's ChatGPT sign-in instead of importing it as an API-key provider. The app calls the selected model route directly — there is no proxy layer or server-side storage.

## Can I log in with my ChatGPT Plus or Codex subscription instead of an API key?

Yes. DSR CoDesign supports ChatGPT Plus / Pro / Team subscription login for Codex models and image generation. One click, no API key required.

## Does DSR CoDesign send my prompts or designs to any third party?

No. Designs, prompts, and scans live on your machine. v0.2 stores design sessions in JSONL and keeps generated sources in workspace files, with configuration in `~/.config/dsr-codesign/config.toml`. The only outbound network traffic is directly to the model route you configure, such as a provider API, local gateway, or ChatGPT subscription endpoint. No telemetry by default.

## Which AI models does DSR CoDesign support?

- **Anthropic Claude** (Opus, Sonnet, Haiku — all versions)
- **OpenAI GPT** (GPT-5.4, GPT-4o, GPT-4 Turbo, O1, O3, O4)
- **Google Gemini** (including third-party relays with `models/` prefix)
- **DeepSeek** (V3, R1)
- **OpenRouter** (every model on the platform)
- **SiliconFlow** (Chinese models like Qwen, Kimi, GLM)
- **Kimi** (Moonshot)
- **GLM** (Zhipu)
- **Qwen** (Alibaba)
- **Ollama** (any local model)
- **Any OpenAI-compatible endpoint** — covers internal proxies, gateway services, CLIProxyAPI, and self-hosted relays.

Keyless (IP-allowlisted) corporate proxies are also supported, as are ChatGPT Plus / Codex subscription logins.

## Which platforms are supported?

- **macOS** — Apple Silicon (M1 / M2 / M3 / M4) and Intel
- **Windows** — x64 and ARM64
- **Linux** — AppImage, `.deb` (Debian / Ubuntu), `.rpm` (Fedora / RHEL)

Heavy features like PDF export (local Chrome) and PPTX generation are lazy-loaded on first use, so the base install stays small.

## How do I install DSR CoDesign?

Fastest: use a package manager.

```bash
# macOS
brew install --cask dsrailab/tap/dsr-codesign

# Windows
scoop bucket add dsrailab https://github.com/DSR-AI-Lab/scoop-bucket
scoop install dsrailab/dsr-codesign
```

Or download the installer directly from [GitHub Releases](https://github.com/DSR-AI-Lab/dsr-codesign/releases). Every release ships `SHA256SUMS.txt` and a CycloneDX SBOM for verification. The winget package is submitted and waiting for Microsoft review; once it merges, `winget install DSR-AI-Lab.DSRCoDesign` will become the Windows one-liner.

## Does DSR CoDesign work offline?

Yes, when used with a local model runtime like Ollama. All generation flows through the same OpenAI-compatible endpoint abstraction, so local and hosted models behave identically from the app's perspective. The app itself requires no internet connection after install; only the model call requires whatever network the chosen provider needs.

## What kind of output can DSR CoDesign produce?

- **HTML prototypes** — sandboxed iframe, inlined CSS, no external runtime dependencies. Deploy as a single file.
- **React / JSX components** — vendored React 18 + Babel, rendered on-device. Copy-paste into your own project.
- **Slide decks** — PPTX via `pptxgenjs`, editable in PowerPoint / Keynote.
- **PDF one-pagers** — rendered via Puppeteer-core against your local Chrome install.
- **ZIP asset bundles** — HTML + CSS + JS + assets, deterministic layout. For handoff to engineering.
- **Markdown exports** — with embedded frontmatter for static-site ingestion.
- **AI-generated bitmap assets** — hero images, backgrounds, illustrations, logos, generated via OpenAI image models, OpenRouter image models, or signed-in ChatGPT subscription. Opt-in, off by default.

## What changed in v0.2?

v0.2 is the Agentic Design update. It turns DSR CoDesign from a one-shot prompt-to-artifact generator into a local design agent:

- **Workspace-backed designs** — every design is a pi session with JSONL history and real files on disk
- **Permissioned local tools** — read, write, edit, bash, grep, find, and ls flow through DSR CoDesign's permission UI
- **Design-specific tools** — `ask`, `scaffold`, `skill`, `preview`, `gen_image`, `tweaks`, `todos`, and `done`
- **Preview self-checks** — the agent can render artifacts, inspect console and asset errors, and use screenshots when the model supports vision
- **Progressive skill disclosure** — design skills, scaffolds, and brand references lazy-load when the agent needs them
- **`DESIGN.md` as design-system memory** — brand values and tokens stay in editable files, not model memory
- **v0.1 migration** — existing SQLite designs migrate into workspaces and session history

See the [roadmap](/roadmap) for the milestone plan.

## Is DSR CoDesign secure?

The security model is:

- **Local-first.** Designs, prompts, and scans never leave your machine.
- **Config on disk, local credential storage.** API keys live in `~/.config/dsr-codesign/config.toml`; ChatGPT OAuth tokens stay in the app config token store.
- **No proxy layer.** Your API key or ChatGPT OAuth token is used directly with the selected model route.
- **No telemetry by default.** No analytics, no auto-update tracking.
- **Signed SBOM per release.** CycloneDX supply-chain manifest attached to every GitHub Release.
- **MIT license.** Audit the source yourself.

Installers are unsigned as of v0.2.0. Apple Developer ID notarization and Windows Authenticode signing land in v0.5. Until then, the repo documents reliable manual-install instructions for each platform.

## How can I contribute to DSR CoDesign?

- **Report bugs** — open an issue with reproduction steps.
- **Suggest features** — use [GitHub Discussions → Ideas](https://github.com/DSR-AI-Lab/dsr-codesign/discussions/categories/ideas).
- **Send PRs** — read [CONTRIBUTING.md](https://github.com/DSR-AI-Lab/dsr-codesign/blob/main/CONTRIBUTING.md). Sign commits with DCO, run `pnpm lint && pnpm typecheck && pnpm test`, add a changeset.
- **Share what you built** — post in [Show & Tell](https://github.com/DSR-AI-Lab/dsr-codesign/discussions/categories/show-and-tell). Standout posts get featured in release notes.

## Where can I get help?

- [GitHub Discussions → Q&A](https://github.com/DSR-AI-Lab/dsr-codesign/discussions/categories/q-a) for usage questions
- [GitHub Issues](https://github.com/DSR-AI-Lab/dsr-codesign/issues) for reproducible bugs
- [LINUX DO](https://linux.do/) (the primary Chinese-speaking community)
- WeChat group — QR code in the [README](https://github.com/DSR-AI-Lab/dsr-codesign#community)
