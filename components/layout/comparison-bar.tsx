"use client";

import { useCompareStore } from "@/lib/store/compare";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function ComparisonBar() {
  const { items, removeItem, clearCompare } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4"
      >
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 border-r border-white/10 pr-4">
               <Layers size={18} className="text-blue-500" />
               <span className="hidden sm:inline">Comparando</span>
               <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-md">{items.length}/3</span>
            </div>

            <div className="flex -space-x-3">
              {items.map((item) => (
                <div key={item.id} className="relative group w-10 h-10 rounded-full border-2 border-zinc-800 bg-zinc-900 overflow-hidden shrink-0">
                  <Image 
                    src={item.imagen || "/placeholder.png"} 
                    alt={item.modelo} 
                    fill 
                    className="object-cover"
                  />
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCompare}
              className="text-zinc-400 hover:text-white h-8 text-xs"
            >
              Borrar
            </Button>
            <Link href="/comparar">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-9 rounded-xl shadow-lg shadow-blue-900/20">
                Comparar <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </Link>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}