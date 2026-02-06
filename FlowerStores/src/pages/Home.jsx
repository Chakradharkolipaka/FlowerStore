import FlowerCard from '../components/FlowerCard.jsx';
import { useCatalog } from '../state/useCatalog.js';

export default function Home() {
  const { available } = useCatalog();

  return (
    <div className="container py-4">
      <div className="p-4 rounded-4 shadow-sm mb-4 hero-surface">
        <h1 className="mb-1">Warm & Fresh Flowers</h1>
        <p className="mb-0 text-muted">
          “Even in the same soil, each flower writes a different story.”
        </p>
      </div>

      <div className="row g-3">
        {available.map((f) => (
          <div key={f.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <FlowerCard flower={f} />
          </div>
        ))}
      </div>
    </div>
  );
}
