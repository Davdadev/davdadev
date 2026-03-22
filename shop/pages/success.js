import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setConfetti(true);
  }, []);

  return (
    <>
      <Head>
        <title>Order Confirmed!</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-3">
            Order Confirmed! 🎉
          </h1>

          <p className="text-slate-400 text-lg mb-2">
            Thank you for your purchase!
          </p>
          <p className="text-slate-500 text-sm mb-8">
            A confirmation email has been sent to you. Your fidget will be on its way soon.
          </p>

          {session_id && (
            <p className="text-xs text-slate-600 mb-8 font-mono break-all">
              Order ref: {session_id}
            </p>
          )}

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
