import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Twitter, Instagram, Facebook, Youtube, Zap, Sparkles } from 'lucide-react'
import { CATEGORIES } from '../../api/products.js'

const FOOTER_LINKS = {
  Shop: [
    { to: '/flash-sale',   label: '⚡ Flash Sale',   badge: 'HOT' },
    { to: '/new-arrivals', label: '✨ New Arrivals',  badge: 'NEW' },
    { to: '/category/smartphones',    label: 'Electronics' },
    { to: '/category/tops',           label: 'Fashion' },
    { to: '/category/home-decoration',label: 'Home & Decor' },
    { to: '/category/skincare',       label: 'Skincare' },
    { to: '/category/fragrances',     label: 'Fragrances' },
  ],
  Account: [
    { to: '/login',       label: 'Login' },
    { to: '/register',    label: 'Create Account' },
    { to: '/account',     label: 'My Orders' },
    { to: '/wishlist',    label: 'Wishlist' },
    { to: '/track-order', label: 'Track Order' },
    { to: '/cart',        label: 'Shopping Cart' },
  ],
  Company: [
    { to: '/about',   label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/faq',     label: 'FAQ' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms',   label: 'Terms & Conditions' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-section)',
      borderTop: '1px solid var(--border-light)',
      paddingTop: '56px', paddingBottom: '0',
      marginTop: '80px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>

        {/* ── Top grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: '40px', marginBottom: '48px',
        }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{ width: '34px', height: '34px', backgroundColor: 'var(--brand)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontFamily: 'Georgia, serif', fontWeight: '700', fontSize: '16px' }}>L</span>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                Luxe<span style={{ color: 'var(--brand)' }}>Market</span>
              </span>
            </Link>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.75', marginBottom: '20px' }}>
              Nigeria's most trusted online marketplace. Premium products, guaranteed quality, delivered fast to your door.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                { Icon: Twitter,   href: '#', label: 'Twitter'   },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook,  href: '#', label: 'Facebook'  },
                { Icon: Youtube,   href: '#', label: 'YouTube'   },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} title={label} style={{
                  width: '36px', height: '36px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.backgroundColor = 'var(--brand-light)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)' }}
                >
                  <Icon style={{ width: '15px', height: '15px' }} />
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {[
                { Icon: MapPin, text: '001 Richzion Drive, Victoria Island, Lagos' },
                { Icon: Phone,  text: '+234 803 983 0412',  href: 'tel:+2348039830412' },
                { Icon: Mail,   text: 'richzion@luxemarket.com', href: 'mailto:richzion@luxemarket.com' },
              ].map(({ Icon, text, href }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Icon style={{ width: '14px', height: '14px', color: 'var(--brand)', marginTop: '2px', flexShrink: 0 }} />
                  {href
                    ? <a href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      >{text}</a>
                    : <span>{text}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: 'Georgia, serif', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', fontSize: '0.95rem' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '0.85rem', color: 'var(--text-muted)',
                      textDecoration: 'none', transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      {l.label}
                      {l.badge && (
                        <span style={{
                          fontSize: '0.58rem', fontWeight: '800',
                          padding: '1px 5px', borderRadius: '3px',
                          backgroundColor: l.badge === 'HOT' ? '#fef3f2' : 'var(--brand-light)',
                          color: l.badge === 'HOT' ? '#ef4444' : 'var(--brand)',
                          border: `1px solid ${l.badge === 'HOT' ? '#fecdd3' : 'var(--brand-mid)'}`,
                          letterSpacing: '0.04em',
                        }}>{l.badge}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter column */}
          <div>
            <h4 style={{ fontFamily: 'Georgia, serif', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', fontSize: '0.95rem' }}>
              Newsletter
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '14px' }}>
              Subscribe for exclusive deals, new arrivals and flash sale alerts!
            </p>
            <div style={{ display: 'flex', marginBottom: '12px' }}>
              <input type="email" placeholder="your@email.com" style={{
                flex: 1, minWidth: 0,
                backgroundColor: 'var(--bg-input)',
                border: '1.5px solid var(--border-medium)', borderRight: 'none',
                color: 'var(--text-primary)', fontSize: '0.82rem',
                borderRadius: '8px 0 0 8px', padding: '9px 11px', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
              />
              <button style={{
                backgroundColor: 'var(--brand)', color: '#fff', fontSize: '0.78rem',
                fontWeight: '700', padding: '9px 14px',
                borderRadius: '0 8px 8px 0', border: 'none', cursor: 'pointer',
                transition: 'background-color 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--brand-dark)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--brand)'}
              >
                Subscribe
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
              {[
                { label: '🔒 Secure Payment' },
                { label: '🚚 Fast Delivery' },
                { label: '↩️ Easy Returns' },
              ].map(b => (
                <span key={b.label} style={{
                  fontSize: '0.68rem', color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-card)', padding: '4px 9px',
                  borderRadius: '99px', border: '1px solid var(--border-light)',
                  fontWeight: '500',
                }}>
                  {b.label}
                </span>
              ))}
            </div>

            {/* Payment methods */}
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontWeight: '600' }}>
                We Accept
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Paystack', 'Visa', 'Mastercard', 'USSD'].map(p => (
                  <span key={p} style={{
                    fontSize: '0.68rem', color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-card)', padding: '3px 9px',
                    borderRadius: '5px', border: '1px solid var(--border-medium)',
                    fontFamily: 'monospace', fontWeight: '600',
                  }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          paddingTop: '20px', paddingBottom: '24px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            © {new Date().getFullYear()} LuxeMarket by Richzion. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { to: '/about',   label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/faq',     label: 'FAQ' },
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms',   label: 'Terms' },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
              >{l.label}</Link>
            ))}
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
            Made with ❤️ in Lagos, Nigeria 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  )
}