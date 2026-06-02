export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden">
          <div className="aspect-square shimmer-bg" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/3 shimmer-bg rounded" />
            <div className="h-4 w-full shimmer-bg rounded" />
            <div className="h-3 w-2/3 shimmer-bg rounded" />
            <div className="h-5 w-1/2 shimmer-bg rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}