import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Twitter, Instagram, Facebook, Youtube } from 'lucide-react'
import { CATEGORIES } from '../../api/products.js'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/8 pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-slate-950 font-display font-bold text-sm">L</span>
              </div>
              <span className="font-display font-bold text-white text-xl">
                Luxe<span className="text-brand-400">Market</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Premium shopping experience with curated products across all categories. Quality guaranteed, delivered to your door.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-400 hover:bg-brand-500/15 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 7).map(cat => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`}
                    className="text-sm text-slate-500 hover:text-brand-400 transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Account</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/login',    label: 'Login' },
                { to: '/register', label: 'Create Account' },
                { to: '/account',  label: 'My Orders' },
                { to: '/cart',     label: 'Shopping Cart' },
                { to: '/account',  label: 'Wishlist' },
              ].map(l => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 hover:text-brand-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Contact Us</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                123 Commerce St, Lagos, Nigeria
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                +234 800 000 0000
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-500">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                hello@luxemarket.com
              </li>
            </ul>
            <p className="text-sm text-slate-400 mb-2 font-medium">Newsletter</p>
            <div className="flex">
              <input type="email" placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500" />
              <button className="bg-brand-500 text-slate-950 text-sm font-semibold px-3 py-2 rounded-r-lg hover:bg-brand-400 transition-colors">
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} LuxeMarket. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms</a>
            <a href="#" className="hover:text-slate-400">Refunds</a>
          </div>
          <div className="flex items-center gap-2">
            {['Paystack', 'Visa', 'Mastercard'].map(p => (
              <span key={p} className="text-xs bg-white/8 text-slate-500 px-2 py-1 rounded border border-white/8 font-mono">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}