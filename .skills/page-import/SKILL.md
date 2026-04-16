---
name: page-import
description: Import a single webpage from any URL to structured HTML content for authoring in AEM Edge Delivery Services. Scrapes the page, analyzes structure, maps to existing blocks, and generates HTML for immediate local preview. Also triggered by terms like "migrate", "migration", or "migrating".
---

# Page Import Orchestrator

You are an orchestrator of a website page import/migration. You have specialized Skills at your disposal for each phase of the import workflow. Below is a high-level overview of what you're going to do.

## When to Use This Skill

Use this skill when:
- Importing or migrating individual pages from existing websites
- Converting competitor pages for reference or analysis
- Creating content files from design prototypes or staging sites

**Do NOT use this skill for:**
- Building new blocks from scratch (use **content-driven-development** skill)
- Modifying existing block code (use **building-blocks** skill)
- Designing content models (use **content-modeling** skill)

## Scope

**This skill imports/migrates main content only:**
- ✅ Import: Hero sections, features, testimonials, CTAs, body content
- ❌ Skip: Header, navigation, footer (handled by dedicated skills)

## Philosophy

Follow **David's Model** (https://www.aem.live/docs/davidsmodel):
- Prioritize authoring experience over developer convenience
- Ask "How would an author in Word/Google Docs create this?"
- Minimize blocks - prefer default content where possible
- Use Block Collection content models

## Available Sub-Skills

This orchestrator delegates work to:
- **scrape-webpage** - Extract content, metadata, and images from source URL
- **identify-page-structure** - Identify section boundaries and content sequences
- **authoring-analysis** - Make authoring decisions (default content vs blocks)
- **generate-import-html** - Create structured HTML file
- **preview-import** - Verify in local dev server

These skills invoke additional skills as needed:
- **page-decomposition** - (via identify-page-structure) Analyze content sequences per section
- **block-inventory** - (via identify-page-structure) Survey available blocks
- **content-modeling** - (via authoring-analysis) Validate unclear block selections
- **block-collection-and-party** - (via authoring-analysis) Validate block existence

## Import Workflow

### Step 0: Create TodoList

Use the TodoWrite tool to create a todo list with the following tasks:

1. **Resolve brand and theme context** (this step)
   - Success: Brand and theme confirmed, stored as BRAND, THEME, CONTENT_PATH_PREFIX

2. **Scrape the webpage** (scrape-webpage skill)
   - Success: metadata.json, screenshot.png, cleaned.html, images/ folder exist

3. **Identify page structure** (identify-page-structure skill)
   - Success: Section boundaries identified, content sequences documented, block inventory complete (with brand-level variants noted)

4. **Analyze authoring approach** (authoring-analysis skill)
   - Success: Every block classified as BRAND_READY / NEEDS_BRAND_SCAFFOLD / NEEDS_BLOCK_CREATION

5. **Resolve brand block readiness** (this orchestrator — Step 4.5)
   - Success: No NEEDS_NEW_BLOCK / NEEDS_BLOCK_CREATION / NEEDS_BRAND_SCAFFOLD remaining; all CSS deltas written and built

6. **Generate HTML file** (generate-import-html skill)
   - Success: HTML file at brand-prefixed path, brand/theme in metadata block, validation checklist passed

7. **Preview and verify** (preview-import skill)
   - Success: Page renders in browser with correct brand styles, layout matches original

---

### Step 0.5: Resolve Brand and Theme Context

**Before scraping**, establish which brand and theme this imported page will serve.

**Read `brand-config.json`:**
```bash
cat brand-config.json
```

**Determine the target brand:**
- If the user already specified a brand → confirm it exists in the `brands[]` array
- If no brand specified → ask: "Which brand will this page serve? Available: `{brands}`. Leave blank for default (no brand)."

**Determine the target theme:**
- If the user already specified a theme → confirm it exists in the `themes[]` array
- If no theme specified → ask: "Which theme? Available: `{themes}`. Leave blank for default (no theme)."

**Store as context for the rest of the workflow:**
- `BRAND` — the selected brand name (empty string if default)
- `THEME` — the selected theme name (empty string if default)

**Determine the target content path:**

The source URL structure becomes the file path (e.g. `competitor.com/products/widget` → `products/widget.plain.html`). For a brand page this path should be prefixed with the brand name so content stays organised by brand in SharePoint and locally:

- Brand page output: `{brand}/{source-path}.plain.html` — e.g. `roy/products/widget.plain.html`
- Default (no brand): `{source-path}.plain.html` — e.g. `products/widget.plain.html`

Ask the user: "Should the content be saved under `{brand}/{path}` (recommended for brand-specific pages) or at a custom path?"

Store as: `CONTENT_PATH_PREFIX` — the brand folder prefix to prepend (defaults to `{brand}` when BRAND is set, empty string for default pages).

**For local draft previews**, the file will be served by `npm start` at `/{CONTENT_PATH_PREFIX}/{path}`. Confirm the AEM proxy is running before Step 5 (preview).

**How brand/theme flow through the workflow:**
- **Step 3 (block-inventory)**: brand informs which brand-level block variants to surface
- **Step 4 (authoring-analysis)**: brand informs which block class variations are available
- **Step 5 (generate-import-html)**: content path is prefixed with brand folder; brand and theme go into the page metadata block so `multi-theme.js` loads the correct CSS
- **Step 6 (preview-import)**: preview URL reflects the brand-prefixed path

**Mark todo complete when:** BRAND, THEME, and CONTENT_PATH_PREFIX values are confirmed.

---

### Step 1: Scrape Webpage

**Invoke:** scrape-webpage skill

**Provide:**
- Target URL
- Output directory: `./import-work`

**Success criteria:**
- ✅ metadata.json exists with paths, metadata, image mapping
- ✅ screenshot.png saved for visual reference
- ✅ cleaned.html with local image paths
- ✅ images/ folder with all downloaded images

**Mark todo complete when:** All files verified to exist

**Pass to Step 2:** Also pass the BRAND and THEME values established in Step 0.5.

---

### Step 2: Identify Page Structure

**Invoke:** identify-page-structure skill

**Provide:**
- screenshot.png from Step 1
- cleaned.html from Step 1
- metadata.json from Step 1
- BRAND and THEME from Step 0.5

**Success criteria:**
- ✅ Section boundaries identified with styling notes
- ✅ Content sequences documented for each section (neutral descriptions)
- ✅ Block inventory completed (local + Block Collection)
- ✅ Brand-level block variants and `block-config.js` overrides noted for BRAND

**Mark todo complete when:** All outputs documented

---

### Step 3: Analyze Authoring Approach

**Invoke:** authoring-analysis skill

**Provide:**
- Section list with content sequences from Step 2
- Block inventory from Step 2 (including brand-level variants)
- screenshot.png from Step 1
- BRAND and THEME from Step 0.5

**Success criteria:**
- ✅ Every content sequence has decision: default content OR block name
- ✅ Block structures fetched for all blocks to be used
- ✅ Brand-level block variations checked for selected blocks
- ✅ Single-block sections validated for styling (Step 3e if applicable)

**Mark todo complete when:** All blocks have a classification (BRAND_READY / NEEDS_BRAND_SCAFFOLD / NEEDS_BLOCK_CREATION) and all remediation is resolved.

---

### Step 4.5: Resolve Brand Block Readiness

**Only if BRAND is set.** Review the full classification output from Step 4 (authoring-analysis). Work through each state in this order — blocking states first, CSS work last.

---

**1. NEEDS_NEW_BLOCK — resolve first (blocking)**

A block is needed that does not match any existing block's content model. Stop the import for that sequence and invoke **building-blocks** skill to create the block. The scaffold will automatically create brand folders for all brands in `brand-config.json`.

After the block is created, re-run authoring-analysis Step 3b-i and 3b-ii for that sequence only before continuing.

---

**2. NEEDS_BLOCK_CREATION — resolve second (blocking)**

Block Collection block needed, not yet in the project:

**Option A — Minimal (unblock import, full implementation later):**
```bash
npm run scaffold:create
# Choose: Block → enter the block name
# Creates base block + brand folders for all brands in brand-config.json
```

**Option B — Full:** Invoke **building-blocks** skill. Use this when the block is central to the brand experience.

Verify after scaffold:
```bash
ls blocks/{block-name}/{BRAND}/
# Should show: _{block}.css  {block}.css  block-config.js  themes/
```

---

**3. NEEDS_BRAND_SCAFFOLD — resolve third (blocking)**

Block in `blocks/`, brand folder missing:

```bash
npm run scaffold:create
# Choose: Block → enter the block name
# Reads brand-config.json, creates blocks/{block}/{brand}/ for ALL brands
# Existing files are never overwritten
```

Verify:
```bash
ls blocks/{block-name}/{BRAND}/
```

---

**4. CSS delta — apply inline (non-blocking but required for correct preview)**

For every block where authoring-analysis documented Layer A or Layer B visual delta:

**Layer A — token overrides** (`styles/{BRAND}/_tokens.css`):

Read the existing file first, then add only missing tokens:
```bash
# Read current brand tokens
cat styles/{BRAND}/_tokens.css
```
Edit `styles/{BRAND}/_tokens.css` — add missing `--brand-*` values.

**Layer B/C — block CSS delta** (`blocks/{block}/{BRAND}/_{block}.css`):

Read the existing partial first (it starts with just `@import '../{block}.css';`), then append overrides:
```css
/* blocks/cards/roy/_cards.css */
@import '../cards.css';

.cards {
  --cards-color-bg: var(--brand-surface);

  .item {
    border: 2px solid var(--brand-primary);
    border-radius: 8px;
  }
}
```

Rules:
- `@import` must remain the first line
- Reference `var(--brand-*)` tokens, not hardcoded values
- Scope all selectors to `.{block-name}`

**After all CSS edits, run one build:**
```bash
npm run scaffold:build
```

---

**When all blocks are in a resolved state and CSS deltas are built, mark this todo complete and proceed to Step 5.**

---

### Step 5: Generate HTML File

**Invoke:** generate-import-html skill

**Provide:**
- Authoring analysis from Step 4
- Section styling decisions from Step 4
- metadata.json from Step 2
- cleaned.html from Step 2
- BRAND, THEME, and CONTENT_PATH_PREFIX from Step 0.5

**Success criteria:**
- ✅ HTML file saved at `{CONTENT_PATH_PREFIX}/{paths.htmlFilePath}`
- ✅ All sections imported (no truncation)
- ✅ Images folder at `{CONTENT_PATH_PREFIX}/{paths.dirPath}/images/`
- ✅ Metadata block includes `brand` and `theme` properties (if set)
- ✅ Validation checklist passed

**Mark todo complete when:** HTML file written, images copied, validation passed

---

### Step 6: Preview and Verify

**Invoke:** preview-import skill

**Provide:**
- HTML file path from Step 5 (brand-prefixed, e.g. `roy/about.plain.html`)
- screenshot.png from Step 2 (for comparison)
- documentPath: `/{CONTENT_PATH_PREFIX}/{paths.documentPath}` (e.g. `/roy/about`)

**Success criteria:**
- ✅ Page loads in browser at the brand-prefixed path
- ✅ Blocks render with brand styles (check DevTools Network for `/{brand}/` CSS requests)
- ✅ Brand tokens visible in DevTools `:root` (confirms `styles/{brand}/tokens.css` loaded)
- ✅ Layout matches original (compare with screenshot)
- ✅ No console errors
- ✅ Images load or show placeholders

**Mark todo complete when:** Visual verification passed including brand styles confirmed

---

## High-Level Dos and Don'ts

**DO:**
- ✅ Follow the workflow steps in order
- ✅ Mark each todo complete after verification
- ✅ Use TodoWrite to track progress
- ✅ Import ALL content (partial import is failure)
- ✅ Compare final preview with original screenshot

**DON'T:**
- ❌ Skip steps or combine steps
- ❌ Make authoring decisions without block inventory
- ❌ Generate HTML before completing authoring analysis
- ❌ Truncate or summarize content
- ❌ Consider import complete without visual verification

## Success Criteria

Import is complete when:
- ✅ All 5 todos marked complete
- ✅ HTML file renders in browser
- ✅ Visual structure matches original page
- ✅ All content imported (no truncation)
- ✅ Images accessible

## Limitations

This orchestrator manages single-page import with existing blocks. It does NOT:
- Custom variant creation (blocks are used as-is)
- Multi-page batch processing (import one page at a time)
- Block code development (assumes blocks exist)
- Advanced reuse detection across imports
- Automatic block matching algorithms

For those features, consider more comprehensive import workflows in specialized tools.
