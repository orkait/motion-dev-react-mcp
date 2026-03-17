# motion-dev-react-mcp

MCP server for [Motion](https://motion.dev) (formerly Framer Motion) — React animation library. Gives AI assistants instant access to documentation, API references, code examples, and animation snippet generation.

**React-only. Zero database. Lightweight.**

## Tools

| Tool | Description |
|------|-------------|
| `list_apis` | List all Motion React APIs, filterable by kind (component, hook, function, utility) |
| `get_api` | Detailed API reference — props, usage, examples, tips |
| `search_docs` | Full-text search across docs and code examples |
| `get_examples` | Code examples by category (scroll, drag, hover, layout, exit, etc.) |
| `get_transitions` | Complete transition types reference (tween, spring, inertia, orchestration) |
| `generate_animation` | Generate animation snippets from natural language descriptions |

## Resources

| URI | Description |
|-----|-------------|
| `motion://react/cheatsheet` | Quick reference cheatsheet |

## Coverage

25 React APIs documented:

- **Components:** `motion`, `AnimatePresence`, `LayoutGroup`, `LazyMotion`, `MotionConfig`, `Reorder.Group`, `Reorder.Item`
- **Hooks:** `useAnimate`, `useMotionValue`, `useTransform`, `useSpring`, `useScroll`, `useInView`, `useMotionValueEvent`, `useVelocity`, `useTime`, `useMotionTemplate`, `useDragControls`, `useAnimationFrame`, `useReducedMotion`, `useIsPresent`, `usePresence`, `usePresenceData`
- **Utilities:** `stagger`, `animate`

14 example categories: animation, gestures, scroll, layout, exit, drag, hover, svg, transitions, variants, keyframes, spring, reorder, performance.

## Installation

### Claude Code

```bash
claude mcp add motion-react-mcp -- node /path/to/motion-react-mcp/dist/index.js
```

### Generic MCP client

```json
{
  "mcpServers": {
    "motion-react-mcp": {
      "command": "node",
      "args": ["/path/to/motion-react-mcp/dist/index.js"]
    }
  }
}
```

### Build from source

```bash
git clone https://github.com/orkait/motion-dev-react-mcp.git
cd motion-dev-react-mcp
npm install
npm run build
```

## License

MIT
