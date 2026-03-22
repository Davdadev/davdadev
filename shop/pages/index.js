import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Head from 'next/head';
import getStripe from '../lib/stripe';

export default function Home({ products, error }) {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Dave's 3D Fidgets";
  const storeDescription = process.env.NEXT_PUBLIC_STORE_DESCRIPTION || 'Premium 3D Printed Fidget Toys';

  return (
    <>
      <Head>
        <title>{storeName}</title>
        <meta name="description" content={storeDescription} />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-24 px-4 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-sky-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                Handcrafted &amp; 3D Printed
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                Premium{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                  3D Fidgets
                </span>
              </h1>

              <p className="text-xl text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto">
                Each piece is designed and printed by hand. Satisfying to hold, impossible to put down.
              </p>

              <a
                href="#products"
                className="btn-primary inline-flex items-center gap-2 glow-pulse text-base px-8 py-4"
              >
                <span>Shop Now</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </section>

          {/* Products Section */}
          <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="section-title">Our Products</h2>
                <p className="text-slate-400 mt-1">
                  {products.length > 0
                    ? `${products.length} item${products.length !== 1 ? 's' : ''} available`
                    : 'Stocking up — check back soon!'}
                </p>
              </div>

              {products.length > 0 && (
                <span className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Secure checkout via Stripe
                </span>
              )}
            </div>

            {error ? (
              <div className="card p-8 text-center">
                <span className="text-4xl mb-4 block">⚠️</span>
                <h3 className="text-white font-semibold text-lg mb-2">Could not load products</h3>
                <p className="text-slate-400 text-sm">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="card p-12 text-center">
                <span className="text-6xl mb-6 block float">🖨️</span>
                <h3 className="text-white font-semibold text-xl mb-2">No products yet</h3>
                <p className="text-slate-400 mb-6">
                  Add products in your{' '}
                  <a
                    href="https://dashboard.stripe.com/products"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Stripe Dashboard
                  </a>{' '}
                  and they'll appear here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* About Section */}
          <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-indigo-900/20">
            <div className="max-w-2xl">
              <h2 className="section-title mb-6">About</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Every fidget toy is designed with precision, printed with premium filaments, and finished by hand. 
                Whether you're looking to focus, relieve stress, or just enjoy the satisfying click of a well-made mechanism —
                you're in the right place.
              </p>
              <p className="text-slate-400 leading-relaxed">
                All orders are processed securely through Stripe. You'll get an email confirmation after your purchase.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-indigo-900/20 py-8 px-4 text-center text-slate-500 text-sm">
          <p>
            © {new Date().getFullYear()} {storeName} · Secure payments by{' '}
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Stripe
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return { props: { products: data.products || [], error: null } };
  } catch (err) {
    // Fall back to direct Stripe call on server
    try {
      const stripe = getStripe();
      const stripeProducts = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
        limit: 100,
      });

      const products = stripeProducts.data
        .filter((p) => p.default_price && p.default_price.active)
        .map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          images: p.images,
          metadata: p.metadata,
          price: p.default_price
            ? {
                id: p.default_price.id,
                unit_amount: p.default_price.unit_amount,
                currency: p.default_price.currency,
              }
            : null,
        }));

      return { props: { products, error: null } };
    } catch (stripeErr) {
      console.error('Stripe error:', stripeErr.message);
      return {
        props: {
          products: [],
          error: 'Unable to load products. Please check your Stripe configuration.',
        },
      };
    }
  }
}
