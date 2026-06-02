import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login, isAuthenticated } = useAuth()
  const from = location.state?.from?.pathname || '/'

  const [form,     setForm]     = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  if (isAuthenticated) { navigate(from, { replace: true }); return null }

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="card-dark rounded-3xl p-8 border border-white/10 shadow-2xl">

          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-slate-950 font-display font-bold">L</span>
              </div>
              <span className="font-display font-bold text-white text-2xl">Luxe<span className="text-brand-400">Market</span></span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-5">
            <p className="text-xs text-amber-400 text-center">💡 Register first, then login — credentials saved locally</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" value={form.email} onChange={set('email')}
                  placeholder="you@example.com" required className="input-field pl-10" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <button type="button" className="text-xs text-brand-400 hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="••••••••" required className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full gap-2 py-3.5 rounded-2xl text-base">
              {loading
                ? <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                : <>Sign In <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" state={location.state} className="text-brand-400 hover:underline font-medium">Create one free</Link>
          </p>
        </div>
        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-400">← Back to store</Link>
        </p>
      </div>
    </div>
  )
}