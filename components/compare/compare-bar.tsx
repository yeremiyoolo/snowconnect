"use client";

import { useCompareStore } from "@/lib/store/compare";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, ArrowRight, Plus, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompareBar() {
  const { items, removeItem, clearCompare } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl"
      >
        <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-2xl flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden sm:flex bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <Scale size={20} />
            </div>
            
            <div className="flex gap-3">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="relative group w-14 h-14 bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-colors"
                >
                  {/* CORRECCIÓN CRÍTICA: Validamos que exista 'image' antes de renderizar */}
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name || "Producto"} 
                      fill 
                      className="object-contain p-2 text-transparent" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-20">
                      <Smartphone size={20} />
                    </div>
                  )}

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {Array.from({ length: 3 - items.length }).map((_, i) => (
                <div key={i} className="w-14 h-14 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-white/5">
                  <Plus size={16} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={clearCompare} 
              className="text-white/40 hover:text-red-400 hover:bg-transparent text-[10px] font-black uppercase tracking-widest hidden xs:block"
            >
              Limpiar
            </Button>
            
            <Link href="/comparar">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold px-6 shadow-lg shadow-blue-600/20 border-none h-12">
                Comparar <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}