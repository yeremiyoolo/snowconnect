"use client";

import { useState } from "react"; import { useSession } from "next-auth/react"; import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart"; import { Button } from "@/components/ui/button"; import { Plus, Loader2, LogIn, X, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; import { cn } from "@/lib/utils";

export function QuickAddButton({ product, className }: { product: any, className?: string }) {
  const { data: session } = useSession(); const router = useRouter(); const addItem = useCartStore((state) => state.addItem); const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); const [showModal, setShowModal] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation(); // IMPORTANTE: Evita que el click abra la tarjeta del producto
    
    // 🔒 BLOQUEO: Si no hay login, mostramos modal.
    if (!session) { setShowModal(true); return; }

    setIsLoading(true); await new Promise(r => setTimeout(r, 400));
    addItem({ id: product.id, name: `${product.marca} ${product.modelo}`, price: product.precioVenta, image: product.imagen || "/placeholder.png", cantidad: 1 });
    toast({ title: "¡Agregado!", className: "bg-blue-600 text-white border-none h-10 px-4 shadow-lg" });
    setIsLoading(false);
  };

  return (
    <>
      <Button size="icon" onClick={handleQuickAdd} disabled={isLoading || product.estado === "VENDIDO"} className={cn("rounded-full h-10 w-10 shadow-lg transition-all border-none ring-0 outline-none", product.estado === "VENDIDO" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-110", className)}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5 font-bold" />}
      </Button>

      {/* --- MODAL DE LOGIN (SOLO SI NO HAY SESIÓN) --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(false); }} />
          <div className="relative w-full max-w-xs bg-background border border-border rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
             <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-secondary text-muted-foreground z-10"><X size={18} /></button>
             <div className="p-6 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4"><ShieldAlert size={28} className="text-blue-600" /></div>
                <h3 className="text-lg font-black mb-1">Cuenta Requerida</h3>
                <p className="text-muted-foreground text-xs mb-5">Inicia sesión para agregar productos a tu carrito.</p>
                <div className="w-full space-y-2">
                   <Button onClick={() => router.push("/auth/login")} className="w-full h-10 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white"><LogIn size={16} className="mr-2" /> Entrar</Button>
                   <Button variant="ghost" onClick={() => setShowModal(false)} className="w-full h-10 rounded-xl text-xs font-bold text-muted-foreground">Cancelar</Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}