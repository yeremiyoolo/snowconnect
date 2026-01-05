"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Smartphone, ArrowRight, Search, ShoppingBag, 
  CreditCard, Truck, ShieldCheck, MapPin, ChevronRight,
  Menu, X, Star, Battery, Camera, Cpu, Zap,
  CheckCircle, Award, Users, Globe,
  ChevronLeft, ChevronDown, Play, Headphones,
  Facebook, Twitter, Instagram, Youtube
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function ClaroHomePage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("destacados");
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const productsRef = useRef(null);
  const heroControls = useAnimation();
  const statsControls = useAnimation();
  const productsControls = useAnimation();
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isStatsInView = useInView(statsRef, { once: true });
  const isProductsInView = useInView(productsRef, { once: true });

  useEffect(() => {
    // Simulación de datos de productos
    const mockProducts = [
      {
        id: 1,
        modelo: "iPhone 16 Pro Max",
        precioVenta: 1299,
        estado: "Disponible",
        categoria: "premium",
        caracteristicas: ["6.9\" Super Retina XDR", "Cámara 48MP", "Chip A18 Pro"],
        rating: 4.8,
        color: "Titanio Negro"
      },
      {
        id: 2,
        modelo: "Samsung Galaxy S25 Ultra",
        precioVenta: 1199,
        estado: "Últimas unidades",
        categoria: "premium",
        caracteristicas: ["Pantalla Dynamic AMOLED 2X", "S-Pen incluido", "Cámara 200MP"],
        rating: 4.7,
        color: "Phantom Black"
      },
      {
        id: 3,
        modelo: "Google Pixel 9 Pro",
        precioVenta: 999,
        estado: "Disponible",
        categoria: "flagship",
        caracteristicas: ["Tensor G4", "Cámara con IA", "Actualizaciones 7 años"],
        rating: 4.6,
        color: "Porcelain"
      },
      {
        id: 4,
        modelo: "Xiaomi 14 Ultra",
        precioVenta: 1099,
        estado: "Nuevo",
        categoria: "premium",
        caracteristicas: ["Leica Summilux", "Snapdragon 8 Gen 3", "Batería 5000mAh"],
        rating: 4.5,
        color: "Ceramic White"
      },
      {
        id: 5,
        modelo: "OnePlus 12",
        precioVenta: 899,
        estado: "Disponible",
        categoria: "flagship",
        caracteristicas: ["Pantalla 2K 120Hz", "Carga 100W", "Hasselblad Camera"],
        rating: 4.4,
        color: "Emerald Green"
      },
      {
        id: 6,
        modelo: "Sony Xperia 1 VI",
        precioVenta: 1399,
        estado: "Próximamente",
        categoria: "premium",
        caracteristicas: ["Pantalla 4K", "Cámara para cineastas", "Audio Hi-Res"],
        rating: 4.3,
        color: "Platinum Silver"
      }
    ];
    
    setProductos(mockProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isHeroInView) {
      heroControls.start("visible");
    }
  }, [isHeroInView, heroControls]);

  useEffect(() => {
    if (isStatsInView) {
      statsControls.start("visible");
    }
  }, [isStatsInView, statsControls]);

  useEffect(() => {
    if (isProductsInView) {
      productsControls.start("visible");
    }
  }, [isProductsInView, productsControls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans antialiased text-gray-900 overflow-x-hidden">
      
      {/* Barra superior de utilidad */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white hidden md:block">
        <div className="max-w-8xl mx-auto px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <Headphones size={14} />
              <span>Soporte 24/7: 800-900-1234</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={14} />
              <span>Envío express en 24h</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link href="#" className="hover:text-red-400 transition-colors">Seguimiento de pedido</Link>
            <Link href="#" className="hover:text-red-400 transition-colors">Sucursales</Link>
            <div className="flex items-center gap-4">
              <Facebook size={14} className="cursor-pointer hover:text-red-400 transition-colors" />
              <Twitter size={14} className="cursor-pointer hover:text-red-400 transition-colors" />
              <Instagram size={14} className="cursor-pointer hover:text-red-400 transition-colors" />
              <Youtube size={14} className="cursor-pointer hover:text-red-400 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-8xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#DA291C] to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:shadow-red-300 transition-all duration-300">
                  <Smartphone className="text-white w-7 h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter italic leading-none">MOBILE<span className="text-[#DA291C]">CLARO</span></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TECHNOLOGY</span>
              </div>
            </Link>

            {/* Navegación desktop */}
            <div className="hidden xl:flex gap-10">
              {["Inicio", "Equipos", "Planes", "Accesorios", "Ofertas", "Empresas"].map((item, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="relative text-sm font-bold text-gray-700 hover:text-[#DA291C] transition-colors group"
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#DA291C] group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Acciones de navegación */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-4 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar equipo, modelo, marca..." 
                className="pl-12 pr-4 py-3 bg-gray-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-200 w-64 transition-all"
              />
            </div>
            
            <button className="hidden lg:block relative p-2 text-gray-700 hover:text-[#DA291C] transition-colors">
              <ShoppingBag size={22} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#DA291C] text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            
            <Link 
              href="/auth/login" 
              className="hidden md:flex items-center gap-3 bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-gray-300 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-[#DA291C] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">MC</span>
              </div>
              <span>Mi Cuenta</span>
            </Link>
            
            {/* Menú móvil */}
            <button 
              className="xl:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil expandido */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-t border-gray-100"
          >
            <div className="px-8 py-6 flex flex-col gap-6">
              {["Inicio", "Equipos", "Planes", "Accesorios", "Ofertas", "Empresas"].map((item, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="text-gray-700 font-bold hover:text-[#DA291C] transition-colors"
                >
                  {item}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button className="p-3 bg-gray-100 rounded-xl">
                    <Search size={20} />
                  </button>
                  <button className="p-3 bg-gray-100 rounded-xl relative">
                    <ShoppingBag size={20} />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#DA291C] text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="max-w-8xl mx-auto px-8 py-24 md:py-32">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            variants={containerVariants}
            initial="hidden"
            animate={heroControls}
          >
            <motion.div className="text-white" variants={itemVariants}>
              <motion.span 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-[#DA291C] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Zap size={14} />
                <span>Lanzamiento exclusivo</span>
              </motion.span>
              
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8"
                variants={fadeInUp}
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  EXPERIENCIA
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-400 to-[#DA291C] bg-clip-text text-transparent">
                  REDEFINIDA
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed"
                variants={fadeInUp}
              >
                Descubre la nueva generación de dispositivos con tecnología 5G avanzada, 
                diseño innovador y rendimiento excepcional. Solo en MobileClaro.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6"
                variants={containerVariants}
              >
                <motion.button 
                  className="group bg-gradient-to-r from-[#DA291C] to-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-3"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Explorar colección</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
                
                <motion.button 
                  className="group bg-white/10 backdrop-blur-sm text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={20} />
                  <span>Ver demostración</span>
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="mt-16 grid grid-cols-3 gap-8"
                variants={containerVariants}
              >
                {[
                  { value: "5G", label: "Velocidad máxima" },
                  { value: "24+", label: "Meses garantía" },
                  { value: "4.8★", label: "Valoración" }
                ].map((stat, idx) => (
                  <motion.div key={idx} className="text-center" variants={itemVariants}>
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="relative">
                {/* Dispositivo flotante */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-[3rem] blur-3xl"></div>
                
                <div className="relative bg-gradient-to-br from-gray-800 to-black rounded-[3rem] p-8 shadow-2xl border border-gray-800">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-12">
                    <div className="relative">
                      <Smartphone className="w-48 h-48 text-gray-700" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-64 bg-gradient-to-b from-red-500/30 to-purple-500/30 rounded-3xl border border-white/10 backdrop-blur-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicadores de características */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    {[Camera, Battery, Cpu].map((Icon, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-[#DA291C] to-red-600 text-white p-3 rounded-xl shadow-lg">
                        <Icon size={20} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-b from-[#DA291C] to-red-700 text-white px-4 py-3 rounded-xl shadow-xl">
                    <div className="text-center">
                      <div className="text-xs font-bold">NUEVO</div>
                      <div className="text-lg font-black">2026</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Elementos decorativos flotantes */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Flecha de scroll */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Sección de valor y confianza */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-8xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-[#DA291C] bg-clip-text text-transparent">
                Más que tecnología, confianza
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Con más de 15 años en el mercado, ofrecemos garantía, soporte premium y la mejor experiencia de compra.
            </p>
          </motion.div>
          
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, value: "15 años", label: "Garantía extendida", desc: "Cobertura total en todos nuestros productos" },
              { icon: Users, value: "2M+", label: "Clientes satisfechos", desc: "Comunidad en constante crecimiento" },
              { icon: Award, value: "Premio", label: "Excelencia 2025", desc: "Reconocidos por calidad y servicio" },
              { icon: Globe, value: "50+", label: "Puntos de venta", desc: "Cobertura nacional e internacional" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
                animate={statsControls}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <item.icon className="text-[#DA291C] w-8 h-8" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">{item.value}</div>
                <div className="text-lg font-bold text-gray-900 mb-3">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo de productos destacados */}
      <section ref={productsRef} className="py-24 bg-white">
        <div className="max-w-8xl mx-auto px-8">
          <motion.div 
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-gray-900 to-[#DA291C] bg-clip-text text-transparent">
                  Colección exclusiva 2026
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Descubre los dispositivos más avanzados del mercado, con tecnología de punta y diseño premium.
              </p>
            </div>
            
            <div className="flex gap-4 bg-gray-100 p-2 rounded-2xl">
              {["destacados", "premium", "ofertas", "nuevos"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm capitalize transition-all ${activeTab === tab ? 'bg-white text-[#DA291C] shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-gray-100 h-[500px] rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={productsControls}
            >
              {productos.slice(0, 6).map((prod) => (
                <motion.div 
                  key={prod.id}
                  className="group bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 border border-gray-200 hover:border-red-200 transition-all duration-500 hover:shadow-2xl hover:shadow-red-100 overflow-hidden relative"
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                >
                  {/* Badge de categoría */}
                  <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-bold z-10 ${prod.categoria === 'premium' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' : 'bg-gray-900 text-white'}`}>
                    {prod.categoria === 'premium' ? 'PREMIUM' : 'FLAGSHIP'}
                  </div>
                  
                  {/* Estado de stock */}
                  <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold ${prod.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {prod.estado}
                  </div>
                  
                  {/* Imagen del producto */}
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-white flex items-center justify-center mb-8 mt-4 p-8 group-hover:scale-105 transition-transform duration-500">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Smartphone size={140} className="text-gray-300 group-hover:text-red-100 transition-colors duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-48 bg-gradient-to-b from-red-500/10 to-purple-500/10 rounded-2xl border border-white/20 backdrop-blur-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Información del producto */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{prod.modelo}</h3>
                    <p className="text-gray-500 text-sm mb-4">{prod.color}</p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={`${i < Math.floor(prod.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-sm font-bold ml-2">{prod.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {prod.caracteristicas.map((caract: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          {caract}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Precio y CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-black text-gray-900">${prod.precioVenta}</div>
                      <div className="text-sm text-gray-500 font-medium">Precio final</div>
                    </div>
                    <button className="group/btn bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-gray-400/30 transition-all duration-300 flex items-center gap-3">
                      <span>Comprar</span>
                      <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                    </button>
                  </div>
                  
                  {/* Efecto de hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-purple-500/0 group-hover:from-red-500/5 group-hover:via-red-500/5 group-hover:to-purple-500/5 transition-all duration-700 pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              href="/catalogo" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-black text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-gray-400/30 transition-all duration-300"
            >
              <span>Ver catálogo completo</span>
              <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sección de beneficios */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-8xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-[#DA291C] bg-clip-text text-transparent">
                Tu ventaja MobileClaro
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Ofrecemos beneficios exclusivos que hacen la diferencia en cada compra.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Entrega Express",
                desc: "Recibe tu pedido en 24-48 horas en todo el país",
                features: ["Seguimiento en tiempo real", "Entrega premium", "Sin coste adicional"]
              },
              {
                icon: CreditCard,
                title: "Financiación",
                desc: "Hasta 36 meses sin intereses con tarjetas participantes",
                features: ["Aprobación inmediata", "Sin comisiones", "Flexibilidad total"]
              },
              {
                icon: ShieldCheck,
                title: "Protección Total",
                desc: "Cobertura extendida contra daños y robos",
                features: ["Garantía 24 meses", "Reparación express", "Seguro incluido"]
              },
              {
                icon: CheckCircle,
                title: "Experiencia Premium",
                desc: "Servicio personalizado y soporte dedicado",
                features: ["Asesoramiento experto", "Configuración incluida", "Soporte VIP"]
              }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="text-[#DA291C] w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 mb-6">{benefit.desc}</p>
                <ul className="space-y-3">
                  {benefit.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-green-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 bg-gradient-to-r from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 text-center relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
          
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
              ¿Listo para
              <span className="bg-gradient-to-r from-red-400 to-[#DA291C] bg-clip-text text-transparent"> cambiar </span>
              tu experiencia?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Únete a miles de clientes que ya disfrutan de la tecnología más avanzada con el respaldo de MobileClaro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button 
                className="group bg-gradient-to-r from-[#DA291C] to-red-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-3 justify-center">
                  Comprar ahora
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button 
                className="group bg-white/10 backdrop-blur-md text-white border border-white/30 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-3 justify-center">
                  <Play size={20} />
                  Solicitar demostración
                </span>
              </motion.button>
            </div>
            
            <p className="text-gray-400 mt-12 text-sm">
              ¿Necesitas ayuda? Llámanos al <span className="text-white font-bold">800-900-1234</span> o escribe a <span className="text-white font-bold">soporte@mobileclaro.com</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-24 pb-12">
        <div className="max-w-8xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
            {/* Logo y descripción */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#DA291C] to-red-700 rounded-2xl flex items-center justify-center">
                  <Smartphone className="text-white w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter italic leading-none">MOBILE<span className="text-[#DA291C]">CLARO</span></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">TECHNOLOGY REDEFINED</span>
                </div>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Líderes en tecnología móvil de alta gama, ofreciendo los dispositivos más avanzados con servicio premium y garantía extendida.
              </p>
              <div className="flex gap-6">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                  <div key={idx} className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-[#DA291C] transition-colors cursor-pointer">
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enlaces rápidos */}
            <div>
              <h4 className="text-lg font-black mb-8">Productos</h4>
              <ul className="space-y-4">
                {["Smartphones", "Tablets", "Wearables", "Accesorios", "Planes", "Ofertas"].map((link, idx) => (
                  <li key={idx}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors font-medium">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Soporte */}
            <div>
              <h4 className="text-lg font-black mb-8">Soporte</h4>
              <ul className="space-y-4">
                {["Centro de ayuda", "Garantías", "Servicio técnico", "Preguntas frecuentes", "Estado de pedido", "Contacto"].map((link, idx) => (
                  <li key={idx}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors font-medium">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Empresa */}
            <div>
              <h4 className="text-lg font-black mb-8">Empresa</h4>
              <ul className="space-y-4">
                {["Sobre nosotros", "Blog", "Trabaja con nosotros", "Sostenibilidad", "Términos", "Privacidad"].map((link, idx) => (
                  <li key={idx}>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors font-medium">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-500 text-sm">
              © 2026 MobileClaro Technologies. Todos los derechos reservados.
            </div>
            
            <div className="flex flex-wrap gap-8 text-sm text-gray-500">
              <Link href="#" className="hover:text-white transition-colors">Términos de uso</Link>
              <Link href="#" className="hover:text-white transition-colors">Política de privacidad</Link>
              <Link href="#" className="hover:text-white transition-colors">Configuración de cookies</Link>
              <Link href="#" className="hover:text-white transition-colors">Aviso legal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}