---
name: authoring-analysis
description: Analyze content sequences and determine authoring approach (default content vs blocks). Validates block selection and section styling for import/migration to AEM Edge Delivery Services.
---

# Authoring Analysis

Determine authoring approach for EACH content sequence: default content or specific block.

## When to Use This Skill

Use this skill when:
- You have page structure with content sequences (from identify-page-structure)
- You have block inventory (local + Block Collection)
- Ready to make authoring decisions following David's Model

**Invoked by:** page-import skill (Step 3)

## Prerequisites

From identify-page-structure skill, you need:
- ✅ Section boundaries with styling notes
- ✅ Content sequences per section (neutral descriptions)
- ✅ Block inventory (local + Block Collection with purposes)
- ✅ screenshot.png for visual reference

## Related Skills

- **page-import** - Orchestrator that invokes this skill
- **identify-page-structure** - Provides section structure and block inventory
- **content-modeling** - This skill invokes it when block selection is unclear
- **block-collection-and-party** - This skill invokes it to validate blocks
- **generate-import-html** - Uses this skill's output to create HTML

## **IMPORTANT: Step 3e Execution Trigger**

After completing Step 3 (analyzing all sequences), you MUST execute Step 3e if:
- ✅ At least one section contains exactly ONE sequence that became a block
- ✅ That section has distinct background styling from identify-page-structure

If NO sections meet these criteria → Skip Step 3e
If ANY sections meet these criteria → Execute Step 3e for EACH qualifying section

## Authoring Analysis Workflow

**Context:** You now have:
- Section boundaries with styles
- Content sequences per section
- Available block palette

**FOR EACH content sequence, follow this mandatory process:**

---

### Step 3a: MANDATORY - Default Content Check (FIRST!)

**Question:** "Can an author create this with normal typing in Word/Google Docs?"

**Default content means:**
- ✅ Headings, paragraphs, lists
- ✅ Inline images within text
- ✅ Simple quotes
- ✅ Just... typing content

**NOT default content means:**
- ❌ Repeating structured patterns (card grids, feature lists)
- ❌ Interactive components (accordions, tabs, carousels)
- ❌ Complex layouts (side-by-side columns, split content)
- ❌ Requires specific structure for decoration

**Decision:**
- If YES (can type normally) → **Mark as DEFAULT CONTENT, DONE** ✅
- If NO (needs structure) → **Proceed to Step 3b**

**Examples:**
```
"Large centered heading, paragraph, two buttons"
→ Can author just type heading, paragraph, links? YES
→ Decision: DEFAULT CONTENT ✅

"Two centered buttons"
→ Can author just type two links? YES
→ Decision: DEFAULT CONTENT ✅

"Four items in grid, each with image, heading, description"
→ Can author just type this? NO - requires grid structure
→ Decision: Proceed to Step 3b ➡️

"Expandable questions and answers"
→ Can author just type this? NO - requires interaction/decoration
→ Decision: Proceed to Step 3b ➡️
```

---

### Step 3b: Block Selection (ONLY IF NOT DEFAULT)

**With block inventory context, ask:** "Which available block would an author choose for this?"

**DECISION TREE: When to Invoke content-modeling**

**OBVIOUS MATCH (Don't invoke content-modeling):**

Pattern matches block purpose 1:1:
- "Grid of items with images/text" + see "cards" block → USE IT ✅
- "Expandable questions" + see "accordion" block → USE IT ✅
- "Tabbed content panels" + see "tabs" block → USE IT ✅
- "Side-by-side content" + see "columns" block → USE IT ✅
- "Rotating images" + see "carousel" block → USE IT ✅

**Criteria for OBVIOUS:**
- Content description matches block purpose exactly
- No ambiguity about structure
- Block exists in inventory

**UNCLEAR MATCH (Invoke content-modeling):**

Ambiguous which block to use:
- "Three items with images" - Could be cards? Could be columns? → INVOKE
- "List of features with icons" - Cards? Custom list block? → INVOKE
- "Customer quotes with photos" - Quote block? Cards? Testimonial block? → INVOKE

Missing from inventory:
- Content needs structure BUT no matching block exists → INVOKE
- content-modeling can recommend canonical model or suggest creating custom block

Complex authoring consideration:
- "Hero-like content but in middle of page" → INVOKE
- "Card-like items but only 2 of them" → INVOKE
- Need validation on author mental model → INVOKE

**Criteria for UNCLEAR:**
- Multiple blocks could work
- No obvious block match
- Need authoring perspective validation
- Creating custom block might be needed

---

### Step 3b-i: Brand Context Check (ALWAYS — if BRAND is set)

After selecting a block (obvious or via content-modeling), **if a BRAND is active**, check the brand-level structure for that block:

```bash
# Does this brand have a CSS override for this block?
ls blocks/{selected-block}/{BRAND}/

# Read the brand-level block-config.js if it exists
cat blocks/{selected-block}/{BRAND}/block-config.js
```

**Classify every selected block into one of three states:**

| State | Condition | Action needed |
|---|---|---|
| **BRAND_READY** | `blocks/{block}/{brand}/_{block}.css` exists | None — CSS cascade applies automatically |
| **NEEDS_BRAND_SCAFFOLD** | Block exists in `blocks/` but `blocks/{block}/{brand}/` is missing | Scaffold brand folder before generating HTML (see remediation below) |
| **NEEDS_BLOCK_CREATION** | Block does not exist in `blocks/` at all (Block Collection block) | Add block to project first, then scaffold brand folder |

**IMPORTANT:** Do NOT proceed to generate-import-html if any block is in `NEEDS_BRAND_SCAFFOLD` or `NEEDS_BLOCK_CREATION` state. `multi-theme.js` will request `blocks/{name}/{brand}/{name}.css` at runtime — if it doesn't exist the request 404s and the block renders completely unstyled, regardless of the metadata block.

---

**Remediation for NEEDS_BRAND_SCAFFOLD (block in `blocks/`, missing brand folder):**

Re-run the scaffold for the block — it reads `brand-config.json` and creates brand folders for all registered brands, skipping any files that already exist:

```bash
npm run scaffold:create
# Choose: Block → enter the block name
# The scaffold creates blocks/{block}/{brand}/ for every brand in brand-config.json
```

Then rebuild:
```bash
npm run scaffold:build
```

The brand CSS files will be minimal (just `@import '../{block}.css';`) — the block inherits base styles. Brand-specific visual overrides can be added later via `/building-blocks`.

---

**Remediation for NEEDS_BLOCK_CREATION (Block Collection block, not in project):**

The block must be added to the project before the import can proceed:

1. Invoke the **building-blocks** skill to create the block (scaffold creates brand folders automatically since it reads `brand-config.json`)
2. OR if minimal styling is acceptable for now, manually scaffold:

```bash
npm run scaffold:create
# Choose: Block → enter the block name
# This creates blocks/{block}/ with full brand folder structure
npm run scaffold:build
```

After the block exists with brand folders, return to the import workflow.

---

**How to use brand variation info:**

- If the brand config adds variations (e.g. `{ variation: 'split', module: 'split.js' }`), these become valid `classes` on the block div — use them where the source page layout matches.
- Do **not** hardcode brand or theme names as block classes — they are set via page metadata, not block classes.

---

### Step 3b-ii: Visual Delta Analysis (ALWAYS — for every block selected)

After classifying the block's brand state (Step 3b-i), compare how the block **looks on the source page** against the **base block CSS**. This determines whether to reuse the existing block with brand CSS overrides or create a new block entirely.

**Core principle:** In this multi-brand project, visual differences between brands are handled at the CSS layer, not by creating new blocks. Only create a new block when the content model or decoration behaviour genuinely differs. When in doubt, favour CSS delta.

---

**Q1 — Does the content model match?**

Look at the source page's block and compare its row/column structure against the block's expected pre-decoration HTML (from Step 3d).

Ask: "Can an author produce this content by filling in the same table structure the block expects?"

| What you see | Decision |
|---|---|
| Same rows/columns, same content types (image + text + link) | ✅ Content model matches → proceed to Q2 |
| Extra column that doesn't exist in the block's model | ❌ Content model differs → **NEEDS_NEW_BLOCK** |
| Different interaction (tabs vs accordion, carousel vs static grid) | ❌ Decoration behaviour differs → **NEEDS_NEW_BLOCK** |
| Same structure, just fewer/more items | ✅ Content model matches (collection blocks scale with items) |

If **NEEDS_NEW_BLOCK**: stop the import analysis for this sequence and invoke **building-blocks** skill. The import cannot proceed for this sequence until the block exists.

---

**Q2 — Does the visual rendering match?**

Compare the source page screenshot against what the base block CSS produces.

Ask: "If the base block CSS were applied to this content, would it look like the source page?"

| Observation | Decision |
|---|---|
| Colors, fonts, spacing match base styles | ✅ No delta → block is ready, no CSS work needed |
| Visual differences exist (colors, borders, typography differ) | → proceed to Q3 |

---

**Q3 — Classify the visual differences**

For each visual difference observed, classify it into one of these layers:

**Layer A — Design token** (values shared across multiple blocks for this brand):
- Brand primary/accent/surface colours → `styles/{brand}/_tokens.css`
- Brand font family/size scale → `styles/{brand}/_tokens.css`
- Global link colour, background colour → `styles/{brand}/_tokens.css`

Check `styles/{brand}/_tokens.css` first — if the token is already defined there, the difference is already covered by the cascade.

**Layer B — Block CSS delta** (visual difference specific to this block in this brand):
- Block-specific background, border, border-radius, shadow
- Internal spacing (padding/gap) different from base
- Element-level colour overrides not covered by global tokens
- Typography tweaks specific to this block

These go in `blocks/{block}/{brand}/_{block}.css` as overrides on the block's own CSS custom properties.

**Layer C — Layout/structural CSS** (elements in different positions, different grid/flex arrangement):
- Two-column vs one-column layout
- Reversed column order (image left vs image right)
- Full-width vs contained width

Ask: "Can this layout difference be achieved purely in CSS (flexbox order, grid template)?"
- YES → Layer B (CSS delta in brand partial) — no new block needed
- NO → Check if an existing block variation handles it (look in `block-config.js` `variations[]`)
  - Variation exists → apply the variation class on the block div in the HTML
  - No variation → **NEEDS_NEW_VARIATION** — add the variation to `block-config.js` and its CSS to `blocks/{block}/{brand}/_{block}.css`

**NEEDS_NEW_BLOCK only when:**
- Content model genuinely differs (Q1 failed), OR
- Requires different JavaScript decoration logic that cannot be a variation, OR
- Mixing two distinctly different interaction patterns in one sequence

---

**Q4 — Document and write the CSS delta inline**

For each Layer A or Layer B difference, write the CSS now — don't defer to "add later". The imported page must render correctly in preview (Step 6).

**For Layer A (token overrides) — edit `styles/{brand}/_tokens.css`:**

```css
/* styles/roy/_tokens.css — add only values that differ from the source file */
:root {
  --brand-primary: #0057cc;    /* cards heading colour, hero CTA colour */
  --brand-surface: #f0f4ff;    /* cards background */
  --brand-accent: #ff6600;
}
```

Read the existing `styles/{brand}/_tokens.css` first and add only what is missing.

**For Layer B (block CSS delta) — edit `blocks/{block}/{brand}/_{block}.css`:**

```css
/* blocks/cards/roy/_cards.css */
@import '../cards.css';   /* must stay as first line */

.cards {
  --cards-color-bg: var(--brand-surface);   /* override block token */

  .item {
    border: 2px solid var(--brand-primary);
    border-radius: 8px;
  }

  .item-title {
    color: var(--brand-primary);
  }
}
```

Rules:
- Always reference brand tokens (`var(--brand-*)`) rather than hardcoded values
- Scope all selectors to `.{block-name}` — no unscoped rules
- The `@import` must remain the first line — it cascades the base block styles first

After editing CSS partials, rebuild:
```bash
npm run scaffold:build
```

---

**Step 3b-ii output — add to your Step 3 analysis for every block:**

```
→ cards: BRAND_READY (roy)
   Content model: ✅ matches (collection, 3 items with image + text)
   Visual delta:
     Layer A tokens needed: --brand-primary (#0057cc), --brand-surface (#f0f4ff)
       → styles/roy/_tokens.css — tokens already present ✅
     Layer B block delta: card border (2px solid brand-primary), border-radius 8px, item-title colour
       → blocks/cards/roy/_cards.css — writing delta inline ✅
     Layer C layout: reversed column order on desktop
       → CSS-achievable with flex row-reverse — adding to block delta ✅
   Action: build after delta applied

→ hero: BRAND_READY (roy)
   Content model: ✅ matches
   Visual delta: none — base styles match source page ✅
   Action: none

→ tabs: BRAND_READY (roy)
   Content model: ❌ source page has 3 columns of content, not tab panels
   Decision: NEEDS_NEW_BLOCK — invoke building-blocks before continuing
```

---

### Step 3c: Validate Block Exists (IF NEEDED)

**Only if block not in Block Collection common set:**

Invoke **block-collection-and-party** skill to:
- Confirm block exists
- Get live example URL
- Review content model

---

### Step 3d: Get Block HTML Structure (BEFORE generating HTML)

**CRITICAL:** Before generating any HTML in next skill, fetch the pre-decoration HTML structure for ALL blocks you'll use.

```bash
# Get structure examples for each block
node .skills/block-collection-and-party/scripts/get-block-structure.js cards
node .skills/block-collection-and-party/scripts/get-block-structure.js tabs
node .skills/block-collection-and-party/scripts/get-block-structure.js accordion
node .skills/block-collection-and-party/scripts/get-block-structure.js columns
```

**Why this prevents mistakes:**
- Shows exact row/column structure (e.g., cards: each card = 1 row with 2 columns)
- Reveals all variants (e.g., "Cards" vs "Cards (no images)")
- Displays clean HTML without decoration
- Prevents the #1 HTML generation error: wrong structure

**Use the output to:**
1. Understand how many columns each row should have
2. See where images vs content go
3. Match your content to the correct variant
4. Generate HTML that matches the expected structure exactly

---

### Step 3 Output Format

**Complete analysis for all sequences:**

```
Section 1 (light):
  - Sequence 1: "Large centered heading, paragraph, two call-to-action buttons"
    → Decision: DEFAULT CONTENT
    → Reason: Author can type heading, paragraph, links normally
    → Note: Prominent styling is a CSS concern

  - Sequence 2: "Two images side-by-side"
    → Decision: Columns block (2 columns)
    → Reason: Side-by-side layout requires structure
    → Obvious match with "columns" block in inventory
    → Brand (roy): BRAND_READY | Content model ✅ | Visual delta: none

Section 2 (light):
  - Sequence 1: "Centered heading"
    → Decision: DEFAULT CONTENT
    → Reason: Just a heading - author types it

  - Sequence 2: "Grid of 8 items, each with icon and short text"
    → Decision: Cards block
    → Reason: Repeating structured pattern, needs block
    → Obvious match with "cards" block in inventory
    → Brand (roy): BRAND_READY | Content model ✅
       Visual delta:
         Layer A: --brand-surface already in styles/roy/_tokens.css ✅
         Layer B: border 2px solid brand-primary, border-radius 8px
           → writing to blocks/cards/roy/_cards.css ✅
         Layer C: desktop reversed column order → CSS flex row-reverse → Layer B ✅
       Action: npm run scaffold:build after delta

  - Sequence 3: "Two centered buttons"
    → Decision: DEFAULT CONTENT
    → Reason: Just two links - author types them

Section 3 (grey):
  - Sequence 1: "Eyebrow text, heading, paragraph, button stacked vertically"
    → Decision: DEFAULT CONTENT
    → Reason: Author types text and link normally

  - Sequence 2: "Four items in grid, each with image, category tag, heading, description"
    → Decision: Cards block
    → Reason: Repeating structured pattern
    → Obvious match with "cards" block in inventory
    → Brand (roy): (same delta as Section 2 Sequence 2 — already applied ✅)

Section 4 (dark):
  - Sequence 1: "Tab navigation with three switchable content panels"
    → Decision: Tabs block
    → Reason: Interactive component, needs decoration
    → Obvious match with "tabs" block in inventory
```

---

### Step 3e: Validate Section Styling (Single-Block Sections Only)

**⚠️ EXECUTION TRIGGER:** This step is executed AFTER Step 3 is complete. Execute this step if and only if:
- ✅ You have completed Step 3 (identified which sequences become blocks)
- ✅ At least one section contains exactly ONE sequence that became a block
- ✅ That section has distinct background styling from identify-page-structure

**If NO sections meet these criteria → Skip Step 3e entirely and proceed to next skill**

**If ANY sections meet these criteria → You MUST execute all sub-steps below for EACH qualifying section**

---

**Why this validation matters:**

When a section contains a single block, the background styling might be:
- **Block-specific design** (e.g., hero with dark background image) → Don't add section-metadata
- **Section container styling** (e.g., dark section with tabs block) → Add section-metadata

Without validation, we risk adding unnecessary section-metadata that conflicts with block styling or makes authoring more complex.

**Sections with multiple sequences:** Always keep section-metadata (styling applies to all content, not validated in Step 3e)

---

**For EACH section with exactly one block, execute ALL these sub-steps:**

**Sub-step 1: Identify the candidate sections**

Review your Step 3 output. Find sections where:
- Section contains exactly 1 content sequence
- That sequence became a block (not default content)
- Section has distinct background styling from identify-page-structure

**Example:**
```
Section 1 (dark blue):
  - Sequence 1: Large centered heading, paragraph, two buttons
    → Decision: Hero block

Section 3 (grey):
  - Sequence 1: Tab navigation with three switchable panels
    → Decision: Tabs block
```

---

**Sub-step 2: For each candidate section, examine the screenshot**

Open screenshot.png and examine the section visually.

**Ask these questions:**

**Q1: Is the background an image (photo, gradient, illustration)?**
- If YES → Likely block-specific design
- If NO (solid color) → Continue to Q2

**Q2: Does the content fill the colored area edge-to-edge, or is there visible section padding?**
- Edge-to-edge (full-bleed) → Likely block-specific design
- Visible padding around content → Likely section container styling

**Q3: Does the block type typically have its own background styling?**
- Hero, banner, full-width CTAs → Often have own backgrounds
- Tabs, accordion, cards, columns → Often use section backgrounds

---

**Sub-step 3: Make the decision**

Based on your analysis, decide for each single-block section:

**SKIP section-metadata if:**
- Background is an image/gradient (block-specific)
- Content is full-bleed/edge-to-edge (no section padding visible)
- Block type typically has intrinsic background (hero, banner)

**KEEP section-metadata if:**
- Background is solid color with visible section padding
- Block type typically inherits section styling (tabs, cards, accordion)
- Styling clearly provides container context (not block design)

---

**Sub-step 4: Document your decisions**

For each validated section, note:
- Section number
- Block type
- Background analysis (image vs solid, full-bleed vs padded)
- Decision (keep or skip section-metadata)
- Reason

**Example output:**
```
VALIDATED SECTIONS:

Section 1 (dark blue):
  - Block: Hero
  - Background: Full-width dark blue gradient image
  - Layout: Edge-to-edge, no visible section padding
  - Decision: SKIP section-metadata
  - Reason: Background is hero's design, not section styling

Section 3 (grey):
  - Block: Tabs
  - Background: Solid grey (#f5f5f5)
  - Layout: Content centered with visible padding (~80px on sides)
  - Decision: KEEP section-metadata style="grey"
  - Reason: Section provides container styling for tabs block
```

---

**When in doubt:**

If you're uncertain whether background is block-specific or section-wide:
- **Default to KEEPING section-metadata** (safer, easier for authors to remove than add)
- **Add a note** in your documentation explaining the ambiguity
- Consider asking the user for guidance

---

**Step 3e Completion Checklist:**

Before proceeding to next skill, verify you have completed:
- ✅ Identified all single-block sections with background styling
- ✅ Examined original screenshot for EACH candidate section
- ✅ Answered Q1, Q2, Q3 for EACH candidate section
- ✅ Made skip/keep decision for EACH candidate section
- ✅ Documented reasoning for EACH decision
- ✅ Updated section styling notes with validated decisions

---

## Final Output

This skill provides complete authoring analysis:

**1. Authoring decisions for all sequences:**
- Each sequence marked as DEFAULT CONTENT or specific block name
- Reasoning documented

**2. Block structures fetched:**
- HTML structure examples for all blocks to be used

**3. Section styling validation (if applicable):**
- Updated section list with validated styling decisions
- Some sections may be marked "no section-metadata"

**Next step:** Pass these outputs to generate-import-html skill
