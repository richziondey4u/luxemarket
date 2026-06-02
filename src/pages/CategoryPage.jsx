import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronRight, SlidersHorizontal, Grid2X2, List, X } from 'lucide-react'
import { useProductsByCategory }         from '../hooks/useProducts.js'
import { getCategoryBySlug, CATEGORIES, formatPrice } from '../api/products.js'
import ProductCard    from '../components/product/ProductCard.jsx'
import ProductSkeleton from '../components/product/ProductSkeleton.jsx'
import { cn } from '../lib/utils.js'

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'discount',   label: 'Best Discount' },
]

export default function CategoryPage() {
  const { slug } = useParams()
  const category = getCategoryBySlug(slug)

  const [sort,        setSort]        = useState('default')
  const [view,        setView]        = useState('grid')
  const [maxPrice,    setMaxPrice]    = useState(2000)
  const [minRating,   setMinRating]   = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, isError } = useProductsByCategory(slug, 30)
  const all = data?.products || []

  const filtered = all
    .filter(p => p.price <= maxPrice && p.rating >= minRating)

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'rating')     return b.rating - a.rating
    if (sort === 'discount')   return b.discountPercentage - a.discountPercentage
    return 0
  })

  if (!category) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">🔍</p>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Category not found</h2>
      <Link to="/" className="btn-primary mt-4">Back to Home</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link to="/" className="text-slate-500 hover:text-brand-400">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-300 font-medium">{category.label}</span>
      </nav>

      {/* Category hero */}
      <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 mb-10 bg-gradient-to-r ${category.color}`}>
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="relative">
          <span className="text-5xl mb-4 block">{category.icon}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">{category.label}</h1>
          <p className="text-white/70">{category.description} · {data?.total || sorted.length} products</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-white/10 p-6 overflow-y-auto transition-transform',
          'lg:relative lg:inset-auto lg:z-auto lg:w-64 lg:flex-shrink-0 lg:border lg:border-white/8 lg:rounded-2xl lg:h-fit lg:translate-x-0',
          showFilters ? 'translate-x-0' : '-translate-x-full',
        )}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="font-semibold text-white">Filters</h3>
            <button onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-slate-400" /></button>
          </div>

          <div className="space-y-6">
            {/* Price */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Max Price</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>$0</span><span>{formatPrice(maxPrice)}</span>
                </div>
                <input type="range" min={0} max={2000} step={10} value={maxPrice}
                  onChange={e => setMaxPrice(+e.target.value)}
                  className="w-full accent-brand-500" />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Min Rating</h4>
              <div className="space-y-1.5">
                {[0, 3, 3.5, 4, 4.5].map(r => (
                  <button key={r} onClick={() => setMinRating(r)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      minRating === r ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:bg-white/8',
                    )}>
                    {r === 0 ? 'All Ratings' : `${r}★ & above`}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { setMaxPrice(2000); setMinRating(0) }}
              className="text-sm text-slate-500 hover:text-brand-400 transition-colors w-full text-left">
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setShowFilters(false)} />
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(true)} className="lg:hidden btn-secondary text-sm py-2 gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <p className="text-sm text-slate-500">
                <span className="text-white font-medium">{sorted.length}</span> products
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="bg-white/5 border border-white/10 text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500">
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                {[{ v: 'grid', I: Grid2X2 }, { v: 'list', I: List }].map(({ v, I }) => (
                  <button key={v} onClick={() => setView(v)}
                    className={cn('p-1.5 rounded-lg transition-colors', view === v ? 'bg-brand-500/20 text-brand-400' : 'text-slate-500 hover:text-white')}>
                    <I className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading  && <ProductSkeleton count={8} />}
          {isError    && <div className="text-center py-16 text-slate-400">Failed to load. Please refresh.</div>}
          {!isLoading && !isError && sorted.length === 0 && (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-slate-400 mb-4">No products match your filters.</p>
              <button onClick={() => { setMaxPrice(2000); setMinRating(0) }} className="btn-outline text-sm">Clear Filters</button>
            </div>
          )}
          {!isLoading && sorted.length > 0 && (
            <div className={view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5'
              : 'space-y-4'}>
              {sorted.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Other categories */}
      <section className="mt-20">
        <h2 className="section-title mb-6">More Categories</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.filter(c => c.slug !== slug).map(cat => (
            <Link key={cat.slug} to={`/category/${cat.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white hover:border-brand-500/40 hover:bg-brand-500/10 transition-all">
              <span>{cat.icon}</span> {cat.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}