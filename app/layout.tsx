import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { Providers } from "@/components/providers";

// 🔥 IMPORTAMOS TU LAYOUT CONDICIONAL 🔥
import ConditionalLayout from "@/components/conditional-layout"; 

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "SnowConnect | Tecnología Premium en Santiago",
    template: "%s | SnowConnect RD",
  },
  description: "Compra, vende e intercambia iPhone y tecnología en Santiago de los Caballeros. Garantía certificada y los mejores precios del mercado.",
  keywords: ["iPhone Santiago", "Celulares RD", "SnowConnect", "Apple Republica Dominicana", "Trade In iPhone"],
  authors: [{ name: "SnowConnect Team" }],
  creator: "SnowConnect Inc.",
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: "https://snowconnect.com", 
    siteName: "SnowConnect",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "SnowConnect - Tecnología Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnowConnect | Tecnología Premium",
    description: "Compra y vende tecnología segura en Santiago.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", 
  },
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
          <div className="flex min-h-screen flex-col">
            
            {/* Usamos el layout condicional para que el menú y el footer desaparezcan en /admin */}
            <ConditionalLayout>
               {children}
            </ConditionalLayout>
            
          </div>
        </Providers>
      </body>
    </html>
  );
}