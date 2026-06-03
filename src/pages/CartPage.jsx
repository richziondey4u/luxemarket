import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../api/products.js'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, tax, total, isEmpty } = useCart()

  if (isEmpty) return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 16px', backgroundColor: '#fff' }}>
      <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f3f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid #ebebeb' }}>
        <ShoppingBag style={{ width: '36px', height: '36px', color: '#c8c8c8' }} />
      </div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: '700', color: '#141414', marginBottom: '10px' }}>Your cart is empty</h2>
      <p style={{ color: '#757575', marginBottom: '28px', maxWidth: '320px', fontSize: '0.9rem' }}>You haven't added anything yet. Start shopping!</p>
      <Link to="/" className="btn-primary" style={{ borderRadius: '8px' }}>
        Browse Products <ArrowRight style={{ width: '16px', height: '16px' }} />
      </Link>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 16px 64px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '700', color: '#141414', marginBottom: '28px' }}>
          Shopping Cart <span style={{ fontSize: '1rem', color: '#a0a0a0', fontFamily: 'DM Sans, sans-serif', fontWeight: '400' }}>({items.length} items)</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px', alignItems: 'flex-start' }}>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map(item => (
              <div key={item.key} style={{
                backgroundColor: '#fff', border: '1px solid #ebebeb', borderRadius: '12px',
                padding: '14px', display: 'flex', gap: '12px', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#c8c8c8'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#ebebeb'}
              >
                <Link to={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                  <img src={item.product.thumbnail} alt={item.product.title}
                    style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#f7f7f7' }} />
                </Link>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.68rem', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.product.brand || item.product.category}</p>
                      <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '500', color: '#242424', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.title}</p>
                      </Link>
                    </div>
                    <button onClick={() => removeItem(item.key)} style={{
                      padding: '5px', color: '#c8c8c8', background: 'none', border: 'none',
                      cursor: 'pointer', borderRadius: '6px', flexShrink: 0, display: 'flex',
                      transition: 'color 0.15s, background-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fff1f2' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#c8c8c8'; e.currentTarget.style.backgroundColor = 'transparent' }}
                    ><Trash2 style={{ width: '15px', height: '15px' }} /></button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e0e0e0', borderRadius: '7px', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)} style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f3f3'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      ><Minus style={{ width: '13px', height: '13px' }} /></button>
                      <span style={{ padding: '0 12px', fontWeight: '600', color: '#141414', fontSize: '0.85rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)} style={{ padding: '5px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f3f3'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      ><Plus style={{ width: '13px', height: '13px' }} /></button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '700', color: '#141414', fontSize: '0.95rem' }}>{formatPrice(item.product.price * item.quantity)}</p>
                      {item.quantity > 1 && <p style={{ fontSize: '0.7rem', color: '#a0a0a0' }}>{formatPrice(item.product.price)} each</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#757575', textDecoration: 'none', padding: '8px 0', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4f7d52'}
              onMouseLeave={e => e.currentTarget.style.color = '#757575'}
            >← Continue Shopping</Link>
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '80px' }}>
            {/* Promo */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #ebebeb', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.85rem', fontWeight: '600', color: '#3a3a3a', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>
                <Tag style={{ width: '15px', height: '15px', color: '#4f7d52' }} /> Promo Code
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Enter code" className="input-field" style={{ fontSize: '0.85rem', padding: '9px 12px' }} />
                <button className="btn-outline" style={{ fontSize: '0.78rem', padding: '9px 16px', whiteSpace: 'nowrap' }}>Apply</button>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #ebebeb', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '700', color: '#141414', marginBottom: '16px' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {[
                  ['Subtotal', formatPrice(subtotal)],
                  ['Shipping', shipping === 0 ? 'FREE' : formatPrice(shipping)],
                  ['Tax (7.5%)', formatPrice(tax)],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#757575' }}>{l}</span>
                    <span style={{ color: v === 'FREE' ? '#4f7d52' : '#242424', fontWeight: v === 'FREE' ? '600' : '400' }}>{v}</span>
                  </div>
                ))}
                {shipping > 0 && (
                  <div style={{ backgroundColor: '#fefce8', border: '1px solid #fef08a', borderRadius: '7px', padding: '8px 10px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a16207' }}>Add {formatPrice(100 - subtotal)} more for free shipping!</p>
                  </div>
                )}
              </div>
              <div style={{ borderTop: '1px solid #ebebeb', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontWeight: '600', color: '#141414', fontSize: '0.95rem' }}>Total</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3rem', fontWeight: '700', color: '#141414' }}>{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" className="btn-primary" style={{ width: '100%', borderRadius: '8px', justifyContent: 'center', fontSize: '0.875rem' }}>
                Proceed to Checkout <ArrowRight style={{ width: '16px', height: '16px' }} />
              </Link>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                {['Paystack', 'Visa', 'MC'].map(p => (
                  <span key={p} style={{ fontSize: '0.68rem', color: '#a0a0a0', fontFamily: 'monospace', backgroundColor: '#f3f3f3', padding: '2px 7px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}