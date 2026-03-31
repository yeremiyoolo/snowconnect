"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

// --- IMPORTACIONES DE CONTEXTOS ---
// 👇 ESTA ES LA LÍNEA QUE FALTA EN TU CÓDIGO ACTUAL
import { ShopProvider } from "@/context/shop-context"; 
import { WishlistProvider } from "@/context/wishlist-context";
import { CompareProvider } from "@/context/compare-context";

export function Providers({ children, session }: { children: React.ReactNode, session?: any }) {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* 👇 AQUÍ ESTÁ LA CLAVE: ENVOLVER TODO CON SHOPPROVIDER 👇 */}
        <ShopProvider>
          <WishlistProvider>
            <CompareProvider>
              
              {children}
              
              <Toaster richColors position="top-center" closeButton />
              
            </CompareProvider>
          </WishlistProvider>
        </ShopProvider>
        {/* 👆 SI NO CIERRAS ESTA ETIQUETA, DARÁ ERROR 👆 */}
        
      </NextThemesProvider>
    </SessionProvider>
  );
}