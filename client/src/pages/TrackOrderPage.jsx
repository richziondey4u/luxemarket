import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate } from '../lib/utils.js'
import { formatPrice } from '../api/products.js'

const STATUSES = {
  paid:      { label: 'Order Placed',  icon: <Package   style={{ width: '16px', height: '16px' }} />, color: '#4f7d52', step: 1 },
  pending:   { label: 'Processing',    icon: <Clock     style={{ width: '16px', height: '16px' }} />, color: '#f59e0b', step: 1 },
  shipped:   { label: 'Shipped',       icon: <Truck     style={{ width: '16px', height: '16px' }} />, color: '#3b82f6', step: 2 },
  delivered: { label: 'Delivered',     icon: <CheckCircle style={{ width: '16px', height: '16px' }} />, color: '#4f7d52', step: 3 },
  cancelled: { label: 'Cancelled',     icon: <AlertCircle style={{ width: '16px', height: '16px' }} />, color: '#ef4444', step: 0 },
}

const STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered']

export default function TrackOrderPage() {
  const { user } = useAuth()
  const [query,  setQuery]  = useState('')
  const [result, setResult] = useState(null)
  const [error,  setError]  = useState('')

  const allOrders = JSON.parse(localStorage.getItem('lm_orders') || '[]')

  const handleSearch = (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    const q = query.trim().toUpperCase()
    if (!q) { setError('Please enter an order ID'); return }
    const found = allOrders.find(o => o.id?.toUpperCase() === q || o.reference?.toUpperCase() === q)
    if (!found) { setError('No order found with that ID. Please check and try again.'); return }
    setResult(found)
  }

  const userOrders = user ? allOrders.filter(o => o.userId === user.id) : []

  const StatusStep = ({ order }) => {
    const status = STATUSES[order.status] || STATUSES.paid
    const currentStep = status.step
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Connector line */}
          <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--border-light)', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '20px', left: '10%', height: '2px', backgroundColor: 'var(--brand)', zIndex: 1, width: Math.min(currentStep / (STEPS.length - 1) * 80, 80) + '%', transition: 'width 0.5s ease' }} />

          {STEPS.map((step, i) => {
            const done    = i < currentStep
            const active  = i === currentStep
            const cancelled = order.status === 'cancelled'
            return (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, flex: 1 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: cancelled ? 'var(--bg-muted)' : done || active ? 'var(--brand)' : 'var(--bg-card)',
                  border: `2px solid ${cancelled ? 'var(--border-medium)' : done || active ? 'var(--brand)' : 'var(--border-medium)'}`,
                  transition: 'all 0.3s',
                }}>
                  {done || active
                    ? <CheckCircle style={{ width: '18px', height: '18px', color: '#fff' }} />
                    : <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--border-medium)', display: 'block' }} />
                  }
                </div>
                <p style={{ fontSize: '0.7rem', fontWeight: active ? '700' : '500', color: active ? 'var(--brand)' : 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {step}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-section)', padding: '14px 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            {' / '}
            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Track Order</span>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: 'var(--brand-light)', border: '1px solid var(--brand-mid)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Package style={{ width: '26px', height: '26px', color: 'var(--brand)' }} />
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--text-primary)', marginBottom: '8px' }}>Track Your Order</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your order ID to see the latest status</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. ORD-ABC123XY"
            className="input-field"
            style={{ fontSize: '0.9rem' }}
          />
          <button type="submit" className="btn-primary" style={{ borderRadius: '8px', padding: '10px 20px', flexShrink: 0 }}>
            <Search style={{ width: '16px', height: '16px' }} /> Track
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: '#be123c', fontSize: '0.875rem' }}>
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} /> {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '24px', marginBottom: '32px', boxShadow: 'var(--shadow-card)' }}>
            {/* Order header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Order ID</p>
                <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{result.id}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{formatDate(result.createdAt)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Total</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{formatPrice(result.total)}</p>
                <span style={{
                  display: 'inline-flex', padding: '2px 10px', borderRadius: '99px',
                  fontSize: '0.72rem', fontWeight: '700', marginTop: '4px',
                  backgroundColor: STATUSES[result.status]?.color + '20',
                  color: STATUSES[result.status]?.color,
                  border: '1px solid ' + STATUSES[result.status]?.color + '40',
                }}>
                  {STATUSES[result.status]?.label || 'Processing'}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <StatusStep order={result} />

            {/* Shipping address */}
            {result.shippingAddress && (
              <div style={{ backgroundColor: 'var(--bg-section)', borderRadius: '10px', padding: '14px 16px', marginTop: '16px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin style={{ width: '12px', height: '12px' }} /> Delivering to
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                  {result.shippingAddress.firstName} {result.shippingAddress.lastName}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {result.shippingAddress.address}, {result.shippingAddress.city}, {result.shippingAddress.state}
                </p>
              </div>
            )}

            {/* Items */}
            {result.items?.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px' }}>Items Ordered</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.items.map(item => (
                    <div key={item.key} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img src={item.product?.thumbnail} alt="" style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-light)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product?.title}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{formatPrice(item.product?.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User's orders */}
        {user && userOrders.length > 0 && !result && (
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px' }}>Your Recent Orders</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userOrders.slice(0, 5).map(order => (
                <button key={order.id} onClick={() => setResult(order)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-light)', borderRadius: '10px',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-mid)'; e.currentTarget.style.backgroundColor = 'var(--brand-light)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)' }}
                >
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{order.id}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(order.createdAt)} · {order.items?.length} item(s)</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>{formatPrice(order.total)}</p>
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: STATUSES[order.status]?.color || 'var(--brand)' }}>
                      {STATUSES[order.status]?.label || 'Processing'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!user && (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--bg-section)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Have an account? Log in to see all your orders automatically.
            </p>
            <Link to="/login" className="btn-outline" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>Login to My Account</Link>
          </div>
        )}
      </div>
    </div>
  )
}