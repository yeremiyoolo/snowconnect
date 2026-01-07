"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-20 flex items-center justify-center px-4 md:px-8 pointer-events-none">
      <div 
        className={cn(
          "w-full max-w-7xl h-14 flex items-center justify-between pointer-events-auto mt-4 px-6 rounded-2xl transition-all duration-300",
          scrolled 
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg" 
            : "bg-transparent border border-transparent"
        )}
      >
        
        {/* LOGO: Aquí está tu imagen redonda */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl group">
          <img 
            src="/logo.png" 
            alt="SnowConnect Logo" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-sm transition-transform group-hover:scale-105" 
          />
          <span className={cn("transition-colors", scrolled ? "text-foreground" : "text-white mix-blend-difference")}>
            SNOW<span className="text-primary">CONNECT</span>
          </span>
        </Link>

        {/* MENÚ CENTRAL */}
        <div className={cn(
          "hidden md:flex items-center gap-8 text-sm font-medium transition-colors",
          scrolled ? "text-muted-foreground" : "text-white/80 mix-blend-difference"
        )}>
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <Link href="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
          <Link href="/servicios" className="hover:text-primary transition-colors">Servicios</Link>
        </div>

        {/* ICONOS DERECHA */}
        <div className="flex items-center gap-2">
          
          <Button variant="ghost" size="icon" className={cn("rounded-full hover:bg-white/10", scrolled ? "text-foreground" : "text-white mix-blend-difference")}>
            <Search className="w-5 h-5" />
          </Button>
          
          <Link href="/carrito">
            <Button variant="ghost" size="icon" className={cn("rounded-full hover:bg-white/10 relative", scrolled ? "text-foreground" : "text-white mix-blend-difference")}>
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white/10" />
            </Button>
          </Link>

          {/* LOGIN / PERFIL */}
          {status === "loading" ? (
             <div className="w-9 h-9 rounded-full bg-gray-200/20 animate-pulse ml-2" />
          ) : session ? (
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="rounded-full ml-2 border border-transparent hover:border-primary/20 hover:bg-primary/10 transition-all">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {session.user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                 </div>
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button 
                variant={scrolled ? "default" : "secondary"} 
                size="sm" 
                className="hidden sm:flex rounded-full px-5 ml-2 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Entrar
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className={cn("md:hidden rounded-full", scrolled ? "text-foreground" : "text-white mix-blend-difference")}>
            <Menu className="w-6 h-6" />
          </Button>

        </div>
      </div>
    </nav>
  );
}