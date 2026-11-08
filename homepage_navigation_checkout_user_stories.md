# User Stories: Storefront, Navigation, Trust & Checkout Flow

This document defines the complete functional user stories and acceptance criteria for the Electronics & Lifestyle E-Commerce Platform, incorporating all UX safeguards, sorting controls, trust elements, and dual checkout paths.

## Epic 1: Header Bar, Search & Category Navigation

### US-1.1: Sticky Top Header with Search Bar & Persistent Cart Icon

**As a** shopper browsing the website,
**I want to** see a search bar and a shopping cart icon in the top header at all times,
**So that** I can immediately search for a specific gadget by name or view my saved items from any page.

**Acceptance Criteria:**

* The top navigation bar remains sticky at the top of the viewport across all pages.

* The search input field displays the exact placeholder text: `"Looking for any product?"`.

* Typing in the search bar filters or searches across product titles, categories, and brands.

* A shopping cart icon is positioned in the top-right header with a numeric badge displaying the total count of items currently saved in the cart.

* Adding a product to the cart immediately increments the cart badge count and persists the items in browser storage.

### US-1.2: 6-Pillar Visual Category Grid with Icons (Homepage)

**As a** homepage visitor,
**I want to** see the 6 core product sections represented by clear visual icons,
**So that** I can tap an icon and go straight to the dedicated page for that product type.

**Acceptance Criteria:**

* The homepage displays a dedicated category grid strictly capped at the **6 flagship product categories** to prevent visual clutter:

  1. **Headphones**

  2. **Power Banks**

  3. **Chargers**

  4. **Smart Watches**

  5. **Home Appliances**

  6. **Personal Care**

* Each category card displays a distinct vector icon paired with its category label.

* Clicking any category icon navigates the user to the dedicated product page showing only items from that category.

### US-1.3: Corner Three-Bar ($\equiv$) Menu (Text-Only Category Directory)

**As a** shopper on mobile or desktop,
**I want to** tap the three-bar icon in the top corner to open a text-only list of product sections,
**So that** I can jump between product categories through a clean, distraction-free menu.

**Acceptance Criteria:**

* A three-bar hamburger icon ($\equiv$) is positioned in the top-left corner of the header.

* Clicking the icon opens a slide-out navigation drawer.

* All product categories (Headphones, Power Banks, Chargers, Smart Watches, Home Appliances, Personal Care, plus any future sub-categories) are listed **strictly as text links without icons**, separated by clean horizontal divider lines.

* Clicking a category name routes the user to that dedicated category page and closes the drawer.

## Epic 2: Homepage Sliders & Humorous Trust Messaging

### US-2.1: Top "Visionary Screen" (Auto-Advancing & Swipeable Hero Slider)

**As a** homepage visitor,
**I want to** see a top hero screen that automatically slides through new products, running offers, and upcoming deals while allowing me to swipe slides manually with my fingers,
**So that** I can effortlessly browse top promotions without dealing with play/pause buttons.

**Acceptance Criteria:**

* The "Visionary Screen" is positioned at the top of the homepage and cycles through promotional slides (Newly Launched Products, Running Offers, Upcoming Offers) automatically every $4\text{ seconds}$ while the user is on the homepage.

* There is **no pause button** overlaid on the screen.

* Users can swipe left or right with their fingers (on touchscreens) or drag/click arrows (on laptops) at any time to move between slides.

* **Anti-Hijack Safeguard:** Whenever a user manually swipes a slide, the $4\text{-second}$ auto-advance timer resets to $0$ so the slide never jumps away mid-swipe.

### US-2.2: Humorous Homepage Authenticity & Warranty Banner

**As a** cautious online electronics buyer,
**I want to** see an engaging, humorous visual banner on the homepage that guarantees product authenticity and official warranty,
**So that** I feel confident the store sells genuine gadgets rather than cheap knock-offs.

**Acceptance Criteria:**

* A high-visibility visual banner is displayed on the homepage featuring a humorous, reassuring headline (e.g., *"100% Original Gadgets. Because the only thing worse than 1% battery is a fake power bank — Real Tech, Official Warranty, Zero 'Trust Me Bro' Guarantees."*).

* Accompanying sub-badges highlight **100% Authentic Brands**, **Official Store/Brand Warranty**, and **Hassle-Free Replacement**.

### US-2.3: Lower Homepage Product Information Blocks & Manual-Swipe Sliders

**As a** shopper scrolling down the homepage,
**I want to** view featured product spotlight banners and horizontal product sliders,
**So that** I can explore more gadgets and specifications before deciding what to buy.

**Acceptance Criteria:**

* Scrolling down reveals split-screen product information blocks (highlighting flagship specs) and horizontal product carousels (e.g., *Best Selling Power Banks*, *Smart Home Upgrades*).

* Unlike the top Visionary Screen, lower product sliders remain static until the user swipes or scrolls them horizontally, preventing screen chaos.

## Epic 3: Dedicated Category Pages & Product Trust Details

### US-3.1: Category Page Sorting by Price and Brand

**As a** shopper viewing a dedicated category page (e.g., only Chargers or only Home Appliances),
**I want to** sort products by price (low-to-high or high-to-low) and filter or sort by brand,
**So that** I can quickly find a gadget that fits my budget and preferred manufacturer.

**Acceptance Criteria:**

* Landing on any dedicated category page displays a sorting/filtering control bar above the product grid.

* **Price Sorting:** Users can select *"Price: Low to High"* or *"Price: High to Low"*, dynamically reordering the displayed products.

* **Brand Sorting/Filtering:** Users can filter by specific brands available in that category (e.g., *All Brands, Anker, Baseus, Xiaomi, Philips, Haylou*) or sort alphabetically by brand name.

### US-3.2: Individual Product Page Trust & Replacement Reliance Strip

**As a** shopper viewing a specific product's detail page,
**I want to** see a concise summary of authenticity, warranty terms, and replacement reliance right next to the purchase buttons,
**So that** I know my purchase is protected before I click buy.

**Acceptance Criteria:**

* Every individual product view includes a short, clearly styled **Authenticity, Warranty & Replacement** box showing:

  * **Authenticity:** Guaranteed $100\%$ Genuine & Original Product.

  * **Warranty:** Specific warranty duration (e.g., $6\text{--}12\text{ Months}$ Official Warranty).

  * **Replacement Reliance:** Clear replacement assurance (e.g., $7\text{-Day}$ Instant Replacement for manufacturing defects).

## Epic 4: Multi-Product Checkout & WhatsApp Business Auto-Fill

### US-4.1: Multi-Product Cart & Checkout with COD / Advance Payment Selection

**As a** ready-to-buy customer,
**I want to** add multiple products to my cart and choose between Cash on Delivery or Advance Payment during checkout,
**So that** I can complete my order using the payment method I trust most.

**Acceptance Criteria:**

* Users can add multiple different products (and adjust quantities) in the shopping cart drawer/page.

* Clicking **"Proceed to Checkout"** opens the order confirmation form collecting customer name, phone number, and delivery address.

* The checkout form includes a mandatory **Payment Preference Selector** with two clear options:

  1. **Cash on Delivery (COD):** Pay in cash when the courier delivers the package.

  2. **Advance Payment:** Pay immediately via mobile banking/digital wallet or card.

* Submitting the form confirms the order, displays an Order ID for tracking, and clears the cart.

### US-4.2: Direct WhatsApp Business Ordering with Auto-Filled Product Info

**As a** customer who prefers talking directly to the seller before or while ordering,
**I want to** click an "Order / Chat on WhatsApp" button that automatically fills in the product details for me,
**So that** I don't have to copy-paste product names or prices into WhatsApp manually.

**Acceptance Criteria:**

* Every product detail page and the shopping cart drawer includes a prominent **"Order via WhatsApp"** button styled with the WhatsApp logo.

* Clicking the button on a product page opens WhatsApp with a pre-filled, URL-encoded message:

  * `"Hello! I want to order/inquire about: [Product Name] - Price: [Price] (Category: [Category]). Please let me know the availability and delivery details."`

* Clicking the button from inside a multi-item cart pre-fills the entire list of cart items and the total amount so the seller receives the full order breakdown immediately.

## Epic 5: Cross-Device Social Links & Complete Footer Directory

### US-5.1: Laptop-Safe & Mobile-Ready Social Media Links (Facebook, Instagram, WhatsApp)

**As a** visitor clicking social icons in the footer from either a smartphone or a laptop,
**I want** the Facebook, Instagram, and WhatsApp logos to open smoothly without application errors,
**So that** I can view the store's social pages or message them regardless of my device.

**Acceptance Criteria:**

* The footer features official vector logos for **Facebook**, **Instagram**, and **WhatsApp Business**.

* All three icons use universal HTTPS web links (`https://www.facebook.com/...`, `https://www.instagram.com/...`, and `https://wa.me/...`) configured with `target="_blank" rel="noopener noreferrer"`.

* **On Smartphones:** The mobile OS automatically intercepts the universal link and opens the native Facebook, Instagram, or WhatsApp app if installed.

* **On Laptops/Desktops:** Clicking the logo opens the corresponding web application cleanly in a new browser tab, avoiding any broken `fb://` or `instagram://` protocol clash.

### US-5.2: Complete Informational, Policy & Trust Footer

**As a** customer looking for store policies, order tracking, or reviews,
**I want** a structured footer at the very bottom of the website containing all essential informational links,
**So that** I can track my package, read reviews, or check the refund policy at any time.

**Acceptance Criteria:**

* The bottom footer is organized into clear sections containing functional links/modals for:

  * **Customer Care:** *Order Tracking*, *FAQ*, *Customer Reviews*.

  * **Company & Legal Policies:** *About Us*, *Refund & Exchange Policy*, *Terms & Conditions*.

  * **Contact & Social:** Physical address, support hotline, email, and the Facebook, Instagram, and WhatsApp Business logos.