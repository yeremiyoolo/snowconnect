"use client";

import { useCompareStore } from "@/lib/store/compare";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Layers, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ComparisonBar() {
  const { items, removeItem, clearCompare } = useCompareStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (items.length === 0) return null;

  // Forzamos siempre 3 slots para el efecto visual de "Bento Box"
  const slots = [0, 1, 2];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-max max-w-[95vw]"
      >
        {/* Contenedor principal estilo "Premium Pill" */}
        <div className="bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] p-2 pr-3 flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
          
          {/* --- SECCIÓN 1: INDICADOR MINIMALISTA --- */}
          <div className="flex flex-col items-center justify-center pl-4 pr-2 border-r border-white/10 hidden sm:flex">
             <div className="flex items-center gap-2 mb-1">
               <Layers size={16} className="text-zinc-500" />
             </div>
             <div className="bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full tracking-widest">
               {items.length}/3
             </div>
          </div>

          {/* --- SECCIÓN 2: SLOTS DE PRODUCTOS --- */}
          <div className="flex items-center gap-3 pl-2 sm:pl-0">
            {slots.map((index) => {
              const item = items[index];
              
              if (item) {
                // SLOT OCUPADO (Muestra la foto en grande)
                return (
                  <div key={item.id} className="relative group w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 bg-zinc-900/50 flex items-center justify-center shrink-0">
                    
                    {/* Efecto hover suave de luz en el fondo del círculo */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors duration-500" />
                    
                    <div className="relative w-10 h-10 md:w-12 md:h-12">
                        <Image 
src={item.image || "/placeholder.png"}
                          alt={item.modelo || item.name || "Equipo"} 
                          fill 
                          className="object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>

                    {/* Botón de eliminar con blur (aparece al hacer hover) */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-1 -right-1 bg-zinc-800/90 backdrop-blur-md border border-white/20 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:border-red-400 hover:scale-110 shadow-lg"
                      title="Quitar"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                );
              } else {
                // SLOT VACÍO (Borde punteado sutil que invita a agregar más)
                return (
                  <div key={`empty-${index}`} className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                     <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <Plus size={12} className="text-zinc-600" />
                     </div>
                  </div>
                );
              }
            })}
          </div>

          {/* --- SECCIÓN 3: ACCIONES --- */}
          <div className="flex items-center gap-4 shrink-0 pr-1">
            
            {/* Texto muy sutil en lugar de un botón tosco para borrar todo */}
            <button 
              onClick={clearCompare}
              className="hidden sm:block text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors font-bold cursor-pointer"
            >
              Limpiar
            </button>
            
            {/* Botón Principal de Comparar */}
            <Link href={items.length > 1 ? "/comparar" : "#"}>
               <div className="relative group">
                 {/* Resplandor (Glow) que solo se activa si hay 2 o más equipos */}
                 {items.length > 1 && (
                   <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse" />
                 )}
                 
                 <Button 
                   disabled={items.length < 2}
                   className={cn(
                     "relative h-12 md:h-14 px-6 md:px-8 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300",
                     items.length > 1 
                       ? "bg-blue-600 hover:bg-blue-500 text-white shadow-xl border border-blue-400/30" 
                       : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5 shadow-none"
                   )}
                 >
                   Comparar
                   <ArrowRight size={16} className={cn("transition-transform duration-300", items.length > 1 && "group-hover:translate-x-1")} />
                 </Button>
               </div>
            </Link>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}