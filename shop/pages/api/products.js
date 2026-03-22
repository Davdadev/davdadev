import getStripe from '../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    return res.status(200).json({ products });
  } catch (err) {
    console.error('[/api/products] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
