"use client";

import Link from "next/link";
import { ArrowRight, LayoutGrid, Compass } from "lucide-react"; // Agregué Compass
import ProductCard from "@/components/landing/product-card";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
  products: any[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  
  // ✂️ REGLA: Solo mostramos los primeros 4
  const displayProducts = products ? products.slice(0, 4) : [];

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border">
      
      {/* Fondo técnico sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      <div className="container mx-auto px-4 md:px-6 relative">
        
        {/* --- HEADER SECCIÓN --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                        Colección Selecta
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                    Novedades <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Destacadas
                    </span>
                </h2>
            </div>

            {/* BOTÓN "EXPLORAR CATÁLOGO" (DISEÑO ORIGINAL RESTAURADO) */}
            <Link href="/catalogo" className="hidden md:block">
               <Button 
                  className="group relative h-11 pl-5 pr-7 rounded-full bg-white border border-gray-200 text-black font-bold text-sm shadow-lg shadow-black/5 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
               >
                 <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 
                 <span className="relative z-10 flex items-center gap-3">
                   <Compass size={20} className="text-black transition-transform duration-700 ease-out group-hover:rotate-180 group-hover:text-blue-600" />
                   
                   <span className="tracking-wide group-hover:text-blue-900 transition-colors duration-300">Explorar Catálogo</span>
                   
                   <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
                 </span>
               </Button>
            </Link>
        </div>

        {/* --- GRID DE PRODUCTOS (SOLO 4) --- */}
        {displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {displayProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
            </div>
        ) : (
            <div className="w-full h-64 rounded-[2rem] border border-dashed border-border flex flex-col items-center justify-center text-center bg-secondary/5">
                <LayoutGrid size={48} className="text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">Cargando inventario selecto...</p>
            </div>
        )}

        {/* Botón móvil (Solo aparece en celular) */}
        <div className="mt-12 md:hidden flex justify-center">
            <Link href="/catalogo" className="w-full">
                <Button className="w-full h-14 rounded-xl bg-foreground text-background font-bold uppercase tracking-wide shadow-lg">
                    Explorar Todo
                    <ArrowRight size={18} className="ml-2" />
                </Button>
            </Link>
        </div>

      </div>
    </section>
  );
}