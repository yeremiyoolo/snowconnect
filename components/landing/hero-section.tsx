"use client";

import Link from "next/link";
import { ArrowRight, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-black selection:bg-blue-500/30">
      
      {/* --- 1. FONDO ATMOSFÉRICO (AURORA EFFECT) --- */}
      <div className="absolute inset-0 w-full h-full">
        {/* Luz Azul Principal - OPTIMIZADA */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse transform-gpu will-change-transform" />
        {/* Luz Secundaria Cian - OPTIMIZADA */}
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] transform-gpu will-change-transform" />
        {/* Grid Sutil */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pt-20">
        
        {/* --- 2. COLUMNA IZQUIERDA: TEXTO DE IMPACTO --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          
          {/* Badge de Novedad */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-blue-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nueva Colección Disponible
          </motion.div>

          {/* Título Masivo */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95]"
          >
            Titanio. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-white">
              Poder Puro.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-xl font-medium leading-relaxed"
          >
            Experimenta el iPhone más ligero y resistente jamás creado. 
            Certificado por SnowConnect™ con garantía real.
          </motion.p>

          {/* Botones de Acción (Glassmorphism) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/catalogo">
              <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Ver Catálogo
              </Button>
            </Link>
            <Link href="/vender">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-white/20 bg-white/5 text-white font-bold text-lg hover:bg-white/10 hover:border-white/40 backdrop-blur-md transition-all">
                Vender mi equipo
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof (Pequeño detalle que da confianza) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-4 pt-4"
          >
            <div className="flex -space-x-3">
               {[1,2,3].map((_,i) => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="user" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
            <div className="flex flex-col">
               <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
               </div>
               <span className="text-xs text-gray-400 font-medium">+500 Clientes felices</span>
            </div>
          </motion.div>

        </div>

        {/* --- 3. COLUMNA DERECHA: IMAGEN HÉROE --- */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.8, x: 50 }}
           animate={{ opacity: 1, scale: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative flex items-center justify-center lg:justify-end h-full min-h-[400px] lg:min-h-[600px]"
        >
           {/* Círculo decorativo detrás del teléfono */}
           <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
           <div className="absolute w-[280px] md:w-[480px] h-[280px] md:h-[480px] border border-dashed border-blue-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

           {/* IMAGEN DEL PRODUCTO (FLOTANDO) */}
           {/* IMPORTANTE: Cambia el src por tu imagen sin fondo */}
           <img 
             src="https://www.apple.com/v/iphone-15-pro/c/images/overview/design/design_titanium_endframe__e62137456d8i_large.jpg" // Usa una URL real o tu archivo local
             alt="iPhone 15 Pro Titanium"
             className="relative z-10 w-full max-w-[400px] md:max-w-[600px] object-contain drop-shadow-2xl mask-image-gradient-b"
             style={{ 
               filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.5))",
               maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" // Desvanecimiento inferior
             }}
           />

           {/* Tarjeta flotante "Specs" */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1, duration: 0.5 }}
             className="absolute bottom-20 left-0 md:left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl z-20"
           >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Chip A17 Pro</p>
                <p className="text-blue-200 text-xs">Rendimiento brutal</p>
              </div>
           </motion.div>

        </motion.div>

      </div>
    </section>
  );
}