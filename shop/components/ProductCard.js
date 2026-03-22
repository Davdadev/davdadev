import { useState } from 'react';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

  const price = product.price
    ? (product.price.unit_amount / 100).toFixed(2)
    : null;

  const currency = product.price?.currency?.toUpperCase() || 'USD';

  const imageUrl = product.images?.[0] || null;

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: product.price?.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card group flex flex-col">
      {/* Product image */}
      <div className="product-image-wrapper relative aspect-square bg-slate-800/50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl select-none float">🎯</span>
          </div>
        )}

        {/* Stock badge */}
        {product.metadata?.stock && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {product.metadata.stock} left
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-lg leading-snug mb-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            {price ? (
              <span className="text-2xl font-bold text-white">
                {currency === 'USD' ? '$' : currency + ' '}
                {price}
              </span>
            ) : (
              <span className="text-slate-500 text-sm">Price unavailable</span>
            )}
          </div>

          <button
            onClick={handleBuy}
            disabled={loading || !product.price?.id}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Loading…</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Buy Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
