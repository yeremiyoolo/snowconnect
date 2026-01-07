"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";

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
        return (
          <Link href={`/producto/${prod.id}`} key={prod.id} className="group h-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="bg-white rounded-[2rem] p-4 h-full border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 flex flex-col"
            >
              
              {/* Imagen Container */}
              <div className="relative aspect-[4/5] bg-[#F5F5F7] rounded-[1.5rem] mb-4 flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                   <span className="bg-white/80 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider text-gray-600 shadow-sm">
                     {prod.estado}
                   </span>
                </div>
                
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
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">
                  {prod.marca}
                </p>
                <h3 className="font-bold text-gray-900 text-base mb-1 pl-1 line-clamp-1">
                  {prod.modelo}
                </h3>
                <p className="text-xs font-medium text-gray-500 pl-1 mb-4">
                  {prod.almacenamiento}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-gray-400 font-bold uppercase">Precio</span>
                     <span className="text-lg font-black text-gray-900 tracking-tight">
                       ${Number(prod.precioVenta).toLocaleString()}
                     </span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>

            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}