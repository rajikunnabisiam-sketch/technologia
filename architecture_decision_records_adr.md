# Architecture Decision Records (ADR): Electronics & Lifestyle E-Commerce Platform

This document records the core architectural, user-experience, and technical decisions made for the **Next-Gen Electronics & Lifestyle Storefront**. Each record follows the standard ADR format (**Status**, **Context**, **Decision**, **Alternatives Considered**, and **Consequences**) to ensure the engineering team understands *why* the system is designed this way.

## ADR Summary Index

| ADR ID | Title | Status | Related PRD / Story IDs | 
| ----- | ----- | ----- | ----- | 
| **ADR-001** | Frontend Stack & Hybrid Rendering Strategy | Accepted | `Vision Sec 6 & 7` | 
| **ADR-002** | Dual-Tier Category Navigation (6-Icon Cap vs. Text-Only Drawer) | Accepted | `US-1.2`, `US-1.3`, `FR-NAV-04`, `FR-NAV-05` | 
| **ADR-003** | Carousel Motion Governance & Touch-Swipe Timer Reset | Accepted | `US-2.1`, `US-2.3`, `FR-HOME-01`, `FR-HOME-02`, `FR-HOME-04` | 
| **ADR-004** | Dual-Path Ordering Engine (Self-Serve Cart + WhatsApp Auto-Fill) | Accepted | `US-4.1`, `US-4.2`, `FR-CHK-01`, `FR-CHK-02` | 
| **ADR-005** | Client-Side Persistent Cart State via `localStorage` | Accepted | `US-1.1`, `FR-NAV-03` | 
| **ADR-006** | Category-Scoped Dynamic Sorting & Brand Filtering | Accepted | `US-3.1`, `FR-CAT-01`, `FR-CAT-02` | 
| **ADR-007** | Universal HTTPS Routing for Cross-Device Social & App Links | Accepted | `US-5.1`, `FR-FTR-01` | 
| **ADR-008** | Embedded Trust & Counterfeit-Mitigation UI Architecture | Accepted | `US-2.2`, `US-3.2`, `FR-HOME-03`, `FR-PDP-01` | 

## ADR-001: Frontend Stack & Hybrid Rendering Strategy

* **Status:** Accepted

* **Context:**
  The storefront sells fast-moving consumer electronics (headphones, power banks, chargers, smartwatches, home appliances, personal care) primarily to mobile shoppers. The platform requires page load times of $< 2\text{ seconds}$, smooth $60\text{ fps}$ touch gestures for sliders, instantaneous search (`"Looking for any product?"`), and strong search engine visibility for category and product pages.

* **Decision:**
  We will build the frontend using **React (Next.js App Router)** styled with **Tailwind CSS**, paired with a lightweight **Node.js + PostgreSQL/MongoDB** backend. Category and Product Detail Pages (PDPs) will use Server-Side Rendering (SSR) / Incremental Static Regeneration (ISR) for fast initial paint and SEO, while interactive modules (Search, Cart Drawer, Sorting Bar, Sliders) will hydrate on the client.

* **Alternatives Considered:**

  * *Traditional Multi-Page Server App (PHP/Laravel or Django templates):* Rejected because full page reloads when sorting by price/brand or updating the cart degrade the mobile shopping experience.

  * *Heavy E-Commerce Monolith (Magento / PrestaShop):* Rejected due to excessive hosting overhead, slow mobile Time-to-Interactive ($> 4\text{ seconds}$), and rigid checkout flows that complicate custom WhatsApp Business auto-fill workflows.

* **Consequences:**

  * **Positive:** Sub-$2\text{-second}$ initial loads, zero-reload category sorting, and seamless mobile transitions.

  * **Negative / Mitigation:** Requires careful hydration management so client-side `localStorage` cart badges do not cause React hydration mismatches (mitigated by rendering cart badge counts inside a `useEffect` hook after mount).

## ADR-002: Dual-Tier Category Navigation (6-Icon Cap vs. Text-Only Drawer)

* **Status:** Accepted

* **Context:**
  Visual category icons on the homepage help users quickly identify core product lines. However, as the business expands into sub-categories (e.g., cables, trimmers, air fryers, hair dryers), adding $12+$ icons to the homepage creates visual clutter and breaks mobile grid alignment. Furthermore, the user specification requires a corner three-bar ($\equiv$) menu that displays product sections strictly as text without icons.

* **Decision:**
  We will enforce a **Dual-Tier Category Navigation Architecture**:

  1. **Homepage Icon Grid (`FR-NAV-05`):** Hard-capped in code and CMS configuration at exactly $6$ **flagship categories** (*Headphones, Power Banks, Chargers, Smart Watches, Home Appliances, Personal Care*), rendered with custom vector icons in a responsive $2 \times 3$ (mobile) / $6 \times 1$ (desktop) grid.

  2. **Corner Three-Bar (**$\equiv$**) Slide-Out Drawer (`FR-NAV-04`):** Renders an uncapped, vertically stacked list of all categories and future sub-categories **strictly as text links without icons**, separated by $1\text{ px}$ horizontal borders.

* **Alternatives Considered:**

  * *Uncapped Homepage Icon Grid:* Rejected because $> 6$ icons push the homepage trust banner and product sliders below the fold on mobile devices.

  * *Reusing the Icon Grid inside the Hamburger Drawer:* Rejected as it violates the explicit product requirement for a clean, text-only corner menu.

* **Consequences:**

  * **Positive:** Preserves a permanently clean homepage layout while allowing infinite catalog expansion inside the text-only $\equiv$ drawer.

  * **Negative / Mitigation:** Both navigation components must consume the same single source of truth (`CATEGORIES` data schema) so category slugs and routes never drift out of sync.

## ADR-003: Carousel Motion Governance & Touch-Swipe Timer Reset

* **Status:** Accepted

* **Context:**
  The homepage features a top "Visionary Screen" (hero slider) for newly launched products and offers, plus multiple product sliders further down the page. If multiple carousels auto-play simultaneously, users experience visual fatigue and mobile browsers suffer frame drops. Additionally, the top Visionary Screen must auto-advance without a visual pause button while still allowing users to swipe slides manually with their fingers.

* **Decision:**

  1. **Single Auto-Play Rule:** Only the top **Visionary Screen** is permitted to auto-advance (set to an interval of $\Delta t = 4000\text{ ms}$ while on the homepage). All lower homepage product sliders are strictly static until manually swiped or scrolled by the user.

  2. **No Pause Button & Anti-Hijack Timer Reset:** No play/pause button will be rendered on the Visionary Screen. Instead, attaching native touch listeners (`onTouchStart`, `onTouchMove`, `onTouchEnd`) and pointer drag handlers will immediately clear and reset the $4000\text{ ms}$ `setInterval` timer (`resetTimer()`) the millisecond a user touches or swipes the slider.

* **Alternatives Considered:**

  * *Auto-Playing All Homepage Carousels:* Rejected due to severe visual distraction and poor mobile battery/CPU performance.

  * *Continuous Uninterruptible `setInterval` Without Touch Reset:* Rejected because if a user swipes at $t = 3800\text{ ms}$, the slider would abruptly jump a second time only $200\text{ ms}$ later.

* **Consequences:**

  * **Positive:** Delivers the exact requested continuous, button-free hero experience while guaranteeing that manual finger swipes feel responsive and never get hijacked mid-gesture.

  * **Negative / Mitigation:** Requires proper cleanup (`clearInterval`) when the user navigates away from the homepage to prevent memory leaks.

## ADR-004: Dual-Path Ordering Engine (Self-Serve Cart + WhatsApp Auto-Fill)

* **Status:** Accepted

* **Context:**
  In our target electronics market, shoppers fall into two distinct behavioral groups:

  1. **Self-Serve Buyers** who want to add multiple products to a cart and complete checkout using either **Cash on Delivery (COD)** or **Advance Payment**.

  2. **Conversational Buyers** who want to talk directly to the seller on **WhatsApp Business** to confirm stock, delivery speed, or bundle deals without manually typing out product names and prices.

* **Decision:**
  We will implement a **Dual-Path Ordering Engine** supporting both workflows simultaneously:

  * **Path A (Standard Multi-Item Checkout):** Users add multiple items to the cart, open the checkout view, enter shipping details, select their payment radio option (`COD` vs. `Advance Payment`), and generate an official Order ID.

  * **Path B (Auto-Filled WhatsApp Business Generator):** Both the Product Detail Page (single item) and the Cart Drawer (multiple items) feature an **"Order via WhatsApp"** button. Clicking it dynamically constructs a URL-encoded payload via `encodeURIComponent()` containing the exact product name(s), quantities, unit prices, category, and total price, and routes to `https://wa.me/<STORE_NUMBER>?text=<ENCODED_PAYLOAD>`.

* **Alternatives Considered:**

  * *Standard Web Checkout Only:* Rejected because high-intent customers who prefer WhatsApp ordering would bounce if forced through a form.

  * *Blank WhatsApp Chat Link Only:* Rejected because forcing customers to remember and type out model numbers (e.g., *"Anker* $65\text{W}$ *GaN Charger"*) creates friction and leads to order errors.

* **Consequences:**

  * **Positive:** Maximizes conversion rate across both tech-savvy self-serve shoppers and chat-first buyers.

  * **Negative / Mitigation:** Orders placed directly via WhatsApp bypass the automated database checkout table until logged by the seller; Phase 2 will introduce a quick seller admin button to log WhatsApp orders into inventory.

## ADR-005: Client-Side Persistent Cart State via `localStorage`

* **Status:** Accepted

* **Context:**
  Users must be able to browse across multiple dedicated category pages, add items to the cart icon in the top header, see the live badge counter update ($\sum_{i=1}^{n} q_i$), and retain their saved items even if they refresh the browser or close and reopen the tab.

* **Decision:**
  We will manage cart state using a global React Context (`CartContext`) synchronized bidirectionally with browser `window.localStorage` under a versioned key (`gadget_store_cart_v1`). Guest checkout will be enabled by default without forcing mandatory account registration prior to adding items to the cart.

* **Alternatives Considered:**

  * *Mandatory Login Before Adding to Cart:* Rejected because forced account creation before checkout is the #1 cause of e-commerce cart abandonment.

  * *In-Memory React State Only:* Rejected because refreshing the page or opening a link in a new tab would wipe the customer's cart.

* **Consequences:**

  * **Positive:** Zero-latency cart additions, instant header badge updates, and zero server database bloat from abandoned guest carts.

  * **Negative / Mitigation:** Prices stored in `localStorage` must be validated against current catalog prices at checkout submission to prevent stale price tampering.

## ADR-006: Category-Scoped Dynamic Sorting & Brand Filtering

* **Status:** Accepted

* **Context:**
  When a user clicks a category icon on the homepage or a text link in the $\equiv$ menu, they land on a dedicated page for that specific category. They need to sort products by **Price: Low to High**, **Price: High to Low**, and filter/sort by **Brand**. Because different categories have completely different brands (e.g., *Anker/Baseus* in Chargers vs. *Philips/Xiaomi* in Home Appliances & Personal Care), a static global brand list would show irrelevant empty brands.

* **Decision:**
  Each dedicated category page will dynamically derive its **Brand Filter** options from the unique set of brands present in that category's dataset:
  

  $$
  \text{Brands}_{\text{cat}} = \{\, p.\text{brand} \mid p \in \text{Products}_{\text{cat}} \,\}
  $$

  
  Sorting (*Default*, *Price: Low* $\rightarrow$ *High*, *Price: High* $\rightarrow$ *Low*, *Brand: A* $\rightarrow$ *Z*) and Brand Filtering will execute client-side using memoized array transformations (`useMemo`) for instantaneous $< 16\text{ ms}$ UI updates.

* **Alternatives Considered:**

  * *Hardcoded Global Brand Dropdown:* Rejected because selecting "Anker" on the "Personal Care" page would frequently yield $0$ results and frustrate users.

  * *Server Round-Trip on Every Sort Change:* Rejected as unnecessary network latency for category catalogs under $500$ SKUs per category.

* **Consequences:**

  * **Positive:** Instantaneous sorting and guaranteed valid brand options on every category page.

  * **Negative / Mitigation:** If a user combines a search query (`"Looking for any product?"`) with a brand filter that yields $0$ matches, a clear "Reset Filters" action button must be displayed.

## ADR-007: Universal HTTPS Routing for Cross-Device Social & App Links

* **Status:** Accepted

* **Context:**
  The footer includes official logos for **Facebook**, **Instagram**, and **WhatsApp Business**. On mobile phones, clicking these logos should open the respective native mobile apps. However, if a customer clicks these logos from a **laptop or desktop browser**, raw mobile URI schemes (`fb://`, `instagram://`, `whatsapp://`) trigger an *"Unrecognized Protocol / Application Not Found"* error in desktop browsers.

* **Decision:**
  All social and messaging links across the platform will strictly use **Universal HTTPS Web URLs** (`https://www.facebook.com/...`, `https://www.instagram.com/...`, `https://wa.me/...`) with `target="_blank" rel="noopener noreferrer"`.

  * **Mobile OS Behavior:** iOS (Universal Links) and Android (App Links) automatically intercept these HTTPS URLs and launch the native Facebook, Instagram, or WhatsApp apps when installed.

  * **Laptop/Desktop Behavior:** Desktop browsers open the official web application cleanly in a new browser tab with zero protocol clashes.

* **Alternatives Considered:**

  * *Custom `fb://` and `instagram://` URI Schemes:* Rejected due to broken behavior on laptops and desktops.

  * *User-Agent Sniffing via JavaScript:* Rejected as brittle and unnecessary given modern OS-level Universal Link support.

* **Consequences:**

  * **Positive:** $100\%$ crash-free compatibility across Android, iOS, Windows, macOS, and Linux devices with zero maintenance overhead.

  * **Negative / Mitigation:** None.

## ADR-008: Embedded Trust & Counterfeit-Mitigation UI Architecture

* **Status:** Accepted

* **Context:**
  Customer hesitation in online gadget shopping stems primarily from fear of receiving counterfeit products or unhonored warranties. Relying solely on a buried "Terms & Conditions" page in the footer fails to reassure users at the moment of purchase decision.

* **Decision:**
  Trust messaging is promoted to a **first-class architectural UI requirement** in three locations:

  1. **Homepage Humorous Trust Banner (`FR-HOME-03`):** A dedicated high-contrast section on the homepage displaying the locked copy: *"100% Original Gadgets. Because the only thing worse than 1% battery is a fake power bank — Real Tech, Official Warranty, Zero 'Trust Me Bro' Guarantees."*

  2. **PDP Mandatory 3-Point Reliance Strip (`FR-PDP-01`):** Hardcoded directly into the Product Detail template so every product automatically renders badges for **100% Authenticity**, **Official Warranty Duration**, and **7-Day Replacement Reliance** directly adjacent to the *Add to Cart* and *Order via WhatsApp* buttons.

  3. **Interactive Footer Policy Directory (`FR-FTR-02`):** Accessible links/modals for *Refund & Exchange Policy*, *Order Tracking*, *Customer Reviews*, *FAQ*, *About Us*, and *Terms & Conditions*.

* **Alternatives Considered:**

  * *Footer-Only Warranty Text:* Rejected because most mobile shoppers never scroll to the footer before deciding whether to trust a product page.

* **Consequences:**

  * **Positive:** Directly addresses buyer skepticism at both the discovery stage (Homepage) and the conversion stage (Product Detail Page).

  * **Negative / Mitigation:** Every product record in the database schema (`Product.warrantyText`, `Product.replacementPolicy`) must carry valid default warranty strings so the PDP reliance strip is never blank.