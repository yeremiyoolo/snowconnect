"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { 
  ShoppingCart, 
  Heart, 
  Menu, 
  Smartphone, 
  Wrench, 
  LogOut, 
  Settings, 
  Tag, 
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useWishlist } from "@/context/wishlist-context";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  
  // CORRECCIÓN: El contexto no tiene 'count', tiene 'items'.
  // Obtenemos los items y calculamos el largo del array.
  const { items } = useWishlist(); 
  const count = items ? items.length : 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Catálogo", href: "/catalogo", icon: Smartphone },
    { name: "Servicios", href: "/servicios", icon: Wrench },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Carrito", href: "/carrito", icon: ShoppingCart },
    { name: "Ofertas", href: "/catalogo?oferta=true", icon: Tag },
    { name: "Ajustes", href: "/perfil", icon: Settings },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-4 py-2 px-4 pl-5 rounded-full transition-all duration-500",
          scrolled 
            ? "w-full max-w-5xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-lg shadow-black/20" 
            : "w-full max-w-6xl bg-white/10 backdrop-blur-md border border-white/20"
        )}
      >
        {/* --- IZQUIERDA: LOGO --- */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 overflow-hidden rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1px] shadow-sm">
               <div className="bg-white w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                  <Image src="/logo.png" alt="Snow" width={32} height={32} className="object-cover" />
               </div>
            </div>
            <span className="text-lg font-black tracking-tighter transition-colors hidden sm:block">
              <span className={cn("transition-colors", scrolled ? "text-white" : "text-black")}>
                Snow
              </span>
              <span className={cn("transition-colors", scrolled ? "text-blue-500" : "text-gray-500")}>
                Connect
              </span>
            </span>
          </Link>
        </div>

        {/* --- CENTRO: MENÚ DESKTOP --- */}
        <div className={cn(
          "hidden lg:flex items-center gap-1 p-1 rounded-full border backdrop-blur-sm transition-colors",
          scrolled 
            ? "bg-white/10 border-white/10"
            : "bg-gray-100/50 border-gray-200/50"
        )}>
          {[
            { name: "Inicio", href: "/" },
            { name: "Catálogo", href: "/catalogo" },
            { name: "Servicios", href: "/servicios" }
          ].map((item) => (
            <Link key={item.name} href={item.href}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "rounded-full text-xs font-bold hover:shadow-sm px-4 h-8 transition-all",
                  scrolled 
                    ? "text-gray-300 hover:bg-white/10 hover:text-white" 
                    : "text-gray-600 hover:bg-white hover:text-black"
                )}
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* --- DERECHA: ACCIONES --- */}
        <div className="flex items-center gap-2">
          
          <Link href="/wishlist" className="relative hidden sm:flex">
             <Button variant="ghost" size="icon" className={cn("rounded-full w-9 h-9 transition-colors hover:text-red-500", scrolled ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-black/5")}>
                <Heart className="w-4 h-4" />
             </Button>
             {count > 0 && (
               <motion.span 
                 initial={{ scale: 0 }} animate={{ scale: 1 }}
                 className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pointer-events-none"
               />
             )}
          </Link>

          <Link href="/carrito">
             <Button variant="ghost" size="icon" className={cn("rounded-full w-9 h-9 transition-colors hover:text-blue-500", scrolled ? "text-gray-400 hover:bg-white/10" : "text-gray-500 hover:bg-black/5")}>
                <ShoppingCart className="w-4 h-4" />
             </Button>
          </Link>

          <div className={cn("h-4 w-[1px] mx-1 transition-colors", scrolled ? "bg-white/20" : "bg-black/10")} />

          {/* AVATAR DESKTOP */}
          {session ? (
            <Link href="/perfil">
               <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-md">
                 <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                   {session.user?.image ? (
                     <Image src={session.user.image} alt="User" width={32} height={32} />
                   ) : (
                     <span className="font-bold text-xs text-gray-700">{session.user?.name?.[0] || "U"}</span>
                   )}
                 </div>
               </div>
            </Link>
          ) : (
            <Link href="/auth/login" className="hidden sm:block">
              <Button size="sm" className={cn("rounded-full px-5 h-9 text-xs font-bold shadow-lg transition-colors", scrolled ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800")}>
                Entrar
              </Button>
            </Link>
          )}

          {/* --- MENÚ HAMBURGUESA --- */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full w-9 h-9 ml-1 transition-colors", 
                  scrolled ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
                )}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l-zinc-800 bg-zinc-950 backdrop-blur-xl flex flex-col h-full text-white">
              
              <SheetHeader className="p-6 border-b border-white/10 text-left">
                <SheetTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter">
                   
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-white/5">
                      <Image src="/logo.png" alt="Snow" width={32} height={32} className="object-contain" />
                   </div>
                   
                   <span>
                     <span className="text-white">Snow</span>
                     <span className="text-blue-500">Connect</span>
                   </span>
                
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col py-4 px-2 space-y-1 flex-1 overflow-y-auto">
                {menuItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link 
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <item.icon size={18} className="text-gray-500 group-hover:text-white" />
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20">
                 {!session ? (
                   <SheetClose asChild>
                     <Link href="/auth/login">
                       <Button className="w-full rounded-xl bg-white text-black font-bold h-12 hover:bg-gray-200 transition-colors">
                         Iniciar Sesión
                       </Button>
                     </Link>
                   </SheetClose>
                 ) : (
                   <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 overflow-hidden shrink-0 border border-white/10">
                            {session.user?.image && <Image src={session.user.image} alt="User" width={40} height={40} />}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-black text-white truncate">{session.user?.name}</span>
                            <span className="text-xs text-gray-500 truncate">{session.user?.email}</span>
                          </div>
                      </div>

                      <SheetClose asChild>
                        <Button 
                          onClick={() => signOut()}
                          variant="destructive"
                          className="w-full rounded-xl font-bold h-11 flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 shadow-none transition-all"
                        >
                          <LogOut size={16} />
                          Cerrar Sesión
                        </Button>
                      </SheetClose>
                   </div>
                 )}
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </motion.nav>
    </div>
  );
}