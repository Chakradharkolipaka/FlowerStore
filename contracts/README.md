## FlowerStore Smart Contracts

Solidity contracts for FlowerStore payments, built with **Foundry**.

### Stack used

- **Solidity**: `^0.8.24`
- **Tooling**: Foundry (`forge`, `cast`)
- **Testnet**: **Sepolia** (chainId `11155111`)
- **Frontend signer**: MetaMask + `ethers` (in the React app)

---

## Contract: `FlowerPayment.sol` (what it does)

- Accepts an ETH payment via `payForFlowers()` (payable)
- **Immediately forwards** the received ETH to the **owner** address set at deployment
- Emits an event for each payment (useful for tracking in the UI / Etherscan)
- Rejects zero-value payments
- Contract is **non-custodial** (intended to keep $0 balance after forwarding)

### Where the transaction happens (from where)

- The payment transaction is created by the **frontend** and signed in the user's **MetaMask**.
- ETH flows: **User MetaMask account → FlowerPayment contract → Owner address** (forwarded in the same call).
- The deployer wallet is **only** used once (terminal) to deploy the contract.

---

## Tested things

Tests live in `test/FlowerPayment.t.sol` and cover:

- Payment forwards ETH to owner
- Zero-value payments revert
- Multiple payments increment tracking (`totalPayments()`)
- Basic fuzzing around different payment amounts

Run tests:

```bash
cd contracts
forge test -vv
```

### Coverage (forge coverage)

Latest `forge coverage` summary:

```
----------------------------------+-----------------+----------------+---------------+---------------|
| script/DeployFlowerPayment.s.sol | 0.00% (0/10)    | 0.00% (0/11)   | 100.00% (0/0) | 0.00% (0/1)   |
----------------------------------+-----------------+----------------+---------------+---------------|
| src/FlowerPayment.sol            | 100.00% (17/17) | 88.89% (16/18) | 66.67% (4/6)  | 100.00% (4/4) |
|----------------------------------+-----------------+----------------+---------------+---------------|
| Total                            | 62.96% (17/27)  | 55.17% (16/29) | 66.67% (4/6)  | 80.00% (4/5)  |
```

---

## Deploy (Sepolia)

See the repo-level guide: `DEPLOYMENT_GUIDE.md`.

Quick reminder:

- Deployment uses `contracts/script/DeployFlowerPayment.s.sol`
- Deployment env lives in `contracts/.env` (git-ignored)

---

## Post-deploy checks (recommended)

After deploying to Sepolia, verify these:

1. **Contract address exists** on Sepolia (view it on Sepolia Etherscan)
2. `owner()` returns the expected owner address
3. `getBalance()` is `0` (or near 0, depending on edge cases) because funds are forwarded
4. A test payment from the UI produces a tx hash and shows on Etherscan

Optional `cast` checks:

```bash
cast call <CONTRACT_ADDRESS> "owner()" --rpc-url $SEPOLIA_RPC_URL
cast call <CONTRACT_ADDRESS> "getBalance()" --rpc-url $SEPOLIA_RPC_URL
cast call <CONTRACT_ADDRESS> "totalPayments()" --rpc-url $SEPOLIA_RPC_URL
```

