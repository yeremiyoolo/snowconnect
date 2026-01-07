"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

// Helper para imagen (ya que estamos en client, lo recibimos como prop ya procesada o la procesamos aquí)
const safeImageParse = (jsonString: string | null): string => {
  if (!jsonString) return "/placeholder-phone.png";
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "/placeholder-phone.png";
  } catch (e) {
    return "/placeholder-phone.png";
  }
};

interface ProductCardProps {
  product: any; // Puedes importar el tipo Producto de prisma si quieres ser estricto
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const imagenPrincipal = safeImageParse(product.fotosJson);

  return (
    <Link href={`/producto/${product.id}`} className="group h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="bg-white dark:bg-card border border-gray-100 dark:border-white/5 rounded-[2rem] p-4 h-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col"
      >
        {/* Imagen Container */}
        <div className="relative aspect-[4/5] rounded-[1.5rem] bg-gray-50 dark:bg-white/5 overflow-hidden mb-5 flex items-center justify-center p-6 group-hover:bg-gray-100 transition-colors">
          <Image 
            src={imagenPrincipal} 
            alt={`${product.marca} ${product.modelo}`} 
            fill
            className="object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
          />
          {/* Badge de Estado */}
          <div className="absolute top-4 left-4">
             <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wider">
               {product.estado}
             </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-2 pb-2 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.marca}</p>
             <div className="flex items-center text-amber-400 text-[10px] gap-0.5">
               <Star className="w-3 h-3 fill-current" /> 5.0
             </div>
          </div>
          <h3 className="font-bold text-lg leading-tight mb-2 text-balance">
            {product.modelo}
          </h3>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
            <span className="text-xl font-black tracking-tight">${product.precioVenta.toLocaleString()}</span>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}