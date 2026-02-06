import { ethers } from 'ethers';
import ABI from './FlowerPayment.abi.json';
import { CONFIG, SEPOLIA_NETWORK } from './config.js';

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Connect to MetaMask wallet
 * @returns {Promise<{address: string, provider: ethers.BrowserProvider, signer: ethers.Signer}>}
 */
export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Request account access
    await provider.send('eth_requestAccounts', []);
    
    // Get the signer
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    // Check if we're on Sepolia
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== CONFIG.CHAIN_ID) {
      // Try to switch to Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_NETWORK.chainId }],
        });
      } catch (switchError) {
        // Chain not added, try to add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_NETWORK],
          });
        } else {
          throw switchError;
        }
      }
    }
    
    return { address, provider, signer };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

/**
 * Get the current connected account
 * @returns {Promise<string|null>}
 */
export async function getCurrentAccount() {
  if (!isMetaMaskInstalled()) return null;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_accounts', []);
    return accounts[0] || null;
  } catch (error) {
    console.error('Failed to get current account:', error);
    return null;
  }
}

/**
 * Pay for flowers using the smart contract
 * @param {ethers.Signer} signer - The signer from MetaMask
 * @param {number} itemCount - Number of items being purchased
 * @returns {Promise<{hash: string, success: boolean}>}
 */
export async function payForFlowers(signer, itemCount = 1) {
  if (CONFIG.CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error(
      'Contract not deployed yet. Please deploy the contract first and update CONFIG.CONTRACT_ADDRESS in src/contracts/config.js'
    );
  }

  try {
    const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, ABI, signer);
    
    // Calculate total payment (per item or fixed)
    const paymentAmount = ethers.parseEther(CONFIG.PAYMENT_AMOUNT);
    const totalPayment = paymentAmount * BigInt(itemCount);
    
    console.log('Paying:', ethers.formatEther(totalPayment), 'ETH for', itemCount, 'item(s)');
    
    // Call the payForFlowers function
    const tx = await contract.payForFlowers({ value: totalPayment });
    
    console.log('Transaction sent:', tx.hash);
    console.log('Waiting for confirmation...');
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    console.log('Transaction confirmed in block:', receipt.blockNumber);
    
    return {
      hash: tx.hash,
      success: receipt.status === 1,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('Payment failed:', error);
    
    // Parse user-friendly error messages
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction was rejected by user');
    } else if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient funds in wallet');
    }
    
    throw error;
  }
}

/**
 * Get contract information
 * @returns {Promise<{owner: string, totalPayments: number}>}
 */
export async function getContractInfo() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask not installed');
  }
  
  if (CONFIG.CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    return { owner: CONFIG.OWNER_ADDRESS, totalPayments: 0 };
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, ABI, provider);
    
    const owner = await contract.owner();
    const totalPayments = await contract.totalPayments();
    
    return {
      owner,
      totalPayments: Number(totalPayments),
    };
  } catch (error) {
    console.error('Failed to get contract info:', error);
    throw error;
  }
}

/**
 * Listen for account changes
 * @param {Function} callback - Called with new account address
 */
export function onAccountChanged(callback) {
  if (!isMetaMaskInstalled()) return;
  
  window.ethereum.on('accountsChanged', (accounts) => {
    callback(accounts[0] || null);
  });

  // Return cleanup so callers can remove the listener.
  return () => {
    try {
      window.ethereum.removeListener('accountsChanged', callback);
    } catch {
      // ignore
    }
  };
}

/**
 * Listen for network changes
 * @param {Function} callback - Called with new chain ID
 */
export function onChainChanged(callback) {
  if (!isMetaMaskInstalled()) return;
  
  window.ethereum.on('chainChanged', (chainId) => {
    callback(parseInt(chainId, 16));
  });
}

/**
 * Format address for display
 * @param {string} address
 * @returns {string}
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
