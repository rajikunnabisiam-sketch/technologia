# Design System: Technologia (Master Blueprint)
*Generated via `ui-ux-pro-max-skill`*

## 1. Design Archetype: Industrial Precision Tech
- **Inspiration:** Teenage Engineering, Braun by Dieter Rams, Nothing Tech, Anker Prime, Leica.
- **Brand Personality:** Serious about authenticity, obsessed with hardware specs, zero gimmicks, zero counterfeit tolerance ("Pure Tech // Zero Cap").
- **Visual Voice:** High information density, surgical hairline borders, monochrome architectural contrast with high-energy laser accents.

---

## 2. Color System & Design Tokens
```css
:root {
  /* Carbon Foundations */
  --bg-canvas: #ffffff;
  --bg-surface: #f8f9fa;
  --bg-surface-elevated: #ffffff;
  --text-primary: #09090b;       /* Zinc 950 */
  --text-secondary: #52525b;     /* Zinc 600 */
  --text-muted: #a1a1aa;         /* Zinc 400 */
  --border-hairline: #e4e4e7;    /* Zinc 200 */
  --border-strong: #d4d4d8;      /* Zinc 300 */
  
  /* Obsidian Dark Surfaces */
  --dark-canvas: #09090b;
  --dark-surface: #121216;
  --dark-surface-elevated: #18181b;
  --dark-border: #27272a;
  
  /* Laser Functional Accents */
  --accent-laser: #2563eb;       /* Cobalt Precision */
  --accent-laser-hover: #1d4ed8;
  --accent-verified: #059669;    /* Hardware Genuine Emerald */
  --accent-amber: #d97706;       /* Hot Deal / Warning */
  --accent-whatsapp: #25D366;    /* Official WhatsApp */
}
```

---

## 3. Typography Architecture
1. **Headings & Display:**
   - Font: Clean geometric neo-grotesque sans-serif.
   - Weights: 800 (Extrabold) and 900 (Black).
   - Tracking: `tracking-tight` (-0.025em to -0.04em).
2. **Body & Prose:**
   - Font: High legibility modern sans.
   - Colors: Zinc 600/700 on light backgrounds with WCAG AA compliance (contrast ratio > 4.5:1).
3. **Technical Specs & Meta Labels:**
   - Font: `font-mono` (Monospaced).
   - Style: High-density data badges, e.g., `[ 200W MAX ]`, `[ 52dB ANC ]`, `[ 20,000mAh ]`, `[ ORD-84920 ]`.
   - Purpose: Replaces fluffy vague marketing text with tactile engineering specs.

---

## 4. Anti-Patterns Blacklist ("Anti-AI-Slop")
1. ❌ **No Random Purple Gradients:** Banned generic `#6366f1` / `#8b5cf6` text gradients that scream "AI placeholder".
2. ❌ **No Raw System Emojis as UI Icons:** Replaced with crisp 1.5px stroke Lucide SVG icons (e.g., `<ShieldCheck>`, `<Zap>`, `<Cpu>`, `<RotateCcw>`).
3. ❌ **No Repetitive 3-Card Grids:** Sections must have distinct visual rhythms (e.g. split-screen technical callouts, high-density spec matrices, horizontal swipe carousels, and itemized data feeds).
4. ❌ **No Floating Meaningless Glow Blobs:** Backgrounds use subtle structural dot grids or architectural hairline divider accents rather than blurry neon blobs.
5. ❌ **No Ambiguous Buttons:** All interactive controls must have crisp hover, focus-visible, and active pressed states with physical tactile depth.

---

## 5. Component Style Specifications
- **Header:** Sticky with 1px border-b, backdrop blur, search input with keyboard shortcut pill `[/]`, cart badge with high-contrast indicator.
- **Hero Screen:** Bold typographic hierarchy, technical specification grid, clean hardware imagery, auto-advance with anti-hijack swipe timer reset.
- **Category Grid:** 6 flagship categories with sharp architectural borders, custom monochrome-to-color vector icons, and exact product counters.
- **Humorous Banner:** High-contrast brutalist layout with signal amber/emerald accents, locking in the copy *"100% Original Gadgets. Because the only thing worse than 1% battery is a fake power bank — Real Tech, Official Warranty, Zero 'Trust Me Bro' Guarantees."*
- **Product Cards:** Hardware spec tags with `font-mono`, genuine brand stamps, clear price strikethroughs, and tactile dual CTAs.
- **Product Detail Page (PDP):** Technical specs data-sheet layout, 3-point reliance strip with hairline borders, and instant WhatsApp / Cart actions.
- **Cart & Checkout:** Clear tabular manifest with free shipping progress bar, explicit COD vs Advance radio selector, and Order ID generator.

