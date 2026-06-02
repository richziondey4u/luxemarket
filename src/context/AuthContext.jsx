import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const USERS_KEY   = 'lm_users'
const SESSION_KEY = 'lm_session'

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY)
      if (s) setUser(JSON.parse(s))
    } catch { localStorage.removeItem(SESSION_KEY) }
    setLoading(false)
  }, [])

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
  }

  const register = useCallback(async ({ name, email, password, phone = '' }) => {
    await new Promise(r => setTimeout(r, 700))
    const users = getUsers()
    if (users.find(u => u.email === email)) throw new Error('Email already registered')

    const newUser = {
      id: `user_${Date.now()}`,
      name, email, password, phone,
      address: null,
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=22c55e&textColor=ffffff`,
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))

    const { password: _, ...safe } = newUser
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
    setUser(safe)
    toast.success(`Welcome to LuxeMarket, ${name}! 🎉`)
    return safe
  }, [])

  const login = useCallback(async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 700))
    const found = getUsers().find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password')

    const { password: _, ...safe } = found
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
    setUser(safe)
    toast.success(`Welcome back, ${safe.name}!`)
    return safe
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateProfile = useCallback(async (updates) => {
    await new Promise(r => setTimeout(r, 400))
    const users  = getUsers()
    const idx    = users.findIndex(u => u.id === user.id)
    if (idx === -1) throw new Error('User not found')
    const updated = { ...users[idx], ...updates }
    users[idx] = updated
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const { password: _, ...safe } = updated
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
    setUser(safe)
    toast.success('Profile updated!')
    return safe
  }, [user])

  const updateAddress = useCallback(
    (address) => updateProfile({ address }),
    [updateProfile]
  )

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      isAuthenticated: !!user,
      register, login, logout, updateProfile, updateAddress,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}