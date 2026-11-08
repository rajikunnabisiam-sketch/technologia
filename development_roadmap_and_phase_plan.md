# Development Roadmap & Phase Execution Plan: Electronics & Lifestyle E-Commerce Platform

| Document Metadata | Details |
| :--- | :--- |
| **Document File** | `roadmapa-nd-phase-develop.md` |
| **Aligned Specifications** | `vision.md`, `userstory.md`, `prd.md`, `adr.md` |
| **Target Architecture** | React / Next.js (App Router), Tailwind CSS, Node.js, PostgreSQL / MongoDB, `localStorage` Cart Sync |
| **Release Target** | $8\text{-Week}$ MVP Production Launch + Post-Launch Growth Phases |

---

## 1. Executive Summary & Development Philosophy

This document defines the phased engineering and product delivery roadmap for the **Next-Gen Electronics & Lifestyle Storefront** (covering *Headphones, Power Banks, Chargers, Smart Watches, Home Appliances,* and *Personal Care*). 

Every phase is structured so that foundational architecture (`ADR-001` through `ADR-008`), user stories (`US-1.1` through `US-5.2`), and functional requirements (`FR-NAV`, `FR-HOME`, `FR-CAT`, `FR-PDP`, `FR-CHK`, `FR-FTR`) are built, tested, and verified in a logical dependency order without blocking frontend or backend progress.

---

## 2. Master Phase Overview Matrix

| Phase | Phase Name | Duration | Core Deliverables | Traceability (Stories, PRD & ADRs) |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | Architecture, Data Schema & UI Scaffolding | Week $1$ | Next.js repo, Tailwind design tokens, catalog database schema, seed data for $6$ categories. | `ADR-001`, `Vision Sec 2 & 7` |
| **Phase 1** | Global Header, Search & Dual-Tier Navigation | Week $2$ | Sticky top header, `"Looking for any product?"` search bar, live cart badge, $6\text{-icon}$ homepage grid, text-only $\equiv$ drawer. | `US-1.1` – `US-1.3`, `FR-NAV-01` – `FR-NAV-05`, `ADR-002`, `ADR-005` |
| **Phase 2** | Homepage Sliders & Counterfeit-Mitigation UI | Week $3$ | Auto-advancing "Visionary Screen" ($4000\text{ ms}$, finger-swipe timer reset, no pause button), humorous warranty banner, static lower sliders. | `US-2.1` – `US-2.3`, `FR-HOME-01` – `FR-HOME-04`, `ADR-003`, `ADR-008` |
| **Phase 3** | Category Sorting Engine & Product Detail Pages | Weeks $4\text{--}5$ | Dedicated category pages, dynamic Price & Brand sorting/filtering, PDP view with mandatory $3\text{-point}$ Authenticity/Warranty/Replacement strip. | `US-3.1` – `US-3.2`, `FR-CAT-01` – `FR-CAT-02`, `FR-PDP-01`, `ADR-006`, `ADR-008` |
| **Phase 4** | Dual-Path Checkout & WhatsApp Auto-Fill Engine | Week $6$ | Multi-item persistent cart drawer, COD vs. Advance Payment selector, $1\text{-click}$ WhatsApp Business URL-encoded auto-fill ordering. | `US-4.1` – `US-4.2`, `FR-CHK-01` – `FR-CHK-02`, `ADR-004`, `ADR-005` |
| **Phase 5** | Cross-Device Footer, Policies & QA Hardening | Weeks $7\text{--}8$ | Universal HTTPS links for Facebook, Instagram & WhatsApp, policy/tracking/review pages, $< 2\text{ s}$ load optimization, production launch. | `US-5.1` – `US-5.2`, `FR-FTR-01` – `FR-FTR-02`, `ADR-007` |
| **Phase 6** | Post-Launch Growth & Automation (V2/V3) | Month $3+$ | Live courier API tracking, verified photo reviews, seller WhatsApp order logger, smart accessory bundling. | `Vision Sec 8 (Phases 2 & 3)` |

---

## 3. Detailed Phase-by-Phase Execution Plan

### Phase 0: Architecture, Data Schema & UI Scaffolding (Week $1$)
**Objective:** Establish the codebase, responsive design tokens, and product catalog data structures required by all downstream features.

* **Tasks & Deliverables:**
  1. **Repository & Stack Initialization (`ADR-001`):** Set up Next.js (App Router) with TypeScript and Tailwind CSS configured for mobile-first breakpoints.
  2. **Catalog & Category Schema Design:**
     * Define the `Category` schema distinguishing the **6 Flagship Homepage Categories** (`isFlagship6: true`, with SVG icon asset paths) from text-only sub-categories (`isFlagship6: false`).
     * Define the `Product` schema including `id`, `title`, `slug`, `categorySlug`, `brand`, `price`, `originalPrice`, `specs`, `authenticityBadge`, `warrantyDuration` (e.g., `"12 Months Official Warranty"`), and `replacementPolicy` (e.g., `"7-Day Instant Replacement"`).
  3. **Seed Dataset Creation:** Populate initial products across *Headphones, Power Banks, Chargers, Smart Watches, Home Appliances,* and *Personal Care* with diverse brands (*Anker, Baseus, Xiaomi, Haylou, Philips, Oral-B*) and price points to test sorting and filtering.
* **Definition of Done (DoD):** Database/JSON catalog serves all $6$ categories with mandatory warranty/replacement fields populated on $100\%$ of items.

---

### Phase 1: Global Header, Search & Dual-Tier Navigation (Week $2$)
**Objective:** Build the persistent top navigation bar, instant product search, and the dual-tier category navigation system.

* **Tasks & Deliverables:**
  1. **Sticky Header Bar (`US-1.1`, `FR-NAV-01`):**
     * Build a sticky top header (`position: sticky; top: 0; z-index: 50`) housing the top-left Three-Bar ($\equiv$) button, Brand Logo, Search Bar, and top-right Cart Icon.
  2. **Global Search Input (`US-1.1`, `FR-NAV-02`):**
     * Implement the search bar with the exact required placeholder: `"Looking for any product?"`.
     * Bind real-time debounced search ($150\text{ ms}$) matching against product `title`, `brand`, and `category`.
  3. **Persistent Cart Badge (`US-1.1`, `FR-NAV-03`, `ADR-005`):**
     * Create `CartContext` synchronized with `window.localStorage` (`gadget_store_cart_v1`).
     * Render live item counter badge ($\sum_{i=1}^{n} q_i$) on the header cart icon using a client-side mount hook to prevent SSR hydration mismatch.
  4. **Homepage 6-Pillar Icon Grid (`US-1.2`, `FR-NAV-05`, `ADR-002`):**
     * Render a $2 \times 3$ (mobile) / $6 \times 1$ (desktop) grid strictly capped at the $6$ core categories with custom vector icons:
       1. *Headphones*
       2. *Power Banks*
       3. *Chargers*
       4. *Smart Watches*
       5. *Home Appliances*
       6. *Personal Care*
  5. **Corner Three-Bar ($\equiv$) Text-Only Drawer (`US-1.3`, `FR-NAV-04`, `ADR-002`):**
     * Build the slide-out navigation drawer triggered by the top-left $\equiv$ button.
     * Render all categories and sub-categories **strictly as text links without icons**, separated by $1\text{ px}$ horizontal divider borders.
* **Definition of Done (DoD):** Clicking any homepage category icon or $\equiv$ text link routes to `/category/[slug]`; search bar displays `"Looking for any product?"`; cart badge persists across browser refreshes.

---

### Phase 2: Homepage Sliders & Counterfeit-Mitigation UI (Week $3$)
**Objective:** Deliver a high-converting homepage experience with governed carousel motion and humorous authenticity assurance.

* **Tasks & Deliverables:**
  1. **Top "Visionary Screen" Hero Carousel (`US-2.1`, `FR-HOME-01`, `FR-HOME-02`, `ADR-003`):**
     * Build the top hero carousel showcasing *Newly Launched Products*, *Running Offers*, and *Upcoming Offers*.
     * Configure auto-advance interval at $\Delta t = 4000\text{ ms}$ ($4\text{ seconds}$) while the user remains on the homepage.
     * **Strict UI Rule:** Render **no pause button** on the Visionary Screen.
     * **Swipe & Anti-Hijack Timer Reset:** Attach `onTouchStart`, `onTouchMove`, `onTouchEnd`, and mouse drag handlers so users can swipe slides with their fingers at any time, immediately resetting the $4000\text{ ms}$ interval timer to $0\text{ ms}$ on touch.
  2. **Humorous Homepage Authenticity & Warranty Banner (`US-2.2`, `FR-HOME-03`, `ADR-008`):**
     * Build a high-contrast visual trust banner featuring the locked headline:
       > *"100% Original Gadgets. Because the only thing worse than 1% battery is a fake power bank — Real Tech, Official Warranty, Zero 'Trust Me Bro' Guarantees."*
     * Include $3$ visual assurance pills: **$100\%$ Authentic Brands**, **Official Warranty**, and **Easy Replacement**.
  3. **Lower Product Spotlights & Static Horizontal Sliders (`US-2.3`, `FR-HOME-04`, `ADR-003`):**
     * Build lower homepage feature blocks and horizontal product carousels (*Flash Deals*, *Top Power Banks & Chargers*, *Smart Home & Grooming*).
     * Enforce static behavior (no auto-play) on all lower sliders so they move only when swiped by the user.
* **Definition of Done (DoD):** Top Visionary Screen auto-slides every $4\text{ s}$, supports smooth finger swiping without mid-swipe jumps, has no pause button, and lower sliders remain static until swiped.

---

### Phase 3: Category Sorting Engine & Product Detail Pages (Weeks $4\text{--}5$)
**Objective:** Enable rapid product comparison within each dedicated category and reinforce buyer trust on every individual product page.

* **Tasks & Deliverables:**
  1. **Dedicated Category Page Layout (`US-1.2`, `US-1.3`, `FR-CAT-01`):**
     * Build the dedicated category template displaying the category header, item count, and filtered product grid.
  2. **Price & Brand Sorting/Filtering Bar (`US-3.1`, `FR-CAT-01`, `FR-CAT-02`, `ADR-006`):**
     * Implement the sticky category control bar with:
       * **Sort Dropdown:** *Featured*, *Price: Low to High* ($p_1 \le p_2$), *Price: High to Low* ($p_1 \ge p_2$), and *Brand: A $\rightarrow$ Z*.
       * **Dynamic Brand Filter:** Automatically extract available brands in the active category ($\text{Brands}_{\text{cat}} = \{\, p.\text{brand} \mid p \in \text{Products}_{\text{cat}} \,\}$) so users only see relevant brands for that specific category.
     * Include a *"Reset Filters"* empty-state button if a combined filter/search yields $0$ products.
  3. **Individual Product Detail Page (PDP) & Reliance Strip (`US-3.2`, `FR-PDP-01`, `ADR-008`):**
     * Build the PDP displaying high-res product imagery, price, brand badge, technical specifications, and purchase actions.
     * Embed the mandatory **3-Point Authenticity, Warranty & Replacement Reliance Strip** directly adjacent to the action buttons:
       * **$\checkmark$ $100\%$ Authentic:** Original brand-sealed product.
       * **🛡️ Official Warranty:** Displays product-specific warranty duration (e.g., $6\text{--}12\text{ Months}$).
       * **🔄 Replacement Reliance:** Displays $7\text{-Day}$ replacement guarantee for manufacturing defects.
* **Definition of Done (DoD):** Category pages sort by price (low-to-high and high-to-low) and brand in $< 16\text{ ms}$; every PDP renders the $3\text{-point}$ trust strip.

---

### Phase 4: Dual-Path Checkout & WhatsApp Auto-Fill Engine (Week $6$)
**Objective:** Convert browsers into buyers via a seamless multi-item cart checkout (COD or Advance Payment) and $1\text{-click}$ auto-filled WhatsApp Business ordering.

* **Tasks & Deliverables:**
  1. **Multi-Item Slide-Out Cart Drawer (`US-4.1`, `FR-CHK-01`, `ADR-005`):**
     * Allow users to add multiple products across categories, increment/decrement quantities ($+ / -$), remove items, and view live subtotal calculations.
  2. **Checkout Form with Payment Preference Selector (`US-4.1`, `FR-CHK-01`, `ADR-004`):**
     * Build the checkout modal/page capturing Customer Name, Mobile Number, Delivery Address, and Delivery Notes.
     * Implement the mandatory **Payment Preference Selector** with two explicit options:
       1. **Cash on Delivery (COD):** Pay in cash upon receiving the gadget at the doorstep.
       2. **Advance Payment:** Pay online via digital wallet / mobile banking / card gateway.
     * Generate a unique Order ID (e.g., `ORD-84920`) upon confirmation and clear the cart.
  3. **WhatsApp Business Auto-Fill Ordering (`US-4.2`, `FR-CHK-02`, `ADR-004`):**
     * Place an **"Order via WhatsApp"** button on every Product Detail Page and inside the multi-item Cart Drawer.
     * Build the URL-encoded message generator (`encodeURIComponent`) routing to `https://wa.me/<STORE_WHATSAPP_NUMBER>?text=<ENCODED_TEXT>`:
       * **Single Product Auto-Fill:** Pre-fills product title, brand, category, unit price, and inquiry prompt.
       * **Full Cart Auto-Fill:** Pre-fills a numbered list of all cart items, quantities, subtotal, and preferred payment method.
* **Definition of Done (DoD):** Users can complete a multi-item checkout choosing either COD or Advance Payment, or launch WhatsApp with all product/cart details automatically typed into the message box.

---

### Phase 5: Cross-Device Footer, Policies & QA Hardening (Weeks $7\text{--}8$)
**Objective:** Complete the bottom footer directory, guarantee crash-free social links across mobile and laptops, and pass all performance and QA gates.

* **Tasks & Deliverables:**
  1. **Cross-Device Social & WhatsApp Links (`US-5.1`, `FR-FTR-01`, `ADR-007`):**
     * Add official vector logos for **Facebook**, **Instagram**, and **WhatsApp Business** in the footer.
     * Configure all three links using universal HTTPS URLs (`https://www.facebook.com/...`, `https://www.instagram.com/...`, `https://wa.me/...`) with `target="_blank" rel="noopener noreferrer"` so mobile phones open native apps while laptops open web browser tabs without protocol errors.
  2. **Complete Informational & Policy Footer Directory (`US-5.2`, `FR-FTR-02`, `ADR-008`):**
     * Build interactive views/modals for all required footer sections:
       * **Customer Care:** *Order Tracking* (with Order ID lookup), *FAQ*, *Customer Reviews*.
       * **Policies & Company Info:** *About Us*, *Refund & Exchange Policy*, *Terms & Conditions*.
       * **Contact Info:** Physical store/service address, support hotline, email, and social logos.
  3. **End-to-End QA & Performance Optimization (`Vision Sec 6`):**
     * Verify page load times $< 2\text{ seconds}$ and $60\text{ fps}$ carousel swipe responsiveness.
     * Run cross-device testing across Android, iOS, Windows, and macOS browsers.
* **Definition of Done (DoD):** Zero broken links, social icons open cleanly on both laptops and smartphones, all footer policy views are accessible, and production deployment is live.

---

## 4. Technical Dependency Graph & Critical Path

```
[Phase 0: Catalog & Category Schema]
       │
       ├──► [Phase 1: Header, "Looking for any product?" Search, 6-Icon Grid & Text-Only (≡) Menu]
       │           │
       │           ├──► [Phase 2: Visionary Auto-Slider (Touch Timer Reset) & Humorous Trust Banner]
       │           │
       │           └──► [Phase 3: Dedicated Category Pages (Price/Brand Sort) & PDP Trust Strip]
       │                       │
       │                       └──► [Phase 4: Multi-Item Cart (COD/Advance) & WhatsApp Auto-Fill]
       │                                   │
       └───────────────────────────────────┴──► [Phase 5: Universal Social Footer, Policies & QA Launch]
```

---

## 5. Quality Assurance (QA) & Release Verification Matrix

Before signing off on the production release, the engineering team must verify the following test gates:

| Gate ID | Verification Test Case | Expected Result |
| :--- | :--- | :--- |
| **QA-01** | Inspect search bar placeholder on all viewports | Displays exact string `"Looking for any product?"`. |
| **QA-02** | Compare Homepage Category Grid vs. Corner $\equiv$ Menu | Homepage shows $6$ categories **with icons**; corner $\equiv$ drawer shows categories **as text only without icons** separated by dividers. |
| **QA-03** | Observe top "Visionary Screen" & swipe with finger at $t = 3.5\text{ s}$ | Slider advances smoothly on finger swipe, has **no pause button**, and resets the $4.0\text{ s}$ timer to $0\text{ s}$ so it does not jump immediately after the swipe. |
| **QA-04** | Scroll to lower homepage product sliders | Lower sliders remain static until manually swiped or scrolled. |
| **QA-05** | Test Category Page sorting & brand filter | Products reorder instantaneously by *Price: Low $\rightarrow$ High*, *Price: High $\rightarrow$ Low*, and filter accurately by category-specific brands. |
| **QA-06** | Inspect Homepage & Individual Product Page trust elements | Homepage shows humorous warranty banner; every PDP displays the $3\text{-point}$ Authenticity, Warranty & Replacement strip. |
| **QA-07** | Add $3$ different gadgets to cart, refresh page, and open checkout | Cart badge retains `3` via `localStorage`; checkout allows selecting **Cash on Delivery (COD)** or **Advance Payment**. |
| **QA-08** | Click "Order via WhatsApp" on PDP and inside Cart | Opens WhatsApp with pre-filled, URL-encoded product names, quantities, and total price. |
| **QA-09** | Click Facebook, Instagram, and WhatsApp footer logos from a laptop | Opens cleanly in new browser tabs via `https://` without throwing an unrecognized app protocol error. |

---

## 6. Post-Launch Evolution Roadmap (Phase 6 / V2 & V3)

Once the Phase 1–5 MVP storefront is live and processing orders, the platform will scale across two post-launch expansions:

1. **V2 — Trust & Post-Purchase Automation (Months $3\text{--}4$):**
   * **Live Courier API Integration:** Connect the footer *Order Tracking* page to local courier webhooks for real-time parcel status updates.
   * **Automated WhatsApp & SMS Order Alerts:** Trigger automated order confirmation and dispatch notifications to customers.
   * **Verified Buyer Photo Reviews:** Allow customers who completed an order to upload real unboxing photos under the *Reviews* section.
2. **V3 — Smart Bundling & Retention (Months $5\text{--}6$):**
   * **Smart Accessory Pairing:** Automatically suggest compatible accessories on PDPs (e.g., suggesting a $20\text{W}$ Type-C Charger or Cable when viewing a Power Bank or Smartwatch).
   * **Flash Deal Countdown Engine:** Add scheduled time-limited promotional drops integrated directly with the homepage Visionary Screen.