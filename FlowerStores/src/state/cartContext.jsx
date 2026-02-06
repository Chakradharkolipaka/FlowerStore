import React, { createContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

/**
 * Cart item shape:
 * { id, title, price, image, qty }
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const decrement = (id) => {
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0),
    );
  };

  const clearCart = () => setItems([]);

  const count = useMemo(
    () => items.reduce((sum, x) => sum + x.qty, 0),
    [items],
  );

  const total = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, decrement, clearCart, total, count }),
    [items, total, count],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
