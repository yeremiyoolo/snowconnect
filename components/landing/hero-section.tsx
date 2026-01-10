"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    // CAMBIOS AQUI:
    // 1. 'mx-4 md:mx-6': Márgenes laterales para que no tope los bordes.
    // 2. 'mt-24': Margen superior para separarlo del techo (y del navbar).
    // 3. 'rounded-[3rem]': Bordes redondeados en todas las esquinas.
    // 4. 'min-h-[85vh]': Altura ajustada.
    <section className="relative w-auto mx-4 md:mx-6 mt-24 min-h-[80vh] flex items-center justify-center overflow-hidden bg-black rounded-[3rem] shadow-2xl shadow-black/20">
      
      {/* 1. Fondo Dinámico */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
         {/* Orbe de luz animado */}
         <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* 2. Contenido */}
      {/* CAMBIO: 'pt-20' adicional para bajar visualmente el texto y que no pelee con el header */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center justify-center h-full pt-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
             <Sparkles size={12} className="text-yellow-400" />
             <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">Nueva Colección 2026</span>
          </div>

          {/* Título Masivo */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.9]">
            FUTURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              CONNECT
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed text-balance">
            La plataforma definitiva para tecnología premium en RD. <br className="hidden md:block"/>
            Garantía certificada, envíos flash y experiencia de compra sin fricción.
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/catalogo">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-xl shadow-white/10 text-base">
                  Explorar Catálogo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </Link>
            <Link href="/servicios">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 font-bold text-base backdrop-blur-sm hover:border-white/40">
                  Vender mi Equipo
                </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}