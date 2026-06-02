import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { cn } from '../lib/utils.js'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, isAuthenticated } = useAuth()
  const from = location.state?.from?.pathname || '/'

  const [form,     setForm]     = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  if (isAuthenticated) { navigate(from, { replace: true }); return null }

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const strength = form.password.length >= 10 ? 4 : form.password.length >= 8 ? 3 : form.password.length >= 6 ? 2 : form.password.length > 0 ? 1 : 0
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-brand-500']
  const strengthLabel = ['', 'Too short', 'Weak', 'Good', 'Strong']

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
            <h1 className="font-display text-3xl font-bold text-white mb-1">Create account</h1>
            <p className="text-slate-500 text-sm">Join thousands of happy shoppers</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {['Free shipping', 'Easy returns', 'Secure pay'].map(b => (
              <div key={b} className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-2 text-center">
                <p className="text-xs text-brand-400 font-medium">{b}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name <span className="text-red-400">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Doe" required className="input-field pl-10" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required className="input-field pl-10" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+234 800 000 0000" className="input-field pl-10" />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
                    placeholder="Min 6 chars" required className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')}
                    placeholder="Repeat password" required
                    className={cn('input-field pl-10', form.confirm && form.confirm !== form.password && 'ring-1 ring-red-500')} />
                </div>
              </div>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= strength ? strengthColor[strength] : 'bg-white/10')} />
                  ))}
                </div>
                <p className="text-xs text-slate-500">{strengthLabel[strength]}</p>
              </div>
            )}

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input type="checkbox" required className="w-4 h-4 mt-0.5 accent-brand-500 flex-shrink-0" />
              <span className="text-xs text-slate-500">
                I agree to the <a href="#" className="text-brand-400 hover:underline">Terms</a> and{' '}
                <a href="#" className="text-brand-400 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="btn-primary w-full gap-2 py-3.5 rounded-2xl text-base">
              {loading
                ? <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                : <>Create Account <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" state={location.state} className="text-brand-400 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-400">← Back to store</Link>
        </p>
      </div>
    </div>
  )
}