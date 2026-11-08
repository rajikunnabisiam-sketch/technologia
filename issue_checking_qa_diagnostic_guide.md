# Issue Checking, Edge-Case Diagnostics & QA Verification Guide

| Document Metadata | Details |
| :--- | :--- |
| **Document File** | `issue-checking.md` |
| **Source Specifications** | `vision.md`, `userstory.md`, `prd.md`, `adr.md`, `roadmapa-nd-phase-develop.md` |
| **Purpose** | Pre-release bug hunting, architectural compliance checking, edge-case prevention, and QA triage |
| **Target Systems** | Storefront UI, Touch Sliders, Category Sorting Engine, `localStorage` Cart, Checkout & WhatsApp Auto-Fill |

---

## 1. Purpose & Severity Classification Matrix

This document serves as the master **Issue Checking & Diagnostic Checklist** for developers and QA engineers. Every potential bug, regression risk, or specification violation across the Electronics & Lifestyle E-Commerce Platform is cataloged below with its root cause, diagnostic test step, and required fix.

### Issue Severity Levels

| Severity Level | Label | Definition & Release Impact | Resolution SLA |
| :--- | :--- | :--- | :--- |
| **Severity 0 ($S0$)** | **Critical Blocker** | Breaks core ordering flow (Cart, COD/Advance Checkout, or WhatsApp Auto-Fill), crashes desktop/mobile browsers, or corrupts prices. **Blocks release.** | Immediate ($< 4\text{ hours}$) |
| **Severity 1 ($S1$)** | **Major Functional Issue** | Direct violation of locked product rules (e.g., icons appearing in the $\equiv$ text menu, pause button on Visionary Screen, broken price/brand sorting). **Blocks release.** | $< 24\text{ hours}$ |
| **Severity 2 ($S2$)** | **Moderate UX / UI Defect** | Visual clipping on small mobile screens ($320\text{ px}$), sluggish slider transitions ($< 60\text{ fps}$), or missing empty-state reset buttons. | Before Sprint Sign-off |
| **Severity 3 ($S3$)** | **Minor / Cosmetic** | Minor spacing alignment, non-critical copy typos, or secondary hover transitions. | Next Patch |

---

## 2. Header, Search & Dual-Tier Navigation Issues (`FR-NAV` / `ADR-002`)

| Issue ID | Potential Issue / Bug Description | Related Spec | Diagnostic Check (How to Test) | Required Fix / Prevention Rule | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-NAV-01** | **Incorrect Search Placeholder Copy:** Developer uses generic text like `"Search..."` instead of the locked prompt. | `US-1.1`<br>`FR-NAV-02` | Inspect the top search bar input across mobile and desktop viewports. | Hardcode exact placeholder attribute: `placeholder="Looking for any product?"`. | $S1$ |
| **ISS-NAV-02** | **Icons Appearing Inside Corner Three-Bar ($\equiv$) Menu:** Developer reuses the homepage icon component inside the slide-out hamburger menu. | `US-1.3`<br>`FR-NAV-04`<br>`ADR-002` | Click the top-left $\equiv$ button and inspect the category list inside the drawer. | Strip all SVG/icon nodes from the drawer component; render strictly text-only links separated by $1\text{ px}$ horizontal borders. | $S1$ |
| **ISS-NAV-03** | **Homepage Category Grid Exceeds $6$ Icons:** Adding a $7\text{th}$ or $8\text{th}$ category breaks the $2 \times 3$ mobile / $6 \times 1$ desktop grid. | `US-1.2`<br>`FR-NAV-05`<br>`ADR-002` | Add a new sub-category to the catalog dataset and inspect the homepage icon section. | Filter homepage icon grid strictly by `.filter(c => c.isFlagship6).slice(0, 6)`. Route additional sub-categories exclusively to the $\equiv$ text menu. | $S1$ |
| **ISS-NAV-04** | **SSR Hydration Mismatch on Cart Badge:** Next.js server renders `0` items while client `localStorage` has `3` items, throwing a React hydration warning. | `US-1.1`<br>`FR-NAV-03`<br>`ADR-001`<br>`ADR-005` | Add items to cart, hard-refresh the browser (`Ctrl+F5`), and check browser DevTools console. | Initialize `isMounted` state to `false` and only read/render `localStorage` cart badge count ($\sum_{i=1}^{n} q_i$) inside a `useEffect` hook after mount. | $S1$ |
| **ISS-NAV-05** | **Sticky Header Z-Index Collision:** Scrolling causes product badges or sliders to overlap on top of the sticky header. | `FR-NAV-01` | Scroll down the homepage and category pages while observing the top bar. | Enforce `sticky top-0 z-50` on the header and `z-60` on slide-out drawers/modals, keeping page content at `z-10` or lower. | $S2$ |

---

## 3. Homepage Sliders & Trust Banner Issues (`FR-HOME` / `ADR-003` / `ADR-008`)

| Issue ID | Potential Issue / Bug Description | Related Spec | Diagnostic Check (How to Test) | Required Fix / Prevention Rule | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-HOME-01** | **Mid-Swipe Timer Hijack on Visionary Screen:** User touches/swipes Slide $1$ at $t = 3800\text{ ms}$, and the slider abruptly jumps two slides forward $200\text{ ms}$ later. | `US-2.1`<br>`FR-HOME-02`<br>`ADR-003` | Wait $3.5\text{ seconds}$ on the homepage, then slowly swipe the top hero slider with a finger. | Bind `clearInterval(timerRef.current)` to `onTouchStart` and `onMouseDown`, and restart a fresh $4000\text{ ms}$ timer only after `onTouchEnd` / `onMouseUp`. | $S1$ |
| **ISS-HOME-02** | **Pause Button Rendered on Visionary Screen:** A carousel library injects a default play/pause button overlay. | `US-2.1`<br>`FR-HOME-02`<br>`ADR-003` | Visually inspect all corners of the top Visionary Screen on mobile and desktop. | Explicitly disable or remove all play/pause UI controls; rely strictly on $4000\text{ ms}$ auto-advance + manual finger swipe. | $S1$ |
| **ISS-HOME-03** | **Lower Homepage Sliders Auto-Playing:** Lower product carousels move automatically at the same time as the top Visionary Screen, causing visual chaos. | `US-2.3`<br>`FR-HOME-04`<br>`ADR-003` | Scroll halfway down the homepage and watch the product sliders for $10\text{ seconds}$ without touching the screen. | Disable auto-play (`autoPlay={false}`) on all lower homepage carousels; only the top Visionary Screen is allowed to auto-advance. | $S1$ |
| **ISS-HOME-04** | **Interval Memory Leak on Route Change:** Navigating from the Homepage to a Category page leaves the $4000\text{ ms}$ slider timer running in the background. | `ADR-003` | Navigate from Homepage $\rightarrow$ Chargers page and check React profiler / console for unmounted state updates. | Return a cleanup function `() => clearInterval(timerRef.current)` inside the Visionary Screen `useEffect` hook. | $S2$ |
| **ISS-HOME-05** | **Humorous Warranty Banner Copy Missing or Truncated:** The witty authenticity guarantee is missing or cut off on mobile screens. | `US-2.2`<br>`FR-HOME-03`<br>`ADR-008` | Inspect the homepage warranty section on a $360\text{ px}$ mobile viewport. | Ensure responsive text wrapping (`text-balance`) for the headline (*"100% Original Gadgets. Because the only thing worse than 1% battery is a fake power bank..."*) and stack the $3$ trust pills cleanly on mobile. | $S2$ |

---

## 4. Dedicated Category Pages, Price Sorting & Brand Filtering Issues (`FR-CAT` / `ADR-006`)

| Issue ID | Potential Issue / Bug Description | Related Spec | Diagnostic Check (How to Test) | Required Fix / Prevention Rule | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-CAT-01** | **Cross-Category Brand Bleed:** Selecting the *Personal Care* category shows irrelevant charger brands (like *Baseus*) in the Brand filter dropdown, resulting in $0$ items when clicked. | `US-3.1`<br>`FR-CAT-02`<br>`ADR-006` | Navigate to each of the $6$ dedicated category pages and open the Brand filter menu. | Compute available brands dynamically from the active category's product list: $\text{Brands}_{\text{cat}} = \{\, p.\text{brand} \mid p \in \text{Products}_{\text{cat}} \,\}$. | $S1$ |
| **ISS-CAT-02** | **In-Place Array Mutation Breaking Sort Order:** Calling `products.sort(...)` directly mutates the original React state array, causing unpredictable UI updates. | `US-3.1`<br>`FR-CAT-01`<br>`ADR-006` | Toggle rapidly between *Price: Low to High*, *Price: High to Low*, and *Featured* on a category page. | Always clone the array before sorting inside `useMemo`: `[...filteredProducts].sort((a, b) => a.price - b.price)`. | $S1$ |
| **ISS-CAT-03** | **Numeric vs. Lexicographical Price Sorting Bug:** Prices stored as strings (`"1200"`, `"450"`) sort alphabetically (`"1200"` before `"450"`) instead of numerically. | `US-3.1`<br>`FR-CAT-01` | Sort a category containing items priced at $450$ and $1,200$ by *Price: Low to High*. | Cast prices strictly as `Number` in the schema and sort via `Number(a.price) - Number(b.price)`. | $S0$ |
| **ISS-CAT-04** | **Dead-End Empty Filter State:** User combines a search query (`"Looking for any product?"`) with a Brand filter that yields $0$ matches and has no obvious way to recover. | `ADR-006` | Search for `"Kettle"` while filtering by brand `"Anker"`. | Render a clear empty-state card with a one-click **"Reset All Filters & Search"** button. | $S2$ |

---

## 5. Individual Product Detail Page (PDP) & Trust Strip Issues (`FR-PDP` / `ADR-008`)

| Issue ID | Potential Issue / Bug Description | Related Spec | Diagnostic Check (How to Test) | Required Fix / Prevention Rule | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-PDP-01** | **Missing 3-Point Reliance Strip on PDP:** Individual product view omits the short Authenticity, Warranty, and Replacement reliance section or renders `undefined`. | `US-3.2`<br>`FR-PDP-01`<br>`ADR-008` | Open at least $1$ product from each of the $6$ categories and inspect the area below the price/buttons. | Enforce schema fallback defaults (`warrantyDuration: "12 Months Official Warranty"`, `replacementPolicy: "7-Day Instant Replacement"`) so all $3$ badges ($\checkmark\ 100\%$ Authentic, Official Warranty, Easy Replacement) always render. | $S1$ |
| **ISS-PDP-02** | **Trust Badges Buried Below Long Descriptions:** Shoppers on mobile cannot see the warranty assurance without scrolling past long spec tables. | `US-3.2`<br>`ADR-008` | View any PDP on a mobile viewport ($375 \times 667\text{ px}$). | Place the compact $3\text{-badge}$ Authenticity/Warranty/Replacement reliance strip directly adjacent to the **Add to Cart** and **Order via WhatsApp** buttons. | $S2$ |

---

## 6. Multi-Item Cart, Checkout & WhatsApp Auto-Fill Issues (`FR-CHK` / `ADR-004`)

| Issue ID | Potential Issue / Bug Description | Related Spec | Diagnostic Check (How to Test) | Required Fix / Prevention Rule | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-CHK-01** | **Special Characters Breaking WhatsApp Auto-Fill Text:** Product names with `&`, `+`, or `%` (e.g., *"Hair Dryer & Styler 2000W+"*) truncate the WhatsApp message halfway through. | `US-4.2`<br>`FR-CHK-02`<br>`ADR-004` | Click **"Order via WhatsApp"** on a product containing `&` or `+` in its title. | Wrap the entire constructed message string inside `encodeURIComponent(message)` before appending it to `https://wa.me/<NUMBER>?text=`. | $S0$ |
| **ISS-CHK-02** | **Duplicate Rows in Cart Instead of Quantity Increment:** Clicking "Add to Cart" twice on the same power bank creates two separate rows instead of setting quantity $q = 2$. | `US-4.1`<br>`FR-CHK-01`<br>`ADR-005` | Click "Add to Cart" $3\text{ times}$ on the same product and open the Cart Drawer. | Check `cart.find(item => item.id === product.id)` in `addToCart()`; if found, increment `item.quantity += 1` rather[ than pushing a duplicate entry. | $S1$ |
| **ISS-CHK-03** | **Missing COD vs. Advance Payment Selection Enforcement:** User submits the checkout form without selecting whether they prefer **Cash on Delivery (COD)** or **Advance Payment**. | `US-4.1`<br>`FR-CHK-01`<br>`ADR-004` | Attempt to submit the checkout order confirmation form without selecting a payment option. | Make the Payment Preference radio group (`"COD"` vs. `"ADVANCE"`) a required field with explicit visual selection states and validation feedback. | $S0$ |
| **ISS-CHK-04** | **Multi-Item Cart WhatsApp Auto-Fill Incomplete:** Clicking "Order via WhatsApp" from inside the Cart Drawer only sends the first item instead of the full list and total. | `US-4.2`<br>`FR-CHK-02`<br>`ADR-004` | Add $3$ different gadgets to the cart, open the Cart Drawer, and click **"Order Cart via WhatsApp"**. | Map over all `cart` items (`cart.map((item, idx) => ...)`), include each item's quantity $q_i$, unit price $p_i$, line subtotal $q_i \times p_i$, and the grand total $\sum q_i p_i$ in the auto-filled message. | $S0$ |
| **ISS-CHK-05** | **Cart Not Cleared After Order Confirmation:** After completing a standard web checkout, old items remain stuck in the cart badge and `localStorage`. | `US-4.1`<br>`ADR-005` | Complete a checkout order and inspect the top-right cart icon badge. | Call `clearCart()` immediately upon generating the confirmation Order ID, resetting both React state and `localStorage` (`gadget_store_cart_v1`) to `[]`. | $S1$ |

---

## 7. Cross-Device Social Links & Footer Directory Issues (`FR-FTR` / `ADR-007`)

| Issue ID | Potential Issue / Bug Description | Related Spec | Diagnostic Check (How to Test) | Required Fix / Prevention Rule | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-FTR-01** | **Laptop App-Protocol Crash on Social Logos:** Clicking the Facebook or Instagram logo from a laptop throws an *"Unrecognized URI scheme (`fb://` or `instagram://`)"* browser error. | `US-5.1`<br>`FR-FTR-01`<br>`ADR-007` | Click the Facebook, Instagram, and WhatsApp Business logos in the footer from a Windows/macOS laptop browser. | Never use raw `fb://` or `instagram://` URIs. Strictly use universal HTTPS URLs (`https://www.facebook.com/...`, `https://www.instagram.com/...`, `https://wa.me/...`) so laptops open web tabs while mobile OS Universal Links open native apps. | $S0$ |
| **ISS-FTR-02** | **Tab-Nabbing Security Vulnerability on External Links:** External social links opened with `target="_blank"` lack `rel="noopener noreferrer"`. | `US-5.1`<br>`ADR-007` | Inspect anchor (`<a>`) tags for Facebook, Instagram, and WhatsApp in the footer DOM. | Include `target="_blank" rel="noopener noreferrer"` on every external social and WhatsApp link. | $S2$ |
| **ISS-FTR-03** | **Dead `#` Links in Footer Customer Care & Policy Sections:** Clicking *Refund & Exchange Policy*, *About Us*, *FAQ*, *Order Tracking*, *Terms & Conditions*, or *Reviews* does nothing. | `US-5.2`<br>`FR-FTR-02`<br>`ADR-008` | Click every single text link in the bottom footer directory. | Bind every footer link to a dedicated view or interactive policy/lookup modal containing real store policy content, an Order ID tracking input, and verified customer reviews. | $S1$ |

---

## 8. Standardized Issue Log & Bug Triage Template

When logging any defect discovered during Phase $1\text{--}5$ testing, engineers and QA testers must use the following structured template:

```text
### [ISSUE-ID] Short Descriptive Title
- **Related Spec / Story:** (e.g., US-2.1 / FR-HOME-02 / ADR-003)
- **Severity:** [S0 Blocker | S1 Major | S2 Moderate | S3 Minor]
- **Device & Viewport:** (e.g., Mobile Android Chrome 375x812px / Laptop macOS Chrome 1440x900px)
- **Steps to Reproduce:**
  1. Navigate to [...]
  2. Perform action [...]
- **Expected Behavior:** [...]
- **Actual Behavior:** [...]
- **Fix Verification Status:** [ ] Open  [ ] In Progress  [ ] Verified Fixed in QA
```