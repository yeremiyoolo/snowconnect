import { prisma } from "@/lib/prisma";
import { MessageSquare, Heart, ShieldCheck, Star } from "lucide-react";
import { TestimonialCard } from "@/components/admin/marketing/testimonial-card";

export const dynamic = 'force-dynamic';

export default async function AdminTestimoniosPage() {
  // Obtenemos los testimonios reales de la DB
  const testimonios = await prisma.testimonio.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const activosCount = testimonios.filter(t => t.activo).length;
  const promedioCalificacion = testimonios.length > 0 
    ? (testimonios.reduce((acc, t) => acc + t.calificacion, 0) / testimonios.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-10 max-w-[1700px] mx-auto pb-32">
      
      {/* CABECERA SIN BOTÓN DE AGREGAR */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1 leading-none">
            Prueba <span className="text-primary">Social</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Moderación de testimonios y reseñas de clientes
          </p>
        </div>
        
        <div className="flex gap-5 shrink-0">
           <div className="bg-card border border-border/50 px-8 py-5 rounded-[2.5rem] shadow-xl flex flex-col justify-center min-w-[180px]">
              <p className="text-[11px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                <Star size={14} className="text-yellow-500 fill-yellow-500"/> Rating Promedio
              </p>
              <p className="text-3xl font-black text-foreground italic mt-1.5 leading-none">{promedioCalificacion} / 5.0</p>
           </div>
           <div className="bg-card border border-border/50 px-8 py-5 rounded-[2.5rem] shadow-xl flex flex-col justify-center min-w-[180px]">
              <p className="text-[11px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
                <Heart size={14} className="fill-primary"/> Visibles en Web
              </p>
              <p className="text-3xl font-black text-primary italic mt-1.5 leading-none">{activosCount} Activos</p>
           </div>
        </div>
      </div>

      <div className="h-px bg-border/50 w-full" />

      {/* GRID DE TESTIMONIOS */}
      {testimonios.length === 0 ? (
        <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[3rem] bg-card/30 opacity-60 text-center">
            <MessageSquare size={50} className="mb-4 text-muted-foreground" />
            <p className="text-base font-black uppercase tracking-widest">No hay testimonios pendientes de moderación</p>
            <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-tighter">Las reseñas que dejen tus clientes aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {testimonios.map((t) => (
             <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      )}
    </div>
  );
}