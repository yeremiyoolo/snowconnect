"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PenTool, ShieldAlert, X, LogIn, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WriteReviewButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleWriteReview = () => {
    if (!session) {
      setShowModal(true);
      return;
    }
    // CORRECCIÓN: La ruta correcta hacia donde debe ir el usuario
    router.push("/dejar-review"); 
  };

  return (
    <>
      <button 
        onClick={handleWriteReview}
        className="group relative w-full sm:w-auto h-16 min-w-[280px] bg-white hover:bg-zinc-200 text-black overflow-hidden flex items-center justify-between p-1 pr-6 rounded-full transition-all duration-300"
      >
        {/* Círculo Icono (Izquierda) */}
        <div className="h-14 w-14 rounded-full bg-black/5 flex items-center justify-center text-black group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
            <PenTool size={20} />
        </div>

        {/* Texto Central */}
        <div className="flex flex-col items-start flex-1 px-4 z-10 text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-700 transition-colors">
                Tu turno
            </span>
            <span className="text-sm font-black uppercase tracking-tight text-black">
                Escribir Reseña
            </span>
        </div>

        {/* Círculo Acción (Derecha) */}
        <div className="text-black group-hover:translate-x-1 transition-transform duration-300">
            <Plus size={20} strokeWidth={3} />
        </div>
      </button>

      {/* --- MODAL DE SEGURIDAD (Si no ha iniciado sesión) --- */}
      <AnimatePresence>
        {showModal && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                    onClick={() => setShowModal(false)} 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-sm bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden rounded-[2rem] z-10"
                >
                    <div className="p-8 relative flex flex-col items-center text-center">
                        <button 
                           onClick={() => setShowModal(false)} 
                           className="absolute top-4 right-4 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                           <X size={18} />
                        </button>
                        
                        <div className="w-16 h-16 bg-blue-900/20 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                            <ShieldAlert size={32} />
                        </div>

                        <h3 className="text-xl font-medium text-white tracking-tight mb-2">Acceso Exclusivo</h3>
                        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                            Para mantener la integridad de nuestras <span className="text-white font-medium">Experiencias Reales</span>, necesitamos verificar tu identidad.
                        </p>

                        <div className="flex flex-col w-full gap-3">
                             <Button 
                               onClick={() => router.push("/auth/login")} 
                               className="h-12 w-full rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                             >
                                <LogIn size={18} className="mr-2" /> Entrar a mi cuenta
                             </Button>
                             <Button 
                               variant="ghost" 
                               onClick={() => setShowModal(false)} 
                               className="h-12 w-full rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-white/10"
                             >
                                Cancelar
                             </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
}