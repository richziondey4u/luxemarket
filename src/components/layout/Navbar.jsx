import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Search, Heart, Menu, X, User,
  ChevronDown, LogOut, Package, Home,
} from 'lucide-react'
import { useAuth }     from '../../context/AuthContext.jsx'
import { useCart }     from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { CATEGORIES }  from '../../api/products.js'
import { cn }          from '../../lib/utils.js'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [catOpen,  setCatOpen]  = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef(null)
  const navigate  = useNavigate()

  const { user, logout, isAuthenticated } = useAuth()
  const { totalItems } = useCart()
  const { count: wishCount } = useWishlist()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const linkCls = ({ isActive }) =>
    cn('text-sm font-medium transition-colors', isActive ? 'text-brand-400' : 'text-slate-400 hover:text-white')

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/8 shadow-lg'
        : 'bg-slate-950/80 backdrop-blur-md border-b border-transparent',
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow transition-all">
              <span className="text-slate-950 font-display font-bold text-sm">L</span>
            </div>
            <span className="font-display font-bold text-white text-xl tracking-tight">
              Luxe<span className="text-brand-400">Market</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={linkCls} end>Home</NavLink>

            {/* Mega categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Categories <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', catOpen && 'rotate-180')} />
              </button>

              {catOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[580px] z-50">
                  <div className="card-dark rounded-2xl p-4 shadow-2xl border border-white/10">
                    <div className="grid grid-cols-5 gap-1">
                      {CATEGORIES.map(cat => (
                        <Link
                          key={cat.slug}
                          to={`/category/${cat.slug}`}
                          onClick={() => setCatOpen(false)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/8 transition-colors text-center group"
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="text-xs text-slate-400 group-hover:text-white transition-colors font-medium leading-tight">
                            {cat.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/category/smartphones"  className={linkCls}>Electronics</NavLink>
            <NavLink to="/category/tops"          className={linkCls}>Fashion</NavLink>
            <NavLink to="/category/home-decoration" className={linkCls}>Home Decor</NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">

            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-1">
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-48 md:w-60 bg-white/10 text-white placeholder:text-white/40 text-sm rounded-l-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500 border border-white/10"
                />
                <button type="submit" className="bg-brand-500 text-slate-950 rounded-r-xl px-3 py-2 hover:bg-brand-400 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-slate-400 hover:text-white ml-1">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/8">
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Wishlist */}
            <Link to="/account" className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/8">
              <Heart className="w-5 h-5" />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/8">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 rounded-full text-xs text-slate-950 flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User dropdown (desktop) */}
            {isAuthenticated ? (
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setUserOpen(true)}
                onMouseLeave={() => setUserOpen(false)}
              >
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/8 transition-colors">
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full border border-brand-500/40" />
                  <span className="text-sm text-slate-300 font-medium max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-full pt-1 w-48 z-50">
                    <div className="card-dark rounded-xl py-1 shadow-2xl border border-white/10">
                      <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/8 transition-colors">
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/8 transition-colors">
                        <Package className="w-4 h-4" /> Orders
                      </Link>
                      <hr className="border-white/10 my-1" />
                      <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link to="/login"    className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/8 transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Sign Up</Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/8"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950/98 border-t border-white/8 px-4 py-4 space-y-1">
          {[
            { to: '/',                     label: 'Home',        icon: <Home className="w-4 h-4" /> },
            { to: '/category/smartphones', label: 'Electronics', icon: <span>📱</span> },
            { to: '/category/tops',        label: 'Fashion',     icon: <span>👕</span> },
            { to: '/category/home-decoration', label: 'Home & Decor', icon: <span>🏠</span> },
            { to: '/category/sports-accessories', label: 'Sports', icon: <span>⚽</span> },
            { to: '/cart',  label: `Cart (${totalItems})`, icon: <ShoppingCart className="w-4 h-4" /> },
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive ? 'bg-brand-500/15 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-white/8',
              )}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}

          <hr className="border-white/10 my-2" />

          {isAuthenticated ? (
            <>
              <Link to="/account" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/8">
                <User className="w-4 h-4" /> {user.name}
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false) }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 w-full">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login"    onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-sm py-2">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary  text-sm py-2">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}