FlowerMart (Frontend) 

A clean, interactive frontend-only shopping experience for flowers, built with React + Vite

☁️ Deploy
Vercel Deployment
Push your code to GitHub
Import repository in Vercel
Configure:
Root Directory: FlowerStores
Framework: Vite
Build Command: npm run build
Output Directory: dist
The included vercel.json handles client-side routing.

After Deployment
Deploy the smart contract to Sepolia (see DEPLOYMENT_GUIDE.md)
Update src/contracts/config.js with the contract address
Rebuild and redeploy the frontend
🧪 Testing
Test the Payment Flow
Open app in browser with MetaMask installed
Add flowers to cart
Go to Checkout
Click "Connect MetaMask"
Switch to Sepolia network (MetaMask will prompt)
Click "Pay X ETH"
Confirm transaction in MetaMask
View transaction on Sepolia Etherscan
Get Test ETH
Free Sepolia ETH faucets:

https://sepoliafaucet.com/
https://www.alchemy.com/faucets/ethereum-sepolia
https://sepolia-faucet.pk910.de/
📚 Documentation
Frontend: You're reading it!
Smart Contracts: ../contracts/README.md
Deployment Guide: ../DEPLOYMENT_GUIDE.md
🛠️ Tech Stack
Frontend
React 18
Vite 7
React Router DOM
Bootstrap 5
Tailwind CSS 3
ethers.js 6
Smart Contracts
Solidity ^0.8.24
Foundry (Forge, Cast, Anvil)
Sepolia Testnet
📝 Notes
This is a testnet demo using Sepolia (no real money)
NFT-like uniqueness: purchased flowers disappear after checkout
All payments go to owner wallet: 0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E
🔮 Future Enhancements
Persist cart/inventory in localStorage
Add search and filters
Transaction history page
Toast notifications
Multiple payment tokens support
Mainnet deployment (with real payments) Bootstrap + Tailwind CSS.
🎯 Objective
Build a warm, user-friendly flower store UI where users can:

Browse a catalog of flowers on the Home page
Add any flower to the cart (like a shopping app)
View totals and manage quantities in the cart
Proceed to Shipping and place an order
NFT-like uniqueness rule
This demo treats each flower card as a unique item (similar to an NFT). Once checkout is completed, purchased flowers are removed from:

The Cart, and
The Landing page inventory (Home)
So the same flower can’t be bought again after payment in this session.


FlowerStore (Smart Contracts)
Solidity contracts for FlowerStore payments, built with Foundry.

Stack used
Solidity: ^0.8.24
Tooling: Foundry (forge, cast)
Testnet: Sepolia (chainId 11155111)
Frontend signer: MetaMask + ethers (in the React app)

Contract: FlowerPayment.sol (what it does)

Accepts an ETH payment via payForFlowers() (payable)
Immediately forwards the received ETH to the owner address set at deployment
Emits an event for each payment (useful for tracking in the UI / Etherscan)
Rejects zero-value payments
Contract is non-custodial (intended to keep $0 balance after forwarding)
Where the transaction happens (from where)
The payment transaction is created by the frontend and signed in the user's MetaMask.

ETH flows: User MetaMask account → FlowerPayment contract → Owner address (forwarded in the same call).

The deployer wallet is only used once (terminal) to deploy the contract.


