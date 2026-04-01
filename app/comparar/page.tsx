"use client";

import { useCompareStore } from "@/lib/store/compare";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingCart, ArrowLeft, Cpu, HardDrive, Battery, Camera, Zap, Smartphone } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const { items, removeItem, clearCompare } = useCompareStore();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // --- ESTADO VACÍO PREMIUM ---
  if (items.length === 0) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4 relative overflow-hidden text-center z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-[#050505] blur-[100px] -z-10" />
            <div className="w-24 h-24 mb-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                <Smartphone size={40} className="text-zinc-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">Nada que comparar.</h1>
            <p className="text-zinc-400 max-w-md mx-auto mb-8 font-medium">
                Selecciona al menos dos equipos del catálogo para ponerlos frente a frente y descubrir cuál es el perfecto para ti.
            </p>
            <Link href="/catalogo">
               <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-base shadow-xl">
                   Explorar Catálogo
               </Button>
            </Link>
        </div>
    )
  }

  // --- FUNCIONES AUXILIARES ---
  const handleAddToCart = (item: any) => {
    cart.addItem({ 
      id: item.id, 
      name: `${item.marca || ''} ${item.modelo}`.trim(), 
      price: item.precio || item.precioVenta, 
      image: item.imagen || item.image, 
      quantity: 1 
    });
    toast.success(`${item.modelo} agregado al carrito`);
  };

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", minimumFractionDigits: 0 }).format(price);
  };

  // Helper para extraer specs (ya que a veces vienen en product.specs y a veces directo)
  const getSpec = (item: any, key: string) => {
    if (key === 'condicion') return item.condicion;
    return item.specs?.[key] || item[key] || null;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans pb-32">
      
      {/* HEADER SUPERIOR */}
      <div className="pt-28 pb-8 px-4 md:px-12 max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <Link href="/catalogo" className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-white transition-colors mb-6">
              <ArrowLeft size={16} className="mr-2" /> Volver al catálogo
           </Link>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">Comparativa</h1>
        </div>
        <Button variant="outline" onClick={clearCompare} className="rounded-full border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 h-10 px-6 font-bold">
            Limpiar Todo
        </Button>
      </div>

      <div className="max-w-[1440px] mx-auto overflow-x-auto no-scrollbar px-4 md:px-12">
        <div className="min-w-[900px]">
          
          {/* --- ENCABEZADOS DE PRODUCTOS (STICKY) --- */}
          <div className="sticky top-20 z-40 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10 pt-4 pb-8 mb-8">
             <div className="grid grid-cols-4 gap-6">
                
                {/* Columna Vacia para Etiquetas */}
                <div className="col-span-1 flex items-end pb-4">
                   <span className="text-xl font-black text-zinc-500 tracking-tight">Modelos</span>
                </div>

                {/* Slots de Productos */}
                {items.map((item) => (
                   <div key={item.id} className="col-span-1 relative group bg-zinc-900/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center transition-colors hover:bg-zinc-900/80">
                      
                      <button 
                         onClick={() => removeItem(item.id)}
                         className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center transition-all z-10"
                      >
                          <X size={14} />
                      </button>

                      <div className="relative h-48 w-full mb-6">
<Image src={item.image || "/placeholder.png"} alt={item.modelo || "Equipo"} fill className="object-contain drop-shadow-2xl" />
                      </div>
                      
                      <span className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-1">{item.marca}</span>
                      <h3 className="text-xl font-black text-white leading-tight mb-2 line-clamp-2">{item.modelo}</h3>
                      <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 mb-6">
{formatPrice(item.price || 0)}
                      </p>

                      <Button 
                         onClick={() => handleAddToCart(item)}
                         className="w-full rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 shadow-lg shadow-blue-900/20"
                      >
                         <ShoppingCart size={18} className="mr-2" /> Agregar
                      </Button>
                   </div>
                ))}

                {/* Slots Vacíos (Hasta llegar a 3) */}
                {[...Array(3 - items.length)].map((_, i) => (
                   <div key={`empty-${i}`} className="col-span-1 border-2 border-dashed border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-white/[0.02]">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                         <Plus size={24} className="text-zinc-600" />
                      </div>
                      <p className="text-zinc-500 font-bold text-sm">Añadir otro equipo<br/>para comparar</p>
                      <Link href="/catalogo" className="mt-4">
                        <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-transparent text-white hover:bg-white/10">Catálogo</Button>
                      </Link>
                   </div>
                ))}

             </div>
          </div>

          {/* --- TABLA DE ESPECIFICACIONES (GRID) --- */}
          <div className="flex flex-col gap-0 pb-20">
             
             <SpecRow label="Condición" icon={Zap} items={items} getSpec={getSpec} specKey="condicion" />
             <SpecRow label="Almacenamiento" icon={HardDrive} items={items} getSpec={getSpec} specKey="almacenamiento" />
             <SpecRow label="Memoria RAM" icon={Cpu} items={items} getSpec={getSpec} specKey="ram" />
             <SpecRow label="Cámara" icon={Camera} items={items} getSpec={getSpec} specKey="camara" />
             <SpecRow label="Batería" icon={Battery} items={items} getSpec={getSpec} specKey="bateria" />
             
          </div>

        </div>
      </div>
    </div>
  );
}

// COMPONENTE HELPER PARA LAS FILAS
function SpecRow({ 
    label, 
    icon: Icon, 
    items, 
    getSpec, 
    specKey 
}: { 
    label: string, 
    icon: any, 
    items: any[], 
    getSpec: (item: any, key: string) => any, 
    specKey: string 
}) {
    return (
        <div className="grid grid-cols-4 gap-6 border-b border-white/5 py-6 group hover:bg-white/[0.02] transition-colors rounded-xl px-4 -mx-4">
            {/* Etiqueta de la Fila */}
            <div className="col-span-1 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-900/20 transition-colors">
                  <Icon size={18} />
               </div>
               <span className="font-bold text-zinc-300 text-sm md:text-base">{label}</span>
            </div>

            {/* Valores por cada equipo */}
            {items.map((item) => {
                const value = getSpec(item, specKey);
                return (
                    <div key={item.id} className="col-span-1 flex items-center justify-center text-center px-4">
                        {value ? (
                           <span className="font-medium text-white text-sm md:text-base">{value}</span>
                        ) : (
                           <Minus className="text-zinc-700" size={20} />
                        )}
                    </div>
                )
            })}

            {/* Rellenar espacios vacíos */}
            {[...Array(3 - items.length)].map((_, i) => (
                <div key={i} className="col-span-1 flex items-center justify-center">
                    <div className="w-8 h-[1px] bg-white/5"></div>
                </div>
            ))}
        </div>
    )
}