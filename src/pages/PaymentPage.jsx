import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Shield, CheckCircle, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../api/products.js'
import { generateOrderId } from '../lib/utils.js'
import toast from 'react-hot-toast'

// ──────────────────────────────────────────────────────────────────────────────
// PAYSTACK SETUP
// 1. Go to https://dashboard.paystack.com → Settings → API Keys
// 2. Copy your Public Key and paste it below
// 3. When you build your backend, verify payments with:
//    GET https://api.paystack.co/transaction/verify/:reference
//    (using your SECRET key on the server only)
// ──────────────────────────────────────────────────────────────────────────────
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { total, clearCart, items } = useCart()

  const [checkoutData,   setCheckoutData]   = useState(null)
  const [paymentMethod,  setPaymentMethod]  = useState('paystack')
  const [loading,        setLoading]        = useState(false)
  const [paystackReady,  setPaystackReady]  = useState(false)

  // Inject Paystack inline script
  useEffect(() => {
    if (document.getElementById('paystack-js')) { setPaystackReady(true); return }
    const s = document.createElement('script')
    s.id  = 'paystack-js'
    s.src = 'https://js.paystack.co/v1/inline.js'
    s.onload  = () => setPaystackReady(true)
    s.onerror = () => toast.error('Could not load Paystack. Check your internet.')
    document.head.appendChild(s)
  }, [])

  // Load checkout session
  useEffect(() => {
    const raw = sessionStorage.getItem('checkout_data')
    if (!raw) { navigate('/checkout'); return }
    try { setCheckoutData(JSON.parse(raw)) } catch { navigate('/checkout') }
  }, [navigate])

  const onSuccess = (orderId, reference) => {
    // Save order locally (replace with POST /api/orders when backend ready)
    const prev   = JSON.parse(localStorage.getItem('lm_orders') || '[]')
    const order  = {
      id: orderId, reference, items, total,
      status: 'paid',
      shippingAddress: checkoutData,
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    localStorage.setItem('lm_orders', JSON.stringify([...prev, order]))
    clearCart()
    sessionStorage.removeItem('checkout_data')
    toast.success('Payment successful! 🎉')
    navigate(`/account`)
  }

  const handlePaystack = () => {
    if (!paystackReady) { toast.error('Paystack not ready yet. Please wait.'); return }
    const orderId = generateOrderId()
    const handler = window.PaystackPop.setup({
      key:      PAYSTACK_PUBLIC_KEY,
      email:    user.email,
      amount:   Math.round(total * 100), // kobo — adjust currency/amount for production
      currency: 'NGN',
      ref:      orderId,
      metadata: {
        custom_fields: [
          { display_name: 'Customer', variable_name: 'customer', value: user.name },
        ],
      },
      callback: (res) => onSuccess(orderId, res.reference),
      onClose:  ()    => toast('Payment cancelled', { icon: '⚠️' }),
    })
    handler.openIframe()
  }

  const handleDemo = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    onSuccess(generateOrderId(), `demo_${Date.now()}`)
    setLoading(false)
  }

  if (!checkoutData) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-10 flex-wrap">
        {['Cart', 'Checkout', 'Payment', 'Done'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${i === 2 ? 'bg-brand-500 text-slate-950' : i < 2 ? 'bg-brand-500/30 text-brand-400' : 'bg-white/10 text-slate-600'}`}>
              {i < 2 ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm ${i === 2 ? 'text-white font-medium' : i < 2 ? 'text-brand-400' : 'text-slate-600'}`}>{step}</span>
            {i < 3 && <ChevronRight className="w-4 h-4 text-slate-700" />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Left — payment form */}
        <div className="space-y-5">
          <div className="card-dark rounded-2xl p-6 border border-white/8">
            <h2 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-400" /> Payment Method
            </h2>

            {/* Method options */}
            <div className="space-y-3 mb-5">
              {[
                { id: 'paystack',     label: 'Paystack',     desc: 'Card, Bank Transfer, USSD', icon: '💳' },
                { id: 'flutterwave', label: 'Flutterwave',  desc: 'Card, Mobile Money, Bank',  icon: '⚡' },
              ].map(m => (
                <label key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                    ${paymentMethod === m.id ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'}`}>
                  <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)} className="accent-brand-500" />
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{m.label}</p>
                    <p className="text-xs text-slate-500">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Notice */}
            {/* <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-300 font-medium">Setup Required</p>
                  <p className="text-xs text-blue-400/70 mt-0.5">
                    Replace <code className="bg-blue-900/40 px-1 rounded">PAYSTACK_PUBLIC_KEY</code> in this file with your real key from{' '}
                    <span className="underline">dashboard.paystack.com</span>
                  </p>
                </div>
              </div>
            </div> */}

            {/* Pay button */}
            <button onClick={handlePaystack} disabled={loading || !paystackReady}
              className="btn-primary w-full gap-2 py-4 rounded-2xl text-base mb-3">
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <>Pay {formatPrice(total)} <ChevronRight className="w-4 h-4" /></>
              }
            </button>

            {/* Demo bypass */}
            <button onClick={handleDemo} disabled={loading}
              className="btn-secondary w-full py-3 rounded-2xl text-sm">
              {loading ? 'Processing...' : '🧪 Demo — Skip to success (dev only)'}
            </button>
          </div>

          <div className="flex items-start gap-3 px-2">
            <Shield className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500">All payments are secured with 256-bit SSL encryption. Your card details are never stored on our servers.</p>
          </div>
        </div>

        {/* Right — order summary */}
        <div>
          <div className="card-dark rounded-2xl p-6 border border-white/8">
            <h3 className="font-display text-xl font-bold text-white mb-5">Order Details</h3>

            {/* Shipping to */}
            <div className="mb-5 p-4 bg-white/5 rounded-xl">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Shipping to</p>
              <p className="text-sm text-white font-medium">{checkoutData.firstName} {checkoutData.lastName}</p>
              <p className="text-sm text-slate-400">{checkoutData.address}</p>
              <p className="text-sm text-slate-400">{checkoutData.city}, {checkoutData.state}</p>
              <p className="text-sm text-slate-400">{checkoutData.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-5 max-h-52 overflow-y-auto">
              {items.map(item => (
                <div key={item.key} className="flex gap-3 items-center">
                  <img src={item.product.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate">{item.product.title}</p>
                    <p className="text-xs text-slate-500">× {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-white">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              {[
                ['Subtotal', formatPrice(checkoutData.subtotal)],
                ['Shipping', checkoutData.shipping === 0 ? 'FREE' : formatPrice(checkoutData.shipping)],
                ['Tax',      formatPrice(checkoutData.tax)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-slate-400">{l}</span>
                  <span className={v === 'FREE' ? 'text-brand-400' : 'text-white'}>{v}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-semibold text-white text-lg">Total</span>
                <span className="font-display text-2xl font-bold text-brand-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}