import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Search, Heart, Menu, X, User,
  ChevronDown, LogOut, Package, Home, Zap, Sparkles, MapPin,
} from 'lucide-react'
import { useAuth }     from '../../context/AuthContext.jsx'
import { useCart }     from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { CATEGORIES }  from '../../api/products.js'
import ThemePicker     from '../ui/ThemePicker.jsx'

export default function Navbar() {
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [catOpen,     setCatOpen]     = useState(false)
  const [userOpen,    setUserOpen]    = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
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

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest('.cat-dropdown')) setCatOpen(false)
      if (!e.target.closest('.user-dropdown')) setUserOpen(false)
    }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setMobileOpen(false)
    setSearchQuery('')
  }

  const iconBtn = {
    padding: '8px', background: 'none', border: 'none',
    cursor: 'pointer', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text-muted)', transition: 'color 0.2s, background-color 0.2s',
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: 'var(--bg-page)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: scrolled ? 'var(--shadow-navbar)' : 'none',
      transition: 'box-shadow 0.3s, background-color 0.3s',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: '62px', gap: '8px',
        }}>

          {/* ── Logo ── */}
          <Link to="/" onClick={() => setMobileOpen(false)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            textDecoration: 'none', flexShrink: 0,
          }}>
            <div style={{
              width: '34px', height: '34px',
              backgroundColor: 'var(--brand)',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: '17px' }}>L</span>
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.15rem' }}>
              Luxe<span style={{ color: 'var(--brand)' }}>Market</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="md-nav" style={{ display: 'none', alignItems: 'center', gap: '4px' }}>

            <NavLink to="/" end style={({ isActive }) => ({
              fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px',
              color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--brand-light)' : 'transparent',
              transition: 'all 0.2s',
            })}>Home</NavLink>

            {/* Categories dropdown */}
            <div className="cat-dropdown" style={{ position: 'relative' }}>
              <button
                onClick={() => setCatOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.875rem', fontWeight: '500',
                  color: 'var(--text-secondary)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-muted)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Categories
                <ChevronDown style={{ width: '14px', height: '14px', transform: catOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {catOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: '50%',
                  transform: 'translateX(-50%)', width: '540px', zIndex: 200,
                }}>
                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '14px', padding: '14px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                  }}>
                    <p style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', paddingLeft: '4px' }}>
                      All Categories
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                      {CATEGORIES.map(cat => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`}
                          onClick={() => setCatOpen(false)}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                            padding: '10px 6px', borderRadius: '8px', textDecoration: 'none',
                            textAlign: 'center', transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--brand-light)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.2' }}>{cat.label}</span>
                        </Link>
                      ))}
                    </div>
                    {/* Quick links inside dropdown */}
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}>
                      <Link to="/flash-sale" onClick={() => setCatOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 12px', borderRadius: '99px', textDecoration: 'none',
                        backgroundColor: '#fef3f2', border: '1px solid #fecdd3',
                        fontSize: '0.72rem', fontWeight: '700', color: '#ef4444',
                      }}>
                        <Zap style={{ width: '11px', height: '11px', fill: '#ef4444' }} /> Flash Sale
                      </Link>
                      <Link to="/new-arrivals" onClick={() => setCatOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 12px', borderRadius: '99px', textDecoration: 'none',
                        backgroundColor: 'var(--brand-light)', border: '1px solid var(--brand-mid)',
                        fontSize: '0.72rem', fontWeight: '700', color: 'var(--brand)',
                      }}>
                        <Sparkles style={{ width: '11px', height: '11px' }} /> New Arrivals
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {[
              { to: '/category/smartphones',    label: 'Electronics' },
              { to: '/category/tops',           label: 'Fashion' },
              { to: '/flash-sale',              label: '⚡ Sale' },
              { to: '/new-arrivals',            label: '✨ New' },
            ].map(l => (
              <NavLink key={l.to} to={l.to} style={({ isActive }) => ({
                fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none',
                padding: '6px 12px', borderRadius: '8px', transition: 'all 0.2s',
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--brand-light)' : 'transparent',
              })}
              onMouseEnter={e => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.backgroundColor = 'var(--bg-muted)' }}
              onMouseLeave={e => { if (!e.currentTarget.style.color.includes('brand')) e.currentTarget.style.backgroundColor = 'transparent' }}
              >{l.label}</NavLink>
            ))}
          </nav>

          {/* ── Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>

            {/* Theme picker — desktop only */}
            <div className="md-flex" style={{ display: 'none', marginRight: '2px' }}>
              <ThemePicker />
            </div>

            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                <input ref={searchRef} value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  style={{
                    width: '160px', backgroundColor: 'var(--bg-muted)',
                    border: '1.5px solid var(--border-medium)', borderRight: 'none',
                    color: 'var(--text-primary)', fontSize: '0.82rem',
                    borderRadius: '8px 0 0 8px', padding: '7px 11px', outline: 'none',
                  }}
                />
                <button type="submit" style={{
                  backgroundColor: 'var(--brand)', color: '#fff', border: 'none',
                  borderRadius: '0 8px 8px 0', padding: '7px 11px', cursor: 'pointer', display: 'flex',
                }}>
                  <Search style={{ width: '15px', height: '15px' }} />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} style={{ ...iconBtn, marginLeft: '2px' }}>
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} style={iconBtn}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.backgroundColor = 'var(--brand-light)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <Search style={{ width: '20px', height: '20px' }} />
              </button>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" style={{ ...iconBtn, position: 'relative', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f43f5e'; e.currentTarget.style.backgroundColor = '#fff1f2' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <Heart style={{ width: '20px', height: '20px' }} />
              {wishCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '16px', height: '16px', backgroundColor: '#f43f5e',
                  borderRadius: '50%', fontSize: '9px', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700',
                }}>{wishCount}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{ ...iconBtn, position: 'relative', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.backgroundColor = 'var(--brand-light)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <ShoppingCart style={{ width: '20px', height: '20px' }} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '17px', height: '17px', backgroundColor: 'var(--brand)',
                  borderRadius: '50%', fontSize: '9px', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700',
                }}>{totalItems > 9 ? '9+' : totalItems}</span>
              )}
            </Link>

            {/* User dropdown — desktop */}
            {isAuthenticated ? (
              <div className="md-flex user-dropdown" style={{ display: 'none', position: 'relative' }}>
                <button
                  onClick={() => setUserOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '5px 10px 5px 5px', borderRadius: '99px',
                    border: '1.5px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-card)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
                >
                  <img src={user.avatar} alt={user.name} style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown style={{ width: '12px', height: '12px', color: 'var(--text-subtle)', transform: userOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {userOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                    width: '200px', zIndex: 200,
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px', padding: '6px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  }}>
                    {/* User info */}
                    <div style={{ padding: '10px 12px 10px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                    </div>

                    {[
                      { to: '/account',     label: 'My Account',   icon: <User    style={{ width: '14px', height: '14px' }} /> },
                      { to: '/account',     label: 'My Orders',    icon: <Package style={{ width: '14px', height: '14px' }} /> },
                      { to: '/wishlist',    label: 'Wishlist',     icon: <Heart   style={{ width: '14px', height: '14px' }} /> },
                      { to: '/track-order', label: 'Track Order',  icon: <MapPin  style={{ width: '14px', height: '14px' }} /> },
                    ].map(item => (
                      <Link key={item.label} to={item.to}
                        onClick={() => setUserOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '9px',
                          padding: '9px 12px', fontSize: '0.82rem',
                          color: 'var(--text-secondary)', textDecoration: 'none',
                          borderRadius: '8px', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--brand-light)'; e.currentTarget.style.color = 'var(--brand)' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '4px 0' }} />

                    <button onClick={() => { logout(); setUserOpen(false) }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '9px 12px', fontSize: '0.82rem', color: '#ef4444',
                      background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut style={{ width: '14px', height: '14px' }} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="md-flex" style={{ display: 'none', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
                <Link to="/login" style={{
                  fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '500',
                  padding: '7px 14px', borderRadius: '8px',
                  border: '1.5px solid var(--border-medium)',
                  textDecoration: 'none', transition: 'all 0.2s',
                  backgroundColor: 'var(--bg-card)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >Login</Link>
                <Link to="/register" className="btn-primary" style={{ fontSize: '0.75rem', padding: '7px 16px' }}>Sign Up</Link>
              </div>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md-hide"
              style={{ ...iconBtn }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-muted)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {mobileOpen ? <X style={{ width: '21px', height: '21px' }} /> : <Menu style={{ width: '21px', height: '21px' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div style={{
          backgroundColor: 'var(--bg-page)',
          borderTop: '1px solid var(--border-light)',
          padding: '12px 16px 20px',
          maxHeight: '85vh', overflowY: 'auto',
        }}>
          {/* Mobile search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', marginBottom: '14px' }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{
                flex: 1, backgroundColor: 'var(--bg-muted)',
                border: '1.5px solid var(--border-medium)', borderRight: 'none',
                color: 'var(--text-primary)', fontSize: '0.875rem',
                borderRadius: '8px 0 0 8px', padding: '9px 12px', outline: 'none',
              }}
            />
            <button type="submit" style={{
              backgroundColor: 'var(--brand)', color: '#fff', border: 'none',
              borderRadius: '0 8px 8px 0', padding: '9px 14px', cursor: 'pointer', display: 'flex',
            }}>
              <Search style={{ width: '16px', height: '16px' }} />
            </button>
          </form>

          {/* Theme picker in mobile */}
          <div style={{ marginBottom: '12px' }}>
            <ThemePicker />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', marginBottom: '10px' }} />

          {/* Nav links */}
          {[
            { to: '/',                            label: 'Home',          icon: <Home          style={{ width: '16px', height: '16px' }} />, end: true },
            { to: '/category/smartphones',        label: 'Electronics',   icon: <span>📱</span> },
            { to: '/category/tops',               label: 'Fashion',       icon: <span>👕</span> },
            { to: '/category/home-decoration',    label: 'Home & Decor',  icon: <span>🏠</span> },
            { to: '/category/skincare',           label: 'Skincare',      icon: <span>✨</span> },
            { to: '/category/fragrances',         label: 'Fragrances',    icon: <span>🌸</span> },
            { to: '/flash-sale',                  label: '⚡ Flash Sale', icon: <Zap      style={{ width: '16px', height: '16px' }} /> },
            { to: '/new-arrivals',                label: '✨ New Arrivals',icon: <Sparkles style={{ width: '16px', height: '16px' }} /> },
            { to: '/wishlist',                    label: `Wishlist`,      icon: <Heart    style={{ width: '16px', height: '16px' }} /> },
            { to: '/cart',                        label: `Cart (${totalItems})`, icon: <ShoppingCart style={{ width: '16px', height: '16px' }} /> },
            { to: '/track-order',                 label: 'Track Order',   icon: <MapPin   style={{ width: '16px', height: '16px' }} /> },
          ].map(link => (
            <NavLink key={link.to + link.label} to={link.to} end={link.end}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '9px',
                fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none',
                marginBottom: '2px',
                backgroundColor: isActive ? 'var(--brand-light)' : 'transparent',
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
              })}
            >{link.icon} {link.label}</NavLink>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '10px 0' }} />

          {isAuthenticated ? (
            <>
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-section)', borderRadius: '9px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{user.email}</p>
                </div>
              </div>
              <Link to="/account" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '9px', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2px' }}>
                <User style={{ width: '16px', height: '16px' }} /> My Account
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '9px', fontSize: '0.875rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
                <LogOut style={{ width: '16px', height: '16px' }} /> Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login"    onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ flex: 1, fontSize: '0.82rem', padding: '10px', justifyContent: 'center' }}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary"   style={{ flex: 1, fontSize: '0.82rem', padding: '10px', justifyContent: 'center' }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .md-nav  { display: none !important; }
        .md-flex { display: none !important; }
        .md-hide { display: flex !important; }
        @media (min-width: 768px) {
          .md-nav  { display: flex !important; }
          .md-flex { display: flex !important; }
          .md-hide { display: none !important; }
        }
      `}</style>
    </header>
  )
}