## Deployment

This file is kept for backwards compatibility.

✅ Use the single consolidated guide instead: **`DEPLOYMENT_GUIDE.md`**.

It covers:
- contract deployment (Foundry) to Sepolia
- frontend configuration (Vite/React)
- Vercel deployment
- post-deploy verification checklist


## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- [Node.js](https://nodejs.org/) v18+ installed
- MetaMask browser extension
- Sepolia testnet ETH in two wallets:
  - **Deployer wallet** (for deploying the contract)
  - **Buyer wallet** (for testing payments): `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA`
- An RPC provider (Alchemy, Infura, or public RPC)

## Part 1: Deploy Smart Contract to Sepolia

### 1. Get Sepolia Test ETH

Get free Sepolia ETH for your deployer wallet from these faucets:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://sepolia-faucet.pk910.de/

You'll need at least ~0.01 ETH for deployment + gas.

### 2. Set Up Environment Variables

```bash
cd contracts
cp .env.example .env
```

Edit `.env` and add:

```bash
PRIVATE_KEY=your_deployer_private_key_without_0x
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **Security**: Never commit `.env` to git!

### 3. Test the Contract Locally

```bash
cd contracts
forge test -vv
```

All tests should pass.

### 4. Deploy to Sepolia

```bash
source .env
forge script script/DeployFlowerPayment.s.sol:DeployFlowerPayment \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

### 5. Save the Contract Address

After deployment, you'll see output like:

```
FlowerPayment deployed to: 0xABCDEF1234567890...
Owner address: 0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E
```

**Copy the contract address** — you'll need it in the next step.

### 6. Verify on Etherscan (if auto-verify failed)

```bash
forge verify-contract \
  --chain-id 11155111 \
  --watch \
  YOUR_CONTRACT_ADDRESS \
  src/FlowerPayment.sol:FlowerPayment \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address)" 0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E)
```

## Part 2: Update Frontend Configuration

### 1. Update Contract Address

Edit `FlowerStores/src/contracts/config.js`:

```javascript
export const CONFIG = {
  CONTRACT_ADDRESS: '0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE', // ← Update this!
  CHAIN_ID: 11155111,
  CHAIN_NAME: 'Sepolia',
  PAYMENT_AMOUNT: '0.000001',
  OWNER_ADDRESS: '0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E',
};
```

### 2. Build the Frontend

```bash
cd FlowerStores
npm install
npm run build
```

### 3. Test Locally

```bash
npm run dev
```

Open the app in your browser and test:
1. Add flowers to cart
2. Go to Shipping/Checkout
3. Click "Connect MetaMask"
4. Switch to Sepolia network (MetaMask will prompt)
5. Click "Pay X ETH"
6. Confirm the transaction in MetaMask

## Part 3: Deploy Frontend to Vercel

### 1. Push to GitHub

Make sure your latest changes are committed and pushed:

```bash
cd /path/to/FlowerStore
git add .
git commit -m "feat: add Web3 payment integration"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New Project"
3. Import your GitHub repository: `ChakradharKolipaka/FlowerStore`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `FlowerStores`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

### 3. Get Your Live URL

After deployment, Vercel will give you a URL like:
```
https://flowerstore-xyz123.vercel.app
```

## Part 4: Test the Deployed App

### 1. Open in Two Different Browsers

**Browser 1 (Owner):**
- Add the owner wallet to MetaMask: `0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E`
- Open Sepolia Etherscan to watch incoming payments

**Browser 2 (Buyer):**
- Add the buyer wallet to MetaMask: `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA`
- Make sure it has some Sepolia ETH

### 2. Make a Test Purchase

In Browser 2 (Buyer):
1. Go to your Vercel URL
2. Browse flowers and add to cart
3. Click "Buy Now" → go to Shipping
4. Click "Connect MetaMask"
5. Approve Sepolia network switch
6. Click "Pay X ETH"
7. Confirm transaction in MetaMask
8. Wait for confirmation

### 3. Verify Payment

In Browser 1 (Owner):
- Check the owner wallet balance increased by the payment amount
- Or check on Etherscan:
  ```
  https://sepolia.etherscan.io/address/0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E
  ```

## Troubleshooting

### "MetaMask is not installed"
Install MetaMask browser extension from https://metamask.io/download/

### "Please switch to Sepolia network"
In MetaMask, click the network dropdown and select "Sepolia Test Network". If it's not there, add it manually with these details:
- Network Name: Sepolia
- RPC URL: https://rpc.sepolia.org
- Chain ID: 11155111
- Currency Symbol: ETH
- Block Explorer: https://sepolia.etherscan.io

### "Insufficient funds"
Get more Sepolia ETH from the faucets listed above.

### "Contract not deployed yet"
Make sure you updated `CONFIG.CONTRACT_ADDRESS` in `src/contracts/config.js` and rebuilt the app.

### Transaction fails
Check:
1. You're on Sepolia network
2. You have enough ETH for gas + payment
3. The contract address is correct
4. Check contract on Etherscan for any issues

## Contract Addresses (for reference)

- **Owner (receives payments)**: `0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E`
- **Test Buyer**: `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA`
- **Contract**: Update after deployment

## Useful Links

- **Sepolia Etherscan**: https://sepolia.etherscan.io
- **Sepolia Faucet**: https://sepoliafaucet.com
- **MetaMask**: https://metamask.io
- **Vercel Docs**: https://vercel.com/docs

## Next Steps

- Share your Vercel URL
- Test from different devices/browsers
- Monitor transactions on Etherscan
- Consider adding error handling/retry logic
- Add transaction history page (optional)

---

**Need Help?** Check the contracts README for more details on the smart contract.
