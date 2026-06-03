import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, User, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../api/products.js'
import toast from 'react-hot-toast'

const NG_STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

const STEPS = ['Information', 'Shipping', 'Payment']

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
  const set = f => e => setForm(v => ({ ...v, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { firstName, email, phone, address, city, state } = form
    if (!firstName || !email || !phone || !address || !city || !state) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      if (form.saveAddress) await updateAddress({ street: form.address, city: form.city, state: form.state, zip: form.zip })
      sessionStorage.setItem('checkout_data', JSON.stringify({ ...form, items, subtotal, shipping, tax, total }))
      navigate('/payment')
    } catch { toast.error('Something went wrong.') }
    finally { setLoading(false) }
  }

  const Field = ({ label, field, type = 'text', required = true, placeholder = '' }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#3a3a3a', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input type={type} value={form[field]} onChange={set(field)} placeholder={placeholder} required={required}
        className="input-field" style={{ fontSize: '0.875rem' }} />
    </div>
  )

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 64px' }}>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', gap: '0', overflowX: 'auto', padding: '4px' }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: '700',
                  backgroundColor: i === 1 ? '#4f7d52' : i < 1 ? '#f4f7f4' : '#f3f3f3',
                  color: i === 1 ? '#fff' : i < 1 ? '#4f7d52' : '#a0a0a0',
                  border: i === 1 ? 'none' : `2px solid ${i < 1 ? '#a3c4a5' : '#e0e0e0'}`,
                }}>
                  {i < 1 ? <Check style={{ width: '13px', height: '13px' }} /> : i + 1}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: i === 1 ? '600' : '400', color: i === 1 ? '#242424' : '#a0a0a0', whiteSpace: 'nowrap' }}>{step}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: '40px', height: '1.5px', backgroundColor: '#e0e0e0', margin: '0 8px', flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', alignItems: 'flex-start' }}>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Contact */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #ebebeb', borderRadius: '12px', padding: '20px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '700', color: '#141414', marginBottom: '16px' }}>
                <User style={{ width: '16px', height: '16px', color: '#4f7d52' }} /> Contact Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
                <Field label="First Name" field="firstName" />
                <Field label="Last Name"  field="lastName"  required={false} />
                <Field label="Email"      field="email"     type="email" />
                <Field label="Phone"      field="phone"     type="tel" placeholder="+234..." />
              </div>
            </div>

            {/* Address */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #ebebeb', borderRadius: '12px', padding: '20px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '700', color: '#141414', marginBottom: '16px' }}>
                <MapPin style={{ width: '16px', height: '16px', color: '#4f7d52' }} /> Shipping Address
              </h2>

              {user?.address && (
                <div style={{ backgroundColor: '#f4f7f4', border: '1px solid #a3c4a5', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
                  <p style={{ fontSize: '0.78rem', color: '#4f7d52', fontWeight: '600', marginBottom: '4px' }}>Saved Address</p>
                  <p style={{ fontSize: '0.82rem', color: '#555' }}>{user.address.street}, {user.address.city}, {user.address.state}</p>
                  <button type="button" onClick={() => setForm(f => ({ ...f, address: user.address.street, city: user.address.city, state: user.address.state, zip: user.address.zip || '' }))}
                    style={{ fontSize: '0.75rem', color: '#4f7d52', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline' }}>
                    Use this address
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Field label="Street Address" field="address" placeholder="House number, street name" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '12px' }}>
                  <Field label="City" field="city" />
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#3a3a3a', marginBottom: '6px' }}>
                      State <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select value={form.state} onChange={set('state')} className="input-field" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                      {NG_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '12px' }}>
                  <Field label="ZIP Code" field="zip" required={false} />
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#3a3a3a', marginBottom: '6px' }}>Country</label>
                    <input value="Nigeria" readOnly className="input-field" style={{ fontSize: '0.875rem' }} />
                  </div>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.saveAddress} onChange={e => setForm(f => ({ ...f, saveAddress: e.target.checked }))}
                  style={{ width: '15px', height: '15px', accentColor: '#4f7d52' }} />
                <span style={{ fontSize: '0.82rem', color: '#757575' }}>Save address for next time</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', borderRadius: '8px', fontSize: '0.875rem', padding: '12px', justifyContent: 'center' }}>
              {loading
                ? <div style={{ width: '18px', height: '18px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <>Continue to Payment <ChevronRight style={{ width: '16px', height: '16px' }} /></>
              }
            </button>
          </form>

          {/* Order summary */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #ebebeb', borderRadius: '12px', padding: '20px', position: 'sticky', top: '80px' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: '700', color: '#141414', marginBottom: '16px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', maxHeight: '220px', overflowY: 'auto' }}>
              {items.map(item => (
                <div key={item.key} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={item.product.thumbnail} alt="" style={{ width: '44px', height: '44px', borderRadius: '7px', objectFit: 'cover', backgroundColor: '#f7f7f7', flexShrink: 0, border: '1px solid #ebebeb' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.78rem', color: '#3a3a3a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.title}</p>
                    <p style={{ fontSize: '0.7rem', color: '#a0a0a0' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#141414', whiteSpace: 'nowrap' }}>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #ebebeb', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[['Subtotal', formatPrice(subtotal)], ['Shipping', shipping === 0 ? 'FREE' : formatPrice(shipping)], ['Tax', formatPrice(tax)]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#757575' }}>{l}</span>
                  <span style={{ color: v === 'FREE' ? '#4f7d52' : '#242424', fontWeight: v === 'FREE' ? '600' : '400' }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #ebebeb', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#141414' }}>Total</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.2rem', fontWeight: '700', color: '#141414' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}