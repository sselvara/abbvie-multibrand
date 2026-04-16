---
name: ue-component-model
description: Create or edit the Universal Editor component configuration (component-definition.json, component-models.json, component-filters.json) for AEM Edge Delivery Services blocks. Use this skill whenever the user mentions component models, component definitions, component filters, block configuration for the Universal Editor, UE block setup, adding a new block to UE, configuring block properties, block authoring fields, or any task involving the three JSON config files that control how blocks appear in the Universal Editor. Also trigger when the user wants to create a new EDS/Franklin block with UE support, modify block fields, add a block to the section filter, or asks about how blocks connect to the Universal Editor.
license: Apache-2.0
---

# Universal Editor Component Model Configuration

This skill helps you create or edit the three JSON configuration files that control how AEM Edge Delivery Services (EDS) blocks appear and behave in the Universal Editor (UE):

1. **component-definition.json** — Registers blocks in the UE component palette
2. **component-models.json** — Defines property panel fields for each block
3. **component-filters.json** — Controls where blocks can be placed

## When to Use

- Creating a new block that needs UE authoring support
- Adding/modifying fields on an existing block's property panel
- Registering a block so it appears in the author's component palette
- Setting up container blocks with child items
- Adding block variants/style options

## Workflow

### Step 1: Understand the Block

This project uses a **multi-brand rendering system** via `scripts/multi-theme.js`. Before generating any configuration, understand the block's full structure:

#### 1a. Read the base JS file (`blocks/<name>/<name>.js`)

In this project, `default export decorate(block)` **always just calls `renderBlock(block)`** — it does not contain the decoration logic. The actual DOM transformation lives in the exported `decorateBlock()` function, which is wired up via `block-config.js`.

```javascript
// What you'll see — default export is NOT where decoration happens
export default async function decorate(block) {
  renderBlock(block); // delegates to multi-theme system
}

// Actual decoration logic is here — read THIS function
export async function decorateBlock(block) {
  // DOM transformation — this is what generates the HTML structure
}
```

Focus your analysis on `decorateBlock` (or `beforeDecorate`/`afterDecorate` if present) to understand:
- What does it read from the block div? (images, links, text, classes)
- Does it expect a flat structure or rows of items?
- Does it use `block.querySelector('a')` (links), `block.querySelector('picture')` (images), etc.?

#### 1b. Read `blocks/<name>/block-config.js`

This file wires decoration hooks and declares flags and variations:

```javascript
export default async function getBlockConfigs() {
  return {
    flags: { /* feature flags */ },
    variations: [
      { variation: 'my-variant', module: 'my-variant.js' },
    ],
    decorations: {
      decorate: async (ctx, blockConfig) => decorateBlock(ctx, blockConfig),
    },
  };
}
```

- **`flags`**: Boolean feature flags — treat these like CSS class variants in UE
- **`variations`**: Each `variation` string is a CSS class on the block div that triggers loading a different JS module — these map directly to UE style options
- If a brand-specific `blocks/<name>/<brand>/block-config.js` exists, read it too — it may override or add variations

#### 1c. Read the base CSS (`blocks/<name>/<name>.css`)

Look for:
- Block-scoped CSS custom properties (`--<name>-*`) that brands override
- Variant selectors like `.block-name.reverse` or `.block-name.wide` — these align with the `variations` in `block-config.js`

**Note:** The runtime (`multi-theme.js`) automatically loads CSS from `blocks/<name>/{brandPath}{themePath}<name>.css`. Brand-specific styles live in `blocks/<name>/<brand>/` and theme styles in `blocks/<name>/themes/<theme>/`. You do not need to configure this — it is automatic based on the page's `brand` and `theme` metadata.

#### 1d. Check for existing config

This project may not have centralized component JSON files yet. Check:
- `component-definition.json` at the project root
- `component-models.json` at the project root
- `component-filters.json` at the project root
- `blocks/<name>/_<name>.json` (distributed config pattern)

If none of these exist, use the **distributed config pattern** (create `blocks/<name>/_<name>.json`) to keep block config co-located with the block code.

### Step 2: Determine the Block Type

Based on the JS (`decorateBlock`) analysis:

- **Simple block**: One component with its own fields. Most blocks are this type.
  - Example: Hero, Embed — single model, no children

- **Container block**: Has repeatable child items (cards, slides, tabs).
  - Clue: JS iterates over `block.children` or creates items from rows
  - Needs: container definition + item definition + filter

- **Key-value block**: Configuration-style block (2-column key-value pairs).
  - Clue: Each property is independent, not a grid of content
  - Needs: `"key-value": true` in template

### Step 3: Design the Model Fields

Map the block's content expectations to component model fields. Read `references/field-types.md` for the full field type reference.

**Common field mappings:**

| Block expects... | Use component type | Notes |
|-----------------|-------------------|-------|
| An image | `reference` (name: `image`) | Pair with `text` field named `imageAlt` |
| A URL/link | `aem-content` (name: `link` or `url`) | For page links and external URLs |
| Rich text content | `richtext` | For formatted text with headings, lists, links |
| Plain text (single line) | `text` | For titles, labels, short strings |
| Plain text (multi-line) | `textarea` | For descriptions, notes, long text without formatting |
| Heading level choice | `select` with h1-h6 options | Name it `titleType` to auto-collapse with title |
| Style variants | `multiselect` (name: `classes`) | Values become CSS classes on block div |
| Multiple toggles | `checkbox-group` | For multiple independent boolean options |
| Boolean toggle | `boolean` | For show/hide options |
| Number value | `number` | For counts, limits |
| Content Fragment | `aem-content-fragment` | For CF-driven blocks |
| Experience Fragment | `aem-experience-fragment` | For reusable content+layout fragments |
| Content tags | `aem-tag` | For categorization via AEM tag picker |

**Field naming rules (semantic collapsing):**
- `image` + `imageAlt` → collapsed into `<picture><img alt="...">`
- `link` + `linkText` + `linkTitle` + `linkType` → collapsed into `<a href="..." title="...">text</a>` with optional class
- `title` + `titleType` → collapsed into `<h2>title</h2>` (level from titleType)
- Fields prefixed with `group_` (underscore separator) are grouped into a single cell

#### Multi-Brand Variant Fields

In this project, block variants come from two sources — map both to UE fields:

**1. Block variations (from `block-config.js`):** Each `variation` string in the `variations` array is a CSS class on the block div. Expose these as a `multiselect` with `name: "classes"`:

```json
{
  "component": "multiselect",
  "name": "classes",
  "label": "Style Variant",
  "valueType": "string",
  "options": [
    { "name": "Reverse", "value": "reverse" },
    { "name": "Wide", "value": "wide" }
  ]
}
```

Only include the variations that exist across all brands. Brand-specific variations can be added separately or omitted if brand CSS handles them automatically.

**2. Brand and Theme (page-level metadata):** The runtime reads `brand` and `theme` from page metadata (`getMetadata('brand')` / `getMetadata('theme')`) to select CSS. These are **page-level fields**, not block-level fields. Expose them in the **page metadata model** (not in individual block models) using `select` fields matching `brand-config.json`:

```json
{
  "component": "select",
  "name": "brand",
  "label": "Brand",
  "valueType": "string",
  "options": [
    { "name": "Default", "value": "" },
    { "name": "Roy", "value": "roy" }
  ]
},
{
  "component": "select",
  "name": "theme",
  "label": "Theme",
  "valueType": "string",
  "options": [
    { "name": "Default", "value": "" },
    { "name": "Bright", "value": "bright" }
  ]
}
```

To get the current list of brands and themes, read `brand-config.json` at the project root.

### Step 4: Generate the Configuration

Generate entries for all three files. The approach depends on whether the project uses centralized or distributed config.

**Check for distributed config pattern**: If no root-level `component-definition.json` / `component-models.json` / `component-filters.json` exist yet (as is the case in a fresh project), **prefer the distributed config pattern** — create `blocks/<name>/_<name>.json` co-located with the block code. This keeps brand/block concerns together and avoids a single large root file.

If the block directory contains `_<blockname>.json` files (e.g., `blocks/hero/_hero.json`), the distributed pattern is already in use — add to the existing file.

#### For Centralized Config (editing the three root JSON files):

**component-definition.json** — Add to the `"Blocks"` group's `components` array:

```json
{
  "title": "<Block Display Name>",
  "id": "<block-id>",
  "plugins": {
    "xwalk": {
      "page": {
        "resourceType": "core/franklin/components/block/v1/block",
        "template": {
          "name": "<Block Name>",
          "model": "<model-id>"
        }
      }
    }
  }
}
```

For container blocks, add both the container AND item definitions. The container gets `"filter"` instead of `"model"`, and the item uses `"core/franklin/components/block/v1/block/item"` as resourceType.

For key-value blocks, add `"key-value": true` to the template.

Template can include default values for any model field (e.g., `"titleType": "h3"`, `"classes": ["light"]`).

**component-models.json** — Add a new model entry:

```json
{
  "id": "<model-id>",
  "fields": [
    {
      "component": "<field-type>",
      "name": "<property-name>",
      "label": "<Display Label>",
      "valueType": "string"
    }
  ]
}
```

**component-filters.json** — Add the block ID to the `section` filter's `components` array. For container blocks, also add a new filter entry defining allowed children.

#### For Distributed Config (creating `blocks/<name>/_<name>.json`):

Create a single file with all three configs:

```json
{
  "definitions": [ ... ],
  "models": [ ... ],
  "filters": [ ... ]
}
```

Still add the block to the `section` filter in the central `component-filters.json`.

### Step 5: Validate

After generating the config, verify:

1. **ID consistency**: The `id` in the definition matches what's used in `component-filters.json`. The `template.model` value matches the `id` in `component-models.json`.
2. **Filter registration**: The block's ID appears in the `section` filter's `components` array (otherwise authors can't add it to pages).
3. **Field names match `decorateBlock` logic**: The `name` properties in the model fields should produce HTML that `decorateBlock()` (not just `decorate()`) can consume. Remember — `decorate()` in this project only calls `renderBlock()`; the actual DOM consumption is in `decorateBlock` and the hooks in `block-config.js`.
4. **Variant classes align with `block-config.js`**: Any `classes` multiselect values must match variation strings declared in `block-config.js` `variations` array, or CSS class selectors in the base/brand CSS.
5. **Brand/theme fields are page-level only**: Do not add `brand` or `theme` fields to block models — they belong in the page metadata model and are consumed automatically by `multi-theme.js`.
6. **Semantic collapsing**: Paired fields use correct suffixes (e.g., `image`/`imageAlt`, not `image`/`altText` unless intentional).
7. **Valid JSON**: All files remain valid JSON after edits.
8. **No duplicate IDs**: No model or filter ID conflicts with existing entries.

## Reference Files

For detailed information, read these reference files as needed:

- **`references/architecture.md`** — How the three files connect, the full AEM→Markdown→HTML pipeline, resource types, field naming conventions, semantic collapsing rules, and RTE filter configuration
- **`references/field-types.md`** — Complete reference for all 17 field component types (`text`, `textarea`, `richtext`, `reference`, `aem-content`, `aem-content-fragment`, `aem-experience-fragment`, `aem-tag`, `select`, `multiselect`, `checkbox-group`, `radio-group`, `boolean`, `number`, `date-time`, `container`, `tab`), valueType constraints, required properties, field properties, validation types, conditional fields, and option formats
- **`references/examples.md`** — Real examples showing Hero (simple), Embed (simple with URL), Cards (container), Teaser (variants), Product Details (key-value), Article (content fragment), Section configuration, Metadata (textarea), Feature Toggles (checkbox-group), and RTE filter configuration

## Common Pitfalls

- **Forgetting to add to section filter**: The block won't appear in the author's add menu unless it's in the `section` filter's components list.
- **Wrong resourceType**: Almost all custom blocks use `core/franklin/components/block/v1/block`. Don't invent custom resource types.
- **Mismatched model/filter IDs**: The `template.model` must exactly match the model `id`, and `template.filter` must exactly match the filter `id`.
- **Choosing the wrong text field type**: Use `text` for single-line strings, `textarea` for multi-line plain text, and `richtext` for formatted content. For URLs and page links, use `aem-content` so authors get the content picker.
- **Wrong valueType**: Most components enforce a specific `valueType` (e.g., `boolean` must use `"boolean"`, `number` must use `"number"`, `checkbox-group` must use `"string[]"`). Always include `valueType` and check the field-types reference for the enforced value.
- **Container without filter**: Container blocks need a `filter` (not a `model`) in their template, and a corresponding filter entry in component-filters.json.
- **Reading `decorate()` instead of `decorateBlock()`**: In this project `decorate()` only calls `renderBlock()` — it contains no decoration logic. Always read `decorateBlock()` and the `block-config.js` decorations hook to understand what HTML the block expects.
- **Adding brand/theme to block models**: Brand and theme drive CSS path selection in `multi-theme.js` automatically from page metadata. Do not add them as block-level fields — they belong in the page/section metadata model only.
- **Variants not matching `block-config.js`**: CSS class variants used in block CSS must also appear in the `variations` array in `block-config.js` for JS-driven behaviour. If a variant is CSS-only, it can be omitted from `block-config.js` variations but must still be a valid class on the block div.
- **Ignoring brand-level `block-config.js`**: A brand override at `blocks/<name>/<brand>/block-config.js` may add or replace variations. Always check both root and brand-level configs before finalising the `classes` options.
