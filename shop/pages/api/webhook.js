import { buffer } from 'micro';
import getStripe from '../../lib/stripe';

// Disable default body parsing — Stripe requires the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];
    const stripe = getStripe();

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      console.log('[webhook] Payment received:', {
        id: session.id,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
      });

      // ── Add any custom fulfillment logic here ──
      // e.g., send confirmation email, update inventory, notify yourself, etc.
      break;
    }

    case 'checkout.session.expired': {
      console.log('[webhook] Session expired:', event.data.object.id);
      break;
    }

    default:
      // Ignore unhandled events
      console.log('[webhook] Unhandled event type:', event.type);
  }

  return res.status(200).json({ received: true });
}
