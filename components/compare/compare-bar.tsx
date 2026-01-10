"use client";
import { useCompare } from "@/context/compare-context";
import { X, ArrowRightLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CompareBar() {
  const { selectedIds, toggleCompare, clearCompare } = useCompare();

  // Evitamos renderizar si no hay selección (esto está bien)
  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 z-[60] flex justify-center px-4">
      <div className="bg-gray-900 text-white px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl bg-opacity-90 animate-in fade-in slide-in-from-bottom-4">
        
        {/* ... (Icono y contadores igual que antes) ... */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <ArrowRightLeft size={18} />
          </div>
          <span className="text-sm font-black uppercase italic tracking-tighter">
            Comparar ({selectedIds.length}/3)
          </span>
        </div>

        {/* ... (Lista de IDs igual que antes) ... */}
        <div className="flex gap-2">
          {selectedIds.map((id) => (
            <div key={id} className="relative group">
              <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center text-[10px] font-bold">
                ID: {id.slice(-3)}
              </div>
              <button 
                onClick={() => toggleCompare(id)}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 hover:scale-110 transition-transform"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <button onClick={clearCompare} className="text-gray-400 hover:text-white transition-colors">
            <Trash2 size={18} />
          </button>
          
          {/* CORRECCIÓN AQUÍ: Usamos asChild para evitar error de hidratación */}
          <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-full font-black text-[10px] uppercase px-6">
            <Link href={`/comparar?ids=${selectedIds.join(",")}`}>
              Ver Comparativa
            </Link>
          </Button>

        </div>
      </div>
    </div>
  );
}