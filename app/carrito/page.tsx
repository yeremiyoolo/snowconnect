"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, ShieldCheck, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // --- CÁLCULOS ---
  const subtotal = items.reduce((acc, item) => {
    const precio = Number(item.price || item.precio || 0);
    return acc + (precio * item.cantidad);
  }, 0);
  
  const envio = 0; // Gratis
  const total = subtotal + envio;

  // --- ESTADO VACÍO ---
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-background">
        <div className="w-24 h-24 bg-secondary/50 border border-border rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
           <ShoppingBag size={40} className="text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">Tu carrito está vacío</h1>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed font-medium">
          Parece que aún no has agregado ningún equipo. Explora nuestro catálogo y encuentra tecnología premium.
        </p>
        <Link href="/catalogo">
          <Button size="lg" className="rounded-xl font-bold px-8 h-12 bg-foreground text-background hover:bg-foreground/90 shadow-lg">
            Explorar Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">Carrito</h1>
        <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md shadow-blue-500/20">
            {items.reduce((acc, item) => acc + item.cantidad, 0)} items
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* --- COLUMNA IZQUIERDA: LISTA DE PRODUCTOS --- */}
          <div className="lg:col-span-8 space-y-6">
             {items.map((item) => {
               // Normalización de datos
               const nombre = item.name || item.modelo || "Producto Sin Nombre";
               const imagen = item.image || item.imagen || "/placeholder.png";
               const precio = Number(item.price || item.precio || 0);
               const specs = [item.capacidad, item.color].filter(Boolean).join(" • ");

               return (
                 <div key={item.id} className="group relative flex flex-col sm:flex-row gap-6 p-6 bg-card border border-border rounded-[2rem] transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
                    
                    {/* Imagen */}
                    <div className="relative w-full sm:w-32 aspect-square bg-white rounded-2xl overflow-hidden shrink-0 border border-border/50 flex items-center justify-center p-2">
                       <Image 
                         src={imagen}
                         alt={nombre}
                         width={200}
                         height={200}
                         className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500" 
                       />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                       <div>
                          <div className="flex justify-between items-start gap-4">
                             <div>
                                <h3 className="text-lg font-black text-foreground leading-tight">{nombre}</h3>
                                {specs && (
                                  <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wide">
                                    {specs}
                                  </p>
                                )}
                             </div>
                             
                             <button 
                               onClick={() => removeItem(item.id)}
                               className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-xl transition-all"
                               aria-label="Eliminar producto"
                             >
                               <Trash2 size={18} />
                             </button>
                          </div>
                       </div>

                       <div className="flex items-end justify-between mt-6 sm:mt-0">
                          {/* Cantidad */}
                          <div className="flex items-center bg-secondary rounded-xl p-1 h-10 border border-border">
                             <button 
                               onClick={() => updateQuantity(item.id, Math.max(1, item.cantidad - 1))}
                               className="w-8 h-full flex items-center justify-center rounded-lg hover:bg-background hover:shadow-sm transition-all"
                             >
                               <Minus size={14} />
                             </button>
                             <span className="text-sm font-bold w-8 text-center tabular-nums">
                               {item.cantidad}
                             </span>
                             <button 
                               onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                               className="w-8 h-full flex items-center justify-center rounded-lg hover:bg-background hover:shadow-sm transition-all"
                             >
                               <Plus size={14} />
                             </button>
                          </div>

                          {/* Precio Item */}
                          <div className="text-right">
                             <p className="text-xs font-medium text-muted-foreground">Total item</p>
                             <p className="text-xl font-black text-foreground tabular-nums tracking-tight">
                                ${(precio * item.cantidad).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
               );
             })}

             <div className="flex justify-end pt-2">
                <Button 
                   variant="ghost" 
                   onClick={clearCart}
                   className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
                >
                  <Trash2 size={16} className="mr-2" /> Vaciar Carrito
                </Button>
             </div>
          </div>

          {/* --- COLUMNA DERECHA: RESUMEN DE PAGO --- */}
          <div className="lg:col-span-4">
             <div className="bg-card border border-border rounded-[2.5rem] p-8 sticky top-24 shadow-xl shadow-black/5">
                <h3 className="text-xl font-black text-foreground mb-6 uppercase tracking-tight">Resumen</h3>
                
                <div className="space-y-4 mb-6">
                   
                   {/* Subtotal */}
                   <div className="flex justify-between text-muted-foreground text-sm font-medium">
                      <span>Subtotal</span>
                      <span className="text-foreground text-base">
                        ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                   </div>

                   {/* Envío Rediseñado */}
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Envío Estimado</span>
                      <span className="text-green-600 font-black tracking-tight uppercase">
                        GRATIS
                      </span>
                   </div>

                </div>

                <Separator className="bg-border mb-6" />

                <div className="flex justify-between items-end mb-8">
                   <span className="text-lg font-bold text-foreground">Total</span>
                   <span className="text-3xl font-black text-foreground tabular-nums tracking-tighter">
                     ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                   </span>
                </div>

                <Button className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.02] transition-all bg-blue-600 hover:bg-blue-700 text-white mb-6">
                   Proceder al Pago <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {/* Sellos de Confianza */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground justify-center bg-secondary/30 p-3 rounded-xl border border-border/50">
                       <ShieldCheck size={16} className="text-green-600" />
                       <span className="font-bold uppercase tracking-wide">Pago 100% Seguro</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground justify-center bg-secondary/30 p-3 rounded-xl border border-border/50">
                       <Package size={16} className="text-blue-600" />
                       <span className="font-bold uppercase tracking-wide">Envío Express 24h</span>
                    </div>
                </div>

             </div>
          </div>
      </div>
    </div>
  );
}