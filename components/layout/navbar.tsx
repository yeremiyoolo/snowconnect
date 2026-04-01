"use client";

import Link from "next/link"; 
import Image from "next/image"; 
import { useSession, signOut } from "next-auth/react"; 
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Heart, Menu, Smartphone, Wrench, LogOut, Settings, Home, User, Package, Crown, LogIn, ChevronRight, RefreshCcw, CreditCard, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils"; 
import { useState, useEffect } from "react";
// 🔥 1. CAMBIAMOS AL NUEVO CARRITO
import { useCart } from "@/hooks/use-cart"; 
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
  
  // 🔥 2. LEEMOS LOS ITEMS DEL NUEVO CARRITO
  const cartItems = useCart((state) => state.items);
  
  const [modalConfig, setModalConfig] = useState<{ open: boolean; type: "wishlist" | "cart" }>({ open: false, type: "cart" });

  useEffect(() => { 
    setMounted(true); 
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    }; 
    window.addEventListener("scroll", handleScroll, { passive: true }); 
    return () => window.removeEventListener("scroll", handleScroll); 
  }, []);
  
  // 🔥 3. SUMAMOS USANDO "quantity"
  const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const handleProtectedAction = (e: React.MouseEvent, type: "wishlist" | "cart", path: string) => {
    if (!session) { 
      e.preventDefault(); 
      setModalConfig({ open: true, type }); 
    } else {
      router.push(path);
    }
  };

  const isActive = (path: string) => pathname === path;
  const publicItems = [{ name: "Inicio", href: "/", icon: Home }, { name: "Catálogo", href: "/catalogo", icon: Smartphone }, { name: "Servicios", href: "/servicios", icon: Wrench }];
  const userItems = [{ name: "Vista General", href: "/account", icon: User }, { name: "Mis Pedidos", href: "/account/orders", icon: Package }, { name: "Mis Ventas", href: "/account/trade-in", icon: RefreshCcw }, { name: "Billetera", href: "/account/wallet", icon: CreditCard }, { name: "Ajustes", href: "/account", icon: Settings }];

  const isWishlistModal = modalConfig.type === "wishlist";
  const modalColor = isWishlistModal ? "text-pink-600" : "text-blue-600";
  const modalBg = isWishlistModal ? "bg-pink-50 dark:bg-pink-900/20" : "bg-blue-50 dark:bg-blue-900/20";
  const modalBtn = isWishlistModal ? "bg-pink-600 hover:bg-pink-700" : "bg-blue-600 hover:bg-blue-700";

  return (
    <>
    {/* 🖥️ TOP NAVBAR (Para PC y la "Píldora" en Móvil) - z-[100] agregado */}
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-2 sm:pt-4 px-2 sm:px-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 200, damping: 20 }} 
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 py-1.5 sm:py-2 px-3 sm:px-4 pl-4 sm:pl-5 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", 
          scrolled ? "w-full max-w-5xl bg-blue-600/95 backdrop-blur-xl border border-blue-400 shadow-xl shadow-blue-900/30" : "w-full max-w-6xl bg-background/70 sm:bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/10"
        )}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-[1px] shadow-sm">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full" />
               <div className={cn("absolute inset-0 bg-white rounded-full transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", scrolled ? "opacity-100" : "opacity-0")} />
               <div className="relative bg-white w-full h-full rounded-full flex items-center justify-center overflow-hidden z-10">
                 <Image src="/logo.png" alt="Snow Connect Logo" width={36} height={36} className="object-cover" />
               </div>
            </div>
            <span className="text-base sm:text-lg font-black tracking-tighter">
              <span className={cn("transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]", scrolled ? "text-white" : "text-foreground")}>Snow</span>
              <span className={cn("transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]", scrolled ? "text-black hidden sm:inline" : "text-blue-500 hidden sm:inline")}>Connect</span>
            </span>
          </Link>
        </div>

        {/* Menú PC */}
        <div className={cn(
            "hidden lg:flex items-center gap-1 p-1 rounded-full border backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", 
            scrolled ? "bg-black/15 border-transparent" : "bg-background/30 border-white/10"
        )}>
          {publicItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <Button variant="ghost" size="sm" className={cn("rounded-full text-xs font-bold px-4 h-8 border-none ring-0 outline-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0", active ? (scrolled ? "bg-white text-black scale-105 shadow-none" : "bg-blue-600 text-white scale-105 shadow-none") : (scrolled ? "text-white hover:bg-white hover:text-black" : "text-foreground hover:bg-background/80 hover:text-primary"))}>
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Iconos Derecha */}
        <div className="flex items-center gap-1 sm:gap-2">
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-500", scrolled ? "text-yellow-300 hover:text-yellow-100" : "text-yellow-500 hover:text-yellow-400")}>
                <Crown size={18} strokeWidth={2.5} />
              </Button>
            </Link>
          )}

          {/* Oculto en móvil porque estará en la barra inferior */}
          <Link href="/wishlist" onClick={(e) => handleProtectedAction(e, "wishlist", "/wishlist")} className="relative hidden md:flex">
             <Button variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-500 !border-none !ring-0 !outline-none focus:ring-0 focus:outline-none hover:bg-transparent shadow-none", isActive("/wishlist") ? "!bg-transparent text-red-500 scale-110" : (scrolled ? "text-white hover:text-red-200" : "text-foreground hover:text-red-500"))}>
                <Heart className={cn("w-4 h-4 transition-colors duration-500", isActive("/wishlist") && "fill-current")} />
             </Button>
          </Link>

          {/* Oculto en móvil porque estará en la barra inferior */}
          <Link href="/carrito" onClick={(e) => handleProtectedAction(e, "cart", "/carrito")} className="relative hidden md:flex">
             <Button variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 sm:w-9 sm:h-9 transition-all duration-500 !border-none !ring-0 !outline-none focus:ring-0 focus:outline-none hover:bg-transparent shadow-none", isActive("/carrito") ? (scrolled ? "!bg-transparent text-black scale-110" : "!bg-transparent text-blue-600 scale-110") : (scrolled ? "text-white hover:text-blue-200" : "text-foreground hover:text-blue-500"))}>
                <ShoppingCart className={cn("w-4 h-4 transition-colors duration-500", isActive("/carrito") && "fill-current")} />
             </Button>
             <AnimatePresence>
               {cartCount > 0 && (
                 <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className={cn("absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center border-none shadow-sm pointer-events-none transition-colors duration-500", isActive("/carrito") ? (scrolled ? "bg-black text-white" : "bg-blue-600 text-white") : (scrolled ? "bg-white text-blue-600" : "bg-blue-600 text-white"))}>
                   {cartCount}
                 </motion.span>
               )}
             </AnimatePresence>
          </Link>

          <div className={cn("hidden sm:block h-4 w-[1px] mx-1 transition-colors duration-500", scrolled ? "bg-white/30" : "bg-border")} />

          {/* Avatar PC / Login PC */}
          <div className="hidden sm:block">
            {session ? (
              <Link href="/account">
                 <div className={cn("w-8 h-8 sm:w-9 sm:h-9 rounded-full p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-md relative", isActive("/account") ? "ring-2 ring-white !border-none" : "")}>
                   <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full" />
                   <div className={cn("absolute inset-0 bg-white rounded-full transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", scrolled ? "opacity-100" : "opacity-0")} />
                   <div className="relative w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden text-foreground font-bold text-xs z-10">
                     {session.user?.image ? <Image src={session.user.image} alt="User" width={32} height={32} /> : session.user?.name?.[0] || "U"}
                   </div>
                 </div>
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden sm:block">
                <Button size="sm" className={cn("rounded-full px-5 h-8 sm:h-9 text-[10px] sm:text-xs font-bold shadow-lg transition-colors duration-500", scrolled ? "bg-black text-white hover:bg-gray-900" : "bg-foreground text-background hover:bg-foreground/80")}>
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Hamburguesa Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("rounded-full w-8 h-8 sm:w-9 sm:h-9 ml-0.5 transition-colors duration-500", scrolled ? "text-white hover:bg-white/20" : "text-foreground hover:bg-secondary/80")}>
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0 border-l-border bg-background/95 backdrop-blur-xl flex flex-col h-full text-foreground z-[110]">
              <SheetHeader className="p-5 sm:p-6 border-b border-border text-left">
                <SheetTitle className="flex items-center gap-3 text-lg sm:text-xl font-black uppercase tracking-tighter">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg shadow-blue-500/20 border border-border"><Image src="/logo.png" alt="Snow" width={32} height={32} className="object-contain" /></div>
                   <span>Snow<span className="text-blue-600">Connect</span></span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-2 sm:py-4 px-2 space-y-1 flex-1 overflow-y-auto">
                {session?.user?.role === "ADMIN" && (<div className="mb-4 px-2"><SheetClose asChild><Link href="/admin" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"><Crown size={18} className="text-yellow-300 fill-yellow-300" /> Panel de Admin</Link></SheetClose></div>)}
                <p className="px-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 sm:mb-2 mt-2">Menú Principal</p>
                {publicItems.map((item) => { const active = isActive(item.href); return (<SheetClose key={item.name} asChild><Link href={item.href} className={cn("flex items-center gap-3 sm:gap-4 px-4 py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all", active ? "text-blue-600 bg-transparent scale-105 origin-left" : "text-muted-foreground hover:text-foreground hover:bg-transparent")}><item.icon size={16} className="sm:w-[18px] sm:h-[18px]" /> {item.name}</Link></SheetClose>)})}
                {session && (<><p className="px-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 sm:mb-2 mt-4 sm:mt-6">Mi Cuenta</p>{userItems.map((item) => { const active = isActive(item.href); return (<SheetClose key={item.name} asChild><Link href={item.href} className={cn("flex items-center justify-between px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all group", active ? "text-blue-600 bg-transparent font-bold" : "text-muted-foreground hover:text-blue-600 hover:bg-transparent")}><div className="flex items-center gap-3 sm:gap-4"><item.icon size={16} className="sm:w-[18px] sm:h-[18px]" /> {item.name}</div><ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></SheetClose>)})}</>)}
              </div>
              <div className="p-5 sm:p-6 border-t border-border bg-secondary/30 pb-20 md:pb-6">
                 {!session ? (<SheetClose asChild><Link href="/auth/login"><Button className="w-full rounded-xl bg-foreground text-background font-bold h-10 sm:h-12 hover:bg-foreground/80 transition-colors shadow-lg"><LogIn size={16} className="mr-2 sm:w-[18px] sm:h-[18px]" /> Iniciar Sesión</Button></Link></SheetClose>) : (<div className="flex flex-col gap-3 sm:gap-4"><Link href="/account"><div className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl bg-background border border-border hover:border-blue-500/50 transition-colors cursor-pointer shadow-sm"><div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary overflow-hidden shrink-0 flex items-center justify-center text-foreground font-bold border border-border text-xs sm:text-base">{session.user?.image ? <Image src={session.user.image} alt="User" width={40} height={40} /> : session.user?.name?.[0] || "U"}</div><div className="flex flex-col overflow-hidden"><span className="text-xs sm:text-sm font-black text-foreground truncate">{session.user?.name}</span><span className="text-[10px] sm:text-xs text-muted-foreground truncate">{session.user?.email}</span></div></div></Link><SheetClose asChild><Button onClick={() => signOut()} variant="destructive" className="w-full rounded-xl font-bold h-10 sm:h-11 flex items-center gap-2 shadow-sm text-xs sm:text-sm"><LogOut size={14} className="sm:w-4 sm:h-4" /> Cerrar Sesión</Button></SheetClose></div>)}
              </div>
            </SheetContent>
          </Sheet>

          {/* Modal Overlay Config */}
          {modalConfig.open && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
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

    {/* 📱 BOTTOM NAV BAR (Solo visible en Móviles) */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-background/90 backdrop-blur-xl border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Inicio */}
        <Link href="/" className={cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", isActive("/") ? "text-blue-600" : "text-muted-foreground hover:text-foreground")}>
          <Home className={cn("w-5 h-5", isActive("/") && "fill-blue-600/20")} />
          <span className="text-[10px] font-bold">Inicio</span>
        </Link>
        
        {/* Catálogo */}
        <Link href="/catalogo" className={cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", isActive("/catalogo") ? "text-blue-600" : "text-muted-foreground hover:text-foreground")}>
          <Smartphone className={cn("w-5 h-5", isActive("/catalogo") && "fill-blue-600/20")} />
          <span className="text-[10px] font-bold">Catálogo</span>
        </Link>

        {/* Carrito Móvil (Central y Destacado) */}
        <div className="relative -top-5 flex justify-center w-full">
          <Link 
            href="/carrito" 
            onClick={(e) => handleProtectedAction(e, "cart", "/carrito")}
            className={cn(
              "absolute flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-blue-900/20 border-[4px] border-background transition-transform active:scale-95",
              cartCount > 0 ? "bg-blue-600 text-white" : "bg-secondary text-foreground"
            )}
          >
            <ShoppingCart className={cn("w-6 h-6", cartCount > 0 && "fill-current")} />
            <AnimatePresence>
               {cartCount > 0 && (
                 <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-sm border-2 border-background pointer-events-none">
                   {cartCount}
                 </motion.span>
               )}
             </AnimatePresence>
          </Link>
        </div>

        {/* Favoritos */}
        <Link href="/wishlist" onClick={(e) => handleProtectedAction(e, "wishlist", "/wishlist")} className={cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", isActive("/wishlist") ? "text-pink-600" : "text-muted-foreground hover:text-foreground")}>
          <Heart className={cn("w-5 h-5", isActive("/wishlist") && "fill-pink-600/20 text-pink-600")} />
          <span className="text-[10px] font-bold">Favoritos</span>
        </Link>

        {/* Perfil */}
        {session ? (
          <Link href="/account" className={cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", isActive("/account") ? "text-blue-600" : "text-muted-foreground hover:text-foreground")}>
             <div className="w-5 h-5 rounded-full overflow-hidden bg-secondary border border-current flex items-center justify-center text-[8px] font-bold">
               {session.user?.image ? <Image src={session.user.image} alt="User" width={20} height={20} /> : session.user?.name?.[0] || "U"}
             </div>
            <span className="text-[10px] font-bold">Perfil</span>
          </Link>
        ) : (
          <Link href="/auth/login" className={cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", isActive("/auth/login") ? "text-blue-600" : "text-muted-foreground hover:text-foreground")}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Entrar</span>
          </Link>
        )}
      </div>
    </div>
    </>
  );
}