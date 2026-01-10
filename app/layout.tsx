import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"; 
import { CompareProvider } from "@/context/compare-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { CompareBar } from "@/components/compare/compare-bar";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer"; // 👈 IMPORTACIÓN NUEVA

const font = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SnowConnect | Tecnología Premium",
  description: "La mejor selección de iPhones y tecnología certificada.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${font.className} min-h-screen bg-background text-foreground antialiased overflow-x-hidden flex flex-col`}>
        <Providers>
          <CompareProvider>
            <WishlistProvider>
              
              <Navbar />

              {/* El main flex-1 asegura que el footer siempre se empuje al fondo si hay poco contenido */}
              <main className="flex-1">
                {children}
              </main>
              
              <Footer /> {/* 👈 FOOTER GLOBAL COMPLETO */}
              
              <CompareBar />
              <Toaster />
              
            </WishlistProvider>
          </CompareProvider>
        </Providers>
      </body>
    </html>
  );
}