import Link from 'next/link';
import type { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';

const cta = (platform: string) =>
  platform === 'shopee' ? 'BELI DI SHOPEE' : 'BELI SEKARANG';

export function ProductCard({ product }: { product: Product }) {
  const trackClick = () => {
  const supabase = createClient();

  void supabase
    .from('clicks')
    .insert({
      product_id: product.id,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    })
    .then(({ error }) => {
      if (error) {
        console.error('CLICK TRACKING ERROR:', error);
      } else {
        console.log('CLICK TRACKING SUCCESS');
      }
    });
};
  return (
    <article className="card product-card">
      <Link
        href={`/product/${product.slug}`}
        aria-label={`Lihat ${product.name}`}
      >
        <div className="product-art">
          {product.image_url ? (
            <img
              src={product.image_url}
              loading="lazy"
              alt={product.name}
            />
          ) : (
            <span className="placeholder">
              PRODUCT IMAGE
              <br />
              COMING SOON
            </span>
          )}

          {product.featured && <span className="badge">FEATURED</span>}
        </div>
      </Link>

      <div className="product-copy">
        <div className="meta">
          {product.brand} · {product.category?.name.toUpperCase()}
        </div>

        <h3>
          <Link href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        <p>{product.description}</p>

        <a
          className="button orange"
          href={product.affiliate_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
  console.log('TRACK CLICK:', product.id, product.name);
  trackClick();
}}
        >
          {cta(product.affiliate_platform)}
        </a>
      </div>
    </article>
  );
}