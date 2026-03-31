import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
// Importación del HeroSection eliminada
import { FeaturedProducts } from "@/components/landing/featured-products";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { VipAccessBanner } from "@/components/landing/vip-access";
import { SmartTradeSection } from "@/components/landing/smart-trade";
import { ArrowRight } from "lucide-react";

export const revalidate = 60; 

async function getData() {
  try {
    const productos = await prisma.producto.findMany({
      where: { estado: { not: 'VENDIDO' } }, 
      orderBy: { createdAt: "desc" },
      take: 4, 
      include: { specs: true, imagenes: true, flashOffers: true },
    });

    const ventas = await prisma.venta.findMany({ 
      include: { 
        producto: {
          include: { imagenes: true }
        } 
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });
    
    const featuredProduct = ventas[0]?.producto;
    const featuredModel = featuredProduct?.modelo || "iPhone 15 Pro Titanium";
    
    // Imagen real o imagen curada de alta calidad por defecto
    const featuredImage = featuredProduct?.imagenes?.[0]?.url || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop";

    return {
      productos: JSON.parse(JSON.stringify(productos)),
      featured: {
        modelo: featuredModel,
        image: featuredImage,
        link: `/catalogo?q=${encodeURIComponent(featuredModel)}`,
        isRealBestSeller: ventas.length > 0
      }
    };

  } catch (error) {
    return { 
      productos: [], 
      featured: { 
        modelo: "Colección Premium", 
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop", 
        link: "/catalogo", 
        isRealBestSeller: false 
      } 
    };
  }
}

export default async function SnowConnectPage() {
  const { productos, featured } = await getData();

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col font-sans">
      
      {/* Componente HeroSection eliminado de aquí */}

      {/* pt-28 añadido para dejar espacio al Navbar fijo de arriba */}
      <main className="space-y-0 pt-28 flex-1 relative z-20">
        
        {/* --- SECCIÓN 1: GRID DESTACADOS EDITORIAL --- */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
            
            {/* CARTA EDITORIAL (Best Seller) */}
            <Link 
              href={featured.link}
              className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-zinc-900 group cursor-pointer border border-black/5 dark:border-white/5"
            >
              <Image 
                src={featured.image}
                alt={featured.modelo}
                fill
                priority
                className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 opacity-90"
              />
              {/* Gradiente suave, no negro puro, para dar un toque más elegante */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end z-10">
                <div className="overflow-hidden mb-2">
                  <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {featured.isRealBestSeller ? "Top Ventas" : "Selección Curada"}
                  </p>
                </div>
                
                <h3 className="text-white text-4xl md:text-6xl font-medium tracking-tighter mb-6">
                  {featured.modelo}
                </h3>
                
                <div className="flex items-center text-white text-sm font-medium tracking-wide">
                  <span>Descubrir detalle</span>
                  <div className="ml-4 w-8 h-[1px] bg-white transition-all duration-500 group-hover:w-16" />
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100" />
                </div>
              </div>
            </Link>

            {/* DERECHA: SNOW V.I.P. */}
            <div className="h-full">
               <VipAccessBanner />
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 2: PRODUCTOS --- */}
        <div className="border-t border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950">
          <FeaturedProducts products={productos} />
        </div>

        {/* --- SECCIÓN 3: SMART TRADE-IN --- */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border-y border-black/5 dark:border-white/5">
          <SmartTradeSection />
        </div>

        {/* --- SECCIÓN 4: TESTIMONIOS --- */}
        <div className="bg-white dark:bg-zinc-950 py-12">
            <TestimonialsSection />
        </div>

      </main>
    </div>
  );
}