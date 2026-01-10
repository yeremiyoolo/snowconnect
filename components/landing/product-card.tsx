"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: any;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  
  const isWished = isInWishlist(product.id);

  const imagenPrincipal = useMemo(() => {
    if (!product.fotosJson) return "/placeholder-phone.png";
    try {
      const parsed = JSON.parse(product.fotosJson);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "/placeholder-phone.png";
    } catch (e) {
      return "/placeholder-phone.png";
    }
  }, [product.fotosJson]);

  // Lógica para obtener el porcentaje de batería
  // Prioriza el campo directo si viene de tu formulario nuevo
  const bateriaPercent = useMemo(() => {
    // Si guardas en 'bateria' directamente en el modelo:
    if (product.bateria) return parseInt(product.bateria);
    // Si se guarda en specs (modelo anterior):
    if (product.specs?.bateriaScore) return product.specs.bateriaScore;
    // Default
    return 100;
  }, [product]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    addItem({
      id: product.id,
      modelo: product.modelo,
      marca: product.marca,
      precio: product.precioVenta,
      imagen: imagenPrincipal,
      cantidad: 1
    });
    toast({ title: "🛍️ Agregado", description: `${product.modelo} en tu carrito.`, className: "bg-blue-50 text-blue-900 border-blue-100" });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    isWished ? removeFromWishlist(product.id) : addToWishlist(product.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative bg-white dark:bg-gray-900 rounded-[2rem] p-4 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 hover:border-green-500/30 flex flex-col h-full overflow-hidden"
    >
      {/* Botón Wishlist */}
      <button 
        onClick={handleWishlist}
        className={cn(
          "absolute top-5 right-5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90",
          isWished 
            ? "bg-red-50 text-red-500" 
            : "bg-white/80 backdrop-blur text-gray-400 hover:text-red-500"
        )}
      >
        <Heart size={16} className={cn(isWished && "fill-current")} />
      </button>

      <Link href={`/producto/${product.id}`} className="block h-full flex flex-col relative z-10">
        
        {/* Badges de Oferta */}
        <div className="absolute top-1 left-1 flex flex-col gap-2 z-20 pointer-events-none">
            {product.enOferta && (
              <span className="bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-lg shadow-red-500/20">
                Oferta
              </span>
            )}
        </div>

        {/* Imagen del Producto */}
        <div className="relative w-full aspect-[4/5] mb-5 bg-gray-50 dark:bg-gray-800/50 rounded-[1.5rem] flex items-center justify-center overflow-hidden">
            <Image 
              src={imagenPrincipal} 
              alt={product.modelo} 
              fill 
              className="object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2" 
            />
        </div>

        {/* --- BARRA DE BATERÍA (REQUERIMIENTO NUEVO) --- */}
        {/* Visible al hacer hover */}
        <div className="mb-4 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 hidden md:block">
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {/* Icono Batería */}
              <Battery size={14} className="text-green-500 fill-green-500/20" /> 
              <span>Batería</span>
              
              {/* Barra de Progreso Verde */}
              <div className="h-2 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative border border-gray-200 dark:border-gray-700">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                  style={{ width: `${bateriaPercent}%` }} 
                />
              </div>
              
              {/* Porcentaje numérico al final */}
              <span className="text-green-600 font-black min-w-[32px] text-right">
                {bateriaPercent}%
              </span>
           </div>
        </div>

        {/* Info del Producto */}
        <div className="mt-auto">
            {/* Marca y Capacidad GB */}
            <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.marca}</p>
                
                {product.almacenamiento && (
                  <span className="text-[10px] font-black text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                    {product.almacenamiento}
                  </span>
                )}
            </div>

            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-2 truncate">
                {product.modelo}
            </h3>
            
            {/* Precios y Botón */}
            <div className="flex items-end justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
                <div className="flex flex-col">
                    {product.precioAnterior > product.precioVenta && (
                      <span className="text-[10px] font-bold text-gray-400 line-through">RD$ {Number(product.precioAnterior).toLocaleString()}</span>
                    )}
                    <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                      ${Number(product.precioVenta).toLocaleString()}
                    </span>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  size="icon" 
                  className="rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-110 transition-all shadow-lg"
                >
                    <ShoppingCart size={18} />
                </Button>
            </div>
        </div>
      </Link>
    </motion.div>
  );
}