import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/app/providers"; // Asegúrate que la ruta sea correcta
import ConditionalLayout from "@/components/conditional-layout"; // <--- IMPORTANTE

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnowConnect",
  description: "Tecnología Premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
           {/* El ConditionalLayout decide si muestra la Navbar o no */}
           <ConditionalLayout>
              {children}
           </ConditionalLayout>
           <Toaster />
        </Providers>
      </body>
    </html>
  );
}