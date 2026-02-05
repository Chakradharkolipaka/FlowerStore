import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../state/useCart.js';

const FALLBACK_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Iconic_image_of_a_flower.svg/512px-Iconic_image_of_a_flower.svg.png';

export default function FlowerCard({ flower }) {
  const { addToCart, items } = useCart();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => flower.image);

  const qtyInCart = useMemo(() => {
    const found = items.find((x) => x.id === flower.id);
    return found?.qty ?? 0;
  }, [items, flower.id]);

  const onBuy = () => {
    addToCart(flower);
    setClicked(true);
  };

  useEffect(() => {
    if (!clicked) return;
    const t = setTimeout(() => setClicked(false), 650);
    return () => clearTimeout(t);
  }, [clicked]);

  // Intentionally no effect to sync imgSrc; using `key` on <img> to remount per flower.

  return (
    <div
      className="bg-white rounded-3 shadow-sm overflow-hidden border transition-transform duration-200 hover:shadow-lg"
      style={{
        transform: hovered
          ? 'translateY(-4px) perspective(900px) rotateX(3deg) rotateY(-3deg)'
          : 'translateY(0px) perspective(900px) rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        boxShadow: hovered
          ? '0 18px 45px rgba(0,0,0,0.45)'
          : '0 4px 12px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <img
          key={flower.id}
          src={imgSrc}
          alt={flower.title}
          className="w-full object-cover"
          style={{ height: 176 }}
          loading="lazy"
          onError={() => setImgSrc(FALLBACK_IMG)}
        />

        {/* Description overlay (always visible) */}
        <div className="absolute top-0 start-0 end-0 p-2">
          <div className="rounded-3 px-2 py-1 text-white"
               style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
            <div className="small fw-semibold">{flower.title}</div>
            <div className="text-xs opacity-90">
              {flower.meaning}
            </div>
          </div>
        </div>

        {qtyInCart > 0 ? (
          <span className="absolute top-2 left-2 badge text-bg-dark opacity-90">
            In cart: {qtyInCart}
          </span>
        ) : null}
      </div>

      <div className="p-3">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div>
            <h5 className="mb-1">{flower.title}</h5>
            <div className="text-muted small">Fresh • Same-day delivery</div>
            <div className="mt-2 d-flex flex-wrap gap-2 align-items-center">
              <span className="badge text-bg-warning text-dark">
                ★ {flower.rating}
              </span>
              <span className="badge text-bg-light border text-dark">
                📍 {flower.origin}
              </span>
            </div>
          </div>

          <div className="text-end">
            <div className="fw-bold">₹{flower.price}</div>
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <span className="text-sm text-gray-600">Inclusive of taxes</span>

          <button
            type="button"
            onClick={onBuy}
            className={[
              'btn',
              clicked ? 'btn-success' : 'btn-primary',
              'px-3',
              'transition-colors',
              'duration-200',
            ].join(' ')}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
