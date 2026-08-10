# DSR CoDesign — Architecture

> Local-first AI design tool. Prompts in → polished artifacts out. Powered by Ollama + Gemma 4 running on your hardware.

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
│   ├── providers/             # LLM provider adapters (Ollama, OpenAI-compat, Codex OAuth)
│   ├── runtime/               # Sandboxed iframe renderer (esbuild-wasm + import maps)
│   ├── ui/                    # Shared design system (Radix UI + Tailwind v4 tokens)
│   ├── artifacts/             # Artifact schema (HTML / React / SVG / PPTX)
│   ├── exporters/             # PDF / PPTX / ZIP exporters (lazy-loaded)
│   ├── templates/             # Built-in demo prompts and example gallery
│   ├── shared/                # Zod schemas, types, config constants
│   └── i18n/                  # Localization (en, es, pt-BR)
└── docs/                      # Vision, roadmap, RFCs (internal, gitignored)
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
│                              │  │  · Codex OAuth     │  │  │
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
          │ Ollama Local │   │ OpenAI-compatible│  │  Codex API   │
          │ localhost:   │   │ relay / cloud    │  │  (ChatGPT    │
          │ 11434/v1     │   │ (Anthropic,      │  │  subscription│
          │              │   │  Gemini, etc.)   │  │  OAuth)      │
          │ gemma4:26b   │   └──────────────────┘  └──────────────┘
          │ gemma4:e4b   │
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
    ┌───────────┼───────────────┐
    ▼           ▼               ▼
 Ollama      API Key         ChatGPT
 (local)    (cloud)         (OAuth)
    │           │               │
    │    ┌──────┴──────┐        │
    │    │ Anthropic   │        │
    │    │ OpenAI      │        │
    │    │ Gemini      │        │
    │    │ DeepSeek    │   Codex OAuth PKCE flow
    │    │ OpenRouter  │   localhost callback server
    │    │ SiliconFlow │   (auto port-fallback if
    │    │ Custom relay│    1455 is busy)
    │    └──────┬──────┘        │
    │           │               │
    └─────┬─────┘               │
          │◄────────────────────┘
          ▼
  @mariozechner/pi-ai
  OpenAI-compatible wire
  (/v1/chat/completions SSE)
          │
          ▼
   Core Orchestrator
```

---

## Data Storage

```
~/.config/dsr-codesign/
├── config.toml          # Provider keys, model selection (mode 0600)
├── preferences.json     # UI preferences (theme, locale)
└── locale.json          # Last-used locale

~/Library/Application Support/@dsr-codesign/desktop/
└── design-store.json    # All designs + snapshots + diagnostic events
                         # Schema-versioned JSON (no SQLite)

~/Documents/CoDesign/<design-name>/   # Default workspace root
├── DESIGN.md            # Brand tokens + design-system decisions
├── index.html           # Generated artifact(s)
└── ui_kits/             # Decompose-to-UI-Kit output
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
| State format | JSON file (`design-store.json`) | Human-readable, no SQLite dependency, schema-versioned |
| Sandbox | Electron iframe `srcdoc` | Process isolation without extra Node process; esbuild-wasm transforms JSX locally |
| Auth | OAuth 2.0 PKCE + localhost callback | Follows Codex/gh CLI pattern; port auto-fallback handles Docker conflicts |
| i18n | i18next | EN / ES / PT-BR; zh-CN removed in DSR fork |
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
| Local inference | Ollama (`gemma4:26b`, `gemma4:e4b`) |
| Monorepo | pnpm workspaces + Turborepo |
| Lint / format | Biome |
| Tests | Vitest (unit) + Playwright (E2E) |
| Types | TypeScript strict |
| Build | electron-builder |
