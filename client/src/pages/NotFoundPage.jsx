import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, ArrowRight, ShoppingBag, Tag, Zap } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Electronics',  to: '/category/smartphones',     icon: '📱' },
  { label: 'Fashion',      to: '/category/tops',            icon: '👕' },
  { label: 'Home & Decor', to: '/category/home-decoration', icon: '🏠' },
  { label: 'Flash Sale',   to: '/flash-sale',               icon: '⚡' },
  { label: 'New Arrivals', to: '/new-arrivals',             icon: '✨' },
  { label: 'My Cart',      to: '/cart',                     icon: '🛒' },
]

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>

      {/* Top accent bar */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #4f7d52, #72a474, #4f7d52)' }} />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 16px 80px', textAlign: 'center' }}>

        {/* Illustration */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '40px' }}>
          <svg viewBox="0 0 480 320" style={{ width: '100%', maxWidth: '440px' }} xmlns="http://www.w3.org/2000/svg">
            {/* Ground */}
            <ellipse cx="240" cy="300" rx="160" ry="14" fill="#f0f0f0" />

            {/* Shadow under bag */}
            <ellipse cx="240" cy="290" rx="85" ry="8" fill="#e8e8e8" />

            {/* Bag body */}
            <rect x="148" y="148" width="184" height="138" rx="18" fill="#ffffff" stroke="#e0e0e0" strokeWidth="2" />

            {/* Bag flap top */}
            <rect x="148" y="148" width="184" height="52" rx="18" fill="#f4f7f4" stroke="#e0e0e0" strokeWidth="2" />
            <rect x="148" y="178" width="184" height="22" fill="#f4f7f4" />

            {/* Bag handle */}
            <path d="M192 148 C192 108 200 92 240 92 C280 92 288 108 288 148"
              fill="none" stroke="#4f7d52" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

            {/* Handle shine */}
            <path d="M196 148 C196 112 203 96 240 96"
              fill="none" stroke="#72a474" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

            {/* Bag clasp */}
            <rect x="222" y="170" width="36" height="20" rx="10" fill="#4f7d52" />
            <rect x="230" y="176" width="20" height="8" rx="4" fill="#3d6440" />

            {/* Bag body stripe */}
            <rect x="148" y="200" width="184" height="2" fill="#f0f0f0" />

            {/* Big 404 on bag */}
            <text x="240" y="252" textAnchor="middle" dominantBaseline="middle"
              fontSize="44" fontFamily="Georgia, serif" fontWeight="700" fill="#4f7d52">
              404
            </text>

            {/* Question mark above */}
            <circle cx="240" cy="52" r="28" fill="#f4f7f4" stroke="#a3c4a5" strokeWidth="2" />
            <text x="240" y="60" textAnchor="middle" dominantBaseline="middle"
              fontSize="28" fontFamily="Georgia, serif" fontWeight="700" fill="#4f7d52">
              ?
            </text>

            {/* Floating elements */}
            {/* Star left */}
            <g transform="translate(72, 100)">
              <polygon points="12,0 15,9 24,9 17,14 20,23 12,18 4,23 7,14 0,9 9,9"
                fill="#fbbf24" opacity="0.8" />
            </g>
            {/* Star right */}
            <g transform="translate(384, 88)">
              <polygon points="10,0 12,7 20,7 14,12 16,19 10,15 4,19 6,12 0,7 8,7"
                fill="#fbbf24" opacity="0.6" />
            </g>

            {/* Dots */}
            <circle cx="96"  cy="180" r="6" fill="#a3c4a5" opacity="0.6" />
            <circle cx="388" cy="175" r="5" fill="#a3c4a5" opacity="0.5" />
            <circle cx="80"  cy="240" r="4" fill="#fbbf24" opacity="0.5" />
            <circle cx="400" cy="235" r="4" fill="#fb7185" opacity="0.5" />
            <circle cx="108" cy="132" r="3" fill="#4f7d52" opacity="0.3" />
            <circle cx="374" cy="140" r="3" fill="#4f7d52" opacity="0.3" />

            {/* Dashed path lines */}
            <path d="M60 180 Q76 160 92 180 Q108 200 124 180"
              fill="none" stroke="#a3c4a5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            <path d="M356 180 Q372 160 388 180 Q404 200 420 180"
              fill="none" stroke="#a3c4a5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
          </svg>
        </div>

        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: '#f4f7f4', border: '1px solid #a3c4a5',
            borderRadius: '99px', padding: '5px 16px',
            fontSize: '0.72rem', fontWeight: '700',
            color: '#4f7d52', letterSpacing: '0.1em',
          }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#4f7d52', borderRadius: '50%', display: 'inline-block' }} />
            PAGE NOT FOUND
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '700', color: '#141414',
          lineHeight: '1.15', marginBottom: '14px',
        }}>
          Oops! This page went<br />
          <span style={{ color: '#4f7d52' }}>out of stock</span>
        </h1>

        <p style={{
          color: '#757575', fontSize: '1rem', lineHeight: '1.7',
          maxWidth: '400px', margin: '0 auto 36px',
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to shopping!
        </p>

        {/* Primary actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '52px' }}>
          <Link to="/" className="btn-primary" style={{ borderRadius: '8px', padding: '12px 28px' }}>
            <Home style={{ width: '16px', height: '16px' }} /> Back to Home
          </Link>
          <Link to="/search" className="btn-secondary" style={{ borderRadius: '8px', padding: '12px 28px' }}>
            <Search style={{ width: '16px', height: '16px' }} /> Search Products
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn-outline"
            style={{ borderRadius: '8px', padding: '12px 28px' }}
          >
            ← Go Back
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ebebeb' }} />
          <span style={{ fontSize: '0.78rem', color: '#c8c8c8', fontWeight: '500', whiteSpace: 'nowrap' }}>
            OR BROWSE THESE PAGES
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ebebeb' }} />
        </div>

        {/* Quick links grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 140px), 1fr))',
          gap: '10px',
          maxWidth: '680px',
          margin: '0 auto 52px',
        }}>
          {QUICK_LINKS.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 16px', backgroundColor: '#fff',
              border: '1px solid #ebebeb', borderRadius: '10px',
              fontSize: '0.82rem', fontWeight: '500', color: '#3a3a3a',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#a3c4a5'
              e.currentTarget.style.backgroundColor = '#f4f7f4'
              e.currentTarget.style.color = '#4f7d52'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#ebebeb'
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.color = '#3a3a3a'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Help text */}
        <p style={{ fontSize: '0.82rem', color: '#a0a0a0', lineHeight: '1.6' }}>
          Need help?{' '}
          <a href="mailto:hello@luxemarket.com" style={{ color: '#4f7d52', fontWeight: '500', textDecoration: 'none' }}>
            Contact our support team
          </a>
          {' '}or call{' '}
          <a href="tel:+2348039830412" style={{ color: '#4f7d52', fontWeight: '500', textDecoration: 'none' }}>
            +234 8039830412
          </a>
        </p>
      </div>
    </div>
  )
}