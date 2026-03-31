import { prisma } from "@/lib/prisma";
import { Star, MessageSquare, ShieldCheck, Filter, Trash2 } from "lucide-react";
import { ReviewCard } from "@/components/admin/resenas/review-card";

export const dynamic = 'force-dynamic';

export default async function AdminResenasPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      producto: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const promedio = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  const pendientes = reviews.filter(r => !r.isApproved).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-[1600px] mx-auto pb-20">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Feedback <span className="text-primary">Clientes</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Modera las opiniones y destaca la confianza Snow
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] shadow-xl flex flex-col justify-center min-w-[160px]">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><Star size={12} className="fill-yellow-400 text-yellow-400"/> Satisfacción</p>
              <p className="text-2xl font-black text-foreground italic mt-1">{promedio} / 5.0</p>
           </div>
           <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] shadow-xl flex flex-col justify-center min-w-[160px]">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5"><MessageSquare size={12}/> Pendientes</p>
              <p className="text-2xl font-black text-primary italic mt-1">{pendientes}</p>
           </div>
        </div>
      </div>

      {/* GRID DE RESEÑAS */}
      {reviews.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[3rem] bg-card/30 opacity-60">
            <MessageSquare size={48} className="mb-4" />
            <p className="text-sm font-black uppercase tracking-widest">Aún no hay reseñas de clientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}