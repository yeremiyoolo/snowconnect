"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, ArrowRightLeft, Check, Heart, Plus } from "lucide-react";
import { useCompare } from "@/context/compare-context";
import { useWishlist } from "@/context/wishlist-context"; // <--- Importar Wishlist
import { useCartStore } from "@/lib/store"; // <--- Importar Carrito
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // <--- Para notificaciones

// Helper para parsear imagen
const safeImageParse = (jsonString: string | null): string => {
  if (!jsonString) return "/placeholder-phone.png";
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "/placeholder-phone.png";
  } catch (e) {
    return "/placeholder-phone.png";
  }
};

interface ProductGridProps {
  productos: any[];
}

export function ProductGrid({ productos }: ProductGridProps) {
  const { selectedIds, toggleCompare } = useCompare();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent, prod: any, imagen: string) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: prod.id,
      modelo: prod.modelo,
      marca: prod.marca,
      precio: prod.precioVenta,
      imagen: imagen,
      cantidad: 1
    });
    toast({ title: "🛍️ Agregado al carrito", description: `${prod.modelo} listo para comprar.` });
  };

  const handleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  if (productos.length === 0) {
    return (
      <div className="py-24 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
           <ShoppingCart size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Inventario en proceso</h3>
        <p className="text-gray-400 text-sm">Estamos actualizando el stock.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((prod, index) => {
        const imagen = safeImageParse(prod.fotosJson);
        const isSelected = selectedIds.includes(prod.id);
        const isWished = isInWishlist(prod.id);

        return (
          <div key={prod.id} className="relative group h-full">
            {/* --- BOTONES FLOTANTES SUPERIORES --- */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
                {/* Comparar */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCompare(prod.id);
                  }}
                  className={cn(
                    "p-2.5 rounded-full transition-all duration-300 border shadow-sm",
                    isSelected 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : "bg-white/90 backdrop-blur-md border-gray-100 text-gray-400 hover:text-blue-600 hover:scale-110"
                  )}
                  title="Comparar"
                >
                  {isSelected ? <Check size={16} strokeWidth={3} /> : <ArrowRightLeft size={16} />}
                </button>
                
                {/* Wishlist */}
                <button 
                  onClick={(e) => handleWishlist(e, prod.id)}
                  className={cn(
                    "p-2.5 rounded-full transition-all duration-300 border shadow-sm",
                    isWished
                      ? "bg-red-50 border-red-100 text-red-500" 
                      : "bg-white/90 backdrop-blur-md border-gray-100 text-gray-400 hover:text-red-500 hover:scale-110"
                  )}
                  title="Favoritos"
                >
                  <Heart size={16} className={cn(isWished && "fill-current")} />
                </button>
            </div>

            <Link href={`/producto/${prod.id}`} className="block h-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className={cn(
                    "bg-white rounded-[2rem] p-4 h-full border transition-all duration-500 flex flex-col",
                    isSelected 
                        ? "border-blue-200 shadow-[0_10px_30px_rgba(37,99,235,0.1)] ring-1 ring-blue-100" 
                        : "border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1"
                )}
              >
                
                {/* Imagen Container */}
                <div className="relative aspect-[4/5] bg-[#F5F5F7] rounded-[1.5rem] mb-4 flex items-center justify-center p-6 overflow-hidden">
                  {prod.enOferta && (
                    <div className="absolute top-4 left-4 z-10">
                       <span className="bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-200">
                         Oferta
                       </span>
                    </div>
                  )}
                  
                  <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                     <Image
                      src={imagen}
                      alt={prod.modelo}
                      fill
                      className="object-contain mix-blend-multiply"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="px-1 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                      {prod.marca}
                    </p>
                    {prod.bateria && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            🔋 {prod.bateria}%
                        </span>
                    )}
                  </div>
                  
                  <h3 className="font-black text-gray-900 text-base mb-1 pl-1 line-clamp-1 uppercase italic">
                    {prod.modelo}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 pl-1 mb-4">
                    {prod.almacenamiento} • {prod.color}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 font-bold uppercase">Precio</span>
                       <div className="flex items-center gap-2">
                           <span className="text-lg font-black text-gray-900 tracking-tight">
                             ${Number(prod.precioVenta).toLocaleString()}
                           </span>
                           {prod.precioAnterior > 0 && (
                               <span className="text-xs text-gray-400 line-through font-bold">
                                   ${Number(prod.precioAnterior).toLocaleString()}
                               </span>
                           )}
                       </div>
                    </div>
                    
                    {/* BOTÓN CARRITO */}
                    <Button 
                      onClick={(e) => handleAddToCart(e, prod, imagen)}
                      size="icon" 
                      className="rounded-full bg-black text-white hover:bg-blue-600 transition-colors shadow-md"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

              </motion.div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}