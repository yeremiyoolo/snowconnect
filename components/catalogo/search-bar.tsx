"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce"; // Necesitarás instalar esto o usar un timeout simple
// Si no tienes use-debounce, instálalo: npm i use-debounce
// O usa este código sin la librería (versión simple nativa):

export function CatalogSearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    // Actualiza la URL sin recargar la página
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input 
        type="text" 
        placeholder="Buscar iPhone 15 Pro..." 
        className="w-full pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
}