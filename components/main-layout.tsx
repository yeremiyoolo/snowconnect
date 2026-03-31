"use client";

import React from "react";
import { usePathname } from "next/navigation";

// --- CORRECCIÓN DE IMPORTACIONES ---
// Se asume que Navbar y Footer usan 'export default' según tu nota.
import { Navbar } from "@/components/layout/navbar"; 
import { Footer } from "@/components/layout/footer"; 
// Importamos la barra de comparación que estaba faltando en el renderizado
import CompareBar from "@/components/compare/compare-bar"; 

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Validación de seguridad para evitar errores de hidratación
  if (!pathname) return null;

  // Lógica para ocultar el layout en rutas de autenticación o administración
  // Basado en tus planes de gestión para SNOWCONNECT
  const hideLayout = pathname.startsWith("/auth") || pathname.startsWith("/admin");

  if (hideLayout) {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>

      {/* BARRA DE COMPARACIÓN GLOBAL 
          Aparecerá automáticamente cuando items.length > 0 en el store 
      */}
      <CompareBar />

      <Footer />
    </div>
  );
}