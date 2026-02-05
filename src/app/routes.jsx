import Home from '../pages/Home.jsx';
import Cart from '../pages/Cart.jsx';
import Shipping from '../pages/Shipping.jsx';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/cart', element: <Cart /> },
  { path: '/shipping', element: <Shipping /> },
];
