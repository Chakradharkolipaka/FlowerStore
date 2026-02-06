import { Link } from 'react-router-dom';
import { useCart } from '../state/useCart.js';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Cart() {
  const { items, total, addToCart, decrement, removeFromCart } = useCart();

  return (
    <div className="container py-4">
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div>
          <h2 className="mb-1">Your Cart</h2>
          <div className="text-muted">Review items and adjust quantities.</div>
        </div>

        <div className="text-end ms-auto">
          <div className="text-muted">Total</div>
          <div className="fs-3 fw-bold">{formatINR(total)}</div>
          <Link to="/shipping" className={`btn btn-dark mt-2 ${items.length ? '' : 'disabled'}`}>
            Continue to Shipping
          </Link>
        </div>
      </div>

      <hr className="my-4" />

      {items.length === 0 ? (
        <div className="p-4 rounded-4 bg-white border shadow-sm">
          <h5 className="mb-2">Cart is empty</h5>
          <p className="text-muted mb-3">Go back to Home and add some flowers.</p>
          <Link to="/" className="btn btn-primary">
            Shop Flowers
          </Link>
        </div>
      ) : (
        <div className="vstack gap-3">
          {items.map((x) => (
            <div key={x.id} className="bg-white border rounded-4 p-3 shadow-sm">
              <div className="d-flex gap-3 flex-wrap">
                <img
                  src={x.image}
                  alt={x.title}
                  className="rounded-3"
                  style={{ width: 150, height: 100, objectFit: 'cover' }}
                  loading="lazy"
                />

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between gap-3 flex-wrap">
                    <div>
                      <h5 className="mb-1">{x.title}</h5>
                      <div className="text-muted small">Price: {formatINR(x.price)}</div>
                    </div>
                    <div className="text-end">
                      <div className="text-muted small">Item total</div>
                      <div className="fw-bold">{formatINR(x.price * x.qty)}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-2 mt-3 flex-wrap">
                    <div className="btn-group" role="group" aria-label="Quantity controls">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => decrement(x.id)}
                      >
                        −
                      </button>
                      <button type="button" className="btn btn-outline-secondary" disabled>
                        Qty: {x.qty}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => addToCart(x)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeFromCart(x.id)}
                    >
                      Remove
                    </button>

                    <Link to="/shipping" className="btn btn-success">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
