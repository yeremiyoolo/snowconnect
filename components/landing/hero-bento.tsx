"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
// Importamos el componente de partículas que creamos en el paso anterior
import { FrostParticles } from "@/components/ui/frost-particles"; 
import type { StaticImageData } from "next/image";

interface HeroBentoProps {
  bannerImage: StaticImageData | string; 
}

export function HeroBento({ bannerImage }: HeroBentoProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[200px] md:auto-rows-[240px] mb-12">
      
      {/* BLOQUE 1: Título Principal (Negro + Efecto Frost) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="md:col-span-8 md:row-span-2 relative rounded-[2.5rem] overflow-hidden bg-black text-white group p-8 md:p-12 flex flex-col justify-center items-start"
      >
        {/* --- EFECTO DE NIEVE (ATMÓSFERA PREMIUM) --- */}
        {/* Lo colocamos al fondo, antes del contenido */}
        <FrostParticles />

        <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest mb-6 relative z-10">
          Nueva Colección
        </span>
        
        <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tight relative z-10">
          Tecnología que <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
            define el futuro.
          </span>
        </h1>
        
        <p className="text-gray-400 max-w-md text-sm md:text-base font-medium mb-8 relative z-10">
          Calidad garantizada y soporte VIP en cada dispositivo.
        </p>
        
        <Link
          href="/catalogo"
          className="relative z-10 px-8 py-3.5 bg-white text-black rounded-full font-bold text-xs md:text-sm hover:scale-105 hover:bg-gray-100 active:scale-95 transition-all duration-300 flex items-center gap-2"
        >
          Ver Catálogo <ArrowRight size={16} />
        </Link>
        
        {/* Gradiente de fondo sutil para dar profundidad detrás del texto */}
        <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/50 to-transparent opacity-60 pointer-events-none" />
      </motion.div>

      {/* BLOQUE 2: Imagen Producto (Gris Claro + Hover 3D sutil) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:col-span-4 relative rounded-[2.5rem] overflow-hidden bg-[#F5F5F7] border border-gray-200 group p-8"
      >
        <div className="flex flex-col h-full justify-between relative z-10">
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-none">iPhones <br/>Certified</h3>
          </div>
          <div className="flex justify-end">
            <Link href="/catalogo?marca=Apple" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all duration-300">
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        
        {/* Imagen con efecto de flotación al hacer hover */}
        <div className="absolute -right-4 -bottom-4 w-48 h-48 opacity-90 transition-transform duration-700 ease-out group-hover:-translate-y-4 group-hover:-translate-x-4 group-hover:scale-105">
           {bannerImage && (
             <Image 
               src={bannerImage} 
               alt="iPhone Destacado" 
               fill 
               className="object-contain drop-shadow-xl" 
               priority 
             />
           )}
        </div>
      </motion.div>

      {/* BLOQUE 3: Ofertas (Azul + Icono Animado) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="md:col-span-4 relative rounded-[2.5rem] overflow-hidden bg-blue-600 text-white group p-8 flex flex-col justify-center items-start hover:bg-blue-700 transition-colors duration-500"
      >
        {/* El rayo vibra al pasar el mouse por la tarjeta */}
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
          <Zap className="text-yellow-300 fill-yellow-300" size={20} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Ofertas Flash</h3>
        <p className="text-blue-100 text-sm mb-6">Hasta 20% OFF en seleccionados.</p>
        <Link href="/catalogo?oferta=true" className="text-xs font-bold underline decoration-blue-300 hover:text-white decoration-2 underline-offset-4 flex items-center gap-1 group-hover:gap-2 transition-all">
          Ver disponibilidad <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </motion.div>

    </section>
  );
}