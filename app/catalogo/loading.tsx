import { ProductSkeleton } from "@/components/ui/product-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FBFBFD] pt-32 pb-24 px-6 xl:px-8 max-w-[1440px] mx-auto">
      {/* Header Skeleton */}
      <div className="mb-12 space-y-4 text-center max-w-2xl mx-auto">
        <div className="h-12 w-3/4 mx-auto bg-gray-200/50 rounded-3xl animate-pulse" />
        <div className="h-4 w-1/2 mx-auto bg-gray-100 rounded-full" />
      </div>

      {/* Filtros Skeleton */}
      <div className="flex gap-4 overflow-hidden mb-12 opacity-50">
         {[1,2,3,4].map(i => (
            <div key={i} className="w-32 h-10 rounded-full bg-gray-100 flex-shrink-0" />
         ))}
      </div>

      {/* Grid de Productos Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
             <ProductSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}