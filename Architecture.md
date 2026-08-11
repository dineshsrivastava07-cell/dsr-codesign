# DSR CoDesign — Architecture

> Local-first AI design tool by DSR AI Lab. Prompts in → polished artifacts out. Powered by Ollama + Gemma 4 running on your hardware by default.

---

## Repository Layout

```
dsr-codesign/
├── apps/
│   └── desktop/               # Electron shell (main + renderer processes)
│       ├── src/main/          # Node.js main process — IPC, DB, file I/O
│       └── src/renderer/      # React 19 UI — views, store, components
├── packages/
│   ├── core/                  # Generation orchestration (prompt → artifact pipeline)
│   ├── providers/             # LLM provider adapters (Ollama, OpenAI-compat, Google OAuth)
│   ├── runtime/               # Sandboxed iframe renderer (esbuild-wasm + import maps)
│   ├── ui/                    # Shared design system (Radix UI + Tailwind v4 tokens)
│   ├── artifacts/             # Artifact schema (HTML / React / SVG / PPTX)
│   ├── exporters/             # PDF / PPTX / ZIP exporters (lazy-loaded)
│   ├── templates/             # Built-in demo prompts and example gallery
│   ├── shared/                # Zod schemas, types, config constants
│   └── i18n/                  # Localization (en)
└── website/                   # VitePress docs site (dsrailab.github.io/dsr-codesign)
```

---

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DSR CoDesign Desktop                    │
│                                                             │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │   Renderer Process   │    │      Main Process        │  │
│  │   (React 19 + Vite)  │    │   (Node.js + Electron)   │  │
│  │                      │    │                          │  │
│  │  ┌────────────────┐  │    │  ┌────────────────────┐  │  │
│  │  │   Zustand Store│  │    │  │  IPC Handler Layer │  │  │
│  │  │  · designs     │  │◄──►│  │  · snapshots-ipc   │  │  │
│  │  │  · snapshots   │  │IPC │  │  · generation-ipc  │  │  │
│  │  │  · generation  │  │    │  │  · exporter-ipc    │  │  │
│  │  │  · chat        │  │    │  │  · memory-ipc      │  │  │
│  │  └────────────────┘  │    │  └────────┬───────────┘  │  │
│  │                      │    │           │               │  │
│  │  ┌────────────────┐  │    │  ┌────────▼───────────┐  │  │
│  │  │  Sandbox iframe│  │    │  │   Core Package     │  │  │
│  │  │  (preview)     │  │    │  │  · Orchestrator    │  │  │
│  │  │  esbuild-wasm  │  │    │  │  · Skills engine   │  │  │
│  │  │  + React 18    │  │    │  │  · Prompt builder  │  │  │
│  │  └────────────────┘  │    │  └────────┬───────────┘  │  │
│  └──────────────────────┘    │           │               │  │
│                              │  ┌────────▼───────────┐  │  │
│                              │  │  Providers Package  │  │  │
│                              │  │  · Ollama adapter  │  │  │
│                              │  │  · OpenAI-compat   │  │  │
│                              │  │  · Google OAuth    │  │  │
│                              │  └────────┬───────────┘  │  │
│                              │           │               │  │
│                              │  ┌────────▼───────────┐  │  │
│                              │  │   design-store.json │  │  │
│                              │  │   config.toml       │  │  │
│                              │  │   Workspace files   │  │  │
│                              │  └────────────────────┘  │  │
│                              └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
          ┌──────────────┐   ┌──────────────────┐  ┌──────────────┐
          │ Ollama Local │   │ OpenAI-compatible│  │ Google Gemini│
          │ localhost:   │   │ relay / cloud    │  │ OAuth 2.0    │
          │ 11434/v1     │   │ (OpenAI, Anthropic│ │ (no key      │
          │              │   │  DeepSeek, etc.) │  │  required)   │
          │ gemma4:26b   │   └──────────────────┘  └──────────────┘
          │ (default)    │
          └──────────────┘
```

---

## Generation Pipeline

```
User types prompt
       │
       ▼
┌─────────────────────┐
│  NewDesignDialog /  │
│  ChatInput (UI)     │
└────────┬────────────┘
         │ IPC: snapshots:v1:create-design
         ▼
┌─────────────────────┐
│  snapshots-ipc.ts   │  Creates design record + workspace folder
│  (Main process)     │  Writes design-store.json
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  generation-ipc.ts  │  Spawns pi-ai agent session
│  (Main process)     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│                  core/Orchestrator                  │
│                                                     │
│  1. Build system prompt                             │
│     ├─ identity.md  (DSR CoDesign persona)          │
│     ├─ Skill modules (dashboard, landing, slide…)   │
│     ├─ Scaffold definitions                         │
│     └─ Brand references (if workspace has DESIGN.md)│
│                                                     │
│  2. Select skills matching the brief                │
│     └─ Skills: layout-intent, typography, color,   │
│        data-vis, glassmorphism, editorial…          │
│                                                     │
│  3. Agent loop (pi-ai)                              │
│     ├─ stream tokens → renderer via IPC             │
│     ├─ tool calls: scaffold, skill, preview,        │
│     │              gen_image, tweaks, todos, done   │
│     └─ self-check + iterate on gaps                 │
│                                                     │
│  4. Emit artifact                                   │
│     └─ HTML / JSX / SVG / PPTX                     │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Sandbox iframe     │  Renders artifact in isolated context
│  (runtime package)  │  esbuild-wasm transforms JSX on-device
│                     │  React 18 vendored locally — no CDN
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Preview pane       │  Phone / tablet / desktop frames
│  (Renderer UI)      │  Comment pins, tweaks sliders
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Export             │  HTML · PDF · PPTX · ZIP · Markdown
│  (exporters pkg,    │  Lazy-loaded on first use
│   lazy-loaded)      │
└─────────────────────┘
```

---

## Provider Routing

```
Settings → Provider selection
                │
    ┌───────────┼───────────────────┐
    ▼           ▼                   ▼
 Ollama    Google Gemini         API Key
 (local,    (OAuth 2.0           (cloud)
 default)    PKCE flow)             │
    │           │               ┌───┴──────────┐
    │           │               │ OpenAI       │
    │           │               │ Anthropic    │
    │           │               │ DeepSeek     │
    │           │               │ OpenRouter   │
    │           │               │ SiliconFlow  │
    │           │               │ Custom relay │
    │           │               └───┬──────────┘
    │           │                   │
    └─────┬─────┘                   │
          │◄────────────────────────┘
          ▼
  @mariozechner/pi-ai
  OpenAI-compatible wire
  (/v1/chat/completions SSE)
          │
          ▼
   Core Orchestrator
```

### Fresh-install default

On first launch with no existing config, `loadConfigOnBoot` auto-seeds **Ollama** (`gemma4:26b` at `http://localhost:11434/v1`) as the active provider. No sign-in or API key required. The user can switch to any provider in Settings → Models at any time.

---

## Data Storage

```
~/.config/dsr-codesign/
├── config.toml              # Provider keys, model selection (mode 0600)
├── google-auth.json         # Google OAuth tokens (Gemini sign-in)
├── preferences.json         # UI preferences (theme, locale)
└── locale.json              # Last-used locale

~/Library/Application Support/@dsr-codesign/desktop/
├── design-store.json        # All designs + snapshots + diagnostic events
│                            # Schema-versioned JSON (no SQLite)
└── memory/
    └── user.md              # Long-term user memory (auto-updated by agent)

~/Documents/CoDesign/<design-name>/   # Default workspace root
├── DESIGN.md                # Brand tokens + design-system decisions
├── index.html               # Generated artifact(s)
└── ui_kits/                 # Decompose-to-UI-Kit output
    └── <slug>/
        ├── index.html
        ├── components/
        ├── tokens.css
        ├── manifest.json
        └── README.md
```

---

## Monorepo Build Graph (Turborepo)

```
                    desktop (Electron app)
                   /        \
                  /          \
               core        providers
              /    \           |
             /      \      shared
        templates  artifacts
             \      /
              shared
                |
               i18n
                |
             runtime ──── ui
```

Build order is derived from package.json `dependencies`. Turborepo caches each
package build; only changed packages rebuild on `pnpm build`.

---

## Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Desktop runtime | Electron | Full Node.js API access for file I/O, OAuth callbacks, local model comms |
| LLM wire | OpenAI `/v1/chat/completions` | Works with Ollama, Anthropic relay, OpenAI, Gemini, all in one interface |
| Default model | `gemma4:26b` via Ollama | Local-first, no API key required, runs on Apple Silicon |
| Default provider seed | Auto-write `config.toml` on first boot | Eliminates onboarding friction — Ollama works immediately |
| Google auth | OAuth 2.0 PKCE + localhost callback | No API key to paste; follows gh CLI / Codex pattern |
| State format | JSON file (`design-store.json`) | Human-readable, no SQLite dependency, schema-versioned |
| Sandbox | Electron iframe `srcdoc` | Process isolation without extra Node process; esbuild-wasm transforms JSX locally |
| i18n | i18next | English-only UI (EN) |
| Packaging | electron-builder | DMG, NSIS, AppImage, deb, rpm from single config |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron (latest stable) |
| UI framework | React 19 + Vite 6 |
| Styling | Tailwind v4 + CSS variables |
| State | Zustand |
| Components | Radix UI primitives |
| LLM abstraction | `@mariozechner/pi-ai` |
| Local inference | Ollama (`gemma4:26b` default, any pulled model supported) |
| Cloud inference | Google Gemini (OAuth), OpenAI, Anthropic, OpenRouter, and more |
| Monorepo | pnpm workspaces + Turborepo |
| Lint / format | Biome |
| Tests | Vitest (unit) + Playwright (E2E) |
| Types | TypeScript strict |
| Build | electron-builder |
