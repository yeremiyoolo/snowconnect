import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HeroBento } from "@/components/landing/hero-bento"; // 👈 Importamos el nuevo hero
import {
  Search,
  ShoppingCart,
  Menu,
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageCircle,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  User,
  ArrowRight // 👈 Importante: asegurado que esté aquí
} from "lucide-react";

// Tu imagen de banner
import bannerIphone from "./carr1.png";

// Helper para parsear imagen segura
const safeImageParse = (jsonString: string | null): string => {
  if (!jsonString) return "/placeholder-phone.png";
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "/placeholder-phone.png";
  } catch (e) {
    return "/placeholder-phone.png";
  }
};

async function getProductos() {
  try {
    const productos = await prisma.producto.findMany({
      where: { 
        estado: { not: 'VENDIDO' } 
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
    return productos;
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

export default async function SnowConnectPage() {
  const productos = await getProductos();
  const session = await getServerSession(authOptions);
  // Iniciales del usuario para el avatar
  const userInitials = session?.user?.name?.[0]?.toUpperCase() || "U";

  return (
    // Cambiamos el fondo a un blanco/gris muy sutil premium
    <div className="min-h-screen bg-[#FBFBFD] font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 pb-10">
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60 transition-all">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-8 h-[72px] flex items-center justify-between">
          
          {/* Logo Premium */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
              <Image src="/logo.png" alt="SnowConnect" fill className="object-cover scale-110" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-gray-900 uppercase">
                Snow<span className="text-gray-400">Connect</span>
              </span>
            </div>
          </Link>

          {/* Menú Central (Estilo Cápsula) */}
          <div className="hidden xl:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50">
            {[
              { label: "Inicio", href: "/" },
              { label: "iPhones", href: "/catalogo?marca=Apple" },
              { label: "Android", href: "/catalogo?marca=Samsung" },
              { label: "Ofertas", href: "/ofertas" }
            ].map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="px-5 py-2 text-xs font-bold text-gray-600 rounded-full hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Iconos Derecha */}
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
              <Search size={18} strokeWidth={2} />
            </button>

            <Link
              href="/carrito"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors relative"
            >
              <ShoppingCart size={18} strokeWidth={2} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
            </Link>
            
            {session?.user ? (
              <Link href="/admin" className="ml-2 pl-1 pr-3 py-1 flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                 <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {userInitials}
                 </div>
                 <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700 hidden sm:inline-block">Mi Cuenta</span>
              </Link>
            ) : (
              <Link 
                href="/auth/login" 
                className="ml-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 hover:shadow-gray-300"
              >
                 Ingresar
              </Link>
            )}

            <button className="xl:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 ml-1">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full px-6 xl:px-8">
        
        {/* --- HERO SECTION (BENTO GRID) --- */}
        <div className="max-w-[1440px] mx-auto pt-8">
          {/* Pasamos la imagen importada como prop al componente */}
          <HeroBento bannerImage={bannerIphone} />
        </div>

        {/* --- GRID PRODUCTOS --- */}
        <div className="max-w-[1440px] mx-auto py-12">
          
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recién llegados</h2>
             <Link href="/catalogo" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 hover:gap-2 transition-all">
               Ver todo <ArrowRight size={14} />
             </Link>
          </div>

          {productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2rem] shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Inventario en preparación
              </h3>
              <p className="text-gray-500 mb-6 max-w-md text-sm">
                Estamos cargando los mejores equipos. Vuelve en unos minutos.
              </p>
              <Link
                href="/admin"
                className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold text-xs hover:bg-gray-800 transition"
              >
                Panel Admin
              </Link>
            </div>
          ) : (
            // --- AQUÍ ESTÁ TU GRID EXACTO ---
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {productos.map((prod) => {
                const imagen = safeImageParse(prod.fotosJson);
                return (
                <Link href={`/producto/${prod.id}`} key={prod.id}>
                  <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full border border-gray-100 relative group cursor-pointer">
                    
                    <div className="w-full h-40 mb-6 flex items-center justify-center p-4 relative bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors">
                      <div className="relative w-full h-full">
                        <Image
                          src={imagen}
                          alt={prod.modelo}
                          fill
                          className="object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                        />
                      </div>
                    </div>

                    <div className="w-full text-left mb-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{prod.marca}</p>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-sm mb-3 leading-tight w-full text-left line-clamp-1">
                      {prod.modelo}
                    </h3>

                    <div className="flex gap-2 w-full mb-4">
                      <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-green-50 text-green-700 uppercase border border-green-100">
                        {prod.estado}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-gray-50 text-gray-600 uppercase border border-gray-100">
                        {prod.almacenamiento}
                      </span>
                    </div>

                    <div className="flex items-end justify-between w-full mt-auto pt-3 border-t border-gray-50">
                      <div className="text-lg font-black text-gray-900 tracking-tight">
                        ${Number(prod.precioVenta).toLocaleString()}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                         <ArrowRight size={14} />
                      </div>
                    </div>

                  </div>
                </Link>
              )})} 
            </div>
          )}
        </div>

        {/* --- BENEFICIOS (Limpiados y mejorados visualmente) --- */}
        <div className="max-w-[1440px] mx-auto pb-12">
          <div className="bg-white rounded-[1.5rem] border border-gray-100 px-8 py-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              <div className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 mb-1">
                  <ShieldCheck size={26} className="text-blue-600 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900">IMEI Verificado</h4>
                  <p className="text-sm text-gray-500 mt-1">Garantizamos equipos limpios, sin reportes ni bloqueos.</p>
                </div>
              </div>
              
              <div className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 mb-1">
                  <CheckCircle2 size={26} className="text-green-600 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900">Garantía Total</h4>
                  <p className="text-sm text-gray-500 mt-1">30 días de cobertura completa directamente con nosotros.</p>
                </div>
              </div>
              
              <div className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 mb-1">
                  <Truck size={26} className="text-orange-600 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900">Entrega Rápida</h4>
                  <p className="text-sm text-gray-500 mt-1">Envíos asegurados a todo el país en 24-48 horas.</p>
                </div>
              </div>
              
              <div className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0 mb-1">
                  <MessageCircle size={26} className="text-purple-600 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900">Soporte VIP</h4>
                  <p className="text-sm text-gray-500 mt-1">Atención personalizada por humanos, no bots.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER PREMIUM --- */}
      <footer className="py-16 px-6 xl:px-8 border-t border-gray-200 bg-white mt-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="object-cover scale-110"
                    />
                 </div>
                 <div>
                    <span className="text-lg font-black text-gray-900 uppercase leading-none block">
                      SNOW<span className="text-gray-400">CONNECT</span>
                    </span>
                 </div>
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                Redefiniendo la experiencia de comprar tecnología de segunda mano. Calidad, confianza y transparencia.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all text-gray-400">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 text-sm">
               <div>
                  <h4 className="font-bold text-gray-900 mb-4">Tienda</h4>
                  <ul className="space-y-3 text-gray-500 font-medium">
                    <li><Link href="#" className="hover:text-blue-600 transition">Smartphones</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 transition">Tablets</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 transition">Accesorios</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 mb-4">Ayuda</h4>
                  <ul className="space-y-3 text-gray-500 font-medium">
                    <li><Link href="#" className="hover:text-blue-600 transition">Estado de pedido</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 transition">Garantía</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 transition">Contacto</Link></li>
                  </ul>
               </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Santiago de los Caballeros, RD
            </div>
            <p className="text-xs text-gray-400 font-medium">
              © {new Date().getFullYear()} SNOWCONNECT INC.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}