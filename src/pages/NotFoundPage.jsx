import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <p className="font-display text-[10rem] font-bold text-white/5 leading-none select-none">404</p>
        <p className="absolute inset-0 flex items-center justify-center font-display text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-400 to-brand-600">
          404
        </p>
      </div>
      <h1 className="font-display text-3xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-slate-500 max-w-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/" className="btn-primary gap-2 px-8 py-3 rounded-2xl">
          Go Home <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/category/smartphones" className="btn-secondary px-8 py-3 rounded-2xl">
          Browse Products
        </Link>
      </div>
    </div>
  )
}