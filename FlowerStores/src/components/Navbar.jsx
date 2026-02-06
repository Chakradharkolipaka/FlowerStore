import { NavLink } from 'react-router-dom';
import { useCart } from '../state/useCart.js';

function navLinkClass({ isActive }) {
  return ['nav-link', isActive ? 'active fw-semibold' : ''].join(' ');
}

export default function Navbar() {
  const { count } = useCart();

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand brand-title" to="/">
          FlowerMart
        </NavLink>

        {/* NOTE: Using non-collapsing nav so links never “disappear” due to Bootstrap collapse state. */}
        <div className="navbar-nav ms-auto gap-2 align-items-lg-center nav-right-half">
            <NavLink className={navLinkClass} to="/">
              Home
            </NavLink>

            <NavLink className={navLinkClass} to="/cart">
              Cart{' '}
              <span className="badge text-bg-primary ms-1" aria-label={`Cart items: ${count}`}>
                {count}
              </span>
            </NavLink>

            <NavLink className={navLinkClass} to="/shipping">
              Shipping
            </NavLink>
        </div>
      </div>
    </nav>
  );
}
