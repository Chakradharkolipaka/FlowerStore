// Web3 configuration for FlowerStore
// Update CONTRACT_ADDRESS after deploying to Sepolia

export const CONFIG = {
  // TODO: Update this after deploying the contract to Sepolia
  CONTRACT_ADDRESS: '0xb7b43c3E5926eF2329f95Dcc8dd5dCFe103007e4', // Replace with actual deployed address
  
  // Sepolia testnet chain ID
  CHAIN_ID: 11155111,
  CHAIN_NAME: 'Sepolia',
  
  // Payment amount in ETH
  PAYMENT_AMOUNT: '0.000001', // 0.000001 ETH per flower
  
  // Owner address (receives payments)
  OWNER_ADDRESS: '0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E',
};

// Sepolia network configuration for MetaMask
export const SEPOLIA_NETWORK = {
  chainId: `0x${CONFIG.CHAIN_ID.toString(16)}`,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};
