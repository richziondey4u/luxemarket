import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useCart }     from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { formatPrice, discountedPrice } from '../../api/products.js'
import { truncate } from '../../lib/utils.js'

export default function ProductCard({ product }) {
  const { addItem }              = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted  = isWishlisted(product.id)
  const finalPrice  = discountedPrice(product.price, product.discountPercentage)

  return (
    <div className="product-card group" style={{ position: 'relative' }}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#f7f7f7' }}>
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s',
          }}
          className="group-hover:scale-105"
        />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {product.discountPercentage > 0.5 && (
            <span className="badge-sale">-{Math.round(product.discountPercentage)}%</span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="badge-hot">Low Stock</span>
          )}
          {product.rating >= 4.8 && (
            <span className="badge-new">Top Rated</span>
          )}
        </div>

        {/* Hover overlay actions */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgb(0 0 0 / 0.15)',
          opacity: 0, transition: 'opacity 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }} className="group-hover:opacity-100">
          <Link to={`/product/${product.id}`} style={{
            width: '38px', height: '38px', backgroundColor: '#ffffff',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#3a3a3a', boxShadow: '0 2px 8px rgb(0 0 0 / 0.15)',
            transition: 'background-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f7d52'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#3a3a3a' }}
          >
            <Eye style={{ width: '16px', height: '16px' }} />
          </Link>
          <button onClick={(e) => { e.preventDefault(); addItem(product) }} style={{
            width: '38px', height: '38px', backgroundColor: '#4f7d52',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', border: 'none', cursor: 'pointer',
            boxShadow: '0 2px 8px rgb(0 0 0 / 0.15)', transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3d6440'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4f7d52'}
          >
            <ShoppingCart style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product) }}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid',
            borderColor: wishlisted ? '#f43f5e' : '#e0e0e0',
            backgroundColor: wishlisted ? '#fff1f2' : '#ffffff',
            color: wishlisted ? '#f43f5e' : '#a0a0a0',
            cursor: 'pointer', transition: 'all 0.2s',
            opacity: wishlisted ? 1 : 0,
          }}
          className="group-hover:opacity-100"
        >
          <Heart style={{ width: '14px', height: '14px', fill: wishlisted ? '#f43f5e' : 'none' }} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontSize: '0.72rem', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', fontWeight: '500' }}>
          {product.brand || product.category}
        </p>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '0.875rem', fontWeight: '500', color: '#242424',
            lineHeight: '1.4', marginBottom: '8px', transition: 'color 0.2s',
            fontFamily: 'DM Sans, system-ui, sans-serif',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#4f7d52'}
          onMouseLeave={e => e.currentTarget.style.color = '#242424'}
          >
            {truncate(product.title, 45)}
          </h3>
        </Link>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} style={{
                width: '12px', height: '12px',
                fill: i < Math.floor(product.rating) ? '#fbbf24' : 'none',
                color: i < Math.floor(product.rating) ? '#fbbf24' : '#d4d4d4',
              }} />
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#a0a0a0' }}>({product.reviews?.length || 0})</span>
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="price-tag" style={{ fontSize: '1rem' }}>{formatPrice(finalPrice)}</span>
            {product.discountPercentage > 0.5 && (
              <span style={{ fontSize: '0.78rem', color: '#a0a0a0', textDecoration: 'line-through' }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            style={{
              width: '32px', height: '32px',
              backgroundColor: '#f4f7f4', border: '1.5px solid #a3c4a5',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#4f7d52', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f7d52'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#4f7d52' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f4f7f4'; e.currentTarget.style.color = '#4f7d52'; e.currentTarget.style.borderColor = '#a3c4a5' }}
          >
            <ShoppingCart style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>
    </div>
  )
}