# FlowerMart (Frontend)

A clean, interactive **frontend-only** shopping experience for flowers, built with 
**React + Vite** and styled using **Bootstrap + Tailwind CSS**.

## 🎯 Objective

Build a warm, user-friendly flower store UI where users can:

- Browse a **catalog of flowers** on the Home page
- Add any flower to the cart (like a shopping app)
- View totals and manage quantities in the cart
- Proceed to Shipping and **place an order**

### NFT-like uniqueness rule

This demo treats each flower card as a unique item (similar to an NFT).
Once checkout is completed, purchased flowers are removed from:

- The **Cart**, and
- The **Landing page inventory** (Home)

So the same flower can’t be bought again after payment in this session.

## ✅ Functionalities (module-wise)

### 1) Home (`src/pages/Home.jsx`)

- Warm hero section + quote
- **Responsive card grid** (20 unique flowers)
- Each card includes:
	- Image of the actual flower
	- Title and price
	- Buy button that briefly changes color after click
	- **3D hover effect** + details overlay (scientific name, fragrance, meaning)

### 2) Cart (`src/pages/Cart.jsx`)

- Stacked, continuous list of items added to cart
- Shows:
	- Item price
	- Item total (price × qty)
	- Cart total on the top-right
- Actions:
	- Increase qty (`+`)
	- Decrease qty (`−`)
	- Remove item (deletes from UI + cart state)

### 3) Shipping (`src/pages/Shipping.jsx`)

- Basic shipping form (frontend-only)
- Order summary (right side)
- Place Order:
	- Removes purchased items from **catalog** (Home inventory)
	- Clears cart
	- Redirects back to Home

### 4) Shared Navbar (`src/components/Navbar.jsx`)

- Sticky top navigation
- Links: Home / Cart / Shipping
- Cart badge shows **live quantity count**

## 🗂️ Project structure (important folders)

```text
src/
	app/                 # App shell + router bindings
	components/          # Reusable UI building blocks
	pages/               # Screen-level pages (Home/Cart/Shipping)
	data/                # Catalog items (20 flowers)
	state/               # Context providers + hooks
	styles/              # Small global CSS
```

## 🚀 Run locally

```bash
npm install
npm run dev
```

## ☁️ Deploy to Vercel

This repo includes `vercel.json` with a rewrite rule so client-side routing works:

- Refreshing `/cart` or `/shipping` won’t 404.

Build settings on Vercel:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Notes / next upgrades (optional)

- Persist catalog + cart in `localStorage` so inventory stays removed on refresh.
- Add search + filters (price, fragrance, meaning).
- Add toast notifications for “Added to cart”.
