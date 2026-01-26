"use client";

import { useState } from "react"; import { useSession } from "next-auth/react"; import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart"; import { Button } from "@/components/ui/button"; import { ShoppingCart, Loader2, LogIn, X, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; import { cn } from "@/lib/utils";

export function AddToCartButton({ product, className }: { product: any, className?: string }) {
  const { data: session } = useSession(); const router = useRouter(); const addItem = useCartStore((state) => state.addItem); const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); const [showModal, setShowModal] = useState(false);

  const handleAddToCart = async () => {
    // 🔒 BLOQUEO: Si no hay usuario, ABRE MODAL y detiene la función.
    if (!session) { setShowModal(true); return; }

    setIsLoading(true); await new Promise(resolve => setTimeout(resolve, 600));
    addItem({ id: product.id, name: `${product.marca} ${product.modelo}`, price: product.precioVenta, image: product.imagen || "/placeholder.png", cantidad: 1 });
    toast({ title: "¡Listo!", description: "Producto agregado correctamente.", className: "bg-blue-600 text-white border-none shadow-lg" });
    setIsLoading(false);
  };

  return (
    <>
      <Button onClick={handleAddToCart} disabled={isLoading || product.estado === "VENDIDO"} className={cn("relative w-full h-14 rounded-2xl text-lg font-bold transition-all duration-300 overflow-hidden group", product.estado === "VENDIDO" ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 hover:scale-[1.02]", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {isLoading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Guardando...</span> : product.estado === "VENDIDO" ? "Agotado" : <span className="relative z-10 flex items-center justify-center gap-3"><ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" /> Agregar al Carrito</span>}
      </Button>

      {/* --- MODAL OBLIGATORIO --- */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-background border border-border rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95">
             <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
             <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground z-10"><X size={20} /></button>
             <div className="p-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse"><ShieldAlert size={40} className="text-blue-600" /></div>
                <h3 className="text-2xl font-black mb-2">Inicia Sesión</h3>
                <p className="text-muted-foreground font-medium mb-8">Debes tener una cuenta para comprar este producto.</p>
                <div className="w-full space-y-3">
                   <Button onClick={() => router.push("/auth/login")} className="w-full h-12 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg"><LogIn size={18} className="mr-2" /> Ir al Login</Button>
                   <Button variant="ghost" onClick={() => setShowModal(false)} className="w-full h-12 rounded-xl font-bold text-muted-foreground hover:bg-secondary">Cancelar</Button>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}