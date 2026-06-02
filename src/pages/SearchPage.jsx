import { useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { useSearchProducts } from '../hooks/useProducts.js'
import ProductCard    from '../components/product/ProductCard.jsx'
import ProductSkeleton from '../components/product/ProductSkeleton.jsx'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data: results, isLoading } = useSearchProducts(query)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Search Results</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLoading ? 'Searching...' : `${results?.length || 0} results for `}
            {!isLoading && query && <span className="text-brand-400 font-medium">"{query}"</span>}
          </p>
        </div>
      </div>

      {!query && (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Enter a search term to find products</p>
        </div>
      )}

      {query && isLoading && <ProductSkeleton count={8} />}

      {query && !isLoading && results?.length === 0 && (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">No results found</h2>
          <p className="text-slate-500 mb-6">Try different keywords or browse our categories.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      )}

      {results?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {results.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}