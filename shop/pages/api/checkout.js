import getStripe from '../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId } = req.body;

  if (!priceId || typeof priceId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid priceId' });
  }

  // Basic validation: Stripe price IDs start with 'price_'
  if (!priceId.startsWith('price_')) {
    return res.status(400).json({ error: 'Invalid priceId format' });
  }

  try {
    const stripe = getStripe();

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (req.headers.origin ? req.headers.origin : 'http://localhost:3000');

    // Shipping countries: set SHIPPING_COUNTRIES env var as comma-separated ISO codes, e.g. "US,CA,GB"
    const shippingCountries = process.env.SHIPPING_COUNTRIES
      ? process.env.SHIPPING_COUNTRIES.split(',').map((c) => c.trim().toUpperCase())
      : ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'BE', 'ES', 'IT', 'PT', 'SE', 'NO', 'DK', 'FI'];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      // Allow customers to change quantity
      allow_promotion_codes: true,
      // Collect shipping address
      shipping_address_collection: {
        allowed_countries: shippingCountries,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[/api/checkout] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
