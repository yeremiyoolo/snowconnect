"use client";

import { WriteReviewButton } from "@/components/landing/review-actions";
import { MessageSquare, Quote, Star, BarChart3, Users } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-background border-t border-border overflow-hidden">
      
      {/* Fondo de Cuadrícula Técnica */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(90deg, #888 1px, transparent 1px), linear-gradient(#888 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
      />

      <div className="container relative mx-auto px-4 md:px-6">
        
        {/* --- TÍTULOS ESTRATÉGICOS --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-border/50 pb-8">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <span className="h-2 w-2 bg-blue-600 rounded-sm animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">
                        Experiencias Reales
                    </h3>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
                    Lo que dicen <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                        nuestros clientes
                    </span>
                </h2>
            </div>
            
            {/* Estadísticas Visuales (Estáticas por ahora) */}
            <div className="flex items-center gap-8 hidden md:flex">
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-foreground">0.0</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating Global</span>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-foreground">0</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reseñas Totales</span>
                </div>
            </div>
        </div>

        {/* --- BLOQUE MASIVO "EMPTY STATE" --- */}
        <div className="w-full relative rounded-[3rem] border border-border bg-secondary/5 backdrop-blur-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            
            {/* Columna Izquierda: Llamada a la Acción (Ancho) */}
            <div className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/50 relative">
                <Quote size={120} className="absolute top-10 left-10 text-foreground/5 pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/20">
                        <Star size={12} className="fill-blue-600" />
                        Oportunidad Pionera
                    </div>

                    <h3 className="text-3xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                        Este espacio está reservado para <span className="text-blue-600">tu historia.</span>
                    </h3>
                    
                    <p className="text-lg text-muted-foreground font-medium mb-12 max-w-lg leading-relaxed">
                        Aún no hay reseñas publicadas. Sé el primero en compartir tu experiencia de compra y establece el estándar de calidad en SnowConnect.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <WriteReviewButton />
                        <p className="text-xs text-muted-foreground max-w-[150px] leading-tight">
                            Solo tomamos 1 minuto de tu tiempo.
                        </p>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Visual "Technical" */}
            <div className="lg:col-span-5 bg-card/30 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Elementos Decorativos de Fondo */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed border-foreground/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                {/* Card Flotante Central */}
                <div className="relative w-full max-w-xs aspect-square bg-background border border-border rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center p-8 rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-500">
                    <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                        <MessageSquare size={32} className="text-muted-foreground" />
                    </div>
                    <div className="h-2 w-24 bg-border/50 rounded-full mb-3" />
                    <div className="h-2 w-32 bg-border/30 rounded-full mb-6" />
                    
                    <div className="flex gap-1">
                         {[1, 2, 3, 4, 5].map((i) => (
                             <div key={i} className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                                 <Star size={14} className="text-muted-foreground/20" />
                             </div>
                         ))}
                    </div>
                    
                    <div className="absolute -bottom-4 -right-4 bg-background border border-border p-3 rounded-2xl shadow-lg flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        <span className="text-xs font-bold">Esperando...</span>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </section>
  );
}