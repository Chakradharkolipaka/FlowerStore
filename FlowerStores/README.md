# FlowerMart (Frontend)

A clean, interactive **frontend-only** shopping experience for flowers, built with 
**React + Vite**
## ☁️ Deploy

### Vercel Deployment

1. Push your code to GitHub
2. Import repository in Vercel
3. Configure:
   - **Root Directory**: `FlowerStores`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

The included `vercel.json` handles client-side routing.

### After Deployment

1. Deploy the smart contract to Sepolia (see [`DEPLOYMENT_GUIDE.md`](../DEPLOYMENT_GUIDE.md))
2. Update `src/contracts/config.js` with the contract address
3. Rebuild and redeploy the frontend

## 🧪 Testing

### Test the Payment Flow

1. Open app in browser with MetaMask installed
2. Add flowers to cart
3. Go to Checkout
4. Click "Connect MetaMask"
5. Switch to Sepolia network (MetaMask will prompt)
6. Click "Pay X ETH"
7. Confirm transaction in MetaMask
8. View transaction on [Sepolia Etherscan](https://sepolia.etherscan.io)

### Get Test ETH

Free Sepolia ETH faucets:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://sepolia-faucet.pk910.de/

## 📚 Documentation

- **Frontend**: You're reading it!
- **Smart Contracts**: [`../contracts/README.md`](../contracts/README.md)
- **Deployment Guide**: [`../DEPLOYMENT_GUIDE.md`](../DEPLOYMENT_GUIDE.md)

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite 7
- React Router DOM
- Bootstrap 5
- Tailwind CSS 3
- ethers.js 6

### Smart Contracts
- Solidity ^0.8.24
- Foundry (Forge, Cast, Anvil)
- Sepolia Testnet

## 📝 Notes

- This is a **testnet demo** using Sepolia (no real money)
- NFT-like uniqueness: purchased flowers disappear after checkout
- All payments go to owner wallet: `0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E`

## 🔮 Future Enhancements

- Persist cart/inventory in localStorage
- Add search and filters
- Transaction history page
- Toast notifications
- Multiple payment tokens support
- Mainnet deployment (with real payments) **Bootstrap + Tailwind CSS**.

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

### 3) Checkout (`src/pages/Shipping.jsx`)

- **Connect MetaMask** wallet button
- Automatically switches to Sepolia testnet
- Shows payment details (total in ETH)
- **Pay with MetaMask** button
- Transaction confirmation with Etherscan link
- After successful payment:
	- Removes purchased items from **catalog** (Home inventory)
	- Clears cart
	- Redirects back to Home

### 4) Shared Navbar (`src/components/Navbar.jsx`)

- Sticky top navigation
- Links: Home / Cart / Shipping
- Cart badge shows **live quantity count**

## 🗂️ Project structure

```text
src/
	app/                 # App shell + router
	components/          # Reusable UI components
	pages/               # Home, Cart, Checkout pages
	data/                # Flower catalog (20 items)
	state/               # React Context (cart + catalog)
	contracts/           # Web3 utilities + ABI
	styles/              # Global CSS
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Sepolia testnet ETH (from faucet)

### Run Locally

```bash
cd FlowerStores
npm install
npm run dev
```

Open http://localhost:5173

### Build for Production

```bash
npm run build
```

## 🔐 Smart Contract Integration

This app uses a Solidity smart contract deployed on Sepolia for payments.

**Contract details:**
- Location: `../contracts/src/FlowerPayment.sol`
- Framework: Foundry
- Tests: `../contracts/test/FlowerPayment.t.sol`

See [`../contracts/README.md`](../contracts/README.md) for contract documentation and [`../DEPLOYMENT_GUIDE.md`](../DEPLOYMENT_GUIDE.md) for full deployment instructions.

### Update Contract Address

After deploying the contract, update `src/contracts/config.js`:

```javascript
export const CONFIG = {
  CONTRACT_ADDRESS: '0xYourDeployedContractAddress',
  // ... other config
};
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
