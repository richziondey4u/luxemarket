import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, Zap, Sparkles, Tag } from 'lucide-react'

const ADS = [
  {
    id: 1,
    icon: <Zap style={{ width: '14px', height: '14px', fill: '#fbbf24', color: '#fbbf24' }} />,
    text: '⚡ Flash Sale is LIVE!',
    sub: 'Up to 70% off on selected items',
    cta: 'Shop Now',
    to: '/flash-sale',
    bg: 'linear-gradient(90deg, #1a3a1c, #2d5a30)',
    color: '#ffffff',
    accent: '#fbbf24',
  },
  {
    id: 2,
    icon: <Sparkles style={{ width: '14px', height: '14px', color: '#4f7d52' }} />,
    text: '✨ New Arrivals are here!',
    sub: 'Fresh styles added every week',
    cta: 'Explore',
    to: '/new-arrivals',
    bg: '#f4f7f4',
    color: '#141414',
    accent: '#4f7d52',
    border: '1px solid #c8ddc8',
  },
  {
    id: 3,
    icon: <Tag style={{ width: '14px', height: '14px', color: '#ffffff' }} />,
    text: '🚚 Free Shipping on orders over ₦50,000',
    sub: 'Shop more, save more on every order',
    cta: 'Start Shopping',
    to: '/',
    bg: 'linear-gradient(90deg, #4f7d52, #3d6440)',
    color: '#ffffff',
    accent: '#ffffff',
  },
]

export default function AdvertBanner() {
  const [current,  setCurrent]  = useState(0)
  const [visible,  setVisible]  = useState(true)
  const [paused,   setPaused]   = useState(false)
  const intervalRef = useRef(null)

  const next = () => setCurrent(i => (i + 1) % ADS.length)
  const prev = () => setCurrent(i => (i - 1 + ADS.length) % ADS.length)

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(next, 4000)
    }
    return () => clearInterval(intervalRef.current)
  }, [paused, current])

  if (!visible) return null

  const ad = ADS[current]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background: ad.bg,
        border: ad.border || 'none',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.4s',
      }}
    >
      {/* Subtle shimmer line at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        animation: 'shimmer 2s infinite',
      }} />

      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '9px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>

        {/* Prev arrow */}
        <button onClick={prev} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: ad.color, opacity: 0.6, padding: '4px', display: 'flex',
          transition: 'opacity 0.2s', flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
        >
          <ChevronLeft style={{ width: '15px', height: '15px' }} />
        </button>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: ad.color, whiteSpace: 'nowrap' }}>
              {ad.text}
            </span>
            <span style={{
              width: '3px', height: '3px', borderRadius: '50%',
              backgroundColor: ad.color, opacity: 0.4, flexShrink: 0,
            }} className="hidden-mobile" />
            <span style={{ fontSize: '0.78rem', color: ad.color, opacity: 0.75, whiteSpace: 'nowrap' }} className="hidden-mobile">
              {ad.sub}
            </span>
          </div>

          <Link to={ad.to} style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '4px 14px', borderRadius: '99px',
            fontSize: '0.72rem', fontWeight: '700',
            backgroundColor: ad.accent,
            color: ad.bg.includes('#fff') || ad.bg.includes('f4f7f4') ? '#fff' : ad.bg,
            textDecoration: 'none', transition: 'opacity 0.2s', flexShrink: 0,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {ad.cta} →
          </Link>
        </div>

        {/* Dots + Next arrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: '4px' }} className="hidden-mobile">
            {ADS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{
                width: i === current ? '16px' : '6px',
                height: '6px', borderRadius: '99px',
                backgroundColor: ad.color,
                opacity: i === current ? 0.9 : 0.3,
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

          {/* Next arrow */}
          <button onClick={next} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: ad.color, opacity: 0.6, padding: '4px', display: 'flex',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
          >
            <ChevronRight style={{ width: '15px', height: '15px' }} />
          </button>

          {/* Close */}
          <button onClick={() => setVisible(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: ad.color, opacity: 0.5, padding: '4px', display: 'flex',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          title="Dismiss"
          >
            <X style={{ width: '13px', height: '13px' }} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}