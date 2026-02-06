import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../state/useCart.js';
import { useCatalog } from '../state/useCatalog.js';
import {
  connectWallet,
  payForFlowers,
  getCurrentAccount,
  formatAddress,
  isMetaMaskInstalled,
  onAccountChanged,
} from '../contracts/web3.js';
import { CONFIG } from '../contracts/config.js';
import { ethers } from 'ethers';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatETH(amount) {
  return `${amount} ETH`;
}


export default function Shipping() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { removeFromCatalogByIds } = useCatalog();

  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  // Check if already connected on mount
  useEffect(() => {
    (async () => {
      const account = await getCurrentAccount();
      if (account && isMetaMaskInstalled()) {
        setWalletAddress(account);

        // Also set signer so Pay works after refresh.
        const provider = new ethers.BrowserProvider(window.ethereum);
        const s = await provider.getSigner();
        setSigner(s);
      }
    })();

    // Listen for account changes
    const cleanup = onAccountChanged(async (account) => {
      setWalletAddress(account);

      if (!account) {
        setSigner(null);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const s = await provider.getSigner();
        setSigner(s);
      } catch {
        setSigner(null);
      }
    });

    return typeof cleanup === 'function' ? cleanup : undefined;
  }, []);

  const handleConnectWallet = async () => {
    setError('');
    setConnecting(true);

    try {
      const { address, signer: walletSigner } = await connectWallet();
      setWalletAddress(address);
      setSigner(walletSigner);
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const handlePayment = async () => {
    if (!signer) {
      setError('Please connect your wallet first');
      return;
    }

    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }

    setError('');
    setPaying(true);
    setTxHash('');

    try {
      // Pay for all items (using total count)
      const result = await payForFlowers(signer, items.length);

      if (result.success) {
        setTxHash(result.hash);

        // Wait a moment to show the success message
        setTimeout(() => {
          // Remove purchased items from catalog (NFT-like uniqueness)
          const purchasedIds = items.map((x) => x.id);
          removeFromCatalogByIds(purchasedIds);
          clearCart();

          // Navigate home
          navigate('/', { replace: true });
        }, 2000);
      } else {
        setError('Payment transaction failed');
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  const ethTotal = parseFloat(CONFIG.PAYMENT_AMOUNT) * items.length;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div>
          <h2 className="mb-1">Checkout</h2>
          <div className="text-muted">Pay with MetaMask on Sepolia testnet</div>
        </div>

        <div className="text-end ms-auto">
          <div className="text-muted">Total (INR)</div>
          <div className="fs-3 fw-bold">{formatINR(total)}</div>
          <div className="text-muted small">≈ {formatETH(ethTotal.toFixed(6))}</div>
          <Link to="/cart" className="btn btn-outline-secondary mt-2">
            Back to Cart
          </Link>
        </div>
      </div>

      <hr className="my-4" />

      {items.length === 0 ? (
        <div className="p-4 rounded-4 bg-white border shadow-sm">
          <h5 className="mb-2">Nothing to checkout</h5>
          <p className="text-muted mb-3">Add items to your cart first.</p>
          <Link to="/" className="btn btn-primary">
            Shop Flowers
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="bg-white border shadow-sm rounded-4 p-4">
              <h5 className="mb-3">Payment</h5>

              {!isMetaMaskInstalled() ? (
                <div className="alert alert-warning">
                  <strong>MetaMask Required</strong>
                  <p className="mb-0 mt-2">
                    Please install{' '}
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      MetaMask
                    </a>{' '}
                    to continue.
                  </p>
                </div>
              ) : (
                <>
                  {/* Wallet Connection */}
                  {!walletAddress ? (
                    <div className="text-center py-4">
                      <p className="text-muted mb-3">Connect your wallet to proceed</p>
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={handleConnectWallet}
                        disabled={connecting}
                      >
                        {connecting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            />
                            Connecting...
                          </>
                        ) : (
                          'Connect MetaMask'
                        )}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Connected Wallet Info */}
                      <div className="alert alert-success d-flex align-items-center justify-content-between">
                        <div>
                          <strong>Wallet Connected</strong>
                          <div className="small mt-1">{formatAddress(walletAddress)}</div>
                        </div>
                        <span className="badge bg-success">Sepolia</span>
                      </div>

                      {/* Payment Details */}
                      <div className="mb-4">
                        <h6 className="mb-3">Payment Details</h6>
                        <table className="table table-sm">
                          <tbody>
                            <tr>
                              <td className="text-muted">Items</td>
                              <td className="text-end">{items.length}</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Price per item</td>
                              <td className="text-end">{CONFIG.PAYMENT_AMOUNT} ETH</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Network</td>
                              <td className="text-end">Sepolia Testnet</td>
                            </tr>
                            <tr className="fw-bold">
                              <td>Total Payment</td>
                              <td className="text-end">{ethTotal.toFixed(6)} ETH</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          <strong>Error:</strong> {error}
                        </div>
                      )}

                      {/* Success Message */}
                      {txHash && (
                        <div className="alert alert-success" role="alert">
                          <strong>Payment Successful!</strong>
                          <div className="small mt-2">
                            Transaction:{' '}
                            <a
                              href={`https://sepolia.etherscan.io/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="alert-link"
                            >
                              {formatAddress(txHash)}
                            </a>
                          </div>
                          <div className="small mt-1">Redirecting to home...</div>
                        </div>
                      )}

                      {/* Pay Button */}
                      <button
                        className="btn btn-success btn-lg w-100"
                        onClick={handlePayment}
                        disabled={paying || !!txHash}
                      >
                        {paying ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            />
                            Processing Payment...
                          </>
                        ) : txHash ? (
                          'Payment Complete ✓'
                        ) : (
                          `Pay ${ethTotal.toFixed(6)} ETH`
                        )}
                      </button>

                      <div className="text-center mt-3 small text-muted">
                        Payment will be sent to owner:{' '}
                        <code className="small">{formatAddress(CONFIG.OWNER_ADDRESS)}</code>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="bg-white border shadow-sm rounded-4 p-4">
              <h5 className="mb-3">Order Summary</h5>
              <div className="vstack gap-2">
                {items.map((x) => (
                  <div key={x.id} className="d-flex justify-content-between gap-2">
                    <div className="text-muted">
                      {x.title} <span className="text-nowrap">× {x.qty}</span>
                    </div>
                    <div className="fw-semibold text-nowrap">{formatINR(x.price * x.qty)}</div>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="d-flex justify-content-between">
                  <div className="fw-bold">Total (INR)</div>
                  <div className="fw-bold">{formatINR(total)}</div>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <div>Total (ETH)</div>
                  <div>{ethTotal.toFixed(6)} ETH</div>
                </div>
              </div>
            </div>

            <div className="alert alert-info mt-3 small">
              <strong>ℹ️ Testnet Only</strong>
              <p className="mb-0 mt-2">
                This is a demo using Sepolia testnet. Get free test ETH from{' '}
                <a
                  href="https://sepoliafaucet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alert-link"
                >
                  Sepolia Faucet
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
