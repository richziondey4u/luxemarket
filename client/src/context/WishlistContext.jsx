import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)
const KEY = 'lm_wishlist'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch { setItems([]) }
  }, [])

  const toggle = useCallback((product) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === product.id)
      const next   = exists ? prev.filter(i => i.id !== product.id) : [...prev, product]
      localStorage.setItem(KEY, JSON.stringify(next))
      toast.success(exists ? 'Removed from wishlist' : 'Added to wishlist ❤️', { duration: 2000 })
      return next
    })
  }, [])

  const isWishlisted = useCallback((id) => items.some(i => i.id === id), [items])

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider')
  return ctx
}