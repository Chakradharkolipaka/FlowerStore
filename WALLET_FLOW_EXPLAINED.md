# FlowerStore - Wallet Flow Explained

## 🎯 Two Separate Wallet Uses

### 1️⃣ Contract Deployment (One-Time, Developer Only)

```
┌─────────────────────────────────────┐
│  Developer (You)                    │
│  ├─ Wallet with Sepolia ETH        │
│  └─ Private Key in contracts/.env  │ ← ONLY for deployment
└────────────┬────────────────────────┘
             │
             │ Deploy contract
             ▼
     ┌───────────────┐
     │   Sepolia     │
     │  Blockchain   │
     └───────────────┘
```

**Files Used**:
- `contracts/.env` (YOUR private key)
- `contracts/script/DeployFlowerPayment.s.sol`

**Command**:
```bash
forge script script/DeployFlowerPayment.s.sol --broadcast
```

---

### 2️⃣ User Payments (Every Purchase, Any User)

```
┌─────────────────────────────────────┐
│  User 1 (Alice)                     │
│  └─ MetaMask in browser             │ ← Her own wallet
└────────────┬────────────────────────┘
             │
             │ Connects via MetaMask UI
             ▼
     ┌───────────────┐
     │  Your React   │
     │     App       │ ← NO private keys!
     │  (Frontend)   │    Only public address
     └───────┬───────┘
             │
             │ User clicks "Pay"
             ▼
     ┌───────────────┐
     │   MetaMask    │ ← User signs transaction
     │  Popup/Modal  │    Private key stays here
     └───────┬───────┘
             │
             │ Signed transaction
             ▼
     ┌───────────────┐
     │   Sepolia     │
     │  Blockchain   │
     └───────┬───────┘
        ## Wallet flow (short)

        FlowerStore uses **MetaMask** for payments on **Sepolia**.

        ### 1) Contract deployment (developer only, one-time)

        - Performed from the terminal using Foundry.
        - Uses a deployer private key stored in `contracts/.env` (git-ignored).

        ### 2) User payments (every checkout)

        - Happens in the **browser**.
        - The frontend requests an on-chain transaction; the user signs it in **MetaMask**.
        - ETH flow: **User MetaMask → Contract → Owner** (forwarded immediately).

        ### Key files

        - Frontend wallet + payment logic: `FlowerStores/src/contracts/web3.js`
        - Checkout UI: `FlowerStores/src/pages/Shipping.jsx`
        - Contract: `contracts/src/FlowerPayment.sol`

        For deployment + verification steps, see **`DEPLOYMENT_GUIDE.md`**.
| **Wallet** | Your deployer wallet | User's MetaMask |
