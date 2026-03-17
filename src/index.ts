#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  ALL_APIS,
  API_KINDS,
  CATEGORIES,
  TRANSITIONS_REFERENCE,
  searchApis,
  getApiByName,
  getExamplesByCategory,
  formatApiReference,
  formatExample,
  capitalize,
} from "./data.js";

const server = new McpServer({
  name: "motion-react-mcp",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool: list_apis
// ---------------------------------------------------------------------------
server.tool(
  "list_apis",
  "List all available Motion for React APIs (components, hooks, utilities)",
  {
    kind: z
      .enum(["all", ...API_KINDS])
      .optional()
      .describe("Filter by API kind"),
  },
  async ({ kind }) => {
    const apis = kind && kind !== "all"
      ? ALL_APIS.filter((a) => a.kind === kind)
      : ALL_APIS;

    const grouped: Record<string, string[]> = {};
    for (const api of apis) {
      const k = api.kind;
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(`${api.name} — ${api.description.split(".")[0]}`);
    }

    let text = "# Motion for React — API Reference\n\n";
    text += `Import from \`"motion/react"\` (or \`"motion/react-client"\` for RSC)\n\n`;
    for (const [kind, items] of Object.entries(grouped)) {
      text += `## ${capitalize(kind)}s\n`;
      for (const item of items) {
        text += `- ${item}\n`;
      }
      text += "\n";
    }
    return { content: [{ type: "text", text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_api
// ---------------------------------------------------------------------------
server.tool(
  "get_api",
  "Get detailed API reference for a specific Motion for React component, hook, or utility. Includes props, usage, examples, and tips.",
  {
    name: z
      .string()
      .describe(
        "API name (e.g., 'motion', 'AnimatePresence', 'useAnimate', 'useScroll', 'stagger', 'Reorder.Group')",
      ),
  },
  async ({ name }) => {
    const api = getApiByName(name);
    if (!api) {
      const suggestions = searchApis(name).map((r) => r.api.name);
      return {
        content: [
          {
            type: "text",
            text: `API "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""}\n\nAvailable APIs: ${ALL_APIS.map((a) => a.name).join(", ")}`,
          },
        ],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: formatApiReference(api) }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: search_docs
// ---------------------------------------------------------------------------
server.tool(
  "search_docs",
  "Search Motion for React documentation by keyword. Searches API names, descriptions, and code examples.",
  {
    query: z.string().describe("Search query (e.g., 'scroll animation', 'drag constraints', 'exit', 'spring')"),
  },
  async ({ query }) => {
    const results = searchApis(query);
    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No results for "${query}". Try broader terms. Available categories: ${CATEGORIES.join(", ")}`,
          },
        ],
      };
    }

    let text = `# Search results for "${query}"\n\n`;
    text += `Found ${results.length} API(s):\n\n`;
    for (const { api, matchingExamples } of results) {
      text += `## ${api.name} (${api.kind})\n`;
      text += `${api.description}\n`;
      text += `Import: \`${api.importPath}\`\n\n`;

      if (matchingExamples.length > 0) {
        text += "**Relevant examples:**\n";
        for (const ex of matchingExamples) {
          text += formatExample(ex);
        }
      }
      text += "---\n\n";
    }
    return { content: [{ type: "text", text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_examples
// ---------------------------------------------------------------------------
server.tool(
  "get_examples",
  "Get code examples for a specific animation category",
  {
    category: z
      .string()
      .describe(
        `Category: ${CATEGORIES.join(", ")}`,
      ),
  },
  async ({ category }) => {
    const examples = getExamplesByCategory(category);
    if (examples.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No examples for category "${category}". Available: ${CATEGORIES.join(", ")}`,
          },
        ],
      };
    }

    let text = `# ${capitalize(category)} Examples\n\n`;
    for (const ex of examples) {
      text += formatExample(ex, 2);
    }
    return { content: [{ type: "text", text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_transitions
// ---------------------------------------------------------------------------
server.tool(
  "get_transitions",
  "Get the complete transition types reference (tween, spring, inertia, orchestration, per-value config)",
  {},
  async () => {
    return { content: [{ type: "text", text: TRANSITIONS_REFERENCE }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: generate_animation
// ---------------------------------------------------------------------------
server.tool(
  "generate_animation",
  "Generate a Motion for React animation snippet from a natural-language description. Returns ready-to-use JSX.",
  {
    description: z
      .string()
      .describe(
        "Describe the animation you want (e.g., 'fade in from bottom on scroll', 'draggable card with spring', 'staggered list entrance', 'page transition with exit')",
      ),
    elementType: z
      .string()
      .optional()
      .describe("HTML element type (default: 'div')"),
  },
  async ({ description, elementType }) => {
    const el = elementType ?? "div";
    const desc = description.toLowerCase();

    const motionImports = new Set<string>(["motion"]);
    const reactImports = new Set<string>();

    let jsx = "";
    let hooks = "";
    let wrapBefore = "";
    let wrapAfter = "";

    // Scroll-linked
    if (desc.includes("scroll") && (desc.includes("link") || desc.includes("progress") || desc.includes("parallax"))) {
      motionImports.add("useScroll");
      motionImports.add("useTransform");
      reactImports.add("useRef");
      hooks += `  const ref = useRef(null);\n`;
      hooks += `  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });\n`;

      if (desc.includes("parallax")) {
        hooks += `  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);\n`;
        jsx = `<motion.${el} ref={ref} style={{ y }}>\n  {children}\n</motion.${el}>`;
      } else {
        hooks += `  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);\n`;
        hooks += `  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);\n`;
        jsx = `<motion.${el} ref={ref} style={{ opacity, y }}>\n  {children}\n</motion.${el}>`;
      }
    }
    // Scroll-triggered (whileInView)
    else if (desc.includes("scroll") || desc.includes("in view") || desc.includes("viewport")) {
      jsx = `<motion.${el}\n  initial={{ opacity: 0, y: 40 }}\n  whileInView={{ opacity: 1, y: 0 }}\n  viewport={{ once: true, amount: 0.3 }}\n  transition={{ duration: 0.6, ease: "easeOut" }}\n>\n  {children}\n</motion.${el}>`;
    }
    // Exit / page transition
    else if (desc.includes("exit") || desc.includes("page transition") || desc.includes("route")) {
      motionImports.add("AnimatePresence");
      wrapBefore = `<AnimatePresence mode="wait">\n  `;
      wrapAfter = `\n</AnimatePresence>`;
      jsx = `<motion.${el}\n    key={/* unique key */}\n    initial={{ opacity: 0, x: 20 }}\n    animate={{ opacity: 1, x: 0 }}\n    exit={{ opacity: 0, x: -20 }}\n    transition={{ duration: 0.3 }}\n  >\n    {children}\n  </motion.${el}>`;
    }
    // Staggered list
    else if (desc.includes("stagger") || desc.includes("list")) {
      motionImports.add("useAnimate");
      motionImports.add("stagger");
      reactImports.add("useEffect");
      hooks += `  const [scope, animate] = useAnimate();\n\n`;
      hooks += `  useEffect(() => {\n    animate("li", { opacity: 1, y: 0 }, { delay: stagger(0.08) });\n  }, []);\n`;
      jsx = `<ul ref={scope}>\n  {items.map(item => (\n    <motion.li key={item} initial={{ opacity: 0, y: 20 }}>\n      {item}\n    </motion.li>\n  ))}\n</ul>`;
    }
    // Drag
    else if (desc.includes("drag")) {
      if (desc.includes("spring") || desc.includes("bounce")) {
        jsx = `<motion.${el}\n  drag\n  dragSnapToOrigin\n  dragElastic={0.3}\n  whileDrag={{ scale: 1.05, cursor: "grabbing" }}\n  transition={{ type: "spring", stiffness: 300, damping: 20 }}\n>\n  {children}\n</motion.${el}>`;
      } else {
        jsx = `<motion.${el}\n  drag\n  dragConstraints={{ top: -100, left: -100, bottom: 100, right: 100 }}\n  whileDrag={{ scale: 1.05 }}\n>\n  {children}\n</motion.${el}>`;
      }
    }
    // Hover
    else if (desc.includes("hover")) {
      jsx = `<motion.${el}\n  whileHover={{ scale: 1.05 }}\n  whileTap={{ scale: 0.95 }}\n  transition={{ type: "spring", stiffness: 400, damping: 17 }}\n>\n  {children}\n</motion.${el}>`;
    }
    // Layout / shared layout
    else if (desc.includes("layout") || desc.includes("shared")) {
      if (desc.includes("shared") || desc.includes("tab") || desc.includes("underline")) {
        jsx = `{selected === id && (\n  <motion.${el} layoutId="indicator" className="indicator" />\n)}`;
      } else {
        jsx = `<motion.${el} layout transition={{ type: "spring", stiffness: 500, damping: 30 }}>\n  {children}\n</motion.${el}>`;
      }
    }
    // Spring
    else if (desc.includes("spring") || desc.includes("bounce")) {
      jsx = `<motion.${el}\n  initial={{ scale: 0 }}\n  animate={{ scale: 1 }}\n  transition={{ type: "spring", stiffness: 260, damping: 20 }}\n>\n  {children}\n</motion.${el}>`;
    }
    // SVG
    else if (desc.includes("svg") || desc.includes("line draw") || desc.includes("path")) {
      jsx = `<motion.path\n  d="M0 0 L100 100"\n  initial={{ pathLength: 0 }}\n  animate={{ pathLength: 1 }}\n  transition={{ duration: 2, ease: "easeInOut" }}\n/>`;
    }
    // Fade in (default)
    else if (desc.includes("fade")) {
      const fromBottom = desc.includes("bottom") || desc.includes("up");
      const fromLeft = desc.includes("left");
      const fromRight = desc.includes("right");
      const initial: Record<string, number> = { opacity: 0 };
      if (fromBottom) initial.y = 30;
      if (fromLeft) initial.x = -30;
      if (fromRight) initial.x = 30;

      jsx = `<motion.${el}\n  initial={${JSON.stringify(initial)}}\n  animate={{ opacity: 1${fromBottom ? ", y: 0" : ""}${fromLeft || fromRight ? ", x: 0" : ""} }}\n  transition={{ duration: 0.5, ease: "easeOut" }}\n>\n  {children}\n</motion.${el}>`;
    }
    // Generic animation
    else {
      jsx = `<motion.${el}\n  initial={{ opacity: 0, y: 20 }}\n  animate={{ opacity: 1, y: 0 }}\n  transition={{ duration: 0.4, ease: "easeOut" }}\n>\n  {children}\n</motion.${el}>`;
    }

    const importLine = `import { ${[...motionImports].join(", ")} } from "motion/react";`;
    const reactImportLine = reactImports.size > 0
      ? `\nimport { ${[...reactImports].join(", ")} } from "react";`
      : "";

    let code = `${importLine}${reactImportLine}\n\nfunction AnimatedComponent({ children }) {\n`;
    if (hooks) code += hooks + "\n";
    code += `  return (\n    ${wrapBefore}${jsx}${wrapAfter}\n  );\n}`;

    return {
      content: [
        {
          type: "text",
          text: `\`\`\`tsx\n${code}\n\`\`\`\n\nYou can customize the animation values, transition type, and element type as needed.`,
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Resource: cheatsheet
// ---------------------------------------------------------------------------
server.resource(
  "cheatsheet",
  "motion://react/cheatsheet",
  {
    description: "Motion for React quick reference cheatsheet",
    mimeType: "text/markdown",
  },
  async () => {
    const text = `# Motion for React — Cheatsheet

## Import
\`\`\`tsx
import { motion, AnimatePresence, useAnimate, useMotionValue, useTransform, useSpring, useScroll, useInView, stagger } from "motion/react"
// For RSC (Next.js app dir): import from "motion/react-client"
// For reduced bundle: import { m } from "motion/react-m" + LazyMotion
\`\`\`

## Quick Patterns

### Fade in
\`\`\`tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
\`\`\`

### Hover + Tap
\`\`\`tsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
\`\`\`

### Exit animation
\`\`\`tsx
<AnimatePresence>
  {show && <motion.div key="x" exit={{ opacity: 0 }} />}
</AnimatePresence>
\`\`\`

### Scroll-triggered
\`\`\`tsx
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} />
\`\`\`

### Scroll-linked
\`\`\`tsx
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
<motion.div style={{ opacity }} />
\`\`\`

### Drag
\`\`\`tsx
<motion.div drag dragConstraints={{ top: -100, left: -100, bottom: 100, right: 100 }} />
\`\`\`

### Layout animation
\`\`\`tsx
<motion.div layout />                    // auto-animate layout changes
<motion.div layoutId="shared-element" /> // shared element transition
\`\`\`

### Variants with stagger
\`\`\`tsx
const parent = { show: { transition: { staggerChildren: 0.1 } } };
const child = { hidden: { opacity: 0 }, show: { opacity: 1 } };
<motion.ul variants={parent} initial="hidden" animate="show">
  <motion.li variants={child} />
</motion.ul>
\`\`\`

### Spring physics
\`\`\`tsx
transition={{ type: "spring", stiffness: 300, damping: 20 }}
// or duration-based:
transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
\`\`\`

## Animatable Values
- Transforms: x, y, z, scale, scaleX, scaleY, rotate, rotateX, rotateY, skewX, skewY
- CSS: opacity, backgroundColor, color, borderRadius, filter, clipPath, etc.
- SVG: pathLength, pathSpacing, pathOffset, cx, cy, r, d, viewBox
- Special: width/height to "auto", CSS variables ("--custom")
`;
    return { contents: [{ uri: "motion://react/cheatsheet", mimeType: "text/markdown", text }] };
  },
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
