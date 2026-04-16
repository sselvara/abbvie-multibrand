# EDS Multi-Brand — Claude Code

> Full instructions and skill discovery are in `AGENTS.md`. This file is a quick-reference supplement.

## Project

EDS Multi-Brand extends the Adobe AEM Edge Delivery boilerplate with multi-brand and multi-theme support. Brands and themes are configured in `brand-config.json` and compiled into layered CSS by a Gulp build pipeline.

## Commands

```sh
npm start                # Theme CSS builder + AEM proxy (localhost:3000)
npm run scaffold:create  # Interactive: create Block | Brand | Theme
npm run scaffold:remove  # Interactive: remove Block | Brand | Theme
npm run scaffold:build   # Compile merged CSS for all brands
npm run lint             # JS + CSS linting
npm run lint:fix         # Auto-fix lint issues
npm run scaffold:build:log  # Build with verbose output
```

## Block Structure

Every block in this project follows the multi-brand pattern:

```
blocks/{name}/
├── {name}.js              # default export calls renderBlock(); decorateBlock() has logic
├── {name}.css             # base styles — scoped to .{name}
├── block-config.js        # flags, variations, decoration hooks
├── themes/{theme}/
│   ├── _{name}.css        # SOURCE partial — edit this
│   └── {name}.css         # compiled output — do not edit
└── {brand}/
    ├── _{name}.css        # SOURCE partial — edit this
    ├── {name}.css         # compiled
    ├── block-config.js    # brand overrides
    └── themes/{theme}/
        ├── _{name}.css    # SOURCE partial
        └── {name}.css     # compiled
```

**Always edit `_file.css` (underscore prefix). `file.css` without underscore is compiled output.**

## JS Pattern

```js
// default export — always just this, no decoration logic here
export default async function decorate(block) {
  renderBlock(block);
}

// decoration logic lives here
export async function decorateBlock(block) { /* DOM transformation */ }
```

`block-config.js` wires `decorateBlock` into the rendering pipeline via `decorations.decorate`.

## CSS Cascade

```
styles/tokens.css                          ← global tokens (:root vars)
styles/styles.css                          ← global base styles
styles/{brand}/_tokens.css                 ← brand token overrides
styles/{brand}/_styles.css                 ← brand style overrides
styles/{brand}/themes/{theme}/_tokens.css  ← brand+theme overrides
styles/themes/{theme}/_tokens.css          ← cross-brand theme overrides
```

Same hierarchy applies inside `blocks/{name}/`.

## CSS Rules

- Scope all selectors to `.{block-name}` — never write unscoped styles
- Define block-scoped tokens: `--{block-name}-color-*`, `--{block-name}-size-*`
- Mobile-first: breakpoints at `600px` and `900px`
- Use `(width >= 600px)` syntax, not `min-width`

## JS Rules

- ES6+, no build step, always include `.js` extension in imports
- Use DOM APIs, not `innerHTML` for complex structures
- Query within block scope: `block.querySelector(...)`, not `document.querySelector(...)`
- Defer heavy work with `setTimeout` or `IntersectionObserver`

## Skills

Run `.agents/discover-skills` to list all available skills. Key skills for block work:

- `content-driven-development` — start here for all block tasks
- `building-blocks` — create/modify blocks
- `building-themes` — create/modify brands and themes
- `testing-blocks` — test before PR
- `ue-component-model` — Universal Editor config

## Never

- Modify `scripts/aem.js`
- Edit compiled CSS (`file.css` without underscore prefix)
- Put `brand` or `theme` fields in block component models (they're page-level metadata)
