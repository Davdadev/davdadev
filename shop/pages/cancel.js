import Link from 'next/link';
import Head from 'next/head';

export default function Cancel() {
  return (
    <>
      <Head>
        <title>Order Cancelled</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Cancel icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-3">
            Order Cancelled
          </h1>

          <p className="text-slate-400 text-lg mb-2">
            No worries — your cart is still waiting for you.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            You were not charged. Feel free to browse again whenever you're ready.
          </p>

          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Shop
          </Link>
        </div>
      </div>
    </>
  );
}
