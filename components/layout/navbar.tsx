"use client";

import Link from "next/link"; 
import Image from "next/image"; 
import { useSession, signOut } from "next-auth/react"; 
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Heart, Menu, Smartphone, Wrench, LogOut, Settings, Home, User, Package, Crown, LogIn, ChevronRight, RefreshCcw, CreditCard, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils"; 
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/cart"; 
import { motion, AnimatePresence } from "framer-motion"; 
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function Navbar() {
  const { data: session } = useSession(); 
  const router = useRouter(); 
  const pathname = usePathname(); 
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false); 
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  
  // ESTADO PARA CONTROLAR QUÉ TIPO DE ALERTA MOSTRAR (Wishlist = Pink, Cart = Blue)
  const [modalConfig, setModalConfig] = useState<{ open: boolean; type: "wishlist" | "cart" }>({ open: false, type: "cart" });

  useEffect(() => { 
    setMounted(true); 
    const handleScroll = () => setScrolled(window.scrollY > 20); 
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll); 
  }, []);
  
  const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.cantidad, 0) : 0;

  // --- INTERCEPTOR INTELIGENTE ---
  const handleProtectedAction = (e: React.MouseEvent, type: "wishlist" | "cart") => {
    if (!session) { 
      e.preventDefault(); 
      setModalConfig({ open: true, type }); // Guardamos si fue click en corazón o carrito
    }
  };

  const isActive = (path: string) => pathname === path;
  const publicItems = [{ name: "Inicio", href: "/", icon: Home }, { name: "Catálogo", href: "/catalogo", icon: Smartphone }, { name: "Servicios", href: "/servicios", icon: Wrench }];
  const userItems = [{ name: "Vista General", href: "/account", icon: User }, { name: "Mis Pedidos", href: "/account/orders", icon: Package }, { name: "Mis Ventas", href: "/account/trade-in", icon: RefreshCcw }, { name: "Billetera", href: "/account/wallet", icon: CreditCard }, { name: "Ajustes", href: "/account", icon: Settings }];

  // Variables dinámicas para el color del Modal
  const isWishlistModal = modalConfig.type === "wishlist";
  const modalColor = isWishlistModal ? "text-pink-600" : "text-blue-600";
  const modalBg = isWishlistModal ? "bg-pink-50 dark:bg-pink-900/20" : "bg-blue-50 dark:bg-blue-900/20";
  const modalBtn = isWishlistModal ? "bg-pink-600 hover:bg-pink-700" : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 200, damping: 20 }} 
        // OPTIMIZACIÓN AQUÍ: Se eliminó 'transition-all' y se añadió 'will-change-transform'
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-4 py-2 px-4 pl-5 rounded-full transition-colors duration-300 will-change-transform", 
          scrolled 
            ? "w-full max-w-5xl bg-blue-600 border border-blue-500 shadow-xl shadow-blue-900/20" 
            : "w-full max-w-6xl bg-background/50 backdrop-blur-md border border-white/20 dark:border-white/10"
        )}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className={cn("relative w-9 h-9 overflow-hidden rounded-full p-[1px] shadow-sm transition-all", scrolled ? "bg-white" : "bg-gradient-to-tr from-blue-500 to-cyan-400")}>
               <div className="bg-white w-full h-full rounded-full flex items-center justify-center overflow-hidden"><Image src="/logo.png" alt="Snow Connect Logo" width={36} height={36} className="object-cover" /></div>
            </div>
            <span className="text-lg font-black tracking-tighter transition-colors hidden sm:block">
              <span className={cn("transition-colors duration-300", scrolled ? "text-white" : "text-foreground")}>Snow</span><span className={cn("transition-colors duration-300", scrolled ? "text-black" : "text-blue-500")}>Connect</span>
            </span>
          </Link>
        </div>

        <div className={cn("hidden lg:flex items-center gap-1 p-1 rounded-full border backdrop-blur-sm transition-colors", scrolled ? "bg-black/10 border-transparent" : "bg-background/30 border-white/10")}>
          {publicItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <Button variant="ghost" size="sm" className={cn("rounded-full text-xs font-bold px-4 h-8 transition-all border-none ring-0 outline-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0", active ? (scrolled ? "bg-white text-black scale-110 shadow-none" : "bg-blue-600 text-white scale-110 shadow-none") : (scrolled ? "text-white hover:bg-white hover:text-black" : "text-foreground hover:bg-background/80 hover:text-primary"))}>{item.name}</Button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="hidden sm:flex"><Button variant="ghost" size="icon" className={cn("rounded-full w-9 h-9 transition-all duration-300 hover:scale-110", scrolled ? "text-yellow-300 hover:text-yellow-100" : "text-yellow-500 hover:text-yellow-400")}><Crown size={20} strokeWidth={2.5} /></Button></Link>
          )}

          {/* ❤️ CORAZÓN (WISHLIST) */}
          <Link href="/wishlist" onClick={(e) => handleProtectedAction(e, "wishlist")} className="relative hidden sm:flex">
             <Button variant="ghost" size="icon" className={cn("rounded-full w-9 h-9 transition-colors !border-none !ring-0 !outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 hover:bg-transparent shadow-none", isActive("/wishlist") ? "!bg-transparent text-red-500 scale-110" : (scrolled ? "text-white hover:text-red-200" : "text-foreground hover:text-red-500"))}>
                <Heart className={cn("w-4 h-4", isActive("/wishlist") && "fill-current")} />
             </Button>
          </Link>

          {/* 🛒 CARRITO (CART) */}
          <Link href="/carrito" onClick={(e) => handleProtectedAction(e, "cart")} className="relative">
             <Button variant="ghost" size="icon" className={cn("rounded-full w-9 h-9 transition-colors !border-none !ring-0 !outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 hover:bg-transparent shadow-none", isActive("/carrito") ? (scrolled ? "!bg-transparent text-black scale-110" : "!bg-transparent text-blue-600 scale-110") : (scrolled ? "text-white hover:text-blue-200" : "text-foreground hover:text-blue-500"))}>
                <ShoppingCart className={cn("w-4 h-4", isActive("/carrito") && "fill-current")} />
             </Button>
             <AnimatePresence>
               {cartCount > 0 && (
                 <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={cn("absolute -top-1 -right-1 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center border-none shadow-sm pointer-events-none", isActive("/carrito") ? (scrolled ? "bg-black text-white" : "bg-blue-600 text-white") : (scrolled ? "bg-white text-blue-600" : "bg-blue-600 text-white"))}>{cartCount}</motion.span>
               )}
             </AnimatePresence>
          </Link>

          <div className={cn("h-4 w-[1px] mx-1 transition-colors", scrolled ? "bg-white/20" : "bg-border")} />

          {session ? (
            <Link href="/account">
               <div className={cn("w-9 h-9 rounded-full p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-md", isActive("/account") ? "ring-2 ring-white !border-none" : "", scrolled ? "bg-white" : "bg-gradient-to-tr from-blue-600 to-purple-600")}>
                 <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden text-foreground font-bold text-xs">
                   {session.user?.image ? <Image src={session.user.image} alt="User" width={32} height={32} /> : session.user?.name?.[0] || "U"}
                 </div>
               </div>
            </Link>
          ) : (
            <Link href="/auth/login" className="hidden sm:block"><Button size="sm" className={cn("rounded-full px-5 h-9 text-xs font-bold shadow-lg transition-colors", scrolled ? "bg-black text-white hover:bg-gray-900" : "bg-foreground text-background hover:bg-foreground/80")}>Entrar</Button></Link>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("rounded-full w-9 h-9 ml-1 transition-colors", scrolled ? "text-white hover:bg-white/20" : "text-foreground hover:bg-secondary/80")}><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l-border bg-background/95 backdrop-blur-xl flex flex-col h-full text-foreground z-[60]">
              <SheetHeader className="p-6 border-b border-border text-left">
                <SheetTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg shadow-blue-500/20 border border-border"><Image src="/logo.png" alt="Snow" width={32} height={32} className="object-contain" /></div>
                   <span>Snow<span className="text-blue-600">Connect</span></span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-4 px-2 space-y-1 flex-1 overflow-y-auto">
                {session?.user?.role === "ADMIN" && (<div className="mb-4 px-2"><SheetClose asChild><Link href="/admin" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"><Crown size={18} className="text-yellow-300 fill-yellow-300" /> Panel de Admin</Link></SheetClose></div>)}
                <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-2">Menú Principal</p>
                {publicItems.map((item) => { const active = isActive(item.href); return (<SheetClose key={item.name} asChild><Link href={item.href} className={cn("flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all", active ? "text-blue-600 bg-transparent scale-105 origin-left" : "text-muted-foreground hover:text-foreground hover:bg-transparent")}><item.icon size={18} /> {item.name}</Link></SheetClose>)})}
                {session && (<><p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-6">Mi Cuenta</p>{userItems.map((item) => { const active = isActive(item.href); return (<SheetClose key={item.name} asChild><Link href={item.href} className={cn("flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group", active ? "text-blue-600 bg-transparent font-bold" : "text-muted-foreground hover:text-blue-600 hover:bg-transparent")}><div className="flex items-center gap-4"><item.icon size={18} /> {item.name}</div><ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></SheetClose>)})}</>)}
              </div>
              <div className="p-6 border-t border-border bg-secondary/30">
                 {!session ? (<SheetClose asChild><Link href="/auth/login"><Button className="w-full rounded-xl bg-foreground text-background font-bold h-12 hover:bg-foreground/80 transition-colors shadow-lg"><LogIn size={18} className="mr-2" /> Iniciar Sesión</Button></Link></SheetClose>) : (<div className="flex flex-col gap-4"><Link href="/account"><div className="flex items-center gap-4 p-3 rounded-2xl bg-background border border-border hover:border-blue-500/50 transition-colors cursor-pointer shadow-sm"><div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 flex items-center justify-center text-foreground font-bold border border-border">{session.user?.image ? <Image src={session.user.image} alt="User" width={40} height={40} /> : session.user?.name?.[0] || "U"}</div><div className="flex flex-col overflow-hidden"><span className="text-sm font-black text-foreground truncate">{session.user?.name}</span><span className="text-xs text-muted-foreground truncate">{session.user?.email}</span></div></div></Link><SheetClose asChild><Button onClick={() => signOut()} variant="destructive" className="w-full rounded-xl font-bold h-11 flex items-center gap-2 shadow-sm"><LogOut size={16} /> Cerrar Sesión</Button></SheetClose></div>)}
              </div>
            </SheetContent>
          </Sheet>

          {/* --- MODAL DINÁMICO (ROSA o AZUL) --- */}
          {modalConfig.open && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModalConfig({ ...modalConfig, open: false }); }} />
              <div className="relative w-full max-w-xs bg-background border border-border rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                 <button onClick={() => setModalConfig({ ...modalConfig, open: false })} className="absolute top-3 right-3 p-1 rounded-full hover:bg-secondary text-muted-foreground z-10"><X size={18} /></button>
                 <div className="p-6 text-center flex flex-col items-center">
                    <div className={cn("w-14 h-14 rounded-full flex items-center justify-center mb-4", modalBg)}><ShieldAlert size={28} className={modalColor} /></div>
                    <h3 className="text-lg font-black mb-1">{isWishlistModal ? "Lista de Deseos" : "Carrito Protegido"}</h3>
                    <p className="text-muted-foreground text-xs mb-5">{isWishlistModal ? "Inicia sesión para guardar tus favoritos." : "Inicia sesión para ver tu carrito."}</p>
                    <div className="w-full space-y-2">
                       <Button onClick={() => router.push("/auth/login")} className={cn("w-full h-10 rounded-xl text-sm font-bold text-white", modalBtn)}><LogIn size={16} className="mr-2" /> Entrar</Button>
                       <Button variant="ghost" onClick={() => setModalConfig({ ...modalConfig, open: false })} className="w-full h-10 rounded-xl text-xs font-bold text-muted-foreground">Cancelar</Button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </motion.nav>
    </div>
  );
}