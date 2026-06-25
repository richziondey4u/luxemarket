import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { User, Package, Heart, MapPin, Settings, LogOut, Edit3, Save, ShoppingBag, Star } from 'lucide-react'
import { useAuth }     from '../context/AuthContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart }     from '../context/CartContext.jsx'
import { formatPrice } from '../api/products.js'
import { formatDate }  from '../lib/utils.js'

const NG_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
]

const TABS = [
  { id: 'overview', label: 'Overview',  icon: User     },
  { id: 'orders',   label: 'Orders',    icon: Package  },
  { id: 'wishlist', label: 'Wishlist',  icon: Heart    },
  { id: 'address',  label: 'Address',   icon: MapPin   },
  { id: 'settings', label: 'Settings',  icon: Settings },
]

export default function AccountPage() {
  const [searchParams] = useSearchParams()
  const [tab,    setTab]    = useState(searchParams.get('tab') || 'overview')
  const [saving, setSaving] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const [editAddress, setEditAddress] = useState(false)

  const { user, logout, updateProfile, updateAddress } = useAuth()
  const { items: wishItems, toggle } = useWishlist()
  const { addItem } = useCart()

  const orders = JSON.parse(localStorage.getItem('lm_orders') || '[]')
    .filter(o => o.userId === user?.id).reverse()

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [addressForm, setAddressForm] = useState({
    street: user?.address?.street || '',
    city:   user?.address?.city   || '',
    state:  user?.address?.state  || 'Lagos',
    zip:    user?.address?.zip    || '',
  })

  const saveProfile = async () => {
    setSaving(true)
    await updateProfile(profileForm)
    setEditProfile(false)
    setSaving(false)
  }

  const saveAddress = async () => {
    setSaving(true)
    await updateAddress(addressForm)
    setEditAddress(false)
    setSaving(false)
  }

  const cn = (...c) => c.filter(Boolean).join(' ')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-dark rounded-2xl p-5 border border-white/8 mb-4 text-center">
            <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full border-2 border-brand-500/40 mx-auto mb-3" />
            <h3 className="font-semibold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
            <p className="text-xs text-brand-400 mt-1 font-medium">Member since {formatDate(user?.createdAt)}</p>
          </div>

          <div className="card-dark rounded-2xl border border-white/8 overflow-hidden">
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2',
                    tab === t.id
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5',
                  )}>
                  <Icon className="w-4 h-4" /> {t.label}
                  {t.id === 'wishlist' && wishItems.length > 0 && (
                    <span className="ml-auto badge-hot text-xs px-1.5 py-0.5">{wishItems.length}</span>
                  )}
                  {t.id === 'orders' && orders.length > 0 && (
                    <span className="ml-auto badge-new text-xs px-1.5 py-0.5">{orders.length}</span>
                  )}
                </button>
              )
            })}
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors border-l-2 border-transparent">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-white">Account Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Orders',   value: orders.length,     icon: <Package className="w-5 h-5" />, color: 'text-brand-400' },
                  { label: 'Wishlist', value: wishItems.length,  icon: <Heart className="w-5 h-5" />,   color: 'text-rose-400'  },
                  { label: 'Reviews',  value: 0,                 icon: <Star className="w-5 h-5" />,    color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="card-dark rounded-2xl p-5 border border-white/8 text-center">
                    <div className={`${s.color} flex justify-center mb-2`}>{s.icon}</div>
                    <p className="text-2xl font-display font-bold text-white">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {orders.length > 0 ? (
                <div className="card-dark rounded-2xl p-5 border border-white/8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Latest Order</h3>
                    <button onClick={() => setTab('orders')} className="text-xs text-brand-400 hover:underline">View all</button>
                  </div>
                  <OrderCard order={orders[0]} expanded />
                </div>
              ) : (
                <div className="card-dark rounded-2xl p-10 border border-white/8 text-center">
                  <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No orders yet. Start shopping!</p>
                  <Link to="/" className="btn-primary text-sm">Browse Products</Link>
                </div>
              )}
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-white">My Orders</h2>
              {orders.length === 0 ? (
                <div className="card-dark rounded-2xl p-10 border border-white/8 text-center">
                  <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No orders yet.</p>
                  <Link to="/" className="btn-primary text-sm">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => <OrderCard key={o.id} order={o} expanded />)}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST */}
          {tab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-white">My Wishlist</h2>
              {wishItems.length === 0 ? (
                <div className="card-dark rounded-2xl p-10 border border-white/8 text-center">
                  <Heart className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">Your wishlist is empty.</p>
                  <Link to="/" className="btn-primary text-sm">Discover Products</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {wishItems.map(product => (
                    <div key={product.id} className="card-dark rounded-2xl p-4 border border-white/8 flex gap-4">
                      <Link to={`/product/${product.id}`} className="flex-shrink-0">
                        <img src={product.thumbnail} alt={product.title} className="w-20 h-20 rounded-xl object-cover bg-slate-800" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${product.id}`}>
                          <p className="text-sm font-medium text-white hover:text-brand-400 transition-colors truncate">{product.title}</p>
                        </Link>
                        <p className="price-tag text-base mt-1">{formatPrice(product.price)}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => addItem(product)} className="btn-primary text-xs py-1.5 px-3 rounded-lg">Add to Cart</button>
                          <button onClick={() => toggle(product)} className="text-xs text-red-400 hover:text-red-300 px-2">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESS */}
          {tab === 'address' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-white">Shipping Address</h2>
                {!editAddress && (
                  <button onClick={() => setEditAddress(true)} className="btn-outline text-sm py-2 gap-1">
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              <div className="card-dark rounded-2xl p-6 border border-white/8">
                {editAddress ? (
                  <div className="space-y-4">
                    {[
                      { label: 'Street Address', field: 'street', ph: 'House number, street' },
                      { label: 'City',            field: 'city',   ph: 'City'                },
                      { label: 'ZIP Code',         field: 'zip',    ph: 'Postal code'         },
                    ].map(({ label, field, ph }) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
                        <input value={addressForm[field]}
                          onChange={e => setAddressForm(f => ({ ...f, [field]: e.target.value }))}
                          placeholder={ph} className="input-field" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">State</label>
                      <select value={addressForm.state}
                        onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))}
                        className="input-field">
                        {NG_STATES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={saveAddress} disabled={saving} className="btn-primary gap-2 py-2.5">
                        {saving ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                      </button>
                      <button onClick={() => setEditAddress(false)} className="btn-secondary py-2.5">Cancel</button>
                    </div>
                  </div>
                ) : user?.address ? (
                  <div className="space-y-1.5">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-slate-400">{user.address.street}</p>
                    <p className="text-slate-400">{user.address.city}, {user.address.state} {user.address.zip}</p>
                    <p className="text-slate-400">Nigeria</p>
                    {user.phone && <p className="text-slate-400">{user.phone}</p>}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400 mb-4">No address saved yet.</p>
                    <button onClick={() => setEditAddress(true)} className="btn-primary text-sm">Add Address</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-white">Profile Settings</h2>
              <div className="card-dark rounded-2xl p-6 border border-white/8">
                {editProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                      <input value={profileForm.name}
                        onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                        className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
                      <input value={profileForm.phone}
                        onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                        className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Email (read-only)</label>
                      <input value={user?.email} readOnly className="input-field opacity-50 cursor-not-allowed" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={saveProfile} disabled={saving} className="btn-primary gap-2 py-2.5">
                        {saving ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                      </button>
                      <button onClick={() => setEditProfile(false)} className="btn-secondary py-2.5">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[['Full Name', user?.name], ['Email', user?.email], ['Phone', user?.phone || '—']].map(([l, v]) => (
                      <div key={l}>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{l}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                    <button onClick={() => setEditProfile(true)} className="btn-outline text-sm py-2 gap-2">
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                  </div>
                )}
              </div>

              <div className="card-dark rounded-2xl p-6 border border-red-500/20">
                <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back.</p>
                <button className="text-sm text-red-400 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order, expanded }) {
  const statusStyle = {
    paid:      'text-brand-400 bg-brand-500/15 border-brand-500/30',
    pending:   'text-amber-400 bg-amber-500/15 border-amber-500/30',
    shipped:   'text-blue-400 bg-blue-500/15 border-blue-500/30',
    delivered: 'text-green-400 bg-green-500/15 border-green-500/30',
    cancelled: 'text-red-400 bg-red-500/15 border-red-500/30',
  }
  const s = statusStyle[order.status] || statusStyle.paid

  return (
    <div className="border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-white">{order.id}</p>
          <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${s}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <span className="price-tag text-sm">{formatPrice(order.total)}</span>
        </div>
      </div>

      {expanded && (
        <div className="flex gap-2 flex-wrap mt-2">
          {order.items?.slice(0, 4).map(item => (
            <img key={item.key} src={item.product?.thumbnail} alt=""
              className="w-12 h-12 rounded-lg object-cover bg-slate-800 border border-white/10"
              title={item.product?.title} />
          ))}
          {order.items?.length > 4 && (
            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-slate-500">
              +{order.items.length - 4}
            </div>
          )}
        </div>
      )}

      {order.shippingAddress && (
        <p className="text-xs text-slate-500 mt-2">
          → {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}
        </p>
      )}
    </div>
  )
}