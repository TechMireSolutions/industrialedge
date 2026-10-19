# Role & Objective
Act as a Principal Frontend Architect and UI/UX Engineer. Build a complete, responsive, production-ready electronics e-commerce storefront called **"OneTech"** using **Tailwind CSS** (and React/Next.js or clean semantic HTML5 + Alpine.js/Vanilla JS—use whichever fits the project workspace best).

The design must be a 1:1 visual and functional replica of the Colorlib **OneTech** e-commerce template, implementing all layout sections, interactive states, hover drawers, tabs, and countdown timers with zero layout shift (CLS).

---

## 1. Global Design System & Tokens
Configure or apply the following design tokens consistently across the entire application:

* **Typography:** Import Google Font `'Rubik'` (Weights: `300`, `400`, `500`, `700`). Set `font-['Rubik',sans-serif]` as the default body font.
* **Color Palette:**
  * **Primary Brand / Tech Blue:** `#0e8ce4` (Hover state: `#3e9ce8` or `bg-[#0e8ce4]/80`)
  * **Sale / Discount / Alert Coral Red:** `#df3b3b`
  * **Surface Backgrounds:** Pure White (`#ffffff`) and Light Cool Gray (`#eff6fa` / `#f2f4f8`)
  * **Text Colors:** Primary `#000000` / `#212529`, Secondary Muted `rgba(0,0,0,0.5)` (`text-black/50`), Subtle Gray `#828282`
  * **Borders & Dividers:** `#e5e5e5` (`border-[#e5e5e5]`)
* **Container Width:** Max width `1140px` (`max-w-[1140px] mx-auto px-4`).
* **Shadows:**
  * Card Elevate Shadow: `shadow-[0_10px_25px_rgba(0,0,0,0.1)]`
  * Floating Drawer Shadow: `shadow-[0_15px_25px_rgba(0,0,0,0.1)]`
  * Pill/Icon Shadow: `shadow-[0_1px_5px_rgba(0,0,0,0.1)]`

---

## 2. Header Architecture (3-Tier Navigation)

### Tier 1: Top Utility Bar (`h-[56px] border-b border-[#e5e5e5] bg-[#fafafa] text-xs`)
* **Left:** Phone icon + `+1 (555) 014-2360` and Mail icon + `support@onetech.example`.
* **Right:**
  * Language Dropdown (`English` -> `Italian`, `Spanish`, `Japanese`)
  * Currency Dropdown (`$ US dollar` -> `EUR Euro`, `GBP British Pound`, `JPY Japanese Yen`)
  * User Auth Links: User icon + `Register` | `Sign in`.

### Tier 2: Main Search & Cart Bar (`h-[100px] lg:h-[130px] bg-white`)
* **Left:** Brand Logo `OneTech` in `text-[36px] font-medium text-[#0e8ce4] tracking-tight`.
* **Center:** Scoped Search Bar (`h-[50px] border border-[#e5e5e5] rounded-[5px] flex items-center overflow-visible`):
  * Input field (`placeholder="Search for products..."`)
  * Custom Category Select dropdown on the right side of the input (`All Categories` with chevron)
  * Blue Search Submit Button (`w-[50px] h-full bg-[#0e8ce4] text-white flex items-center justify-center rounded-r-[5px]`).
* **Right:**
  * **Wishlist Widget:** Heart icon + `Wishlist` label (hover `#0e8ce4`) + item count `115` in muted gray below.
  * **Cart Widget:** Bag icon with floating circular badge (`w-[24px] h-[24px] bg-[#0e8ce4] text-white rounded-full text-xs -top-2 -right-2` showing `10`) + `Cart` label + `$85` total below.

### Tier 3: Primary Navigation & Category Spine (`h-[60px] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.05)] border-t border-[#e5e5e5]`)
* **Left Anchored Category Button (`w-[270px] h-full bg-[#0e8ce4] text-white px-6 flex items-center gap-4 uppercase font-medium tracking-wider cursor-pointer relative group`):**
  * Hamburger 3-line icon + `CATEGORIES`.
  * **Dropdown Flyout Menu:** Absolute positioned `w-[270px] bg-white shadow-lg border border-[#e5e5e5] z-40`. Contains 9 categories (*Computers & Laptops, Cameras & Photos, Hardware [with nested multi-level right flyout], Smartphones & Tablets, TV & Audio, Gadgets, Car Electronics, Video Games & Consoles, Accessories*).
* **Right Horizontal Nav Links:** `Home`, `Super Deals` (with dropdown), `Featured Brands` (with dropdown), `Pages` (Shop, Product, Blog, Cart, Contact), `Blog`, `Contact`.
* **Mobile Drawer:** Responsive collapsible menu for `<lg` breakpoints containing search, language/currency selectors, and nav links.

---

## 3. Page Sections & Layout Specs

### Section 1: Hero Banner
* **Background:** Light cool gradient/tint (`bg-gradient-to-r from-[#eff6fa] to-[#f9fcff]`) with a subtle geometric overlay, `min-h-[480px] flex items-center`.
* **Layout:** 2-column split:
  * **Text Column:** `h1` `"NEW ERA OF SMARTPHONES"` (`uppercase text-[36px] lg:text-[52px] font-normal text-[#212529] leading-tight`), Price block showing strikethrough `$530` (`text-[#212529] line-through mr-3 text-2xl`) and active sale price `$460` (`text-[#df3b3b] text-3xl font-medium`), Subtitle `"Fold Duo Phone"` (`text-black/50 mt-1`), and Primary CTA Button `"Shop Now"` (`mt-6 inline-block bg-[#0e8ce4] hover:bg-[#0e8ce4]/80 text-white px-8 py-3 rounded-[5px] font-medium transition`).
  * **Image Column:** High-resolution floating smartphone cutout image (`max-h-[450px] object-contain`).

### Section 2: 4-Column Trust / Characteristics Bar
* 4 equal columns (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10`):
  * Each card (`h-[100px] bg-white border border-[#e8e8e8] rounded-[5px] shadow-[0_1px_5px_rgba(0,0,0,0.05)] flex items-center px-8 gap-5`):
  * 1: Truck Icon | **Free Delivery** (`font-medium text-sm`) / `from $50` (`text-xs text-black/50`)
  * 2: Refresh Icon | **99% Positive** / `Feedbacks`
  * 3: Wallet Icon | **365 Days** / `for free return`
  * 4: Shield/Support Icon | **Payment** / `Secure System`

### Section 3: Deals of the Week (4 Cols) + Tabbed Product Grid (8 Cols)
Create a 12-column grid (`grid-cols-1 lg:grid-cols-12 gap-8 py-8`):

#### Left 4 Columns: "Deals of the Week" Spotlight Card (`.deals_item`)
* Container: `lg:col-span-4 bg-white rounded-[5px] p-8 shadow-[0_10px_25px_rgba(0,0,0,0.1)] relative`.
* Header: `"Deals of the Week"` (`text-lg font-medium mb-6`) + prev/next chevron controls in top right.
* Image: Centered `310x310px` headphone product image.
* Split Metadata Row 1: `Headphones` (left, `text-sm text-black/50`) | `$300` (right, `text-sm text-black/50 line-through`).
* Split Metadata Row 2: `Timber Studio` (left, `text-2xl font-medium text-black`) | `$225` (right, `text-2xl font-medium text-[#df3b3b]`).
* Scarcity Progress Bar:
  * Top labels: `Available: 6` (with `6` in `#0e8ce4` font-medium) on left, `Already sold: 28` (with `28` in `#0e8ce4` font-medium) on right.
  * Progress Track: `w-full h-[6px] bg-[#e8e8e8] rounded-full mt-2 overflow-hidden` with inner fill `w-[22%] h-full bg-[#0e8ce4] rounded-full`.
* Live Countdown Timer Row:
  * Left text: `"Hurry Up"` (`text-sm font-medium text-black`) + `"Offer ends in:"` (`text-xs text-black/50`).
  * Right segmented box (`border border-[#cccccc] rounded-[5px] flex divide-x divide-[#cccccc]`): 3 boxes for `hours`, `mins`, `secs` with a working live JS countdown timer (`text-xl font-medium text-black` + `text-[10px] uppercase text-black/50`).

#### Right 8 Columns: Tabbed Product Matrix (`Featured` | `On Sale` | `Best Rated`)
* Top Tab Bar: 3 interactive tabs (`text-lg font-medium pb-3 border-b border-[#e5e5e5]`). Active tab has `#000000` text and a `2px` bottom indicator bar in `#0e8ce4`.
* Grid: 4 columns × 2 rows (`grid-cols-2 sm:grid-cols-4`) rendering 8 **Standard Product Cards** per tab.

---

## 4. Product Card Component & All Interactive States (CRITICAL)
Build a reusable `<ProductCard />` component that supports all OneTech states without causing layout shift on hover:

### Card Structure & States
1. **Base Container:**
   * ` group relative bg-white h-[285px] pt-[25px] text-center transition-shadow duration-200 hover:z-20 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-t-[5px]`
2. **Right Divider Border:**
   * `absolute top-[25px] right-0 w-[1px] h-[calc(100%-50px)] bg-[#e5e5e5] group-hover:opacity-0 transition-opacity`
3. **Top-Left Floating Status Badge (`status` prop: `'none' | 'discount' | 'new'`):**
   * Positioned `absolute top-[18px] left-[18px] w-[36px] h-[36px] rounded-full flex items-center justify-center text-xs font-medium text-white`.
   * If `'discount'`: `bg-[#df3b3b]` showing `"-25%"`.
   * If `'new'`: `bg-[#0e8ce4]` showing `"new"`.
4. **Top-Right Wishlist Heart Button (`isWishlisted` state):**
   * Positioned `absolute top-[18px] right-[18px] w-[36px] h-[36px] rounded-full bg-white shadow-[0_1px_5px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer transition-all duration-200`.
   * **Resting State (Unwishlisted):** `opacity-0 invisible group-hover:opacity-100 group-hover:visible text-[#cccccc] hover:text-[#df3b3b]`.
   * **Active/Clicked State (Wishlisted):** `opacity-100 visible text-[#df3b3b]` (persists even when not hovering).
5. **Thumbnail Stage:**
   * `h-[140px] flex items-center justify-center px-4` containing `w-[115px] h-[115px] object-contain`.
6. **Price & Title Stack:**
   * **Price:** `mt-3 text-base font-medium`. If `status === 'discount'`, text is `text-[#df3b3b]` with an inline strikethrough original price `<span class="text-xs font-normal text-black/50 line-through ml-2">$300</span>`. Otherwise, text is `text-black`.
   * **Product Name:** `mt-1 text-sm font-normal text-black hover:text-[#0e8ce4] transition-colors truncate px-3`.
7. **Hover-Reveal Expandable Action Drawer (`.product_extras`):**
   * Positioned `absolute left-0 top-full w-full bg-white pt-3 shadow-[0_15px_25px_rgba(0,0,0,0.1)] rounded-b-[5px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20`.
   * **Color Swatch Radio Dots:** 3 circular color selectors (`#b19c83`, `#000000`, `#999999`), `w-3.5 h-3.5 rounded-full cursor-pointer ring-offset-2` where the selected color shows an active ring.
   * **Full-Width Add to Cart CTA:** `mt-3 w-full h-[44px] bg-[#0e8ce4] hover:bg-[#0e8ce4]/80 text-white text-base font-normal rounded-b-[5px] transition-colors cursor-pointer`.

---

## 5. Additional Mid & Lower Page Sections
Include the remaining OneTech sections below the main fold:
1. **Popular Categories:** Left header column ("Popular Categories" + "Full Catalog" link) + 5 horizontal category cards with icon/thumbnail and title (*Smartphones & Tablets, Computers & Laptops, Gadgets, Video Games & Consoles, Accessories*).
2. **Mid-Page Full-Width Promo Banner:** Soft blue/gray background featuring a MacBook Air / Laptop spotlight, category tag, title, star rating, and `Explore` link.
3. **Hot New Arrivals:** Section header + category filter tabs (`Featured`, `Audio & Video`, `Laptops & Computers`) + 8-card grid + a featured tall promo card on the right.
4. **Best Sellers (Horizontal Media Cards):** `bg-[#eff6fa] py-14` section with 3 tabs (`Top 20`, `Audio & Video`, `Laptops & Computers`) displaying 2-column horizontal product cards (thumbnail on left, category, title, 5-star rating, and red/black price on right).
5. **Trends Carousel & Recently Viewed Strip:** Compact square cards with `-25%` / `new` circular badges and persistent heart buttons.
6. **Newsletter Subscription Bar:** Full-width bar with paper-plane icon, `"Sign up for Newsletter"` + `"…and receive %20 coupon for first shopping."`, email input, and `#0e8ce4` `"Subscribe"` button.
7. **Footer:** 4-column layout (Logo + 24/7 phone + address + social icons | *Find it Fast* links | *Customer Care* links) + bottom copyright and payment method badges (Visa, Mastercard, PayPal).

---

## 6. Interactive & Quality Requirements
* Make all tabs (*Featured / On Sale / Best Rated*, *Hot New Arrivals*, *Best Sellers*) interactive with realistic electronics product data and high-quality transparent/clean product imagery (use reliable Unsplash/Pexels tech gadget URLs or clean SVG/canvas product placeholders).
* Ensure clicking the Heart icon on any product card toggles its active red state and increments/decrements the Header Wishlist counter (`115`).
* Ensure clicking `"Add to Cart"` increments the Header Cart badge (`10`) and updates the cart total (`$85`).
* Ensure the `"Deals of the Week"` countdown timer ticks down every second.