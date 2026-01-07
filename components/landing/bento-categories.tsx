"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Watch, Zap } from "lucide-react";

export function BentoCategories() {
  return (
    <section className="py-20 px-6 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          Explora el <span className="text-gray-400">Ecosistema</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        
        {/* Card Grande - iPhone / Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 relative group rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10"
        >
          <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur text-xs font-bold uppercase tracking-wider">
                Apple
              </span>
              <h3 className="mt-4 text-3xl font-bold max-w-[200px] leading-tight text-balance">
                iPhone 15 Pro Max
              </h3>
            </div>
            <Link href="/catalogo?marca=Apple" className="inline-flex items-center gap-2 font-bold hover:gap-4 transition-all">
              Ver iPhones <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-blue-100/50 to-transparent" />
           {/* Aquí iría una imagen de fondo o un next/image posicionado absolutamente */}
           <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full" />
        </motion.div>

        {/* Card Vertical - Android */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative group rounded-[2rem] overflow-hidden bg-black text-white p-8 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 to-black opacity-50" />
          <div className="relative z-10">
            <Smartphone className="w-8 h-8 mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-balance">Universo Android</h3>
            <p className="text-gray-400 text-sm mt-2">Samsung, Pixel y más.</p>
          </div>
          <Link href="/catalogo?marca=Samsung" className="relative z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Card Horizontal - Accesorios */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="relative group rounded-[2rem] overflow-hidden bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 p-8"
        >
           <div className="flex items-center gap-4 mb-2">
             <Watch className="w-6 h-6 text-orange-600" />
             <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100">Wearables</h3>
           </div>
           <p className="text-sm text-orange-700/80 dark:text-orange-200/60 max-w-[200px]">
             Relojes inteligentes y audífonos para complementar tu estilo.
           </p>
        </motion.div>

        {/* Card Ofertas */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.3 }}
           className="md:col-span-2 relative group rounded-[2rem] overflow-hidden bg-white border border-gray-200 p-8 flex items-center justify-between"
        >
           <div>
             <div className="flex items-center gap-2 text-purple-600 mb-2">
               <Zap className="w-5 h-5 fill-current" />
               <span className="font-bold text-sm uppercase tracking-wider">Ofertas Flash</span>
             </div>
             <h3 className="text-2xl font-bold">Precios de liquidación</h3>
           </div>
           <Link href="/ofertas" className="px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:scale-105 transition-transform">
             Ver Ofertas
           </Link>
        </motion.div>
      </div>
    </section>
  );
}