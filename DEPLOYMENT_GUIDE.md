# FlowerStore — Deployment Guide (Sepolia + Vercel)

This repo has two parts:

- **Smart contracts** (Foundry) in `contracts/`
- **Frontend** (Vite + React) in `FlowerStores/`

The app takes payment on **Sepolia testnet** using **MetaMask**. Users sign transactions in their browser; your app never stores user private keys.

---

## Stack

- **Frontend**: React + Vite, React Router
- **Web3 client**: `ethers` (MetaMask via `window.ethereum`)
- **Smart contracts**: Solidity `^0.8.24`
- **Contract tooling**: Foundry (forge/cast)
- **Target testnet**: Sepolia (chainId `11155111`)
- **Frontend hosting**: Vercel

---

## How transactions work (important)

There are **two wallet contexts**:

1) **Developer deployer wallet** (one-time)
- Used only in the terminal to deploy the contract.
- Private key is stored in `contracts/.env` (git-ignored).

2) **User wallet (MetaMask)** (every purchase)
- Used in the browser.
- The **transaction is created by the frontend** and **signed inside MetaMask**.
- ETH moves **from the user’s MetaMask account → your owner wallet**.

---

## Part A — Deploy the smart contract (contracts/)

### A1) Prerequisites

- Foundry installed
- RPC URL for Sepolia (Alchemy/Infura/etc.)
- Sepolia ETH in the deployer wallet (for gas)
- (Optional) Etherscan API key for verification

### A2) Configure env

In `contracts/`:

- Copy the template
- Fill in your values

**Expected keys**:
- `PRIVATE_KEY`
- `SEPOLIA_RPC_URL`
- `ETHERSCAN_API_KEY` (optional but recommended)

Notes:
- Keep `.env` **uncommitted** (already ignored by git).
- Use the format expected by your deploy script (this repo’s deploy has already been used successfully).

### A3) Run tests (recommended before deploy)

Run Foundry tests to confirm everything is green.

### A4) Deploy and (optionally) verify

Deploy using the provided script:
- `contracts/script/DeployFlowerPayment.s.sol`

After deployment, you’ll get a **contract address**.

### A5) Post-deploy verification checklist

Use Sepolia Etherscan + optional `cast` checks:

- Contract exists on-chain at the deployed address
- Contract verified (recommended)
- `owner()` returns the expected owner address
- `getBalance()` is `0` (contract forwards ETH immediately)

---

## Part B — Point the frontend at the deployed contract (FlowerStores/)

### B1) Update contract address

Edit: `FlowerStores/src/contracts/config.js`

Set:
- `CONFIG.CONTRACT_ADDRESS = "0x..."` (your deployed address)

### B2) Build and run locally

Install deps and build from `FlowerStores/`.

### B3) Manual test checklist (local)

- Add items to cart
- Go to Checkout
- Click **Connect MetaMask**
- Ensure MetaMask is on **Sepolia** (the app requests a switch)
- Click **Pay**
- Confirm tx in MetaMask
- See a tx hash + Etherscan link
- After success: cart clears and purchased items are removed from catalog

---

## Part C — Deploy frontend to Vercel

Vercel settings (important for this repo layout):

- **Root Directory**: `FlowerStores`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

After deploy, repeat the same Checkout flow on the deployed URL.

---

## Troubleshooting

### MetaMask not detected
- Install MetaMask and refresh the page.

### Wrong network
- Switch to **Sepolia** in MetaMask.

### “Please connect your wallet first”
- Click **Connect MetaMask**.
- If you refreshed after connecting, the app should still restore the signer; if not, reconnect.

### Transaction fails / reverted
Check:
- You’re on Sepolia
- You have enough Sepolia ETH for payment + gas
- `CONFIG.CONTRACT_ADDRESS` is correct
- Contract is deployed and reachable on Sepolia

---

## Key files

- Contract: `contracts/src/FlowerPayment.sol`
- Tests: `contracts/test/FlowerPayment.t.sol`
- Deploy script: `contracts/script/DeployFlowerPayment.s.sol`
- Frontend web3 helpers: `FlowerStores/src/contracts/web3.js`
- Frontend config: `FlowerStores/src/contracts/config.js`
- Checkout page: `FlowerStores/src/pages/Shipping.jsx`
