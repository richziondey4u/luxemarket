import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)
const CART_KEY = 'lm_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(CART_KEY) || '[]')) } catch { setItems([]) }
  }, [])

  const save = (next) => {
    setItems(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
  }

  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const key      = `${product.id}`
      const existing = prev.find(i => i.key === key)
      const next     = existing
        ? prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { key, id: product.id, product, quantity }]
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      return next
    })
    toast.success(`Added to cart 🛒`, { duration: 2000 })
  }, [])

  const removeItem = useCallback((key) => {
    setItems(prev => {
      const next = prev.filter(i => i.key !== key)
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      return next
    })
    toast.success('Item removed')
  }, [])

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) return
    setItems(prev => {
      const next = prev.map(i => i.key === key ? { ...i, quantity } : i)
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearCart = useCallback(() => save([]), [])

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping  = subtotal > 100 ? 0 : 9.99
  const tax       = subtotal * 0.075
  const total     = subtotal + shipping + tax
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      subtotal, shipping, tax, total, totalItems,
      isEmpty: items.length === 0,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}