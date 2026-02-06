import React, { createContext, useMemo, useState } from 'react';
import { flowers as initialFlowers } from '../data/flowers.js';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [available, setAvailable] = useState(initialFlowers);

  const removeFromCatalogByIds = (ids) => {
    const idSet = new Set(ids);
    setAvailable((prev) => prev.filter((p) => !idSet.has(p.id)));
  };

  const value = useMemo(
    () => ({ available, removeFromCatalogByIds }),
    [available],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export { CatalogContext };
