"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Para cambiar de URL al elegir otro color
import { useCartStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, ShieldCheck, Truck, Battery, Wifi, 
  ShoppingCart, Heart, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProductViewProps {
  product: any;     // El producto actual
  variants: any[];  // Otros productos del mismo modelo (para los selectores)
}

export default function ProductView({ product, variants }: ProductViewProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();

  // Parsear fotos (vienen como string JSON desde la DB)
  let images = ["/placeholder.png"];
  try {
    if (product.fotosJson) {
      const parsed = JSON.parse(product.fotosJson);
      if (Array.isArray(parsed) && parsed.length > 0) images = parsed;
    }
  } catch (e) {
    console.error("Error parsing images", e);
  }

  const [currentImage, setCurrentImage] = useState(0);

  // Lógica para el Carrito
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      modelo: product.modelo,
      precio: product.precioVenta,
      imagen: images[0],
      cantidad: 1,
      color: product.color,
      capacidad: product.almacenamiento
    });

    toast({
      title: "¡Agregado al carrito!",
      description: `${product.modelo} - ${product.color}`,
    });
  };

  // Lógica para cambiar de variante (Navegar a la URL del otro producto)
  const handleVariantChange = (targetId: string) => {
    if (targetId !== product.id) {
      router.push(`/catalogo/${targetId}`);
    }
  };

  // Agrupar variantes para los selectores
  // 1. Colores disponibles para esta capacidad
  const availableColors = variants
    .filter(v => v.almacenamiento === product.almacenamiento)
    .map(v => ({ id: v.id, color: v.color }));

  // 2. Capacidades disponibles para este color
  const availableStorages = variants
    .filter(v => v.color === product.color)
    .map(v => ({ id: v.id, size: v.almacenamiento, price: v.precioVenta }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      
      {/* COLUMNA 1: GALERÍA */}
      <div className="space-y-6">
          <div className="relative aspect-square w-full bg-secondary/30 rounded-3xl overflow-hidden border border-border">
            <span className="absolute top-4 left-4 z-10 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md uppercase">
                {product.estado}
            </span>
            <Image 
              src={images[currentImage]} 
              alt={product.modelo}
              fill
              className="object-contain p-8 hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImage === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-border"
                  }`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" />
                </button>
            ))}
          </div>
      </div>

      {/* COLUMNA 2: INFO */}
      <div className="flex flex-col justify-center">
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-bold text-primary tracking-wider uppercase">{product.marca}</h2>
                {product.specs?.bateriaScore && (
                  <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                     <Battery size={12} /> Batería {product.specs.bateriaScore}%
                  </span>
                )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
                {product.modelo}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
                {product.descripcion || "Equipo verificado y certificado por SnowConnect."}
            </p>
          </div>

          <div className="mb-8 p-4 bg-secondary/30 rounded-2xl border border-border/50 inline-block w-full">
            <span className="block text-sm text-muted-foreground font-medium mb-1">Precio de oferta</span>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-foreground">RD$ {product.precioVenta.toLocaleString()}</span>
                {product.precioAnterior > 0 && (
                  <span className="text-sm text-muted-foreground line-through mb-1.5 opacity-60">
                      RD$ {product.precioAnterior.toLocaleString()}
                  </span>
                )}
            </div>
          </div>

          {/* SELECTORES REALES */}
          <div className="space-y-8 mb-8">
            
            {/* Selector Color */}
            <div>
                <label className="text-sm font-bold text-foreground mb-3 block">Color: <span className="text-muted-foreground font-normal">{product.color}</span></label>
                <div className="flex flex-wrap gap-3">
                  {availableColors.length > 0 ? availableColors.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantChange(v.id)}
                        className={`px-4 h-10 rounded-lg border flex items-center gap-2 transition-all ${
                          v.color === product.color 
                            ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary" 
                            : "border-border hover:border-primary/50 text-muted-foreground"
                        }`}
                      >
                        {v.color}
                      </button>
                  )) : (
                    <span className="text-sm text-muted-foreground italic">Único color disponible</span>
                  )}
                </div>
            </div>

            {/* Selector Capacidad */}
            <div>
                <label className="text-sm font-bold text-foreground mb-3 block">Capacidad</label>
                <div className="grid grid-cols-3 gap-3">
                  {availableStorages.length > 0 ? availableStorages.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantChange(v.id)}
                        className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                          v.size === product.almacenamiento
                            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "border-border hover:border-primary/50 bg-card text-foreground"
                        }`}
                      >
                        <span className="font-bold">{v.size}</span>
                        <span className="text-[10px] opacity-80">RD$ {v.price.toLocaleString()}</span>
                      </button>
                  )) : (
                     <span className="text-sm text-muted-foreground italic">Única capacidad disponible</span>
                  )}
                </div>
            </div>

          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col gap-4">
            <Button 
                size="lg" 
                onClick={handleAddToCart}
                className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform bg-primary text-primary-foreground"
            >
                <ShoppingCart className="mr-2 h-5 w-5" /> Agregar al Carrito
            </Button>
            
            <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12 rounded-xl border-border hover:bg-secondary font-bold">
                  <Heart className="mr-2 h-4 w-4" /> Wishlist
                </Button>
            </div>
          </div>

          {/* Specs Rápidas */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <BenefitItem icon={ShieldCheck} title="Garantía" desc="Incluida en tu compra" />
            <BenefitItem icon={Truck} title="Envío Gratis" desc="En 24-48 horas" />
          </div>

      </div>
    </div>
  );
}

function BenefitItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/20 border border-border/50">
            <div className="p-2 bg-background rounded-lg text-primary shadow-sm">
                <Icon size={16} />
            </div>
            <div>
                <p className="text-xs font-bold text-foreground">{title}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{desc}</p>
            </div>
        </div>
    )
}