<p align="center">
  <img src="https://motion.dev/favicon.svg" width="60" alt="Motion logo" />
</p>

<h1 align="center">motion-dev-react-mcp</h1>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node >= 18" /></a>
  <a href="https://modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-compatible-blue.svg" alt="MCP Compatible" /></a>
  <a href="https://github.com/orkait/motion-dev-react-mcp/stargazers"><img src="https://img.shields.io/github/stars/orkait/motion-dev-react-mcp?style=social" alt="GitHub Stars" /></a>
  <br />
  <a href="https://github.com/orkait/motion-dev-react-mcp/commits/main"><img src="https://img.shields.io/github/last-commit/orkait/motion-dev-react-mcp" alt="Last Commit" /></a>
  <a href="https://www.npmjs.com/package/motion-dev-react-mcp"><img src="https://img.shields.io/npm/v/motion-dev-react-mcp?color=cb3837" alt="npm version" /></a>
  <a href="https://motion.dev"><img src="https://img.shields.io/badge/Motion-v12-ff0055.svg" alt="Motion v12" /></a>
</p>

<p align="center">
  Give your AI assistant perfect knowledge of <a href="https://motion.dev">Motion</a> for React.
  <br />
  <strong>Stop correcting hallucinated props. Start shipping animations.</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#what-it-does">What It Does</a> &middot;
  <a href="#tools">Tools</a> &middot;
  <a href="#why-this-exists">Why This Exists</a>
</p>

---

## The Problem

You ask your AI to add a scroll-linked parallax animation with Motion. It gives you code with made-up props, deprecated Framer Motion imports, and a `useViewportScroll` hook that hasn't existed since 2022.

You spend the next 20 minutes fixing hallucinations instead of building your UI.

## The Fix

`motion-dev-react-mcp` is an [MCP server](https://modelcontextprotocol.io) that gives any AI assistant — Claude, Cursor, Windsurf, or anything that speaks MCP — direct access to the **complete, accurate** Motion for React documentation.

No hallucinated APIs. No outdated imports. Just correct code, first try.

## Quick Start

**One command. That's it.**

```bash
# Clone and build
git clone https://github.com/orkait/motion-dev-react-mcp.git
cd motion-dev-react-mcp
npm install && npm run build

# Add to Claude Code
claude mcp add motion-react-mcp -- node $(pwd)/dist/index.js
```

<details>
<summary><strong>Cursor / Windsurf / Other MCP clients</strong></summary>

Add to your MCP config (typically `~/.cursor/mcp.json` or equivalent):

```json
{
  "mcpServers": {
    "motion-react-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/motion-dev-react-mcp/dist/index.js"]
    }
  }
}
```

</details>

## What It Does

Ask your AI to build any Motion animation. The MCP server silently provides it with the right APIs, props, and patterns — so the generated code actually works.

**Before (without MCP):**
```tsx
// AI hallucinates deprecated API
import { useViewportScroll } from "framer-motion"  // wrong
```

**After (with MCP):**
```tsx
// AI looks up the real API via MCP
import { useScroll, useTransform } from "motion/react"  // correct

const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
```

## Tools

Your AI gets 6 tools to work with:

| Tool | What your AI uses it for |
|------|--------------------------|
| `get_api` | Look up exact props, types, and usage for any component or hook |
| `search_docs` | Find the right API for a task ("how to animate on scroll") |
| `get_examples` | Get working code patterns by category (scroll, drag, layout, exit...) |
| `generate_animation` | Turn a plain-English description into a ready-to-use component |
| `get_transitions` | Reference for spring, tween, inertia config and orchestration |
| `list_apis` | Browse all available APIs |

Plus a `motion://react/cheatsheet` resource for quick reference.

## Coverage

**25 APIs** across the full Motion for React surface:

| | APIs |
|-|------|
| Components | `motion` `AnimatePresence` `LayoutGroup` `LazyMotion` `MotionConfig` `Reorder.Group` `Reorder.Item` |
| Hooks | `useAnimate` `useMotionValue` `useTransform` `useSpring` `useScroll` `useInView` `useMotionValueEvent` `useVelocity` `useTime` `useMotionTemplate` `useDragControls` `useAnimationFrame` `useReducedMotion` `useIsPresent` `usePresence` `usePresenceData` |
| Utilities | `animate` `stagger` |

**14 example categories:** animation, gestures, scroll, layout, exit, drag, hover, SVG, transitions, variants, keyframes, spring, reorder, performance.

Every prop documented. Every API with working examples. Sourced directly from [motion.dev/docs](https://motion.dev/docs).

## Why This Exists

- **AI models hallucinate animation APIs constantly.** Motion (formerly Framer Motion) has changed significantly — old training data leads to wrong code.
- **Existing solutions are bloated.** The only other Motion MCP bundles SQLite, Babel, and 180+ dependencies for... a docs lookup. This one has **2 runtime dependencies**.
- **React only.** No half-baked Vue/JS conversion stubs. Focused coverage for the framework you're actually using.

## How It Works

All documentation is embedded as structured TypeScript data — no database, no network calls, no scraping at runtime. The MCP server starts in milliseconds and responds instantly.

```
src/
  data.ts    # 25 APIs with full props, usage, examples, tips
  index.ts   # MCP server — 6 tools + 1 resource
```

Total: **2 source files. 2 runtime dependencies. ~55KB bundled.**

## Contributing

PRs welcome. If Motion adds new APIs or you spot inaccuracies, open an issue or submit a fix.

## License

MIT
