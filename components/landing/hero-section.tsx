"use client"; // 👈 Esto es la clave. Indica que aquí sí podemos animar.

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full rounded-[2.5rem] bg-black text-white overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center justify-center mb-24">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-80" />
      
      <div className="relative z-10 text-center flex flex-col items-center max-w-3xl px-6 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-medium uppercase tracking-wider mb-6 inline-block">
            Nueva Colección 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-balance leading-[1.1] mb-6">
            Tecnología que <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">define el futuro.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8 text-balance">
            Experimenta la mejor selección de dispositivos móviles premium. Garantía certificada y soporte exclusivo.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex gap-4"
        >
          <Button size="lg" className="rounded-full px-8 text-base bg-white text-black hover:bg-gray-200">
            Ver Catálogo
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-white/20 text-white hover:bg-white/10 hover:text-white">
            Vender mi equipo
          </Button>
        </motion.div>
      </div>
    </section>
  );
}