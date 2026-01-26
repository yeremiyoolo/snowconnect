"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, ArrowLeftRight, Star, ShieldCheck, Truck, RotateCcw, Smartphone, HardDrive, Battery, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductViewProps {
  product: any;
}

export function ProductView({ product }: ProductViewProps) {
  const { toast } = useToast();
  const cart = useCartStore();
  const wishlist = useWishlistStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // --- 1. LÓGICA DE DATOS SEGURA ---
  const priceValue = Number(product.precioVenta || product.precio) || 0;
  
  // Imagen: Extraer de fotosJson o imagen simple
  let images = ["/placeholder.png"];
  if (product.fotosJson) {
      try {
          const parsed = JSON.parse(product.fotosJson);
          if (parsed.length > 0) images = parsed;
      } catch(e) {}
  } else if (product.imagen) {
      images = [product.imagen];
  }
  
  // Especificaciones
  const specs = product.specs || {};
  const almacenamiento = specs.almacenamiento || product.almacenamiento || "N/A";
  const color = specs.color || product.color || "Estándar";
  
  // Batería (Lógica robusta)
  const rawBat = product.bateria || specs.bateria || product.battery;
  let bateria = "100%"; // Por defecto si es nuevo
  const condicion = String(product.condicion || "").toLowerCase();
  
  if (rawBat) {
      // Si hay dato real, úsalo
      bateria = String(rawBat); 
      if(!bateria.includes("%")) bateria += "%";
  } else if (!condicion.includes("nuevo") && !condicion.includes("sellado")) {
      // Si es usado y no tiene dato, mostramos N/A
      bateria = "Consultar";
  }

  // --- HANDLERS ---
  const handleAddToCart = () => {
    setIsAdding(true);
    cart.addItem({
      id: product.id,
      modelo: product.modelo,
      precio: priceValue,
      imagen: images[0],
      cantidad: 1,
    });
    toast({ title: "Agregado al carrito", className: "bg-green-600 text-white" });
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlist = () => {
    wishlist.addItem({ ...product, imagen: images[0], precio: priceValue });
    toast({ description: "Guardado en favoritos ❤️", className: "bg-pink-600 text-white" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
      
      {/* --- GALERÍA --- */}
      <div className="space-y-4">
        <div className="relative aspect-square bg-secondary/20 rounded-[2rem] overflow-hidden border border-border">
           <Image 
             src={images[selectedImage]} 
             alt={product.modelo}
             fill
             className="object-contain p-8"
             priority
           />
           {product.condicion && (
             <span className="absolute top-6 left-6 bg-black/80 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
               {product.condicion}
             </span>
           )}
        </div>
        {/* Miniaturas */}
        {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((img, idx) => (
                <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                    "relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0",
                    selectedImage === idx ? "border-blue-600" : "border-transparent bg-secondary/20"
                )}
                >
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
            ))}
            </div>
        )}
      </div>

      {/* --- INFORMACIÓN --- */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase mb-2">
           <Smartphone size={16} /> {product.marca || "Smartphone"}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
          {product.modelo}
        </h1>

        <div className="flex items-baseline gap-2 mb-8">
           <span className="text-4xl font-black text-foreground">
             {new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(priceValue)}
           </span>
        </div>

        {/* Grid de Specs */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <HardDrive size={18} /> <span className="text-xs font-bold uppercase">Espacio</span>
                </div>
                <div className="text-xl font-bold">{almacenamiento}</div>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Battery size={18} /> <span className="text-xs font-bold uppercase">Batería</span>
                </div>
                <div className={cn("text-xl font-bold", bateria === "100%" ? "text-green-500" : "")}>{bateria}</div>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <span className="w-4 h-4 rounded-full border bg-zinc-500" /> <span className="text-xs font-bold uppercase">Color</span>
                </div>
                <div className="text-xl font-bold capitalize">{color}</div>
            </div>
            {/* Si tienes RAM u otro dato, agrégalo aquí */}
        </div>

        <div className="flex flex-col gap-3">
           <Button 
             size="lg" 
             onClick={handleAddToCart}
             className="w-full h-14 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
           >
             {isAdding ? "Agregando..." : "Agregar al Carrito"}
             <ShoppingCart className="ml-2 w-5 h-5" />
           </Button>
           
           <div className="grid grid-cols-2 gap-3">
               <Button variant="outline" size="lg" className="h-12 rounded-xl" onClick={handleWishlist}>
                   <Heart className="mr-2 h-4 w-4" /> Favoritos
               </Button>
               {/* Botón de volver */}
               <Button variant="ghost" size="lg" className="h-12 rounded-xl" onClick={() => window.history.back()}>
                   Seguir Comprando
               </Button>
           </div>
        </div>
        
        {/* Garantías */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border/50">
            <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase">Garantía 30 días</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
                <Truck className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase">Envío Rápido</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase">Devolución</span>
            </div>
        </div>

      </div>
    </div>
  );
}