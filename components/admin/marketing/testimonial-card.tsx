"use client";

import { useState } from "react";
import { toggleTestimonialStatus, deleteTestimonial } from "@/actions/admin/testimonial-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Star, Trash2, Eye, EyeOff, User, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestimonialCard({ testimonial }: { testimonial: any }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleTestimonialStatus(testimonial.id, testimonial.activo);
    setLoading(false);
    if (res.success) {
      toast.success(testimonial.activo ? "Testimonio ocultado" : "Testimonio activado");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este testimonio permanentemente?")) return;
    const res = await deleteTestimonial(testimonial.id);
    if (res.success) toast.success("Testimonio eliminado");
  };

  return (
    // 🍎 MEJORA: Más padding (p-10), sombra más profunda y bordes más suaves
    <div className="bg-white dark:bg-zinc-900 border border-border/50 rounded-[3rem] p-10 shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
      
      {/* Decoración premium */}
      <Quote className="absolute -top-3 -right-3 text-primary/5 w-28 h-28 -rotate-12 pointer-events-none" />

      {/* HEADER: Avatar, Nombre y Estrellas */}
      <div className="flex justify-between items-start mb-8 relative z-10 gap-4">
        <div className="flex items-center gap-5">
          {/* Avatar más grande */}
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-primary border-2 border-background shadow-md overflow-hidden shrink-0">
            {testimonial.fotoUrl ? (
                <img src={testimonial.fotoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
                <User size={30} />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-xl uppercase italic tracking-tighter leading-none break-all">
                {testimonial.nombre}
            </h3>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={cn(i < (testimonial.calificacion || 5) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground opacity-20")} />
              ))}
            </div>
          </div>
        </div>
        <Badge className={cn("text-[10px] font-black uppercase tracking-widest rounded-full px-4 py-1.5 shrink-0", testimonial.activo ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-zinc-500/10 text-zinc-600 border-zinc-500/20")}>
          {testimonial.activo ? "En Pantalla" : "Pausado"}
        </Badge>
      </div>

      {/* CUERPO: Mensaje (Con scroll si es demasiado largo) */}
      <div className="relative z-10 mb-10 flex-grow">
        <p className="text-base font-medium italic text-foreground/90 leading-relaxed max-h-[160px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
          "{testimonial.mensaje}"
        </p>
      </div>

      {/* FOOTER: Fecha y Acciones */}
      <div className="flex items-center justify-between border-t border-border/30 pt-8 mt-auto relative z-10">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Registrado: {new Date(testimonial.createdAt).toLocaleDateString()}
        </span>
        
        <div className="flex gap-2.5">
          <Button 
            onClick={handleToggle} 
            disabled={loading}
            variant="ghost" 
            size="sm" 
            className={cn("h-11 rounded-xl px-5 text-[11px] font-black uppercase tracking-widest gap-2.5 shadow-sm transition-all hover:scale-105", testimonial.activo ? "text-red-500 hover:bg-red-50" : "text-primary hover:bg-primary/10")}
          >
            {testimonial.activo ? <><EyeOff size={16} /> Ocultar</> : <><Eye size={16} /> Mostrar</>}
          </Button>
          <Button onClick={handleDelete} variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:scale-105 transition-all">
            <Trash2 size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}