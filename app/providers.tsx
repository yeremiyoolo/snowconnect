"use client";

import { SessionProvider } from "next-auth/react"; // <--- ESTO ES VITAL
import { ThemeProvider } from "next-themes"; // Si usas temas oscuros
// ... otras importaciones

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider> {/* <--- Envuelve todo con esto */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}