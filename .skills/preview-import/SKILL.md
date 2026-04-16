---
name: preview-import
description: Preview and verify imported content in local AEM Edge Delivery Services dev server. Validates rendering, compares with original page, and troubleshoots common issues.
---

# Preview Import

Open and verify imported content in local development server.

## When to Use This Skill

Use this skill when:
- You have generated HTML file (from generate-import-html)
- Ready to preview in browser and verify rendering
- Need to compare with original page structure

**Invoked by:** page-import skill (Step 5)

## Prerequisites

From previous skills, you need:
- ✅ HTML file at correct path (from generate-import-html)
- ✅ Images folder in same directory
- ✅ screenshot.png from scrape-webpage (for comparison)
- ✅ documentPath from metadata.json (for URL construction)

## Related Skills

- **page-import** - Orchestrator that invokes this skill
- **generate-import-html** - Provides HTML file to preview
- **scrape-webpage** - Provides screenshot for comparison

## Preview Workflow

### Step 1: Start Development Server

**Command:**
```bash
npm start
```

This runs both the theme CSS builder (Gulp) and the AEM proxy server together at `http://localhost:3000`. Do not use `aem up` alone — it skips the CSS build watch and brand CSS changes won't be reflected.

If already running, skip this step.

---

### Step 2: Construct the Preview URL

The preview URL must account for the `CONTENT_PATH_PREFIX` established in page-import Step 0.5 — the brand folder prefix is part of the file path and therefore part of the URL.

**Formula:**
```
http://localhost:3000/{CONTENT_PATH_PREFIX}/{paths.documentPath}
```

**Examples:**

| CONTENT_PATH_PREFIX | paths.documentPath | Preview URL |
|---|---|---|
| `roy` | `/about` | `http://localhost:3000/roy/about` |
| `rapidly` | `/products/widget` | `http://localhost:3000/rapidly/products/widget` |
| _(empty)_ | `/us/en/about` | `http://localhost:3000/us/en/about` |

**For index files** use the explicit `/index` suffix:
```
File: roy/index.plain.html → http://localhost:3000/roy/index
NOT: http://localhost:3000/roy/
```

---

### Step 3: Verify Brand CSS Is Loading

Open DevTools before checking visual rendering.

**Network tab — filter by brand name:**
```
Filter: /{BRAND}/
```

Confirm these requests return 200 (not 404):
- `styles/{brand}/tokens.css`
- `styles/{brand}/styles.css`
- `styles/{brand}/fonts.css`
- `blocks/{block-name}/{brand}/{block-name}.css` — one per block on the page
- If theme set: `styles/{brand}/themes/{theme}/tokens.css`

**If any of these 404** → the compiled CSS file is missing. Run `npm run scaffold:build` and hard-refresh.

**Elements tab — confirm brand tokens on `:root`:**

Open Elements → select `<html>` → check Computed → filter by `--brand-`. Brand-specific token values (e.g. `--brand-primary`, `--brand-surface`) should be present. If they show global defaults, brand tokens did not load.

---

### Step 4: Verify Rendering

**Check the following:**
- ✅ Brand CSS loaded with 200 status for all `/{brand}/` paths (Step 3)
- ✅ Brand tokens present on `:root` (Step 3)
- ✅ Blocks render with brand visual styling (colours, typography, spacing match brand spec)
- ✅ Layout matches original page structure — compare to `./import-work/screenshot.png`
- ✅ Images load (or show appropriate placeholders)
- ✅ No raw HTML visible (all blocks decorated)
- ✅ Section styling applied correctly (section backgrounds if section-metadata was used)

**Verify metadata in page source:**
- View page source → search `<meta name="brand"` — value must match `{BRAND}`
- Search `<meta name="theme"` — value must match `{THEME}` (if theme was set)

---

### Step 5: Compare with Original

**Side-by-side comparison:**
1. Open `./import-work/screenshot.png` alongside browser preview
2. Check that content structure matches
3. Verify blocks decorated correctly with brand visual treatment
4. Confirm section boundaries align
5. Validate brand styling consistency — colours, fonts, spacing should reflect brand spec, not base styles

---

## Troubleshooting

**Brand CSS 404 in Network tab (`styles/{brand}/styles.css` not found):**
- Check `npm run scaffold:build` was run after any CSS partial edits
- Verify `styles/{brand}/` directory exists: `ls styles/{BRAND}/`
- Confirm `brand-config.json` includes this brand in `brands[]`

**Brand tokens not on `:root` (showing global defaults):**
- Confirm `<meta name="brand" content="{brand}">` is in page `<head>` (view source)
- Confirm the metadata block in the HTML file has `brand` row with correct value
- Check `styles/{brand}/_tokens.css` was edited and build was run

**Block brand CSS 404 (`blocks/{block}/{brand}/{block}.css` not found):**
- Brand folder missing for this block — run `npm run scaffold:create` → Block → `{block-name}`
- Then `npm run scaffold:build`

**Block renders with base styles, not brand styles:**
- Verify `blocks/{block}/{brand}/_{block}.css` contains the CSS delta (not just the `@import`)
- Confirm `npm run scaffold:build` was run after editing the partial
- Hard-refresh the browser (Cmd+Shift+R / Ctrl+Shift+R) to clear cached CSS

**Blocks don't render correctly (raw HTML visible):**
- Block name in HTML div class must match folder name in `blocks/` exactly (case-sensitive)
- Check browser console for JavaScript errors
- Verify block exists in `blocks/` directory

**Wrong page served (content from SharePoint, not local file):**
- The AEM proxy falls back to SharePoint when a local file is not found
- Verify the HTML file exists at `{CONTENT_PATH_PREFIX}/{paths.htmlFilePath}` relative to project root
- Check the URL path matches: `/{CONTENT_PATH_PREFIX}/{documentPath}`

**Images not loading:**
- Verify images folder is at `{CONTENT_PATH_PREFIX}/{paths.dirPath}/images/`
- Check image paths in HTML are `./images/...` format

**Page not found (404):**
- Verify HTML file exists at the brand-prefixed path (e.g. `roy/about.plain.html`)
- For index files, use `/roy/index` not `/roy/`
- URL must include the brand prefix: `http://localhost:3000/{BRAND}/{path}`

**Dev server not running or CSS not updating:**
- Use `npm start` (not `aem up`) — this runs both CSS builder and AEM proxy
- `aem up` alone does not watch and rebuild brand CSS partials

---

## Output

This skill provides:
- ✅ Verified preview at `http://localhost:3000/{CONTENT_PATH_PREFIX}/{documentPath}`
- ✅ Brand CSS confirmed loading (200 status for all `/{brand}/` paths in Network tab)
- ✅ Brand tokens confirmed on `:root` in Elements panel
- ✅ Visual rendering matches original with brand styling applied
- ✅ Block decoration confirmed
- ✅ `brand` and `theme` metadata confirmed in page `<head>`

**Import complete when all verification points pass.**
