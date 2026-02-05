import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../state/useCart.js';
import { useCatalog } from '../state/useCatalog.js';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Shipping() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { removeFromCatalogByIds } = useCatalog();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const canSubmit = useMemo(() => {
    if (items.length === 0) return false;
    return (
      form.name.trim() &&
      form.phone.trim() &&
      form.address.trim() &&
      form.city.trim() &&
      form.pincode.trim()
    );
  }, [form, items.length]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onPlaceOrder = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Frontend-only demo:
    // 1) Remove purchased items from the landing page catalog (unique/NFT-like items)
    // 2) Clear cart
    const purchasedIds = items.map((x) => x.id);
    removeFromCatalogByIds(purchasedIds);
    clearCart();
    navigate('/', { replace: true });
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div>
          <h2 className="mb-1">Shipping</h2>
          <div className="text-muted">Enter delivery details (frontend-only demo).</div>
        </div>

        <div className="text-end ms-auto">
          <div className="text-muted">Payable</div>
          <div className="fs-3 fw-bold">{formatINR(total)}</div>
          <Link to="/cart" className="btn btn-outline-secondary mt-2">
            Back to Cart
          </Link>
        </div>
      </div>

      <hr className="my-4" />

      {items.length === 0 ? (
        <div className="p-4 rounded-4 bg-white border shadow-sm">
          <h5 className="mb-2">Nothing to ship</h5>
          <p className="text-muted mb-3">Add items to your cart first.</p>
          <Link to="/" className="btn btn-primary">
            Shop Flowers
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <form onSubmit={onPlaceOrder} className="bg-white border shadow-sm rounded-4 p-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="10-digit number"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Pincode</label>
                  <input
                    className="form-control"
                    name="pincode"
                    value={form.pincode}
                    onChange={onChange}
                    placeholder="e.g. 500081"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    rows={3}
                    placeholder="House no, street, landmark"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">City</label>
                  <input
                    className="form-control"
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    placeholder="Hyderabad"
                    required
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2">
                  <button
                    type="submit"
                    className={`btn btn-success ${canSubmit ? '' : 'disabled'}`}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </form>
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
                  <div className="fw-bold">Total</div>
                  <div className="fw-bold">{formatINR(total)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
