import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Search, Heart, Menu, X, User,
  ChevronDown, LogOut, Package, Home, Zap, Sparkles,
  MapPin, Phone, ChevronRight,
} from 'lucide-react'
import { useAuth }     from '../../context/AuthContext.jsx'
import { useCart }     from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { CATEGORIES }  from '../../api/products.js'
import ThemePicker     from '../ui/ThemePicker.jsx'

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [mobileSearch, setMobileSearch] = useState('')
  const [catOpen,      setCatOpen]      = useState(false)
  const [userOpen,     setUserOpen]     = useState(false)
  const searchRef = useRef(null)
  const navigate  = useNavigate()

  const { user, logout, isAuthenticated } = useAuth()
  const { totalItems } = useCart()
  const { count: wishCount } = useWishlist()

  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest('.cat-mega'))  setCatOpen(false)
      if (!e.target.closest('.user-drop')) setUserOpen(false)
    }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [])

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleSearch = (e, q) => {
    e.preventDefault()
    const query = (q ?? searchQuery).trim()
    if (!query) return
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setMobileOpen(false)
    setSearchQuery('')
    setMobileSearch('')
  }

  const TOP_CATS = [
    { to: '/flash-sale',                  label: '⚡ Flash Sale',     hot: true },
    { to: '/new-arrivals',                label: '✨ New Arrivals' },
    { to: '/category/smartphones',        label: 'Phones & Tablets' },
    { to: '/category/laptops',            label: 'Computing' },
    { to: '/category/tops',               label: 'Fashion' },
    { to: '/category/home-decoration',    label: 'Home & Office' },
    { to: '/category/skincare',           label: 'Beauty' },
    { to: '/category/sports-accessories', label: 'Sports' },
    { to: '/category/groceries',          label: 'Grocery' },
  ]

  // Shared icon-button style using your CSS vars
  const iconBtn = {
    position: 'relative', padding: '8px 10px',
    color: '#fff', textDecoration: 'none',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '1px',
    borderRadius: '4px', cursor: 'pointer',
    background: 'none', border: 'none',
    transition: 'background 0.2s',
  }

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>

        {/* ── Top bar using your brand color ── */}
        <div style={{ backgroundColor: 'var(--brand)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', height: '60px', gap: '12px' }}>

              {/* Logo */}
              <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                <div style={{
                  backgroundColor: 'var(--bg-card)', borderRadius: '6px',
                  padding: '5px 12px', display: 'flex', alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontWeight: '800', fontSize: '1.15rem', color: 'var(--brand)' }}>
                    Luxe<span style={{ color: 'var(--text-primary)' }}>Market</span>
                  </span>
                </div>
              </Link>

              {/* Search bar — desktop only */}
              <form onSubmit={handleSearch} className="md-show"
                style={{ flex: 1, display: 'flex', maxWidth: '640px' }}>
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands and categories"
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: '0.875rem', padding: '0 14px',
                    borderRadius: '4px 0 0 4px',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    height: '40px',
                  }}
                />
                <button type="submit" style={{
                  backgroundColor: 'var(--brand-dark, var(--brand))',
                  filter: 'brightness(0.85)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  padding: '0 18px', borderRadius: '0 4px 4px 0',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.875rem', fontWeight: '600', height: '40px',
                }}>
                  <Search style={{ width: '16px', height: '16px' }} />
                  <span>Search</span>
                </button>
              </form>

              {/* Right actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}>

                {/* Theme picker */}
                <div className="md-show">
                  <ThemePicker />
                </div>

                {/* Account */}
                {isAuthenticated ? (
                  <div className="user-drop md-show" style={{ position: 'relative' }}>
                    <button
                      onClick={() => setUserOpen(o => !o)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 10px', borderRadius: '4px',
                        border: 'none', background: 'rgba(255,255,255,0.15)',
                        cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    >
                      <img src={user.avatar} alt={user.name}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }} />
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1 }}>Account</p>
                        <p style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff', lineHeight: 1.3, maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name.split(' ')[0]}
                        </p>
                      </div>
                      <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.8)', transform: userOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {userOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                        width: '210px', zIndex: 300,
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-card, 0 4px 20px rgba(0,0,0,0.15))',
                        overflow: 'hidden',
                      }}>
                        <div style={{ padding: '12px 14px', backgroundColor: 'var(--brand-light, var(--bg-muted))', borderBottom: '1px solid var(--border-light)' }}>
                          <p style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                        </div>
                        {[
                          { to: '/account',     icon: <User size={14} />,    label: 'My Account' },
                          { to: '/account',     icon: <Package size={14} />, label: 'My Orders' },
                          { to: '/wishlist',    icon: <Heart size={14} />,   label: 'Saved Items' },
                          { to: '/track-order', icon: <MapPin size={14} />,  label: 'Track Order' },
                        ].map(item => (
                          <Link key={item.label} to={item.to}
                            onClick={() => setUserOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 14px', fontSize: '0.82rem',
                              color: 'var(--text-secondary)', textDecoration: 'none',
                              borderBottom: '1px solid var(--border-light)',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--brand-light, var(--bg-muted))'; e.currentTarget.style.color = 'var(--brand)' }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                          >
                            <span style={{ color: 'var(--brand)' }}>{item.icon}</span> {item.label}
                          </Link>
                        ))}
                        <button onClick={() => { logout(); setUserOpen(false) }} style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 14px', fontSize: '0.82rem', color: '#ef4444',
                          background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="md-show" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Link to="/login" style={{
                      padding: '7px 14px', borderRadius: '4px',
                      border: '1.5px solid rgba(255,255,255,0.7)',
                      color: '#fff', textDecoration: 'none',
                      fontSize: '0.8rem', fontWeight: '600',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >Login</Link>
                    <Link to="/register" style={{
                      padding: '7px 14px', borderRadius: '4px',
                      backgroundColor: 'var(--bg-card)', color: 'var(--brand)',
                      textDecoration: 'none', fontSize: '0.8rem', fontWeight: '700',
                    }}>Sign Up</Link>
                  </div>
                )}

                {/* Wishlist */}
                <Link to="/wishlist"
                  style={iconBtn}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Heart size={20} style={{ color: '#fff' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: '600', color: '#fff' }} className="md-show">Saved</span>
                  {wishCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '3px', right: '3px',
                      minWidth: '16px', height: '16px',
                      backgroundColor: 'var(--bg-card)', color: 'var(--brand)',
                      borderRadius: '99px', fontSize: '9px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', padding: '0 3px',
                    }}>{wishCount}</span>
                  )}
                </Link>

                {/* Cart */}
                <Link to="/cart"
                  style={iconBtn}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <ShoppingCart size={20} style={{ color: '#fff' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: '600', color: '#fff' }} className="md-show">Cart</span>
                  {totalItems > 0 && (
                    <span style={{
                      position: 'absolute', top: '3px', right: '3px',
                      minWidth: '16px', height: '16px',
                      backgroundColor: 'var(--bg-card)', color: 'var(--brand)',
                      borderRadius: '99px', fontSize: '9px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', padding: '0 3px',
                    }}>{totalItems > 99 ? '99+' : totalItems}</span>
                  )}
                </Link>

                {/* Hamburger — mobile only */}
                <button onClick={() => setMobileOpen(o => !o)} className="md-hide"
                  style={{
                    padding: '8px', background: 'rgba(255,255,255,0.15)',
                    border: 'none', cursor: 'pointer', color: '#fff',
                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                  }}
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }} />
      )}

      {/* ── Mobile drawer (slides from left) ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '290px', backgroundColor: 'var(--bg-card)',
        zIndex: 200,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      }}>
        {/* Drawer header */}
        <div style={{ backgroundColor: 'var(--brand)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={user.avatar} alt={user.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.6)' }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>Hi, {user.name.split(' ')[0]}</p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{user.email}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{
                padding: '7px 16px', backgroundColor: 'var(--bg-card)', color: 'var(--brand)',
                borderRadius: '4px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '700',
              }}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} style={{
                padding: '7px 16px', backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff', borderRadius: '4px', textDecoration: 'none',
                fontSize: '0.82rem', fontWeight: '700', border: '1px solid rgba(255,255,255,0.4)',
              }}>Register</Link>
            </div>
          )}
          <button onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', marginLeft: '8px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mobile search */}
        <form onSubmit={e => handleSearch(e, mobileSearch)}
          style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', flexShrink: 0 }}>
          <div style={{ display: 'flex' }}>
            <input value={mobileSearch} onChange={e => setMobileSearch(e.target.value)}
              placeholder="Search LuxeMarket..."
              style={{
                flex: 1, border: '1.5px solid var(--border-medium)', borderRight: 'none',
                padding: '8px 12px', fontSize: '0.875rem', outline: 'none',
                borderRadius: '4px 0 0 4px', backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
              }}
            />
            <button type="submit" style={{
              backgroundColor: 'var(--brand)', color: '#fff', border: 'none',
              padding: '8px 14px', cursor: 'pointer', borderRadius: '0 4px 4px 0',
              display: 'flex', alignItems: 'center',
            }}>
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Theme picker */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-light)', flexShrink: 0 }}>
          <ThemePicker />
        </div>

        {/* Category label */}
        <div style={{ padding: '10px 16px 6px', backgroundColor: 'var(--bg-muted)', flexShrink: 0 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Categories</p>
        </div>

        {/* Category list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {[
            { to: '/flash-sale',   label: '⚡ Flash Sale',  hot: true },
            { to: '/new-arrivals', label: '✨ New Arrivals' },
            ...CATEGORIES.map(c => ({ to: `/category/${c.slug}`, label: `${c.icon} ${c.label}` })),
          ].map(link => (
            <NavLink key={link.to} to={link.to}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 16px', fontSize: '0.875rem',
                color: link.hot ? '#ef4444' : isActive ? 'var(--brand)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: link.hot || isActive ? '600' : '400',
                borderBottom: '1px solid var(--border-light)',
                backgroundColor: isActive ? 'var(--brand-light, var(--bg-muted))' : 'transparent',
              })}
            >
              {link.label}
              <ChevronRight size={14} style={{ color: 'var(--text-subtle)' }} />
            </NavLink>
          ))}
        </div>

        {/* Footer actions */}
        {isAuthenticated && (
          <div style={{ borderTop: '1px solid var(--border-light)', padding: '12px 16px', flexShrink: 0 }}>
            <Link to="/account" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', borderBottom: '1px solid var(--border-light)' }}>
              <User size={16} style={{ color: 'var(--brand)' }} /> My Account
            </Link>
            <Link to="/account" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', borderBottom: '1px solid var(--border-light)' }}>
              <Package size={16} style={{ color: 'var(--brand)' }} /> My Orders
            </Link>
            <button onClick={() => { logout(); setMobileOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 0', color: '#ef4444', background: 'none',
              border: 'none', cursor: 'pointer', fontSize: '0.875rem', width: '100%',
            }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>

      <style>{`
        .md-show { display: none !important; }
        .md-hide { display: flex !important; }
        @media (min-width: 768px) {
          .md-show { display: flex !important; }
          .md-hide { display: none !important; }
        }
      `}</style>
    </>
  )
}