<p align="center">
  <img src="./logo.png" width="120" alt="motion-dev-react-mcp logo" />
</p>

<h1 align="center">motion-dev-react-mcp</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@orkait-ai/motion-dev-react-mcp"><img src="https://img.shields.io/npm/v/@orkait-ai/motion-dev-react-mcp?color=cb3837&label=npm" alt="npm" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="MIT" /></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-compatible-blue.svg" alt="MCP" /></a>
  <a href="https://motion.dev"><img src="https://img.shields.io/badge/Motion-v12-ff0055.svg" alt="Motion v12" /></a>
  <a href="https://github.com/orkait/motion-dev-react-mcp/stargazers"><img src="https://img.shields.io/github/stars/orkait/motion-dev-react-mcp?style=social" alt="Stars" /></a>
</p>

<p align="center">
  Give your AI the <strong>complete, source-verified</strong> <a href="https://motion.dev">Motion</a> for React API.<br/>
  33 APIs. 70 tests. Zero hallucinations.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#before--after">Before / After</a> &middot;
  <a href="#tools">Tools</a> &middot;
  <a href="#coverage">Coverage</a> &middot;
  <a href="#why-this-exists">Why</a>
</p>

---

## Quick Start

```bash
# npx — zero install, works everywhere
npx @orkait-ai/motion-dev-react-mcp
```

**Claude Code**
```bash
claude mcp add motion-dev-react-mcp -- npx -y @orkait-ai/motion-dev-react-mcp
```

**Cursor / Windsurf / any MCP client**
```json
{
  "mcpServers": {
    "motion-dev-react-mcp": {
      "command": "npx",
      "args": ["-y", "@orkait-ai/motion-dev-react-mcp"]
    }
  }
}
```

<details>
<summary>Or install from source</summary>

```bash
git clone https://github.com/orkait/motion-dev-react-mcp.git
cd motion-dev-react-mcp && npm install && npm run build
claude mcp add motion-dev-react-mcp -- node $(pwd)/dist/index.js
```
</details>

---

## Before / After

**Without MCP** — your AI guesses wrong:
```tsx
import { useViewportScroll } from "framer-motion"  // deprecated since 2022
```

**With MCP** — your AI looks it up:
```tsx
import { useScroll, useTransform } from "motion/react"

const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
```

---

## Tools

| Tool | Purpose |
|------|---------|
| **`get_api`** | Exact props, types, defaults, and usage for any API |
| **`search_docs`** | Find the right API for a task — *"how to animate on scroll"* |
| **`get_examples`** | Working code by category — scroll, drag, layout, exit, SVG... |
| **`generate_animation`** | Plain English &rarr; ready-to-use React component |
| **`get_transitions`** | Spring, tween, inertia config + orchestration reference |
| **`list_apis`** | Browse all 33 APIs, filter by kind |

Plus a `motion://react/cheatsheet` resource for quick reference.

---

## Coverage

**33 APIs** verified against [`motiondivision/motion`](https://github.com/motiondivision/motion) v12.38.0 source code.

| Kind | Count | APIs |
|------|-------|------|
| **Components** | 7 | `motion` &middot; `AnimatePresence` &middot; `LayoutGroup` &middot; `LazyMotion` &middot; `MotionConfig` &middot; `Reorder.Group` &middot; `Reorder.Item` |
| **Hooks** | 19 | `useAnimate` &middot; `useMotionValue` &middot; `useTransform` &middot; `useSpring` &middot; `useScroll` &middot; `useInView` &middot; `useMotionValueEvent` &middot; `useVelocity` &middot; `useTime` &middot; `useMotionTemplate` &middot; `useDragControls` &middot; `useAnimationFrame` &middot; `useReducedMotion` &middot; `useIsPresent` &middot; `usePresence` &middot; `usePresenceData` &middot; `useWillChange` &middot; `useCycle` &middot; `usePageInView` |
| **Functions** | 7 | `animate` &middot; `stagger` &middot; `hover` (<1kb) &middot; `press` &middot; `scroll` &middot; `inView` &middot; `motion.create` |

**14 example categories** &mdash; animation, gestures, scroll, layout, exit, drag, hover, SVG, transitions, variants, keyframes, spring, reorder, performance.

### Source-verified defaults

Default values checked against the actual source — not the docs (which have [known inaccuracies](https://github.com/motiondivision/motion)):

| Property | Default | Why it matters |
|----------|---------|----------------|
| `dragElastic` | **0.35** | Docs say 0.5 — source says 0.35 |
| Spring (transforms) | **stiffness: 500, damping: 25** | Not the generic 100/10 |
| Spring (scale) | **stiffness: 550, damping: 30** | Different from other transforms |
| Tween duration | **0.3s** (keyframes: 0.8s) | |
| Inertia timeConstant | **325** | Docs say 700 — source says 325 |

---

## Why This Exists

| Problem | This MCP |
|---------|----------|
| AI hallucinates Motion APIs constantly (Framer Motion &rarr; Motion rename broke training data) | **33 source-verified APIs** with correct imports |
| The other Motion MCP bundles SQLite + Babel + 180 deps | **2 runtime dependencies**, starts in ms |
| Other MCPs cover React + Vue + JS with half-baked stubs | **React only** — focused, complete |
| Docs have wrong defaults (dragElastic, timeConstant) | **Source-verified** against v12.38.0 |

---

## Architecture

```
src/
  data.ts    33 APIs — props, usage, examples, tips
  index.ts   MCP server — 6 tools + 1 resource
```

2 files &middot; 2 deps &middot; ~75KB &middot; 70 tests &middot; 0 network calls

---

## Contributing

PRs welcome. Motion adds new APIs? Spot an inaccuracy? [Open an issue](https://github.com/orkait/motion-dev-react-mcp/issues).

Motion+ paid components (AnimateNumber, Carousel, Cursor, ScrambleText, Ticker, Typewriter) are intentionally excluded.

## License

MIT &copy; [Orkait](https://github.com/orkait)
