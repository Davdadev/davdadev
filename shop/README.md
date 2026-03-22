# 🖨️ Dave's 3D Fidget Shop

A clean, modern online shop for your 3D-printed fidget toys — powered by **Stripe** and deployable to **Vercel** in minutes with zero coding required.

---

## ✨ Features

- **Auto-synced catalog** — Add/edit/remove products directly in Stripe, they appear in your shop instantly
- **Secure payments** — All payments handled by Stripe Checkout (no card data ever touches your server)
- **Admin dashboard** — View all orders, revenue stats, and products at `/admin`
- **Shipping collection** — Automatically collects customer shipping address at checkout
- **Mobile friendly** — Looks great on phones, tablets, and desktops
- **Dark, modern design** — Clean tech aesthetic perfect for 3D printing

---

## 🚀 Deploy to Vercel (5 minutes, no coding needed)

### Step 1 — Fork this repo

Click the **Fork** button at the top of this GitHub page to copy it to your account.

### Step 2 — Create a Vercel account

Go to [vercel.com](https://vercel.com) and sign up for free with your GitHub account.

### Step 3 — Import your repo

1. In Vercel, click **"Add New… → Project"**
2. Find and select your forked repository
3. Click **"Deploy"** — Vercel will try to deploy (it will fail without env vars, that's OK)

### Step 4 — Set your environment variables

In your Vercel project, go to **Settings → Environment Variables** and add:

| Name | Value | Where to get it |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | See Step 5 below |
| `ADMIN_PASSWORD` | *your chosen password* | Make up any password you want |
| `NEXT_PUBLIC_STORE_NAME` | `Dave's 3D Fidgets` | Customize to your liking |
| `NEXT_PUBLIC_STORE_DESCRIPTION` | `Premium 3D Printed Fidget Toys` | Customize |
| `NEXT_PUBLIC_BASE_URL` | `https://your-project.vercel.app` | Your Vercel deployment URL |

After adding them, click **"Redeploy"** in Vercel.

### Step 5 — Set up the Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Set the URL to: `https://YOUR-DOMAIN.vercel.app/api/webhook`
4. Under "Events to listen to", add: `checkout.session.completed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`) and paste it as `STRIPE_WEBHOOK_SECRET` in Vercel

---

## 🛍️ Adding Products

1. Go to your [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Click **"+ Add product"**
3. Enter:
   - **Name** — e.g. "Infinity Cube"
   - **Description** — What makes it special
   - **Price** — One-time price
   - **Image** — Upload a photo of your fidget
4. Click **"Save product"**

Your product appears on your shop **immediately** — no restart needed!

---

## 🔐 Admin Dashboard

Visit `https://your-shop.vercel.app/admin` and log in with your `ADMIN_PASSWORD`.

You can:
- View all orders with customer details and amounts
- See all products with their prices
- Click any product to edit it directly in Stripe
- See revenue stats

---

## 🧪 Testing Before Going Live

Use Stripe's test mode to try everything out:
1. In Stripe, make sure you're in **Test mode** (toggle in the top-right)
2. Use test key `sk_test_...` in your env vars during testing
3. Test card number: `4242 4242 4242 4242` (any future date, any CVV)
4. Switch to live keys (`sk_live_...`) when ready to accept real payments

---

## 🗂 Project Structure

```
shop/
├── pages/
│   ├── index.js          ← Main shop / product catalog
│   ├── success.js        ← Payment success page
│   ├── cancel.js         ← Payment cancelled page
│   ├── admin/
│   │   └── index.js      ← Admin dashboard (password protected)
│   └── api/
│       ├── products.js   ← Fetch products from Stripe
│       ├── checkout.js   ← Create Stripe Checkout session
│       ├── webhook.js    ← Handle Stripe payment events
│       └── admin.js      ← Admin data API (password protected)
├── components/
│   ├── Navbar.js
│   └── ProductCard.js
├── lib/
│   └── stripe.js         ← Stripe client setup
├── styles/
│   └── globals.css       ← Global styles (Tailwind + custom)
└── .env.example          ← Copy to .env.local for local development
```

---

## 💻 Running Locally

```bash
cd shop
cp .env.example .env.local
# Edit .env.local with your Stripe test keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛟 Troubleshooting

| Problem | Solution |
|---|---|
| Products don't show up | Make sure each product has a **default price** set in Stripe |
| Checkout fails | Check that `STRIPE_SECRET_KEY` is set correctly in Vercel |
| Webhook not working | Re-check the webhook URL and make sure `STRIPE_WEBHOOK_SECRET` matches |
| Admin login fails | Make sure `ADMIN_PASSWORD` env var is set (not in source code) |
| Images not loading | Images must be hosted on Stripe — upload them in the Stripe product editor |

---

Made with ❤️ by Dave · Payments secured by [Stripe](https://stripe.com)
