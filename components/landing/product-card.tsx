"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeftRight, HardDrive, Zap, Sparkles, ShieldAlert, X, LogIn, Scale, ShoppingCart, Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Stores & Hooks
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCompareStore } from "@/lib/store/compare";
import { useCartStore } from "@/lib/store/cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

// Definición flexible del producto para evitar errores de TS estrictos
interface ProductCardProps {
  product: any;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // Stores
  const wishlist = useWishlistStore();
  const compare = useCompareStore();
  const cart = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [isAddingCart, setIsAddingCart] = useState(false);
  
  // ESTADO UNIFICADO PARA LAS ALERTAS (Wishlist, Compare, Cart)
  const [authOverlay, setAuthOverlay] = useState<{ open: boolean; type: "wishlist" | "compare" | "cart" }>({ 
    open: false, 
    type: "wishlist" 
  });

  useEffect(() => { setMounted(true); }, []);

  // --- LÓGICA DE DATOS ---
  const specs = product.specs || {};
  
  // Formateo de almacenamiento
  let almacenamiento = specs.almacenamiento || product.almacenamiento;
  if (almacenamiento && !String(almacenamiento).toLowerCase().match(/(gb|tb)/)) {
    almacenamiento = `${almacenamiento} GB`;
  }

  // Lógica de Batería
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
  // Si es nuevo/sellado y no tiene dato de batería, asumimos 100%
  if (bateriaNumero === null && (condicion.match(/(nuevo|new|sellado)/))) {
    bateriaNumero = 100;
  }

  // Formateo de Precio
  const priceValue = Number(product.precioVenta || product.precio) || 0;
  const formatPrice = (amount: number) => new Intl.NumberFormat("en-US", { 
    style: "decimal", 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(amount);

  // Lógica de Imagen
  let imageUrl = "/placeholder.png";
  if (product.fotosJson) {
    try {
      const parsed = JSON.parse(product.fotosJson);
      if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
    } catch (e) {}
  } else if (product.imagen) {
    imageUrl = product.imagen;
  }
  
  // Fallback visual si no hay imagen
  if (!imageUrl || imageUrl === "/placeholder.png") {
    imageUrl = "https://images.unsplash.com/photo-1592899677712-a5a254503484?q=80&w=1000&auto=format&fit=crop";
  }

  // Estados de UI
  const isWishlisted = mounted ? wishlist.isInWishlist(product.id) : false;
  const isComparing = mounted ? compare.isInCompare(product.id) : false;
  const isNew = index < 2; // Los primeros 2 se marcan como nuevos

  // --- HANDLERS CENTRALIZADOS ---
  const handleAction = async (e: React.MouseEvent, type: "wishlist" | "compare" | "cart") => {
      e.preventDefault(); 
      e.stopPropagation();
      
      // 🔒 BLOQUEO: Si no hay sesión, mostramos el overlay
      if (!session) { 
        setAuthOverlay({ open: true, type }); 
        return; 
      }

      // LÓGICA SI ESTÁ LOGUEADO
      if (type === "wishlist") {
          if (isWishlisted) {
            wishlist.removeItem(product.id);
            toast({ description: "Eliminado de favoritos" });
          } else {
            wishlist.addItem({ ...product, imagen: imageUrl, precio: priceValue });
            toast({ description: "Guardado ❤️", className: "bg-pink-600 text-white border-none" });
          }
      } 
      else if (type === "compare") {
          if (isComparing) {
            compare.removeItem(product.id);
            toast({ description: "Removido de comparar" });
          } else {
            if (compare.items.length >= 3) return toast({ title: "Límite alcanzado (Máx 3)" });
            compare.addItem({ ...product, imagen: imageUrl, precio: priceValue });
            toast({ title: "Agregado a comparar", className: "bg-cyan-600 text-white border-none" });
          }
      }
      else if (type === "cart") {
          setIsAddingCart(true);
          // Simular pequeño delay para feedback visual
          await new Promise(r => setTimeout(r, 500));
          
          cart.addItem({ 
            id: product.id, 
            name: `${product.marca} ${product.modelo}`, 
            price: priceValue, 
            image: imageUrl, 
            cantidad: 1 
          });
          
          toast({ title: "¡Agregado al carrito!", className: "bg-blue-600 text-white border-none" });
          setIsAddingCart(false);
      }
  };

  // --- CONFIGURACIÓN VISUAL DEL OVERLAY ---
  const overlayConfig = {
    wishlist: { 
      color: "text-pink-600", 
      bg: "bg-pink-50 dark:bg-pink-900/20", 
      btn: "from-pink-600 to-rose-600 shadow-pink-500/30", 
      icon: ShieldAlert, 
      title: "Favoritos", 
      text: "Guarda productos para verlos después." 
    },
    compare: { 
      color: "text-cyan-600", 
      bg: "bg-cyan-50 dark:bg-cyan-900/20", 
      btn: "from-cyan-600 to-blue-600 shadow-cyan-500/30", 
      icon: Scale, 
      title: "Comparar", 
      text: "Compara características técnicas lado a lado." 
    },
    cart: { 
      color: "text-blue-600", 
      bg: "bg-blue-50 dark:bg-blue-900/20", 
      btn: "from-blue-600 to-indigo-600 shadow-blue-500/30", 
      icon: ShoppingCart, 
      title: "Carrito", 
      text: "Inicia sesión para poder comprar." 
    }
  };
  
  const currentConfig = overlayConfig[authOverlay.type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ duration: 0.5, delay: index * 0.1 }} 
      className="h-full relative"
    >
        <div className="h-full rounded-[2rem] bg-card border border-border overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 flex flex-col relative group/card">
          
          <Link href={`/catalogo/${product.id}`} className="group relative block h-full flex-1 flex flex-col">
            
            {/* --- IMAGEN --- */}
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30 p-6 flex items-center justify-center">
              {isNew && (
                <Badge className="absolute top-4 left-4 z-10 bg-blue-600 text-white border-none shadow-lg px-2 py-0.5 text-[10px] font-black uppercase animate-pulse">
                  <Sparkles size={10} className="mr-1 inline-block" /> Nuevo
                </Badge>
              )}
              
              {/* Botones Flotantes (Wishlist / Compare) */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-10 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-300">
                  <button onClick={(e) => handleAction(e, "wishlist")} className={cn("w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm border border-white/20 hover:scale-110", isWishlisted ? "bg-white text-red-500" : "bg-white/60 text-zinc-600 hover:bg-white hover:text-red-500")}>
                    <Heart size={16} className={cn("transition-all", isWishlisted && "fill-current")} />
                  </button>
                  <button onClick={(e) => handleAction(e, "compare")} className={cn("w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm border border-white/20 hover:scale-110", isComparing ? "bg-blue-600 text-white border-blue-500" : "bg-white/60 text-zinc-600 hover:bg-white hover:text-blue-600")}>
                    <ArrowLeftRight size={16} />
                  </button>
              </div>

              <Image 
                src={imageUrl} 
                alt={product.modelo || "Producto"} 
                fill 
                className="object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal" 
              />
            </div>

            {/* --- INFO --- */}
            <div className="p-5 flex flex-col flex-1 gap-2">
              <div>
                <p className="text-[10px] font-bold text-blue-500 mb-0.5 uppercase tracking-wider">{product.marca || "Smartphone"}</p>
                <h3 className="text-lg font-black text-foreground leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{product.modelo}</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                 {almacenamiento && (
                   <Badge variant="secondary" className="px-2 py-0.5 h-6 text-[10px] font-bold bg-secondary/50 border-border text-muted-foreground gap-1.5 hover:bg-secondary">
                     <HardDrive size={10} className="text-blue-500" />{almacenamiento}
                   </Badge>
                 )}
                 
                 {/* Indicador de Batería */}
                 <div className="flex items-center gap-2 px-2 py-0.5 h-6 rounded-full bg-secondary/50 border border-border text-[10px] font-bold text-muted-foreground w-auto min-w-[80px]">
                     <Zap size={10} className={cn(bateriaNumero && bateriaNumero < 80 ? "text-yellow-500" : "text-green-500 fill-green-500")} />
                     {bateriaNumero ? (
                        <>
                          <span>{bateriaNumero}%</span>
                          <div className="h-1.5 w-8 bg-zinc-300 dark:bg-zinc-700 rounded-full overflow-hidden ml-auto">
                            <div className={cn("h-full rounded-full", bateriaNumero > 80 ? "bg-green-500" : bateriaNumero > 50 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${bateriaNumero}%` }} />
                          </div>
                        </>
                     ) : (
                       <span className="text-xs opacity-50">--</span>
                     )}
                 </div>
              </div>

              <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Precio</span>
                   <div className="flex items-baseline gap-1">
                     <span className="text-xs font-bold text-primary">$</span>
                     <span className="text-xl font-black text-foreground tracking-tighter">{formatPrice(priceValue)}</span>
                   </div>
                 </div>
                 
                 {/* BOTÓN "+" CARRITO INTEGRADO */}
                 <Button 
                    size="icon" 
                    onClick={(e) => handleAction(e, "cart")} 
                    disabled={isAddingCart || product.estado === "VENDIDO"} 
                    className={cn(
                      "rounded-full h-10 w-10 shadow-lg transition-all border-none ring-0 outline-none", 
                      product.estado === "VENDIDO" 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-110"
                    )}
                 >
                    {isAddingCart ? <Loader2 className="h-4 w-4 animate-spin" /> : product.estado === "VENDIDO" ? <X className="h-4 w-4"/> : <Plus className="h-5 w-5 font-bold" />}
                 </Button>
              </div>
            </div>
          </Link>

          {/* --- OVERLAY DE SEGURIDAD PREMIUM (LOGIN REQUERIDO) --- */}
          <AnimatePresence>
            {authOverlay.open && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, scale: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, scale: 0.95, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 dark:bg-black/90 p-6 text-center cursor-default"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                    <button onClick={() => setAuthOverlay({ ...authOverlay, open: false })} className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground transition-colors"><X size={18} /></button>
                    
                    {/* ICONO CON EFECTO GLOW */}
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-xl ring-1 ring-black/5 dark:ring-white/10", currentConfig.bg)}>
                        <currentConfig.icon size={28} className={currentConfig.color} />
                    </div>
                    
                    <h4 className="text-lg font-black mb-1 leading-tight text-foreground tracking-tight">
                        {currentConfig.title}
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground mb-6 px-1 leading-relaxed">
                        {currentConfig.text}
                    </p>

                    {/* BOTONES */}
                    <div className="flex flex-col w-full gap-3">
                         <Button 
                            onClick={() => router.push("/auth/login")} 
                            className={cn(
                                "w-full h-11 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r border-0",
                                currentConfig.btn
                            )}
                         >
                            <LogIn size={16} className="mr-2" /> Iniciar Sesión
                         </Button>
                         
                         <Button 
                            variant="outline" 
                            onClick={() => setAuthOverlay({ ...authOverlay, open: false })} 
                            className="w-full h-11 rounded-xl text-xs font-bold border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors uppercase tracking-wide"
                         >
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