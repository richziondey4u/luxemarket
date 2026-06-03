import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronRight, ChevronLeft, Star, ShoppingCart,
  Heart, Shield, Truck, RotateCcw, Share2, Minus, Plus,
} from 'lucide-react'
import { useProduct, useRelatedProducts } from '../hooks/useProducts.js'
import { useCart }     from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { formatPrice, discountedPrice, getCategoryBySlug } from '../api/products.js'
import ProductCard from '../components/product/ProductCard.jsx'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading, isError } = useProduct(id)
  const { data: related } = useRelatedProducts(product?.category, product?.id)
  const { addItem }              = useCart()
  const { toggle, isWishlisted } = useWishlist()

  const [qty,         setQty]         = useState(1)
  const [selectedImg, setSelectedImg] = useState(0)
  const [activeTab,   setActiveTab]   = useState('description')

  /* ── Loading ── */
  if (isLoading) return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: '40px',
      }}>
        <div
          className="shimmer-bg"
          style={{ aspectRatio: '1', borderRadius: '16px', width: '100%' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
          {[25, 75, 33, 100, 66].map((w, i) => (
            <div
              key={i}
              className="shimmer-bg"
              style={{ height: '16px', width: w + '%', borderRadius: '6px' }}
            />
          ))}
        </div>
      </div>
    </div>
  )

  /* ── Error ── */
  if (isError || !product) return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '24px', backgroundColor: '#fff',
    }}>
      <p style={{ fontSize: '3rem', marginBottom: '12px' }}>😕</p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#141414', marginBottom: '8px' }}>
        Product not found
      </h2>
      <p style={{ color: '#757575', fontSize: '0.9rem', marginBottom: '20px' }}>
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/" className="btn-primary" style={{ borderRadius: '8px' }}>
        Back to Home
      </Link>
    </div>
  )

  const finalPrice = discountedPrice(product.price, product.discountPercentage)
  const savings    = product.price - finalPrice
  const wishlisted = isWishlisted(product.id)
  const images     = product.images?.length ? product.images : [product.thumbnail]
  const catLabel   = getCategoryBySlug(product.category)?.label || product.category

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: '1px solid #ebebeb', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 16px' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#757575', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4f7d52'}
              onMouseLeave={e => e.currentTarget.style.color = '#757575'}
            >Home</Link>
            <ChevronRight style={{ width: '12px', height: '12px', color: '#c8c8c8', flexShrink: 0 }} />
            <Link
              to={'/category/' + product.category}
              style={{ color: '#757575', textDecoration: 'none', textTransform: 'capitalize' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4f7d52'}
              onMouseLeave={e => e.currentTarget.style.color = '#757575'}
            >{catLabel}</Link>
            <ChevronRight style={{ width: '12px', height: '12px', color: '#c8c8c8', flexShrink: 0 }} />
            <span style={{
              color: '#242424', fontWeight: '500',
              maxWidth: '200px', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{product.title}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 16px 64px' }}>

        {/* ── Main grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '40px',
          marginBottom: '56px',
        }}>

          {/* Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Main image */}
            <div style={{
              position: 'relative', aspectRatio: '1',
              backgroundColor: '#f7f7f7', borderRadius: '16px',
              overflow: 'hidden', border: '1px solid #ebebeb',
            }}>
              <img
                src={images[selectedImg]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.discountPercentage > 0.5 && (
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge-sale" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                    -{Math.round(product.discountPercentage)}% OFF
                  </span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImg(i => Math.max(0, i - 1))}
                    style={{
                      position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                      width: '36px', height: '36px',
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      border: '1px solid #e0e0e0', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.92)'}
                  >
                    <ChevronLeft style={{ width: '18px', height: '18px', color: '#3a3a3a' }} />
                  </button>
                  <button
                    onClick={() => setSelectedImg(i => Math.min(images.length - 1, i + 1))}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      width: '36px', height: '36px',
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      border: '1px solid #e0e0e0', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.92)'}
                  >
                    <ChevronRight style={{ width: '18px', height: '18px', color: '#3a3a3a' }} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    style={{
                      flexShrink: 0, width: '64px', height: '64px',
                      borderRadius: '8px', overflow: 'hidden', padding: 0,
                      border: '2px solid ' + (selectedImg === i ? '#4f7d52' : '#e0e0e0'),
                      cursor: 'pointer', transition: 'border-color 0.2s',
                      backgroundColor: '#f7f7f7',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Brand + stock + title + rating */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.72rem', color: '#4f7d52',
                  textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600',
                }}>
                  {product.brand || product.category}
                </span>
                {product.stock > 0 ? (
                  <span className="badge-new">In Stock ({product.stock})</span>
                ) : (
                  <span style={{
                    display: 'inline-flex', padding: '2px 8px', borderRadius: '4px',
                    fontSize: '0.68rem', fontWeight: '700',
                    backgroundColor: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3',
                  }}>Out of Stock</span>
                )}
              </div>

              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                fontWeight: '700', color: '#141414', lineHeight: '1.25',
              }}>
                {product.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      style={{
                        width: '15px', height: '15px',
                        fill: i < Math.floor(product.rating) ? '#fbbf24' : 'none',
                        color: i < Math.floor(product.rating) ? '#fbbf24' : '#d4d4d4',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.82rem', color: '#757575' }}>
                  {product.rating} ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: '700', color: '#141414',
              }}>
                {formatPrice(finalPrice)}
              </span>
              {savings > 0.5 && (
                <>
                  <span style={{ fontSize: '1rem', color: '#a0a0a0', textDecoration: 'line-through' }}>
                    {formatPrice(product.price)}
                  </span>
                  <span className="badge-sale">Save {formatPrice(savings)}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: '#555555', fontSize: '0.9rem', lineHeight: '1.75', margin: 0 }}>
              {product.description}
            </p>

            {/* Quantity */}
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: '600', color: '#3a3a3a', marginBottom: '10px' }}>
                Quantity
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1.5px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{
                      padding: '10px 14px', background: 'none', border: 'none',
                      cursor: 'pointer', color: '#555555', display: 'flex', alignItems: 'center',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f3f3'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Minus style={{ width: '15px', height: '15px' }} />
                  </button>
                  <span style={{
                    padding: '0 18px', fontWeight: '600', color: '#141414',
                    fontSize: '0.95rem', minWidth: '40px', textAlign: 'center',
                  }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                    style={{
                      padding: '10px 14px', background: 'none', border: 'none',
                      cursor: 'pointer', color: '#555555', display: 'flex', alignItems: 'center',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f3f3'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Plus style={{ width: '15px', height: '15px' }} />
                  </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#a0a0a0' }}>
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => addItem(product, qty)}
                disabled={product.stock === 0}
                className="btn-primary"
                style={{ flex: 1, minWidth: '140px', borderRadius: '8px', justifyContent: 'center' }}
              >
                <ShoppingCart style={{ width: '17px', height: '17px' }} /> Add to Cart
              </button>
              <button
                onClick={() => toggle(product)}
                style={{
                  padding: '10px 16px', borderRadius: '8px',
                  border: '1.5px solid ' + (wishlisted ? '#f43f5e' : '#e0e0e0'),
                  backgroundColor: wishlisted ? '#fff1f2' : '#fff',
                  color: wishlisted ? '#f43f5e' : '#555555',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!wishlisted) {
                    e.currentTarget.style.borderColor = '#f43f5e'
                    e.currentTarget.style.color = '#f43f5e'
                  }
                }}
                onMouseLeave={e => {
                  if (!wishlisted) {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.color = '#555555'
                  }
                }}
              >
                <Heart style={{ width: '17px', height: '17px', fill: wishlisted ? '#f43f5e' : 'none' }} />
              </button>
              <button style={{
                padding: '10px 16px', borderRadius: '8px',
                border: '1.5px solid #e0e0e0', backgroundColor: '#fff',
                color: '#555555', cursor: 'pointer', display: 'flex', alignItems: 'center',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4f7d52'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
              >
                <Share2 style={{ width: '17px', height: '17px' }} />
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { Icon: Truck,     text: 'Free Delivery', sub: 'Over ₦50k' },
                { Icon: Shield,    text: 'Secure Pay',    sub: 'Paystack'  },
                { Icon: RotateCcw, text: 'Easy Returns',  sub: '30 days'   },
              ].map(({ Icon, text, sub }, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '10px 6px', backgroundColor: '#f9f9f9',
                  border: '1px solid #ebebeb', borderRadius: '8px', textAlign: 'center',
                }}>
                  <Icon style={{ width: '15px', height: '15px', color: '#4f7d52' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#242424' }}>{text}</span>
                  <span style={{ fontSize: '0.65rem', color: '#a0a0a0' }}>{sub}</span>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '6px',
              fontSize: '0.82rem', paddingTop: '14px', borderTop: '1px solid #ebebeb',
            }}>
              {[
                ['SKU',      product.sku || 'SKU-' + product.id],
                ['Warranty', product.warrantyInformation || '1 Year'],
                ['Shipping', product.shippingInformation || '2–5 business days'],
              ].map(([label, value]) => (
                <p key={label} style={{ color: '#757575', margin: 0 }}>
                  {label}:{' '}
                  <span style={{ color: '#3a3a3a' }}>{value}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'flex', borderBottom: '1.5px solid #ebebeb',
            marginBottom: '24px', gap: '4px', overflowX: 'auto',
          }}>
            {['description', 'reviews', 'shipping'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px', fontSize: '0.875rem', fontWeight: '500',
                  textTransform: 'capitalize', border: 'none', background: 'none',
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s',
                  borderBottom: '2px solid ' + (activeTab === tab ? '#4f7d52' : 'transparent'),
                  color: activeTab === tab ? '#4f7d52' : '#757575',
                  marginBottom: '-1.5px',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Description */}
          {activeTab === 'description' && (
            <div>
              <p style={{ color: '#555555', fontSize: '0.9rem', lineHeight: '1.8', margin: 0 }}>
                {product.description}
              </p>
              {product.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                  {product.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '4px 12px', backgroundColor: '#f3f3f3',
                      border: '1px solid #e0e0e0', borderRadius: '99px',
                      fontSize: '0.8rem', color: '#555555',
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {product.reviews?.length ? (
                product.reviews.map((r, i) => (
                  <div key={i} style={{
                    backgroundColor: '#f9f9f9', border: '1px solid #ebebeb',
                    borderRadius: '10px', padding: '16px',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', marginBottom: '8px',
                      gap: '8px', flexWrap: 'wrap',
                    }}>
                      <div>
                        <p style={{ fontWeight: '600', color: '#242424', fontSize: '0.85rem', margin: 0 }}>
                          {r.reviewerName}
                        </p>
                        <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                          {Array.from({ length: 5 }, (_, j) => (
                            <Star key={j} style={{
                              width: '12px', height: '12px',
                              fill: j < r.rating ? '#fbbf24' : 'none',
                              color: j < r.rating ? '#fbbf24' : '#d4d4d4',
                            }} />
                          ))}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#a0a0a0' }}>
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#555555', lineHeight: '1.6', margin: 0 }}>
                      {r.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '32px 0', margin: 0 }}>
                  No reviews yet.
                </p>
              )}
            </div>
          )}

          {/* Shipping */}
          {activeTab === 'shipping' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  Icon: Truck,
                  title: 'Delivery',
                  text: product.shippingInformation || 'Standard: 2–5 days. Express: 1–2 days.',
                },
                {
                  Icon: RotateCcw,
                  title: 'Returns',
                  text: product.returnPolicy || '30-day hassle-free returns in original packaging.',
                },
              ].map(({ Icon, title, text }) => (
                <div key={title} style={{
                  backgroundColor: '#f9f9f9', border: '1px solid #ebebeb',
                  borderRadius: '10px', padding: '16px',
                }}>
                  <h4 style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontFamily: 'DM Sans, sans-serif', fontWeight: '600',
                    color: '#242424', marginBottom: '6px', fontSize: '0.875rem', margin: '0 0 6px 0',
                  }}>
                    <Icon style={{ width: '15px', height: '15px', color: '#4f7d52' }} />
                    {title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#555555', lineHeight: '1.6', margin: 0 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Related products ── */}
        {related?.length > 0 && (
          <div>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontSize: '1.5rem',
              fontWeight: '700', color: '#141414', marginBottom: '20px',
            }}>
              You Might Also Like
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 190px), 1fr))',
              gap: '16px',
            }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}