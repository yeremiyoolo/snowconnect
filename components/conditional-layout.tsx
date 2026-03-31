"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ComparisonBar } from "@/components/layout/comparison-bar";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 🍎 MANZANITA: Ocultamos Navbar, Footer y Comparador en auth, admin y en la PANTALLA DE ÉXITO
  const hideLayout = 
    pathname?.startsWith("/auth") || 
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/checkout/exito");

  return (
    <>
      {!hideLayout && <Navbar />}
      
      {/* El contenido de la página (children) siempre se muestra */}
      <div className="flex-1">{children}</div>
      
      {!hideLayout && <ComparisonBar />}
      {!hideLayout && <Footer />}
    </>
  );
}