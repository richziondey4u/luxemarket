import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, User, ChevronRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../api/products.js'
import toast from 'react-hot-toast'

const NG_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user, updateAddress } = useAuth()
  const { items, subtotal, shipping, tax, total } = useCart()

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName:  user?.name?.split(' ').slice(1).join(' ') || '',
    email:     user?.email  || '',
    phone:     user?.phone  || '',
    address:   user?.address?.street || '',
    city:      user?.address?.city   || '',
    state:     user?.address?.state  || 'Lagos',
    zip:       user?.address?.zip    || '',
    saveAddress: true,
  })
  const [loading, setLoading] = useState(false)

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { firstName, email, phone, address, city, state } = form
    if (!firstName || !email || !phone || !address || !city || !state) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      if (form.saveAddress) {
        await updateAddress({ street: form.address, city: form.city, state: form.state, zip: form.zip })
      }
      sessionStorage.setItem('checkout_data', JSON.stringify({ ...form, items, subtotal, shipping, tax, total }))
      navigate('/payment')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, field, type = 'text', required = true, placeholder = '', readOnly = false }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type} value={form[field]} onChange={set(field)}
        placeholder={placeholder} required={required} readOnly={readOnly}
        className={`input-field ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
      />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-10 flex-wrap">
        {['Cart', 'Checkout', 'Payment', 'Done'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${i === 1 ? 'bg-brand-500 text-slate-950' : i < 1 ? 'bg-brand-500/30 text-brand-400' : 'bg-white/10 text-slate-600'}`}>
              {i < 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm ${i === 1 ? 'text-white font-medium' : 'text-slate-600'}`}>{step}</span>
            {i < 3 && <ChevronRight className="w-4 h-4 text-slate-700" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Contact */}
            <div className="card-dark rounded-2xl p-6 border border-white/8">
              <h2 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-400" /> Contact Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First Name"    field="firstName" />
                <Field label="Last Name"     field="lastName"  required={false} />
                <Field label="Email"         field="email"     type="email" />
                <Field label="Phone"         field="phone"     type="tel" placeholder="+234..." />
              </div>
            </div>

            {/* Address */}
            <div className="card-dark rounded-2xl p-6 border border-white/8">
              <h2 className="font-display text-xl font-bold text-white mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-400" /> Shipping Address
              </h2>

              {user?.address && (
                <div className="mb-4 p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                  <p className="text-sm text-brand-400 font-medium mb-1">Saved Address</p>
                  <p className="text-sm text-slate-400">{user.address.street}, {user.address.city}, {user.address.state}</p>
                  <button type="button" onClick={() => setForm(f => ({ ...f, address: user.address.street, city: user.address.city, state: user.address.state, zip: user.address.zip || '' }))}
                    className="text-xs text-brand-400 hover:underline mt-1">
                    Use this address
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <Field label="Street Address" field="address" placeholder="House number, street name" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="City" field="city" />
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">State <span className="text-red-400">*</span></label>
                    <select value={form.state} onChange={set('state')} className="input-field">
                      {NG_STATES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="ZIP Code" field="zip" required={false} />
                  <Field label="Country" field="country" readOnly value="Nigeria" />
                </div>
              </div>

              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input type="checkbox" checked={form.saveAddress}
                  onChange={e => setForm(f => ({ ...f, saveAddress: e.target.checked }))}
                  className="w-4 h-4 accent-brand-500 rounded" />
                <span className="text-sm text-slate-400">Save address for next time</span>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full gap-2 py-4 rounded-2xl text-base">
              {loading
                ? <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                : <>Continue to Payment <ChevronRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="card-dark rounded-2xl p-6 border border-white/8 sticky top-24">
            <h3 className="font-display text-xl font-bold text-white mb-5">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
              {items.map(item => (
                <div key={item.key} className="flex gap-3">
                  <img src={item.product.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate">{item.product.title}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm text-brand-400 font-semibold whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              {[['Subtotal', formatPrice(subtotal)], ['Shipping', shipping === 0 ? 'FREE' : formatPrice(shipping)], ['Tax', formatPrice(tax)]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-slate-400">{l}</span>
                  <span className={v === 'FREE' ? 'text-brand-400' : 'text-white'}>{v}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="font-display text-xl font-bold text-brand-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}