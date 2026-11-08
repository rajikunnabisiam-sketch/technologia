# Product Requirements Document (PRD): Electronics & Lifestyle E-Commerce Platform

| Document Details | Specification |
| :--- | :--- |
| **Product Name** | Next-Gen Electronics & Lifestyle Storefront |
| **Document Version** | $1.0$ (MVP Release Specification) |
| **Status** | Locked for Development |
| **Target Platforms** | Mobile Web (Primary) & Desktop/Laptop Web (Secondary) |
| **Source Documents** | `vision.md`, `userstory.md` |

---

## 1. Executive Summary & Product Scope

### 1.1 Purpose
This Product Requirements Document (PRD) defines the functional, technical, user interface, and data requirements for an online electronics, home appliances, and personal care storefront. It serves as the single source of truth for frontend/backend engineers, UI/UX designers, and QA testers.

### 1.2 Core Value Proposition
1. **Curated 6-Pillar Discovery:** Fast visual navigation across 6 core categories on the homepage paired with a scalable, text-only corner menu ($\equiv$).
2. **High-Trust Conversion Architecture:** Combats counterfeit fears using a humorous homepage warranty banner and a mandatory 3-point reliance strip (Authenticity, Warranty, Replacement) on every product page.
3. **Dual-Path Ordering Engine:** Supports both a traditional multi-item shopping cart (with Cash on Delivery or Advance Payment) and 1-click WhatsApp Business ordering with auto-filled product/cart details.

---

## 2. End-to-End User Flows

### Flow A: Standard Multi-Item Cart Checkout
1. User lands on Homepage $\rightarrow$ Views auto-sliding "Visionary Screen" or searches in `"Looking for any product?"`.
2. User clicks a category icon (e.g., *Power Banks*) $\rightarrow$ Lands on the dedicated Power Banks page.
3. User sorts by *Price: Low to High* and filters by *Brand* (e.g., *Anker*).
4. User views Product Detail Page (PDP), verifies the Authenticity/Warranty/Replacement strip, and clicks **Add to Cart**.
5. User adds additional items across categories $\rightarrow$ Opens Cart Drawer $\rightarrow$ Clicks **Proceed to Checkout**.
6. User enters delivery details, selects **Cash on Delivery (COD)** or **Advance Payment**, and confirms the order.

### Flow B: Direct WhatsApp Business Assisted Order
1. User browses a Product Detail Page or opens their populated Shopping Cart.
2. User clicks **"Order via WhatsApp"**.
3. System generates a URL-encoded message containing the exact product name(s), price(s), category, and total amount, opening WhatsApp (native app on mobile, WhatsApp Web on laptop/desktop) ready to send to the seller.

---

## 3. Functional Requirements (FR)

### 3.1 Header & Global Navigation (`FR-NAV`)

| ID | Requirement Name | Detailed Specification | Priority |
| :--- | :--- | :--- | :--- |
| **FR-NAV-01** | Sticky Top Header | The header must remain fixed (`position: sticky; top: 0; z-index: 50`) across all pages. It contains: (1) Corner Three-Bar ($\equiv$) Menu Button, (2) Brand Logo, (3) Search Bar, and (4) Cart Icon. | P0 |
| **FR-NAV-02** | Global Search Bar | Must display the exact placeholder text: `"Looking for any product?"`. Typing triggers real-time query matching against product `title`, `brand`, and `category`. | P0 |
| **FR-NAV-03** | Persistent Cart Badge | The top-right cart icon displays a numeric badge representing $\sum \text{item quantities}$. State must persist in `localStorage` across page reloads. | P0 |
| **FR-NAV-04** | Corner Three-Bar ($\equiv$) Text Menu | Clicking the top-left $\equiv$ icon opens a slide-out drawer listing all product categories **strictly as text links without icons**, separated by $1\text{ px}$ horizontal divider borders. | P0 |
| **FR-NAV-05** | 6-Pillar Homepage Icon Grid | The homepage displays a dedicated category grid strictly capped at **6 flagship categories** with custom vector icons: *Headphones, Power Banks, Chargers, Smart Watches, Home Appliances,* and *Personal Care*. Clicking an icon routes to that dedicated category page. | P0 |

---

### 3.2 Homepage Sliders & Content Modules (`FR-HOME`)

| ID | Requirement Name | Detailed Specification | Priority |
| :--- | :--- | :--- | :--- |
| **FR-HOME-01** | Top "Visionary Screen" (Hero Carousel) | Positioned immediately below the header/category bar. Cycles through promotional slides (Newly Launched Products, Running Offers, Upcoming Offers) automatically every $4000\text{ ms}$ ($4\text{ seconds}$) while the user is on the homepage. | P0 |
| **FR-HOME-02** | Swipe Physics & Timer Reset | The Visionary Screen has **no pause button**. Users can swipe left/right with fingers (`touchstart`/`touchend`) or mouse drag. Any manual swipe immediately resets the $4\text{-second}$ interval timer to $0\text{ ms}$ to prevent mid-swipe jumping. | P0 |
| **FR-HOME-03** | Humorous Warranty & Authenticity Banner | A high-contrast visual banner displayed on the homepage featuring the locked copy: *"100% Original Gadgets. Because the only thing worse than 1% battery is a fake power bank — Real Tech, Official Warranty, Zero 'Trust Me Bro' Guarantees."* Includes 3 visual sub-pills: $100\%$ Genuine, Official Warranty, Easy Replacement. | P0 |
| **FR-HOME-04** | Lower Product Info Screens & Static Sliders | Scrolling down displays featured product specification spotlights and horizontal product carousels. Lower sliders **must not auto-play**; they move only when swiped or scrolled by the user. | P0 |

---

### 3.3 Dedicated Category Pages & Sorting Engine (`FR-CAT`)

| ID | Requirement Name | Detailed Specification | Priority |
| :--- | :--- | :--- | :--- |
| **FR-CAT-01** | Category Isolation | Clicking a category from the homepage icon grid or the $\equiv$ menu renders a dedicated view displaying only products matching that `categoryId`. | P0 |
| **FR-CAT-02** | Price Sorting Control | Category pages include a sorting dropdown supporting: <br>1. **Default / Featured**<br>2. **Price: Low to High** ($P_1 \le P_2 \le \dots \le P_n$)<br>3. **Price: High to Low** ($P_1 \ge P_2 \ge \dots \ge P_n$) | P0 |
| **FR-CAT-03** | Brand Filtering & Sorting | Category pages dynamically extract unique brands present in that category (e.g., *All Brands, Anker, Baseus, Xiaomi, Haylou, Philips*) so users can filter by a specific brand or sort products alphabetically by brand. | P0 |

---

### 3.4 Individual Product Detail Page (`FR-PDP`)

| ID | Requirement Name | Detailed Specification | Priority |
| :--- | :--- | :--- | :--- |
| **FR-PDP-01** | Product Information Display | Displays high-resolution product image(s), title, brand badge, category label, current price, discount strikethrough price (if applicable), key technical specifications, and stock status. | P0 |
| **FR-PDP-02** | 3-Point Reliance Strip | Directly below the action buttons, every product view must display a compact trust box advertising:<br>• **Authenticity:** $100\%$ Original & Genuine Brand Product<br>• **Warranty:** Official Brand/Store Warranty (e.g., $6\text{--}12\text{ Months}$)<br>• **Replacement Reliance:** $7\text{-Day}$ Instant Replacement for manufacturing defects | P0 |
| **FR-PDP-03** | Dual CTA Buttons | Displays two primary call-to-action buttons:<br>1. **Add to Cart** (adds item to persistent cart)<br>2. **Order via WhatsApp** (triggers `FR-CHK-04` auto-fill) | P0 |

---

### 3.5 Multi-Product Cart, Checkout & WhatsApp Auto-Fill (`FR-CHK`)

| ID | Requirement Name | Detailed Specification | Priority |
| :--- | :--- | :--- | :--- |
| **FR-CHK-01** | Multi-Product Cart Management | Users can add multiple distinct products to the cart, increment/decrement item quantities ($q \ge 1$), remove items, and view the live subtotal. | P0 |
| **FR-CHK-02** | Checkout Order Form | Clicking **Proceed to Checkout** opens a structured checkout screen requiring: Full Name, Phone Number, Full Delivery Address, and Optional Delivery Notes. | P0 |
| **FR-CHK-03** | Payment Preference Selector | The checkout screen includes a mandatory radio/card selector with two options:<br>1. **Cash on Delivery (COD):** Pay cash upon package arrival.<br>2. **Advance Payment:** Pay upfront via digital wallet / mobile banking / card (displays payment instructions or gateway prompt). | P0 |
| **FR-CHK-04** | WhatsApp Business Auto-Fill Engine | Clicking **Order via WhatsApp** constructs an HTTPS `wa.me` link with URL-encoded text:<br>• **Single Product:** `"Hello! I want to order: [Product Name] (Brand: [Brand]) - Price: [Price]. Is this in stock?"`<br>• **Full Cart:** `"Hello! I would like to place an order for:\n1. [Item A] x[Qty] - [Subtotal]\n2. [Item B] x[Qty] - [Subtotal]\nTotal Amount: [Cart Total]\nPreferred Payment: [Selected Method]"` | P0 |

---

### 3.6 Cross-Device Footer & Informational Directory (`FR-FTR`)

| ID | Requirement Name | Detailed Specification | Priority |
| :--- | :--- | :--- | :--- |
| **FR-FTR-01** | Conflict-Free Social & WhatsApp Links | The footer displays official logos for **Facebook**, **Instagram**, and **WhatsApp Business**. All links must use standard universal HTTPS URLs (`https://www.facebook.com/...`, `https://www.instagram.com/...`, `https://wa.me/...`) with `target="_blank" rel="noopener noreferrer"`. Raw custom URI schemes (`fb://`, `instagram://`) are prohibited so laptops open web apps cleanly while mobile OS deep-linking opens native apps automatically. | P0 |
| **FR-FTR-02** | Customer Care & Policy Sections | The footer provides accessible pages/views for:<br>• **Order Tracking** (lookup by Order ID / Phone)<br>• **Customer Reviews**<br>• **FAQ (Frequently Asked Questions)**<br>• **Refund & Exchange Policy**<br>• **About Us**<br>• **Terms & Conditions**<br>• **Company Contact Info** (Address, Phone, Email, Business Hours) | P0 |

---

## 4. Data Models & Schema Specifications

### 4.1 Product Object Schema
```json
{
  "id": "prod_anker_01",
  "title": "Anker Prime 20,000mAh 200W Power Bank",
  "category": "power-banks",
  "categoryLabel": "Power Banks",
  "brand": "Anker",
  "price": 8500,
  "originalPrice": 9500,
  "rating": 4.9,
  "reviewsCount": 142,
  "inStock": true,
  "warranty": "18 Months Official Anker Warranty",
  "replacementPolicy": "7-Day Instant Defect Replacement",
  "authenticityGuarantee": "100% Original & Serial Verified",
  "specs": [
    "Capacity: 20,000mAh",
    "Total Output: 200W Max (Dual USB-C + USB-A)",
    "Smart Digital Display"
  ],
  "image": "https://images.unsplash.com/..."
}
```

### 4.2 Order Payload Schema
```json
{
  "orderId": "ORD-84920",
  "createdAt": "2026-11-03T13:14:00Z",
  "customer": {
    "name": "Customer Name",
    "phone": "+8801XXXXXXXXX",
    "address": "House, Road, Area, City"
  },
  "paymentMethod": "COD",
  "items": [
    {
      "productId": "prod_anker_01",
      "title": "Anker Prime 20,000mAh 200W Power Bank",
      "quantity": 1,
      "unitPrice": 8500
    }
  ],
  "totalAmount": 8500,
  "status": "Confirmed"
}
```

---

## 5. Non-Functional Requirements & Edge-Case Handling

### 5.1 Performance & Responsiveness
* **Initial Load Time:** First Contentful Paint (FCP) $< 1.5\text{ seconds}$; Time to Interactive (TTI) $< 2.0\text{ seconds}$.
* **Touch Target Sizing:** All interactive icons (category grid, three-bar menu, cart button, social icons) must have a minimum tap target of $44\text{ px} \times 44\text{ px}$ on mobile devices.
* **Carousel Frame Rate:** CSS hardware acceleration (`transform: translate3d`) required for $60\text{ fps}$ swipe transitions.

### 5.2 Edge Cases & Fallback Rules
1. **Zero Search Results:** If a user types a query into `"Looking for any product?"` that matches $0$ products, display a friendly empty state with a direct **"Ask us on WhatsApp about this product"** button that auto-fills the searched keyword.
2. **Simultaneous Brand Filter + Price Sort:** When a user selects a specific brand (e.g., *Xiaomi*) and then changes the price sort (*Low to High*), both states must remain active simultaneously rather than resetting each other.
3. **Empty Cart Checkout Prevention:** The **Proceed to Checkout** and **Order Cart via WhatsApp** buttons must be disabled when `cart.length === 0`.
4. **Desktop Popup Blockers:** Social and WhatsApp links must be triggered directly by user click events on standard `<a>` anchor tags so browser popup blockers on laptops never block the new tab.

---

## 6. Release Criteria & Success Metrics (KPIs)

* **Primary Conversion Metric:** Combined Checkout Completion Rate (Standard Cart Orders + WhatsApp Auto-Fill Clicks) $\ge 3.5\%$.
* **Navigation Efficiency:** $\ge 60\%$ of visitors reach a dedicated category or product view within $15\text{ seconds}$ of landing on the homepage.
* **QA Sign-Off Checklist:**
  * [ ] Header search bar displays exact `"Looking for any product?"` prompt and filters accurately.
  * [ ] Homepage shows exactly 6 category icons; corner $\equiv$ menu shows text-only categories with dividers.
  * [ ] Top Visionary slider auto-advances every $4\text{ seconds}$, supports finger swiping, has no pause button, and resets timer on swipe.
  * [ ] Lower homepage sliders do not auto-play.
  * [ ] Category pages sort accurately by Price (Low $\leftrightarrow$ High) and Brand.
  * [ ] Humorous warranty banner is visible on the homepage and 3-point reliance strip is visible on every product page.
  * [ ] Multi-product checkout allows selecting Cash on Delivery or Advance Payment.
  * [ ] WhatsApp buttons auto-fill product and cart details accurately on both mobile and laptop browsers.