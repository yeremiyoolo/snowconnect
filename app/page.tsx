import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturedProducts } from "@/components/landing/featured-products";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  RefreshCcw, 
  Banknote, 
  Wallet,
  Wrench,      // Nuevo
  Smartphone,  // Nuevo
  Battery,     // Nuevo
  ShieldCheck, // Nuevo
  ChevronRight // Nuevo
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 0; 

// --- 1. CEREBRO ARTIFICIAL DE IMÁGENES ---
const WALLPAPER_DB: Record<string, string> = {
  "iphone 15": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop", 
  "iphone 14": "https://images.unsplash.com/photo-1663499482523-1c0c167dd2a7?q=80&w=2070&auto=format&fit=crop",
  "iphone 13": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=2070&auto=format&fit=crop",
  "iphone 12": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=2064&auto=format&fit=crop",
  "iphone 11": "https://images.unsplash.com/photo-1573148195900-7845dcb9b858?q=80&w=2070&auto=format&fit=crop",
  "s24": "https://images.unsplash.com/photo-1706606991536-e32049185a64?q=80&w=2070&auto=format&fit=crop",
  "s23": "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=2070&auto=format&fit=crop",
  "z flip": "https://images.unsplash.com/photo-1631281980860-7a0e28987b28?q=80&w=2070&auto=format&fit=crop",
  "apple_generic": "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=2070&auto=format&fit=crop",
  "android_generic": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071&auto=format&fit=crop",
  "default": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
};

function analyzeAndGetImage(rawName: string) {
  let cleanName = rawName.toLowerCase()
    .replace(/ipon|ifone|aifon|phone/g, "iphone")
    .replace(/galaxi|galaxia/g, "galaxy")
    .trim();

  if (cleanName.includes("iphone 15")) return WALLPAPER_DB["iphone 15"];
  if (cleanName.includes("iphone 14")) return WALLPAPER_DB["iphone 14"];
  if (cleanName.includes("iphone 13")) return WALLPAPER_DB["iphone 13"];
  if (cleanName.includes("iphone 12")) return WALLPAPER_DB["iphone 12"];
  if (cleanName.includes("s24")) return WALLPAPER_DB["s24"];
  if (cleanName.includes("s23")) return WALLPAPER_DB["s23"];
  if (cleanName.includes("flip") || cleanName.includes("fold")) return WALLPAPER_DB["z flip"];
  if (cleanName.includes("iphone") || cleanName.includes("apple")) return WALLPAPER_DB["apple_generic"];
  if (cleanName.includes("samsung") || cleanName.includes("android") || cleanName.includes("xiaomi")) return WALLPAPER_DB["android_generic"];
  return WALLPAPER_DB["default"];
}

async function getData() {
  try {
    const productosRaw = await prisma.producto.findMany({
      where: { estado: { not: 'VENDIDO' } }, 
      orderBy: { createdAt: "desc" },
      take: 4, 
      include: { 
        specs: true,
        almacenamiento: true 
      },
    });

    const productosProcesados = productosRaw.map(p => ({
        ...p,
        almacenamiento: p.almacenamiento && p.almacenamiento.length > 0 
            ? p.almacenamiento[0].capacidad 
            : null
    }));

    const ventas = await prisma.venta.findMany({ include: { producto: true } });
    const conteoModelos: Record<string, number> = {};
    ventas.forEach((v) => {
      const modelo = v.producto.modelo;
      const key = modelo.toLowerCase().trim();
      conteoModelos[key] = (conteoModelos[key] || 0) + 1;
    });

    const topModelKey = Object.keys(conteoModelos).reduce((a, b) => 
      conteoModelos[a] > conteoModelos[b] ? a : b
    , "");

    let displayModelName = "";
    let topProductAvailable = null;
    
    if (topModelKey) {
       const ventaGanadora = ventas.find(v => v.producto.modelo.toLowerCase().trim() === topModelKey);
       displayModelName = ventaGanadora?.producto.modelo || topModelKey;

       topProductAvailable = await prisma.producto.findFirst({
        where: { 
          modelo: { contains: topModelKey, mode: 'insensitive' },
          estado: 'DISPONIBLE'
        }
      });
    }

    const finalModelName = displayModelName || (productosProcesados[0]?.modelo ?? "iPhone 15 Pro");
    const finalLink = topProductAvailable 
      ? `/catalogo/${topProductAvailable.id}`
      : `/catalogo?q=${encodeURIComponent(finalModelName)}`;

    return {
      productos: JSON.parse(JSON.stringify(productosProcesados)),
      featured: {
        modelo: finalModelName,
        image: analyzeAndGetImage(finalModelName),
        link: finalLink,
        isRealBestSeller: !!topModelKey
      }
    };

  } catch (error) {
    console.error("Error cargando datos home:", error);
    return { 
      productos: [], 
      featured: {
        modelo: "iPhone 15 Pro",
        image: WALLPAPER_DB["iphone 15"],
        link: "/catalogo",
        isRealBestSeller: false
      } 
    };
  }
}

export default async function SnowConnectPage() {
  const { productos, featured } = await getData();

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <HeroSection />

      <main className="space-y-0 pt-16 flex-1">
        
        {/* --- SECCIÓN 1: BANNER DESTACADOS + TRADE IN --- */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
            
            {/* DESTACADO IZQUIERDA */}
            <div className="md:col-span-2 relative rounded-[2.5rem] overflow-hidden bg-black group cursor-pointer shadow-2xl shadow-black/20 border border-white/5">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-60"
                style={{ backgroundImage: `url('${featured.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10 z-10 w-full">
                <div className="flex items-center gap-3 mb-4">
                   {featured?.isRealBestSeller ? (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 border border-yellow-300 text-yellow-950 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse">
                       <Trophy size={12} className="fill-yellow-950" /> #1 En Ventas
                     </span>
                   ) : (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
                       <Sparkles size={12} /> Destacado de la Semana
                     </span>
                   )}
                </div>
                <h3 className="text-white text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6 drop-shadow-2xl py-2 pr-2">
                  {featured.modelo}
                </h3>
                <Link href={featured.link}>
                  <Button 
                    size="lg" 
                    className="relative overflow-hidden rounded-full h-14 px-10 text-base font-bold bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:scale-105 group/btn"
                  >
                    <span className="relative z-10 flex items-center">
                      Comprar Ahora 
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* TRADE-IN DERECHA */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-black border border-white/10 p-8 flex flex-col justify-end text-center items-center group cursor-pointer h-full shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
               <div 
                  className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                  style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1740&auto=format&fit=crop')" 
                  }}
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90" />
               <div className="relative z-10 w-full flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-500">
                    <RefreshCcw className="w-8 h-8 text-green-400 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                 </div>
                 <h4 className="text-3xl font-black text-white italic tracking-tighter mb-2">
                   Vende el tuyo
                 </h4>
                 <p className="text-gray-300 text-sm mb-8 max-w-[220px] mx-auto font-medium leading-relaxed">
                   Recibe una oferta instantánea y úsalo como parte de pago.
                 </p>
                 
                 <Link href="/sell" className="w-full">
                   <Button 
                      className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold text-base shadow-lg hover:bg-green-500 hover:border-green-400 hover:text-white transition-all duration-300 group/btn relative overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     <span className="relative z-10 flex items-center justify-center gap-2">
                       <div className="relative w-6 h-6 flex items-center justify-center">
                          <Wallet size={20} className="absolute transition-all duration-300 group-hover/btn:opacity-0 group-hover/btn:translate-y-2" />
                          <Banknote size={20} className="absolute text-white opacity-0 translate-y-2 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-y-0" />
                       </div>
                       Cotizar Gratis
                     </span>
                   </Button>
                 </Link>
               </div>
            </div>
          </div>
        </section>

        {/* --- SECCIÓN 2: RECIÉN LLEGADOS --- */}
        <FeaturedProducts products={productos} />

        {/* --- SECCIÓN 3: SNOW SUPPORT (NUEVA) --- */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 mb-24 mt-24">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-white/10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-12 group">
             
             {/* Glow de Fondo */}
             <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
             <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

             {/* Contenido de Texto */}
             <div className="relative z-10 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-widest mb-6 border border-blue-500/20 backdrop-blur-md">
                   <Wrench size={12} /> Snow Support™
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[0.95]">
                   ¿Algo salió mal? <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                      Lo reparamos en minutos.
                   </span>
                </h2>
                <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">
                   Desde pantallas rotas hasta baterías agotadas. Servicio técnico certificado con garantía real, piezas de calidad premium y la confianza de siempre.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/servicios">
                    <Button className="h-14 px-8 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      Solicitar Reparación
                    </Button>
                  </Link>
                  <Link href="/servicios">
                    <Button variant="ghost" className="h-14 px-6 rounded-full text-white hover:bg-white/10 font-bold">
                       Ver Lista de Precios <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
             </div>

             {/* Representación Visual (Tarjetas Flotantes) */}
             <div className="relative z-10 w-full max-w-md h-[300px] md:h-auto flex items-center justify-center">
                 {/* Card 1: Pantalla */}
                 <div className="absolute top-0 right-10 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 hover:z-20 group/card">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3 text-purple-400">
                       <Smartphone size={24} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-white font-bold text-sm">Cambio de Pantalla</p>
                       <p className="text-xs text-gray-500">OLED Original</p>
                    </div>
                 </div>

                 {/* Card 2: Batería */}
                 <div className="absolute bottom-10 left-0 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:z-20 group/card z-10">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 text-green-400">
                       <Battery size={24} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-white font-bold text-sm">Batería Nueva</p>
                       <p className="text-xs text-gray-500">100% Condición</p>
                    </div>
                 </div>

                 {/* Card 3: Garantía (Centro) */}
                 <div className="absolute bg-zinc-800/90 backdrop-blur-xl border border-blue-500/30 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500 z-20 text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 text-white mx-auto shadow-lg shadow-blue-500/40">
                       <ShieldCheck size={32} />
                    </div>
                    <p className="text-white font-black text-xl mb-1">Garantía Real</p>
                    <p className="text-xs text-gray-400">Certificado por SnowConnect</p>
                 </div>
             </div>

          </div>
        </section>

        {/* --- SECCIÓN 4: TESTIMONIOS --- */}
        <div className="mt-24">
            <TestimonialsSection />
        </div>

      </main>
    </div>
  );
}