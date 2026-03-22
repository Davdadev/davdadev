import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Dave's 3D Fidgets";

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🖨️</span>
            <span className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
              {storeName}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              Shop
            </Link>
            <a
              href="#about"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
              About
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-indigo-900/20">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium px-1"
              >
                Shop
              </Link>
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium px-1"
              >
                About
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
