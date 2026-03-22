import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Dave's 3D Fidgets";

  return (
    <>
      <Head>
        <title>{storeName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={process.env.NEXT_PUBLIC_STORE_DESCRIPTION || 'Premium 3D Printed Fidget Toys'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
