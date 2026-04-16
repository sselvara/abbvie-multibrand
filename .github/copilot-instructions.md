# GitHub Copilot Instructions — EDS Multi-Brand

This is an Adobe AEM Edge Delivery Services (EDS) project with multi-brand and multi-theme support. Read these instructions before making suggestions.

---

## Tech Stack

- Vanilla JS (ES6+) — no transpiling, no build step for JS
- CSS3 with modern features — no frameworks
- Node.js tooling: Gulp (CSS build), plop (scaffolding), ESLint, Stylelint
- AEM Edge Delivery: blocks transform authored HTML via DOM APIs

---

## Commands

```sh
npm start                # Theme CSS builder + AEM proxy at localhost:3000
npm run scaffold:create  # Interactive scaffold: Block | Brand | Theme
npm run scaffold:remove  # Remove Block | Brand | Theme
npm run scaffold:build   # Compile merged CSS for all configured brands
npm run lint             # JS + CSS linting (must pass before PR)
npm run lint:fix         # Auto-fix lint issues
```

---

## Block File Structure

Each block has this directory layout:

```
blocks/{name}/
├── {name}.js              # JS — default export calls renderBlock(); logic in decorateBlock()
├── {name}.css             # Base CSS — scoped to .{name}
├── block-config.js        # Flags, variations, decoration hooks
├── themes/{theme}/
│   ├── _{name}.css        # Source partial (edit this) — imports base + adds theme overrides
│   └── {name}.css         # Compiled output (do not edit)
└── {brand}/
    ├── _{name}.css        # Source partial — imports base + adds brand overrides
    ├── {name}.css         # Compiled output
    ├── block-config.js    # Brand-specific config overrides
    └── themes/{theme}/
        ├── _{name}.css    # Source partial — brand + theme overrides
        └── {name}.css     # Compiled output
```

**Rule: always edit `_file.css` (underscore prefix). Files without the underscore are compiled by `npm run scaffold:build` — never edit them manually.**

---

## JavaScript Pattern

```js
import { renderBlock } from '../../scripts/multi-theme.js';

// Default export — always delegates to renderBlock. Do NOT put decoration logic here.
export default async function decorate(block) {
  renderBlock(block);
}

// Actual DOM transformation — called via block-config.js
export async function decorateBlock(block) {
  // transform block.children into final DOM structure
}
```

### `block-config.js`

```js
import { decorateBlock } from './{name}.js';

export default async function getBlockConfigs() {
  return {
    flags: {},         // boolean feature flags
    variations: [      // CSS class → JS module mappings
      // { variation: 'my-variant', module: 'my-variant.js' }
    ],
    decorations: {
      decorate: async (ctx, blockConfig) => decorateBlock(ctx, blockConfig),
    },
  };
}
```

Brand-level `blocks/{name}/{brand}/block-config.js` can override any of these.

---

## CSS Rules

### Always scope to block

```css
/* Good */
.my-block { }
.my-block .item { }
.my-block.wide .item { }

/* Bad — never write unscoped */
.item { }
h2 { }
```

### Block-scoped custom properties

Define overrideable tokens on the block:

```css
.my-block {
  --my-block-color-bg: #fff;
  --my-block-color-text: #222;
  background-color: var(--my-block-color-bg);
}
```

Brand/theme CSS overrides these vars, not the properties directly.

### Responsive — mobile first

```css
/* mobile default */
.my-block { padding: 1rem; }

@media (width >= 600px) { .my-block { padding: 2rem; } }   /* tablet */
@media (width >= 900px) { .my-block { padding: 4rem; } }   /* desktop */
```

### Brand and theme partials always start with `@import`

```css
/* blocks/{name}/{brand}/_{name}.css */
@import '../{name}.css';

/* brand overrides below */
.my-block { --my-block-color-bg: var(--brand-primary); }
```

---

## CSS Cascade (Global Styles)

```
styles/tokens.css                              ← global :root variables
styles/styles.css                              ← global base styles
styles/{brand}/_tokens.css                     ← brand token overrides
styles/{brand}/_styles.css                     ← brand style overrides
styles/{brand}/themes/{theme}/_tokens.css      ← brand + theme overrides
styles/themes/{theme}/_tokens.css              ← cross-brand theme overrides
```

`brand-config.json` lists all registered brands and themes.

---

## JS Conventions

- Always include `.js` extension in imports: `import { foo } from './bar.js'`
- Use DOM APIs, not `innerHTML`: `document.createElement`, `element.append`
- Query within block scope: `block.querySelector(...)` not `document.querySelector(...)`
- Defer heavy work: `setTimeout` or `IntersectionObserver`
- Available utilities from `../../scripts/aem.js`: `toClassName`, `getMetadata`, `createOptimizedPicture`, `loadCSS`
- Never modify `scripts/aem.js`

---

## Multi-Brand Runtime

`scripts/multi-theme.js` automatically:
- Reads `brand` and `theme` from page metadata (`<meta name="brand">`, `<meta name="theme">`)
- Loads CSS from `blocks/{name}/{brand}/{theme}/{name}.css` for the active combination
- Merges global and brand `block-config.js` (brand takes precedence)

Do not hardcode brand or theme logic in block JS — the runtime handles routing.

---

## Universal Editor Component Models

When creating `blocks/{name}/_name.json` (distributed config):
- `decorateBlock()` defines what HTML the model fields must produce — not `decorate()`
- Expose block variations as `"component": "multiselect", "name": "classes"`
- `brand` and `theme` are page-level metadata fields, not block model fields
- Check `brand-config.json` for the current list of brands and themes when writing `select` options

---

## Quality Checklist

Before any PR:
- [ ] `npm run lint` passes with no errors
- [ ] Edited `_file.css` (not compiled `file.css`)
- [ ] `npm run scaffold:build` run after CSS partial changes
- [ ] All selectors scoped to block class
- [ ] Tested on mobile (< 600px), tablet (600px), desktop (900px)
- [ ] No `scripts/aem.js` modifications
