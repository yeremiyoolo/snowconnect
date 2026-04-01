"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeftRight, HardDrive, Zap, Sparkles, X, LogIn, Scale, ShoppingCart, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useWishlistStore } from "@/lib/store/wishlist";
import { useCompareStore } from "@/lib/store/compare";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// 🍎 Importamos el Botón Inteligente
import { AddToCartButton } from "@/components/catalogo/add-to-cart-button";

interface ProductCardProps {
  product: any;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const wishlist = useWishlistStore();
  const compare = useCompareStore();
  
  const [mounted, setMounted] = useState(false);
  
  const [authOverlay, setAuthOverlay] = useState<{ open: boolean; type: "wishlist" | "compare" | "cart" }>({ 
    open: false, 
    type: "wishlist" 
  });

  useEffect(() => { setMounted(true); }, []);

  const specs = product.specs || {};
  
  let almacenamiento = specs.almacenamiento || product.almacenamiento;
  if (almacenamiento && !String(almacenamiento).toLowerCase().match(/(gb|tb)/)) {
    almacenamiento = `${almacenamiento} GB`;
  }

  const rawBat = product.bateria || specs.bateria || product.battery;
  const condicion = String(product.condicion || "").toLowerCase();
  let bateriaNumero: number | null = null;
  
  if (rawBat) {
    const match = String(rawBat).match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num > 0 && num <= 100) bateriaNumero = num;
    }
  }
  if (bateriaNumero === null && (condicion.match(/(nuevo|new|sellado)/))) {
    bateriaNumero = 100;
  }

  const priceValue = Number(product.precioVenta || product.precio) || 0;
  const now = new Date();
  let ofertaActiva = null;

  if (product.flashOffers && product.flashOffers.length > 0) {
    ofertaActiva = product.flashOffers.find((o: any) => 
      o.isActive === true && new Date(o.expiresAt) > now
    );
  }

  let precioFinal = priceValue;
  let porcentajeDescuento = 0;

  if (ofertaActiva) {
    porcentajeDescuento = ofertaActiva.discountPercent;
    const descuentoDinero = priceValue * (porcentajeDescuento / 100);
    precioFinal = priceValue - descuentoDinero;
  }

  const formatPrice = (amount: number) => new Intl.NumberFormat("en-US", { 
    style: "decimal", 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(amount);

  // LOGICA DE IMAGEN CORREGIDA
  let imageUrl = "/placeholder.png";
  if (product.imagenes && product.imagenes.length > 0) {
    if (typeof product.imagenes[0] === 'object' && product.imagenes[0].url) {
      imageUrl = product.imagenes[0].url;
    } else if (typeof product.imagenes[0] === 'string') {
      imageUrl = product.imagenes[0];
    }
  } else if (product.fotosJson) {
    try {
      const parsed = JSON.parse(product.fotosJson);
      if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
    } catch (e) {}
  } else if (product.imagen) {
    imageUrl = product.imagen;
  }
  
  // Si la url está vacía, usamos el placeholder local seguro
  if (!imageUrl || imageUrl.trim() === "") {
    imageUrl = "/placeholder.png";
  }

  const isWishlisted = mounted ? wishlist.isInWishlist(product.id) : false;
  const isComparing = mounted ? compare.isInCompare(product.id) : false;
  const isNew = index < 2 && !ofertaActiva;

  const handleAction = async (e: React.MouseEvent, type: "wishlist" | "compare") => {
      e.preventDefault(); 
      e.stopPropagation();

      if (type === "compare") {
        if (isComparing) {
          compare.removeItem(product.id);
          toast({ description: "Removido de comparar" });
        } else {
          if (compare.items.length >= 3) return toast({ title: "Límite alcanzado (Máx 3)" });
          compare.addItem({ ...product, imagen: imageUrl, precio: precioFinal });
          toast({ title: "Agregado a comparar", className: "bg-cyan-600 text-white border-none" });
        }
        return; 
      }

      if (!session) { 
        setAuthOverlay({ open: true, type }); 
        return; 
      }

      if (type === "wishlist") {
          if (isWishlisted) {
            wishlist.removeItem(product.id);
            toast({ description: "Eliminado de favoritos" });
          } else {
            wishlist.addItem({ ...product, imagen: imageUrl, precio: precioFinal });
            toast({ description: "Guardado ❤️", className: "bg-pink-600 text-white border-none" });
          }
      } 
  };

  const overlayConfig = {
    wishlist: { color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-900/20", btn: "from-pink-600 to-rose-600 shadow-pink-500/30", icon: Heart, title: "Favoritos", text: "Guarda productos para verlos después." },
    compare: { color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20", btn: "from-cyan-600 to-blue-600 shadow-cyan-500/30", icon: Scale, title: "Comparar", text: "Compara características técnicas lado a lado." },
    cart: { color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", btn: "from-blue-600 to-indigo-600 shadow-blue-500/30", icon: ShoppingCart, title: "Carrito", text: "Inicia sesión para poder comprar." }
  };
  const currentConfig = overlayConfig[authOverlay.type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ duration: 0.4, delay: index * 0.05 }} 
      className="h-full relative"
    >
        <div className="h-full rounded-[1.5rem] md:rounded-[2rem] bg-card border border-border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col relative group/card">
          
          <Link href={`/catalogo/${product.id}`} className="group relative block h-full flex-1 flex flex-col">
            
            {/* AQUÍ EL ARREGLO DEL ASPECT RATIO */}
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-secondary/30 p-4 md:p-6 flex items-center justify-center">
              {isNew && (
                <Badge className="absolute top-3 left-3 z-10 bg-blue-600 text-white border-none shadow-md px-2 py-0.5 text-[9px] md:text-[10px] font-black uppercase">
                  <Sparkles size={10} className="mr-1 inline-block" /> Nuevo
                </Badge>
              )}

              {ofertaActiva && (
                 <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    <Badge className="bg-red-600 text-white border-none shadow-md px-2 py-1 text-[10px] md:text-xs font-black uppercase">
                       <Timer size={12} className="mr-1 animate-pulse" /> Flash
                    </Badge>
                    <Badge className="bg-black text-white border-none self-start px-1.5 text-[10px] font-bold">
                       -{porcentajeDescuento}%
                    </Badge>
                 </div>
              )}
              
              <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 md:translate-x-10 md:opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-300">
                  <button onClick={(e) => handleAction(e, "wishlist")} className={cn("w-8 h-8 md:w-9 md:h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm border border-black/5 dark:border-white/10 active:scale-95", isWishlisted ? "bg-white text-red-500" : "bg-white/80 dark:bg-black/50 text-zinc-600 dark:text-zinc-300")}>
                    <Heart size={14} className={cn("transition-all", isWishlisted && "fill-current")} />
                  </button>
                  <button onClick={(e) => handleAction(e, "compare")} className={cn("w-8 h-8 md:w-9 md:h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm border border-black/5 dark:border-white/10 active:scale-95", isComparing ? "bg-blue-600 text-white border-blue-500" : "bg-white/80 dark:bg-black/50 text-zinc-600 dark:text-zinc-300")}>
                    <ArrowLeftRight size={14} />
                  </button>
              </div>

              {/* IMAGEN CORREGIDA: Sin mix-blend-multiply y con padding interno */}
              <div className="relative w-full h-full p-2">
                <Image 
                  src={imageUrl} 
                  alt={product.modelo || "Producto"} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
            </div>

            <div className="p-4 md:p-5 flex flex-col flex-1 gap-2">
              <div>
                <p className="text-[9px] md:text-[10px] font-bold text-blue-500 mb-0.5 uppercase tracking-wider">{product.marca || "Smartphone"}</p>
                <h3 className="text-base md:text-lg font-black text-foreground leading-tight line-clamp-1">{product.modelo}</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                 {almacenamiento && (
                   <Badge variant="secondary" className="px-1.5 py-0.5 h-5 md:h-6 text-[9px] md:text-[10px] font-bold bg-secondary/50 border-border text-muted-foreground gap-1">
                     <HardDrive size={10} className="text-blue-500" />{almacenamiento}
                   </Badge>
                 )}
                 
                 <div className="flex items-center gap-1.5 px-1.5 py-0.5 h-5 md:h-6 rounded-full bg-secondary/50 border border-border text-[9px] md:text-[10px] font-bold text-muted-foreground">
                     <Zap size={10} className={cn(bateriaNumero && bateriaNumero < 80 ? "text-yellow-500" : "text-green-500 fill-green-500")} />
                     {bateriaNumero ? (
                        <>
                          <span>{bateriaNumero}%</span>
                          <div className="hidden sm:block h-1.5 w-6 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden ml-1">
                            <div className={cn("h-full rounded-full", bateriaNumero > 80 ? "bg-green-500" : bateriaNumero > 50 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${bateriaNumero}%` }} />
                          </div>
                        </>
                     ) : (
                       <span className="text-[9px] opacity-50">--</span>
                     )}
                 </div>
              </div>

              <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
                 <div className="flex flex-col">
                   <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase">Precio</span>
                   
                   {ofertaActiva ? (
                     <div className="flex flex-col leading-none">
                        <span className="text-[10px] md:text-xs text-muted-foreground line-through decoration-red-500 decoration-2">
                           ${formatPrice(priceValue)}
                        </span>
                        <div className="flex items-baseline gap-0.5">
                           <span className="text-xs md:text-sm font-bold text-red-600">$</span>
                           <span className="text-lg md:text-2xl font-black text-red-600 tracking-tighter">
                              {formatPrice(precioFinal)}
                           </span>
                        </div>
                     </div>
                   ) : (
                     <div className="flex items-baseline gap-1">
                       <span className="text-xs font-bold text-primary">$</span>
                       <span className="text-lg md:text-xl font-black text-foreground tracking-tighter">{formatPrice(priceValue)}</span>
                     </div>
                   )}
                 </div>
                 
                 {product.estado === "VENDIDO" ? (
                    <Button size="icon" disabled className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed border-none ring-0 outline-none">
                      <X className="h-3 w-3 md:h-4 md:w-4"/>
                    </Button>
                 ) : (
                    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                      <AddToCartButton 
                        variant="icon" 
                        product={{
                          id: product.id,
                          name: `${product.marca} ${product.modelo}`,
                          price: precioFinal,
                          image: imageUrl,
                        }} 
                      />
                    </div>
                 )}
              </div>
            </div>
          </Link>

          <AnimatePresence>
            {authOverlay.open && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, scale: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, scale: 0.95, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-black/95 p-4 md:p-6 text-center cursor-default"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                    <button onClick={() => setAuthOverlay({ ...authOverlay, open: false })} className="absolute top-2 right-2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground"><X size={16} /></button>
                    <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-3 shadow-xl ring-1 ring-black/5 dark:ring-white/10", currentConfig.bg)}>
                        <currentConfig.icon size={24} className={currentConfig.color} />
                    </div>
                    <h4 className="text-base md:text-lg font-black mb-1 leading-tight text-foreground tracking-tight">{currentConfig.title}</h4>
                    <p className="text-[10px] md:text-xs font-medium text-muted-foreground mb-4 px-2 leading-relaxed">{currentConfig.text}</p>
                    <div className="flex flex-col w-full gap-2">
                         <Button onClick={() => router.push("/auth/login")} className={cn("w-full h-10 md:h-11 rounded-xl text-xs md:text-sm font-bold text-white shadow-lg bg-gradient-to-r border-0", currentConfig.btn)}>
                            <LogIn size={14} className="mr-2" /> Iniciar Sesión
                         </Button>
                         <Button variant="outline" onClick={() => setAuthOverlay({ ...authOverlay, open: false })} className="w-full h-10 md:h-11 rounded-xl text-[10px] md:text-xs font-bold border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors uppercase tracking-wide">
                            Cancelar
                         </Button>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
    </motion.div>
  );
}