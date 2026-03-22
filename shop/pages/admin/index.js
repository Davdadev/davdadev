import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Dave's 3D Fidgets";

function formatMoney(amount, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleString();
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || 'Login failed');
        setLoading(false);
        return;
      }

      const json = await res.json();
      setData(json);
      setLoggedIn(true);
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${password}` },
      });
      const json = await res.json();
      setData(json);
    } catch {
      setError('Refresh failed');
    } finally {
      setLoading(false);
    }
  }

  // ── Login Screen ────────────────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <>
        <Head>
          <title>Admin — {STORE_NAME}</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">🔐</span>
              <h1 className="text-3xl font-bold text-white">Admin</h1>
              <p className="text-slate-400 mt-1 text-sm">Enter your admin password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="input"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center mt-4 text-sm text-slate-600">
              <Link href="/" className="text-indigo-400 hover:text-indigo-300">
                ← Back to shop
              </Link>
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  const { stats, orders, products } = data || {};

  return (
    <>
      <Head>
        <title>Admin Dashboard — {STORE_NAME}</title>
      </Head>

      <div className="min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-indigo-900/20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🖨️</span>
              <div>
                <span className="font-bold text-white">Admin Dashboard</span>
                <span className="ml-2 text-xs text-slate-500">{STORE_NAME}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>

              <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
                View Shop →
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon="💰"
              label="Total Revenue"
              value={formatMoney(stats?.totalRevenue || 0, stats?.currency || 'usd')}
              color="green"
            />
            <StatCard
              icon="📦"
              label="Total Orders"
              value={stats?.totalOrders || 0}
              color="blue"
            />
            <StatCard
              icon="🛍️"
              label="Products"
              value={stats?.totalProducts || 0}
              color="purple"
            />
            <StatCard
              icon="💳"
              label="Powered by"
              value="Stripe"
              color="indigo"
              href="https://dashboard.stripe.com"
              linkLabel="Open Dashboard →"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-indigo-900/20 pb-0">
            {['orders', 'products'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
                  activeTab === tab
                    ? 'text-indigo-400 border-indigo-400'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {tab === 'orders' ? `Orders (${orders?.length || 0})` : `Products (${products?.length || 0})`}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {!orders || orders.length === 0 ? (
                <div className="card p-8 text-center">
                  <span className="text-4xl mb-3 block">📭</span>
                  <p className="text-slate-400">No orders yet. Share your shop link to start selling!</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="card p-5">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{order.customer_name}</span>
                          <span className="badge bg-green-500/15 text-green-400 border border-green-500/20">
                            Paid
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">{order.customer_email}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{formatDate(order.created)}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          {formatMoney(order.amount_total, order.currency)}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[200px]">
                          {order.id}
                        </div>
                      </div>
                    </div>

                    {order.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-indigo-900/20">
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, i) => (
                            <span key={i} className="badge bg-slate-700/60 text-slate-300 border border-slate-600/40 py-1">
                              {item.quantity}× {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm">
                  Products are managed in your{' '}
                  <a
                    href="https://dashboard.stripe.com/products"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Stripe Dashboard
                  </a>
                  {' '}— changes sync instantly to your shop.
                </p>
                <a
                  href="https://dashboard.stripe.com/products/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </a>
              </div>

              <div className="space-y-3">
                {!products || products.length === 0 ? (
                  <div className="card p-8 text-center">
                    <span className="text-4xl mb-3 block">📦</span>
                    <p className="text-slate-400 mb-4">No products yet.</p>
                    <a
                      href="https://dashboard.stripe.com/products/create"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      Add your first product in Stripe
                    </a>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="card p-4 flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">🎯</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{product.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{product.id}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        {product.price ? (
                          <span className="font-semibold text-white">
                            {formatMoney(product.price.unit_amount, product.price.currency)}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-sm">No price</span>
                        )}
                        <div className="mt-0.5">
                          <span className={`badge text-xs ${product.active ? 'bg-green-500/15 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                            {product.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`https://dashboard.stripe.com/products/${product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-indigo-400 transition-colors flex-shrink-0"
                        title="Edit in Stripe"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, label, value, color, href, linkLabel }) {
  const colors = {
    green:  'bg-green-500/10  border-green-500/20  text-green-400',
    blue:   'bg-blue-500/10   border-blue-500/20   text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  };

  return (
    <div className={`card p-5 border ${colors[color] || colors.indigo}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {href && linkLabel && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 block"
            >
              {linkLabel}
            </a>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
