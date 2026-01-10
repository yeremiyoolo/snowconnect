"use client";

import { useEffect, useState } from "react";
import { Star, Quote, Plus } from "lucide-react"; // Importar Plus
import { cn } from "@/lib/utils";
import Link from "next/link"; // Importar Link

export function TestimonialsSection() {
  const [testimonios, setTestimonios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonios?public=true")
      .then(res => res.json())
      .then(data => {
        setTestimonios(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  // Modificación: Si no hay testimonios, mostramos la sección vacía invitando a comentar
  // en lugar de retornar null.
  
  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Elementos decorativos de fondo */}
      <div className="absolute -left-20 top-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="text-center md:text-left space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">Experiencias Reales</h2>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
                    Lo que dicen <span className="text-gray-400">nuestros clientes</span>
                </h3>
            </div>
            
            {/* --- BOTÓN PARA DEJAR RESEÑA --- */}
            <Link 
                href="/dejar-review"
                className="group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                Escribir mi opinión
            </Link>
        </div>

        {testimonios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonios.slice(0, 3).map((t, i) => (
                <div key={t.id} className="group bg-[#FBFBFD] p-8 rounded-[2rem] border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-500 relative flex flex-col">
                <Quote className="absolute top-8 right-8 text-gray-100 rotate-180 group-hover:text-blue-50 transition-colors" size={60} />
                
                <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, starIndex) => (
                    <Star 
                        key={starIndex} 
                        size={16} 
                        className={cn(
                        "fill-current", 
                        starIndex < t.calificacion ? "text-yellow-400" : "text-gray-200"
                        )} 
                    />
                    ))}
                </div>

                <p className="text-gray-600 font-medium leading-relaxed mb-8 relative z-10">
                    "{t.mensaje}"
                </p>

                <div className="mt-auto flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-bold border-2 border-white shadow-sm">
                    {t.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                    <p className="text-sm font-bold text-gray-900">{t.nombre}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Cliente Verificado</p>
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            // Mensaje si no hay reseñas aprobadas aún
            <div className="text-center py-16 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                <Star className="mx-auto text-gray-300 mb-4" size={48} />
                <h4 className="text-xl font-bold text-gray-900">Aún no hay reseñas publicadas</h4>
                <p className="text-gray-500 mb-6">Sé el primero en contarnos tu experiencia con SnowConnect.</p>
            </div>
        )}
      </div>
    </section>
  );
}