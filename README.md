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
  <a href="https://motion.dev">Motion</a> for React — inside your AI assistant.<br/>
  <strong>33 APIs. Correct imports. Accurate defaults. No hallucinations.</strong>
</p>

---

## Install

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
<summary>Build from source</summary>

```bash
git clone https://github.com/orkait/motion-dev-react-mcp.git
cd motion-dev-react-mcp && npm install && npm run build
claude mcp add motion-dev-react-mcp -- node $(pwd)/dist/index.js
```
</details>

---

## What it does

Your AI writes Motion code that actually works — because it can look up the real API instead of guessing.

```tsx
// Without MCP — AI hallucinates
import { useViewportScroll } from "framer-motion"  // wrong

// With MCP — AI looks it up
import { useScroll, useTransform } from "motion/react"  // correct
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
```

## Tools

| Tool | Purpose |
|------|---------|
| **`get_api`** | Props, types, defaults, and usage for any component or hook |
| **`search_docs`** | Find the right API — *"how to animate on scroll"* |
| **`get_examples`** | Working code by category — scroll, drag, layout, exit, SVG... |
| **`generate_animation`** | Describe what you want &rarr; get a working component |
| **`get_transitions`** | Spring, tween, inertia config and orchestration |
| **`list_apis`** | Browse all 33 APIs, filter by kind |

---

## Coverage

**33 APIs** — verified against [`motiondivision/motion`](https://github.com/motiondivision/motion) v12 source code.

| | |
|-|-|
| **Components** | `motion` `AnimatePresence` `LayoutGroup` `LazyMotion` `MotionConfig` `Reorder.Group` `Reorder.Item` |
| **Hooks** | `useAnimate` `useMotionValue` `useTransform` `useSpring` `useScroll` `useInView` `useMotionValueEvent` `useVelocity` `useTime` `useMotionTemplate` `useDragControls` `useAnimationFrame` `useReducedMotion` `useIsPresent` `usePresence` `usePresenceData` `useWillChange` `useCycle` `usePageInView` |
| **Functions** | `animate` `stagger` `hover` `press` `scroll` `inView` |

**14 example categories** — animation, gestures, scroll, layout, exit, drag, hover, SVG, transitions, variants, keyframes, spring, reorder, performance.

Every prop, every default, every example — cross-referenced against the source, not just the docs.

---

## Why this over the other one

| | motion-dev-react-mcp | [the other MCP](https://github.com/Abhishekrajpurohit/motion-dev-mcp) |
|-|---|---|
| **APIs** | 33 | 9 (5 broken) |
| **Dependencies** | 2 | 180+ (SQLite, Babel, Cheerio...) |
| **Framework** | React only | React + Vue + JS (stubs) |
| **Defaults** | Source-verified | From docs (some wrong) |
| **Tests** | 70 passing | 1 (`1+1=2`) |
| **Last updated** | Active | Aug 2025 |

---

## Contributing

PRs welcome. [Open an issue](https://github.com/orkait/motion-dev-react-mcp/issues) if Motion adds new APIs or you spot an inaccuracy.

Motion+ paid components (AnimateNumber, Carousel, Cursor, ScrambleText, Ticker, Typewriter) are intentionally excluded.

## License

MIT &copy; [Orkait](https://github.com/orkait)
