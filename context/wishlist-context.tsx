"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Definimos la estructura: Un array de objetos { id: string }
interface WishlistItem {
  id: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // 1. Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snow-wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing wishlist", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Guardar en localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("snow-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // --- CORRECCIÓN AQUÍ ---
  const addToWishlist = (id: string) => {
    // 1. Verificamos usando la variable 'wishlist' actual (sin entrar al setter aún)
    const exists = wishlist.some((item) => item.id === id);
    
    if (exists) return; // Si ya existe, no hacemos nada

    // 2. Ejecutamos el efecto visual (Toast) PRIMERO
    toast({ 
      title: "❤️ Agregado a favoritos", 
      className: "bg-red-50 border-red-200 text-red-600" 
    });

    // 3. Actualizamos el estado DESPUÉS, de forma limpia
    setWishlist((prev) => [...prev, { id }]);
  };

  const removeFromWishlist = (id: string) => {
    // Aquí ya estaba bien, pero por consistencia:
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    toast({ title: "💔 Eliminado de favoritos" });
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};