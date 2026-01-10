import { cn } from "@/lib/utils";

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex flex-col h-full relative overflow-hidden">
      {/* Efecto Shimmer (Brillo que pasa) */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent z-20" />

      {/* Badges falsos */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
      </div>

      {/* Imagen Placeholder */}
      <div className="w-full aspect-[4/5] mb-6 bg-gray-50 rounded-3xl animate-pulse flex items-center justify-center">
         <div className="w-12 h-12 rounded-full bg-gray-200/50" />
      </div>

      {/* Barras de Stats (RPG Vibe) */}
      <div className="space-y-2 mb-6 opacity-50">
        <div className="flex items-center gap-2">
           <div className="w-4 h-4 bg-gray-100 rounded-full" />
           <div className="h-1.5 flex-1 bg-gray-100 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
           <div className="w-4 h-4 bg-gray-100 rounded-full" />
           <div className="h-1.5 flex-1 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* Info Textos */}
      <div className="mt-auto space-y-3">
        <div className="h-5 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-3 w-1/2 bg-gray-50 rounded-lg" />
        
        <div className="flex items-end justify-between pt-4 border-t border-gray-50">
           <div className="space-y-1">
              <div className="h-3 w-10 bg-gray-50 rounded" />
              <div className="h-6 w-24 bg-gray-100 rounded-lg" />
           </div>
           <div className="w-10 h-10 rounded-xl bg-gray-900/10" />
        </div>
      </div>
    </div>
  );
}