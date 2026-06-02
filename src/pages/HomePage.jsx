import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck, RotateCcw, Star, ChevronRight } from 'lucide-react'
import { useFeaturedProducts, useNewArrivals, useBestSellers } from '../hooks/useProducts.js'
import ProductCard    from '../components/product/ProductCard.jsx'
import ProductSkeleton from '../components/product/ProductSkeleton.jsx'
import { CATEGORIES } from '../api/products.js'

const PERKS = [
  { icon: <Truck    className="w-5 h-5" />, title: 'Free Shipping',   desc: 'On orders over $100' },
  { icon: <Shield   className="w-5 h-5" />, title: 'Secure Payment',  desc: 'Paystack encrypted'  },
  { icon: <RotateCcw className="w-5 h-5" />, title: 'Easy Returns',   desc: '30-day return policy' },
  { icon: <Zap      className="w-5 h-5" />, title: 'Fast Delivery',   desc: '2–5 business days'   },
]

export default function HomePage() {
  const { data: featured,    isLoading: fl } = useFeaturedProducts(8)
  const { data: newArrivals, isLoading: nl } = useNewArrivals()
  const { data: bestSellers, isLoading: bl } = useBestSellers()

  return (
    <div className="space-y-24">

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-brand-950/20" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow" />
                <span className="text-brand-400 text-sm font-medium">New Collection 2026</span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight">
                Shop the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-300">
                  Future
                </span>{' '}
                of Retail
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                Discover thousands of premium products across electronics, fashion, home decor and more.
                Delivered fast, guaranteed quality.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/category/smartphones" className="btn-primary gap-2 text-base px-8 py-3.5 rounded-2xl">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/category/tops" className="btn-secondary text-base px-8 py-3.5 rounded-2xl">
                  Browse Fashion
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-2">
                {[{ v: '50K+', l: 'Products' }, { v: '4.9★', l: 'Rating' }, { v: '120K+', l: 'Customers' }].map(s => (
                  <div key={s.l}>
                    <p className="text-2xl font-display font-bold text-white">{s.v}</p>
                    <p className="text-xs text-slate-500 font-medium">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card */}
            <div className="hidden lg:block">
              <div className="relative max-w-sm mx-auto">
                <div className="card-glass p-6 rounded-3xl shadow-2xl">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-slate-800 to-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">5.0 (2,148)</span>
                    </div>
                    <h3 className="font-display font-bold text-white text-lg">Premium Collection</h3>
                    <p className="text-sm text-slate-400">Exclusive deals updated daily</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-brand-400 font-display font-bold text-2xl">$49.99</span>
                      <Link to="/category/smartphones" className="btn-primary text-sm py-2 px-4">View →</Link>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-amber-500 text-slate-950 rounded-2xl px-4 py-2 shadow-glow-amber font-bold text-sm">
                  🔥 Hot Deal
                </div>
                <div className="absolute -bottom-4 -left-4 card-dark rounded-2xl px-4 py-2.5 border border-brand-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-500/20 rounded-lg flex items-center justify-center">
                      <Truck className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Free Delivery</p>
                      <p className="text-xs text-slate-500">Orders over $100</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks bar ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PERKS.map((p, i) => (
            <div key={i} className="card-glass p-5 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center text-brand-400 flex-shrink-0">
                {p.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{p.title}</p>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-1">Browse</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link to="/category/smartphones" className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1">
            All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/2] sm:aspect-square"
            >
              <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70 group-hover:opacity-80 transition-opacity`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl mb-2 drop-shadow-lg">{cat.icon}</span>
                <span className="font-display font-bold text-white text-sm md:text-base drop-shadow leading-tight">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-1">Handpicked</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link to="/category/smartphones" className="btn-outline text-sm py-2">View All</Link>
        </div>
        {fl ? <ProductSkeleton count={8} /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured?.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Promo banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 border border-brand-500/20 p-10 md:p-16">
          <div className="absolute inset-0 bg-hero-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-brand-400 font-medium mb-2 uppercase tracking-widest text-sm">Limited Time</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Up to 50% Off<br />Electronics
            </h2>
            <p className="text-slate-400 mb-8 max-w-md">Get the best deals on smartphones, laptops and accessories. Sale ends Sunday.</p>
            <Link to="/category/smartphones" className="btn-primary gap-2 text-base px-8 py-3.5 rounded-2xl">
              Shop Electronics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-1">Just In</p>
          <h2 className="section-title">New Arrivals</h2>
        </div>
        {nl ? <ProductSkeleton count={4} /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals?.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Best Sellers ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-rose-400 text-sm font-medium uppercase tracking-widest mb-1">🔥 Trending</p>
          <h2 className="section-title">Best Sellers</h2>
        </div>
        {bl ? <ProductSkeleton count={4} /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers?.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-12">
          <p className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-2">Reviews</p>
          <h2 className="section-title">What Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Amara O.',  review: 'Fastest delivery I ever experienced. My laptop arrived in 2 days!', rating: 5, avatar: 'AO' },
            { name: 'Chidi N.',  review: 'Great product quality. The skincare items are exactly as described.',  rating: 5, avatar: 'CN' },
            { name: 'Fatima B.', review: 'Excellent customer service. Returns process was seamless and quick.',  rating: 4, avatar: 'FB' },
          ].map((t, i) => (
            <div key={i} className="card-dark p-6 rounded-2xl border border-white/8">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">"{t.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 font-bold text-sm">
                  {t.avatar}
                </div>
                <span className="text-sm font-medium text-white">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}