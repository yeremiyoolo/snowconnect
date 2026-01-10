import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/landing/hero-section";
import { ProductCard } from "@/components/landing/product-card";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  MessageCircle 
} from "lucide-react";

// Server Action para obtener productos
async function getProductos() {
  try {
    const productos = await prisma.producto.findMany({
      where: { estado: { not: 'VENDIDO' } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { specs: true },
    });
    return JSON.parse(JSON.stringify(productos));
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

export default async function SnowConnectPage() {
  const productos = await getProductos();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      <main className="space-y-24 pt-16 flex-1 pb-24">
        
        {/* 2. BANNER PROMOCIONAL "BENTO" */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
            
            {/* Caja Grande - Featured */}
            <div className="md:col-span-2 relative rounded-[2.5rem] overflow-hidden bg-black group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105 transform" />
              <div className="absolute bottom-0 left-0 p-10 z-10">
                <span className="text-blue-400 font-black tracking-widest uppercase text-xs mb-2 block">Destacado</span>
                <h3 className="text-white text-4xl md:text-5xl font-black uppercase italic mb-4">iPhone 15 Pro Max</h3>
                <Link href="/catalogo?modelo=iphone-15-pro-max">
                  <span className="inline-flex items-center gap-2 text-white font-bold underline decoration-blue-500 underline-offset-4 hover:text-blue-400 transition-colors">
                    Comprar ahora <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            </div>

            {/* Caja Derecha: VENDE EL TUYO */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 p-8 flex flex-col justify-center text-center items-center group cursor-pointer h-full">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90" />
               <div className="relative z-10">
                 <h4 className="text-3xl font-black text-white italic">Vende el tuyo</h4>
                 <p className="text-blue-200 text-sm mt-2 mb-6">Mejoramos cualquier oferta.</p>
                 <Link href="/servicios" className="px-6 py-2 bg-white text-black rounded-full font-bold text-xs hover:bg-gray-200 transition-colors inline-block">
                   Cotizar ahora
                 </Link>
               </div>
            </div>
            
          </div>
        </section>

        {/* 3. RECIÉN LLEGADOS */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-10">
             <div>
               {/* CORRECCIÓN: Quitamos dark:text-white para forzar NEGRO. Agregamos pr-2 para la 's'. */}
               <h2 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase italic pr-2">
                 Recién <span className="text-gray-400">Llegados</span>
               </h2>
               <p className="text-gray-500 font-medium mt-2">Lo último en tecnología premium certificada.</p>
             </div>
             <Link href="/catalogo" className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group">
               Ver catálogo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((prod: any, index: number) => (
              <ProductCard key={prod.id} product={prod} index={index} />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center sm:hidden">
            <Link href="/catalogo" className="w-full py-3 rounded-xl border border-gray-200 text-center font-bold text-sm">
              Ver todo el catálogo
            </Link>
          </div>
        </section>

        {/* 4. BENEFICIOS */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: ShieldCheck, 
                title: "IMEI Verificado", 
                desc: "Equipos libres de reportes.", 
                color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
              },
              { 
                icon: CheckCircle2, 
                title: "Garantía Real", 
                desc: "30 días de cobertura completa.", 
                color: "text-green-600 bg-green-50 dark:bg-green-900/20" 
              },
              { 
                icon: Truck, 
                title: "Envío Express", 
                desc: "Entrega segura en 24-48h.", 
                color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" 
              },
              { 
                icon: MessageCircle, 
                title: "Soporte VIP", 
                desc: "Asesoría personalizada.", 
                color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" 
              }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <item.icon size={26} />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{item.title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TESTIMONIOS */}
        <TestimonialsSection />

      </main>
    </div>
  );
}