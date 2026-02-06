# FlowerStore (FlowerMart) — Sepolia MetaMask DApp

A monorepo containing:

- **Frontend**: Flower shopping SPA (React + Vite)
- **Smart contracts**: Sepolia payment contract (Solidity + Foundry)

Users pay on **Sepolia testnet** using **MetaMask**. Transactions are signed in the browser (no user private keys are stored in the app).

---

## 🔗 Links

- **GitHub repo**: https://github.com/Chakradharkolipaka/FlowerStore
- **Vercel deployed app**: https://flowerstore-dapp-4dvcyoocp-chakradhar-kolipakas-projects.vercel.app/
- **Contract on Sepolia (Etherscan)**: https://sepolia.etherscan.io/address/0xb7b43c3e5926ef2329f95dcc8dd5dcfe103007e4

---

## 📁 Repo structure

- `FlowerStores/` — Frontend (Vite + React)
	- checkout page triggers MetaMask transaction
	- includes SPA routing config for Vercel
- `contracts/` — Smart contracts (Foundry)
	- Solidity contract + tests + deploy script

---

## ✅ What this project does (features)

- Browse a catalog of flowers (Home)
- Add/remove items from cart (Cart)
- Checkout with **MetaMask on Sepolia** (Checkout)
- "NFT-like uniqueness": after successful payment, purchased items are removed from the catalog in the current session

---

## 🧱 Tech stack

### Frontend

- React + Vite
- React Router
- Bootstrap + Tailwind
- `ethers` (MetaMask integration)

### Smart contracts

- Solidity `^0.8.24`
- Foundry (forge/cast)
- Sepolia testnet (chainId `11155111`)

---

## 🚀 Deployment / running

Use the single guide: **`DEPLOYMENT_GUIDE.md`**

It includes:

- deploying the contract to Sepolia
- updating frontend config with the deployed address
- Vercel deploy settings (Root Directory = `FlowerStores`)
- post-deploy verification checklist

---

## 📚 More docs

- Frontend details: `FlowerStores/README.md`
- Contract details + tests + coverage: `contracts/README.md`
- Wallet flow (short): `WALLET_FLOW_EXPLAINED.md`


