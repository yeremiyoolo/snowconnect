"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Sparkles, Calculator } from "lucide-react";
import { motion } from "framer-motion";

export function SmartTradeSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-10 mb-32">
      <div className="relative w-full rounded-[3rem] bg-zinc-950 border border-white/5 overflow-hidden flex flex-col lg:flex-row items-center p-8 md:p-16 lg:p-20 gap-12 lg:gap-20 shadow-2xl">
         
         {/* --- FONDO SUTIL (Sin lag) --- */}
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.1)_0%,_transparent_50%)] pointer-events-none" />
         {/* Patrón de cuadrícula muy sutil para dar toque técnico/premium */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-screen pointer-events-none" />

         {/* --- IZQUIERDA: COPY MONUMENTAL --- */}
         <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center text-center lg:text-left">
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="inline-flex items-center justify-center lg:justify-start gap-2 text-blue-400 font-bold tracking-widest uppercase text-[10px] mb-6"
            >
               <Calculator size={14} /> Smart Trade-In
            </motion.div>
            
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
               className="text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tighter mb-6 leading-[1.05]"
            >
               Actualiza. <br className="hidden lg:block"/>
               <span className="text-zinc-600">Ahorra. <br className="hidden lg:block"/> Así de simple.</span>
            </motion.h2>
            
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
               className="text-zinc-400 text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0 mb-10"
            >
               Entréganos tu equipo actual y úsalo como crédito inmediato para tu próxima compra. Obten una valoración justa basada en el mercado real de Santiago.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
               className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/servicios" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                   Cotizar mi equipo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/catalogo" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto h-14 px-8 rounded-full text-white font-bold text-sm hover:bg-white/10 transition-colors">
                   Ver catálogo
                </Button>
              </Link>
            </motion.div>
         </div>

         {/* --- DERECHA: WIDGET ESTIMADOR INTERACTIVO --- */}
         <div className="w-full lg:w-1/2 relative z-10 flex justify-center lg:justify-end">
             
             {/* Halo de luz detrás del widget */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

             {/* Tarjeta UI Simulada */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
                className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,1)] backdrop-blur-2xl"
             >
                {/* Cabecera del Widget */}
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                   <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
                      <Sparkles size={16} className="text-blue-500" />
                      Estimación de crédito
                   </div>
                   <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En vivo</span>
                   </div>
                </div>

                {/* Diagrama de Cambio */}
                <div className="flex items-center justify-between mb-8 px-2">
                   <div className="flex flex-col items-center text-center gap-3">
                     <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-zinc-700 transition-colors">
                        <Smartphone size={28} className="text-zinc-600" />
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-zinc-300">Tu iPhone 13 Pro</span>
                        <span className="block text-[10px] text-zinc-600 font-medium">128GB • Excelente</span>
                     </div>
                   </div>
                   
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500">
                         <ArrowRight size={14} />
                      </div>
                   </div>

                   <div className="flex flex-col items-center text-center gap-3">
                     <div className="w-16 h-16 rounded-2xl bg-blue-900/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden">
                        <Smartphone size={28} className="text-blue-400" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-blue-400">iPhone 15 Pro</span>
                        <span className="block text-[10px] text-blue-500/70 font-medium">Titanium • 256GB</span>
                     </div>
                   </div>
                </div>

                {/* El Valor (Foco Principal) - Ahora ocupa el espacio inferior sin los textos extra */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 text-center border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                   <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Crédito a favor</span>
                   {/* Usamos font-mono para que los números parezcan de una app financiera */}
                   <span className="block text-4xl md:text-5xl font-medium text-white tracking-tighter font-mono">
                      RD$38,500
                   </span>
                </div>

             </motion.div>
         </div>

      </div>
    </section>
  );
}