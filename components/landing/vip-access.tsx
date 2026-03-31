"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, ArrowUpRight, Sparkles } from "lucide-react";

export function VipAccessBanner() {
  return (
    <div className="relative h-full min-h-[400px] md:min-h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-between group cursor-pointer shadow-2xl shadow-blue-900/20 border border-white/10">
       
       {/* Decoración de fondo */}
       <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
       
       {/* Header del Card */}
       <div className="relative z-10 flex justify-between items-start">
         <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Crown size={28} className="fill-white/20" />
         </div>
         <span className="px-3 py-1 rounded-full bg-black/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
            Membresía Gratis
         </span>
       </div>

       {/* Contenido Central */}
       <div className="relative z-10 mt-auto mb-8">
         <h4 className="text-4xl md:text-5xl font-black text-white leading-[0.9] mb-4 tracking-tighter">
           SNOW <br/> 
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
             CLUB V.I.P.
           </span>
         </h4>
         <p className="text-blue-100/90 text-sm font-medium leading-relaxed max-w-[240px]">
           Sé el primero en enterarte de los "Drops" de iPhone 15, ofertas flash y recibe regalos exclusivos en tu cumpleaños.
         </p>
       </div>

       {/* Botón */}
       <div className="relative z-10">
         <Link href="/auth/register">
            <Button className="w-full h-14 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-black text-base justify-between group/btn shadow-lg shadow-black/10 transition-all hover:scale-[1.02]">
               <span className="flex items-center gap-2">
                 <Sparkles size={18} className="text-yellow-500 fill-yellow-500" /> Unirme Ahora
               </span>
               <ArrowUpRight size={20} className="group-hover/btn:rotate-45 transition-transform duration-300" />
            </Button>
         </Link>
       </div>
    </div>
  );
}