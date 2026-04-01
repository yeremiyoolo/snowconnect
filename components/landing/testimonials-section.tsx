"use client";

import { useEffect, useState } from "react";
import { WriteReviewButton } from "@/components/landing/review-actions";
import { MessageSquare, Quote, Star, Users } from "lucide-react";

interface Testimonio {
  id: string;
  nombre: string;
  mensaje: string;
  calificacion: number;
  createdAt: string;
}

export function TestimonialsSection() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonios?public=true")
      .then(res => res.json())
      .then(data => {
        setTestimonios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalReviews = testimonios.length;
  const avgRating = totalReviews > 0 
    ? (testimonios.reduce((acc, curr) => acc + curr.calificacion, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      
      <div className="container relative mx-auto px-4 md:px-6 max-w-[1440px]">
        
        {/* --- TÍTULOS ESTRATÉGICOS --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-border pb-8">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <span className="h-2 w-2 bg-blue-600 rounded-sm animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">
                        Experiencias Reales
                    </h3>
                </div>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1] md:leading-[0.9]">
                    Lo que dicen <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-zinc-100 dark:to-zinc-500">
                        nuestros clientes
                    </span>
                </h2>
            </div>
            
            {/* Estadísticas Visuales */}
            <div className="hidden md:flex items-center gap-8">
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-foreground">{avgRating}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating Global</span>
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-foreground">{totalReviews}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reseñas Totales</span>
                </div>
            </div>
        </div>

        {/* --- RENDERIZADO CONDICIONAL --- */}
        {loading ? (
            <div className="w-full flex items-center justify-center min-h-[300px]">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        ) : totalReviews === 0 ? (
            
            // --- BLOQUE "EMPTY STATE" (Ajustado a Dark Mode) ---
            <div className="w-full relative rounded-[2rem] md:rounded-[3rem] border border-border bg-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[400px] md:min-h-[500px] shadow-sm">
                
                {/* Columna Izquierda: Llamada a la Acción */}
                <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border relative bg-secondary/10">
                    <Quote size={120} className="absolute top-10 left-10 text-muted-foreground/10 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-200 dark:border-blue-800/50">
                            <Star size={12} className="fill-current" />
                            Oportunidad Pionera
                        </div>

                        <h3 className="text-3xl md:text-5xl font-black text-foreground mb-4 md:mb-6 leading-tight">
                            Este espacio está reservado para <span className="text-blue-600">tu historia.</span>
                        </h3>
                        
                        <p className="text-base md:text-lg text-muted-foreground font-medium mb-8 md:mb-12 max-w-lg leading-relaxed">
                            Aún no hay reseñas publicadas. Sé el primero en compartir tu experiencia de compra y establece el estándar de calidad en SnowConnect.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <WriteReviewButton />
                            <p className="text-xs text-muted-foreground max-w-[150px] leading-tight">
                                Solo tomamos 1 minuto de tu tiempo.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Visual */}
                <div className="hidden md:flex lg:col-span-5 bg-secondary/30 flex-col items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed border-border rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                    <div className="relative w-full max-w-xs aspect-square bg-card border border-border rounded-3xl shadow-xl flex flex-col items-center justify-center text-center p-8 rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-500">
                        <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                            <MessageSquare size={32} className="text-muted-foreground" />
                        </div>
                        <div className="h-2 w-24 bg-border rounded-full mb-3" />
                        <div className="h-2 w-32 bg-secondary rounded-full mb-6" />
                        
                        <div className="flex gap-1">
                             {[1, 2, 3, 4, 5].map((i) => (
                                 <div key={i} className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                     <Star size={14} className="text-muted-foreground/30" />
                                 </div>
                             ))}
                        </div>
                        
                        <div className="absolute -bottom-4 -right-4 bg-card border border-border p-3 rounded-2xl shadow-lg flex items-center gap-2">
                            <Users size={16} className="text-blue-600" />
                            <span className="text-xs font-bold text-foreground">Esperando...</span>
                        </div>
                    </div>
                </div>
            </div>

        ) : (
            
            // --- GRID DE RESEÑAS REALES ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
               {testimonios.map((t) => (
                   <div key={t.id} className="bg-card border border-border p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:border-blue-500/50 hover:shadow-xl transition-all shadow-sm">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Quote size={40} className="text-muted-foreground/10 mb-6" />
                      
                      <div className="flex text-yellow-500 mb-4">
                         {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < t.calificacion ? "fill-current" : "text-muted-foreground/30"} />
                         ))}
                      </div>
                      
                      <p className="text-foreground font-medium leading-relaxed mb-8">"{t.mensaje}"</p>
                      
                      <div className="flex items-center gap-4 mt-auto">
                         <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold border border-border">
                            {t.nombre.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <h4 className="text-foreground font-bold text-sm">{t.nombre}</h4>
                            <span className="text-muted-foreground text-xs">Cliente Verificado</span>
                         </div>
                      </div>
                   </div>
               ))}
            </div>
        )}
        
        {totalReviews > 0 && (
            <div className="flex justify-center border-t border-border pt-8 md:pt-12">
                <WriteReviewButton />
            </div>
        )}

      </div>
    </section>
  );
}