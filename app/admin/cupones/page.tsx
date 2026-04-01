import { prisma } from "@/lib/prisma";
import { Ticket, Trash2, Calendar, Users, Activity, ToggleLeft, ToggleRight, DollarSign, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CouponForm } from "@/components/admin/cupones/coupon-form";
import { toggleCouponStatus, deleteCoupon } from "@/actions/admin/coupon-actions";

export const dynamic = 'force-dynamic';

export default async function AdminCuponesPage() {
  const coupons = await prisma.discountCode.findMany({
    include: { _count: { select: { usedBy: true } } },
    orderBy: { createdAt: "desc" }
  });

  const activos = coupons.filter(c => c.isActive).length;
  const totalUsos = coupons.reduce((acc, c) => acc + c._count.usedBy, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 md:p-8 max-w-[1700px] mx-auto pb-20">
      
      {/* CABECERA */}
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Central de <span className="text-primary">Descuentos</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Crea promociones y fideliza a tus clientes Snow
          </p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 shrink-0">
           <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] shadow-xl flex flex-col justify-center min-w-[180px]">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><Activity size={12}/> Activos</p>
              <p className="text-2xl font-black text-green-500 italic mt-1">{activos} Códigos</p>
           </div>
           <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] shadow-xl flex flex-col justify-center min-w-[180px]">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5"><Users size={12}/> Canjes Totales</p>
              <p className="text-2xl font-black text-primary italic mt-1">{totalUsos} Usos</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LADO IZQUIERDO: FORMULARIO (4 columnas en XL para dar más espacio a la lista) */}
        <div className="xl:col-span-4">
          <h2 className="text-xl font-black uppercase italic tracking-tighter mb-5 ml-4 text-foreground/70">Panel de Creación</h2>
          <CouponForm />
        </div>

        {/* LADO DERECHO: LISTA (8 columnas en XL) */}
        <div className="xl:col-span-8 space-y-8">
          <h2 className="text-xl font-black uppercase italic tracking-tighter mb-5 ml-4 text-foreground/70">Inventario de Cupones ({coupons.length})</h2>
          
          {coupons.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[3rem] bg-card/30 opacity-60">
                <Ticket size={48} className="mb-4" />
                <p className="text-sm font-black uppercase tracking-widest">No hay cupones registrados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-6">
              {coupons.map((coupon) => {
                const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                const handleToggle = toggleCouponStatus.bind(null, coupon.id, coupon.isActive);
                const handleDelete = deleteCoupon.bind(null, coupon.id);
                const isPerc = coupon.type === "PERCENTAGE";

                return (
                  <div key={coupon.id} className="relative bg-white dark:bg-zinc-900 border border-border/50 rounded-[2.5rem] p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden hover:-translate-y-1">
                    
                    {/* Borde punteado estilo ticket (más grueso para visibilidad) */}
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-secondary/50 border-r border-dashed border-border/50" />
                    
                    {/* Decoración de fondo */}
                    <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 text-primary group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
                      <Ticket size={200} />
                    </div>

                    {/* CABECERA */}
                    <div className="flex justify-between items-start mb-6 relative z-10 pl-2">
                      <div className="max-w-[70%]">
                        <Badge className={`uppercase text-[10px] font-black tracking-widest rounded-full px-3 py-1 ${coupon.isActive && !isExpired ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>
                          {isExpired ? "Expirado" : coupon.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase italic tracking-tighter mt-2.5 break-all line-clamp-1">
                          {coupon.code}
                        </h3>
                      </div>
                      <div className="flex gap-1.5 shrink-0 ml-2">
<form action={async () => { await handleToggle(); }}>
                            <Button type="submit" variant="ghost" size="icon" className="rounded-full hover:bg-secondary h-10 w-10">
                            {coupon.isActive ? <ToggleRight className="text-primary w-6 h-6" /> : <ToggleLeft className="text-muted-foreground w-6 h-6" />}
                          </Button>
                        </form>
<form action={async () => { await handleDelete(); }}>
                            <Button type="submit" variant="ghost" size="icon" className="rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 h-10 w-10">
                            <Trash2 size={20} />
                          </Button>
                        </form>
                      </div>
                    </div>

                    {/* DATOS */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border relative z-10 ml-2 ${isPerc ? "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50" : "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/50"}`}>
                      <div className="space-y-1">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isPerc ? "text-blue-700" : "text-green-700"}`}>Descuento</p>
                        <p className={`text-2xl md:text-3xl font-black italic tracking-tighter flex items-center gap-1.5 ${isPerc ? "text-blue-600" : "text-green-600"}`}>
                          {isPerc ? <Percent size={20}/> : <DollarSign size={20}/>}
                          {coupon.value.toLocaleString()}
                          {isPerc && <span className='text-xl not-italic font-bold'>%</span>}
                        </p>
                      </div>
                      <div className="sm:text-right space-y-1 border-t sm:border-t-0 sm:border-l border-dashed border-border/50 pt-3 sm:pt-0 sm:pl-5">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Usos / Límite</p>
                        <p className="text-xl md:text-2xl font-black text-foreground italic tracking-tighter">
                          {coupon._count.usedBy} <span className="text-lg font-bold text-muted-foreground">/ {coupon.maxUses || '∞'}</span>
                        </p>
                      </div>
                    </div>

                    {/* FECHA */}
                    {coupon.expiresAt && (
                        <div className="mt-6 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground border-t border-border/50 pt-5 ml-2 relative z-10">
                           <span>Válido hasta:</span>
                           <span className={`flex items-center gap-1.5 ${isExpired ? "text-red-500" : "text-foreground"}`}>
                              <Calendar size={14} /> 
                              {new Date(coupon.expiresAt).toLocaleDateString()}
                           </span>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}