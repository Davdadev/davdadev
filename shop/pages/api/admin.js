import getStripe from '../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin password
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not configured' });
  }

  if (!token || token !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const stripe = getStripe();

    // Fetch last 50 completed checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 50,
      expand: ['data.line_items'],
    });

    // Fetch products
    const productsRes = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
      limit: 100,
    });

    // Calculate basic stats
    const completedSessions = sessions.data.filter((s) => s.payment_status === 'paid');
    const totalRevenue = completedSessions.reduce((sum, s) => sum + (s.amount_total || 0), 0);

    const orders = completedSessions.map((s) => ({
      id: s.id,
      created: s.created,
      customer_email: s.customer_details?.email || 'Unknown',
      customer_name: s.customer_details?.name || 'Unknown',
      amount_total: s.amount_total,
      currency: s.currency,
      status: s.payment_status,
      items: s.line_items?.data?.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        amount: item.amount_total,
      })) || [],
    }));

    const products = productsRes.data.map((p) => ({
      id: p.id,
      name: p.name,
      active: p.active,
      price: p.default_price
        ? {
            unit_amount: p.default_price.unit_amount,
            currency: p.default_price.currency,
          }
        : null,
      images: p.images,
    }));

    return res.status(200).json({
      stats: {
        totalOrders: completedSessions.length,
        totalRevenue,
        currency: completedSessions[0]?.currency || 'usd',
        totalProducts: productsRes.data.length,
      },
      orders,
      products,
    });
  } catch (err) {
    console.error('[/api/admin] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
