import { useContext } from 'react';
import { CatalogContext } from './catalogContext.jsx';

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
