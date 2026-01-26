"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PenTool, ShieldAlert, X, LogIn, Plus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function WriteReviewButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleWriteReview = () => {
    if (!session) {
      setShowModal(true);
      return;
    }
    router.push("/account/reviews/new"); 
  };

  return (
    <>
      <button 
        onClick={handleWriteReview}
        className="group relative w-full md:w-auto min-w-[300px] h-16 bg-foreground text-background overflow-hidden flex items-center justify-between px-1 rounded-full transition-all hover:scale-[1.01]"
      >
        {/* Círculo Icono (Izquierda) */}
        <div className="h-14 w-14 rounded-full bg-background/10 flex items-center justify-center text-background group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <PenTool size={20} />
        </div>

        {/* Texto Central */}
        <div className="flex flex-col items-center flex-1 px-4 z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70 group-hover:opacity-100 transition-opacity">
                Tu turno
            </span>
            <span className="text-base font-black uppercase tracking-tight">
                Escribir Reseña
            </span>
        </div>

        {/* Círculo Acción (Derecha) */}
        <div className="h-14 w-14 rounded-full bg-background text-foreground flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
            <Plus size={24} strokeWidth={3} />
        </div>

        {/* Efecto Background al Hover */}
        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out -z-0 mix-blend-difference" />
      </button>

      {/* --- MODAL DE SEGURIDAD --- */}
      <AnimatePresence>
        {showModal && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 cursor-default" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-sm bg-background border border-border shadow-2xl overflow-hidden rounded-3xl"
                >
                    <div className="p-8 relative flex flex-col items-center text-center">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"><X size={18} /></button>
                        
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                            <ShieldAlert size={32} />
                        </div>

                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">Acceso Exclusivo</h3>
                        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                            Para mantener la integridad de nuestras <span className="font-bold text-foreground">Experiencias Reales</span>, necesitamos verificar tu identidad.
                        </p>

                        <div className="grid grid-cols-2 gap-3 w-full">
                             <Button variant="outline" onClick={() => setShowModal(false)} className="h-12 rounded-xl font-bold border-2">
                                Cancelar
                             </Button>
                             <Button onClick={() => router.push("/auth/login")} className="h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white">
                                <LogIn size={18} className="mr-2" /> Entrar
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