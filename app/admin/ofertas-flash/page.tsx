import { prisma } from "@/lib/prisma";
import { Zap, Trash2, Clock, Smartphone, ToggleLeft, ToggleRight, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateOfferForm from "@/components/admin/ofertas-flash/create-offer-form";
import { toggleOfferStatus, deleteOffer } from "@/actions/admin/offer-actions";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AdminOfertasFlashPage() {
  // Solo productos disponibles para crear nuevas ofertas
  const productos = await prisma.producto.findMany({
    where: { estado: "DISPONIBLE", stockTotal: { gt: 0 } },
    select: { id: true, marca: true, modelo: true, precioVenta: true }
  });

  const offers = await prisma.flashOffer.findMany({
    include: { producto: { include: { imagenes: true } } },
    orderBy: { createdAt: "desc" }
  });

  const activasCount = offers.filter(o => o.isActive && new Date(o.expiresAt) > new Date()).length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-[1600px] mx-auto pb-20">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Central <span className="text-orange-500 text-6xl">Flash</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Crea urgencia y liquida stock con descuentos temporales
          </p>
        </div>
        
        <div className="bg-orange-500/10 border border-orange-500/20 px-8 py-4 rounded-[2rem] shadow-lg flex flex-col justify-center min-w-[200px]">
          <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest flex items-center gap-2">
            <Zap size={12} className="fill-orange-600"/> Ofertas en Vivo
          </p>
          <p className="text-3xl font-black text-orange-600 italic mt-1">{activasCount} Activas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LADO IZQUIERDO: FORMULARIO */}
        <div className="lg:col-span-5">
          <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 ml-4 flex items-center gap-2">
            <Zap size={20} className="text-orange-500"/> Nuevo Lanzamiento
          </h2>
          <CreateOfferForm productos={productos} />
        </div>

        {/* LADO DERECHO: LISTA DE OFERTAS */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 ml-4 text-foreground/70">Historial de Ofertas</h2>
          
          {offers.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[3rem] bg-card/30 opacity-60">
                <Zap size={48} className="mb-4 text-muted-foreground" />
                <p className="text-sm font-black uppercase tracking-widest">No hay campañas registradas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {offers.map((offer) => {
                const isExpired = new Date(offer.expiresAt) < new Date();
                const handleToggle = toggleOfferStatus.bind(null, offer.id, offer.isActive);
                const handleDelete = deleteOffer.bind(null, offer.id);
                
                const precioOriginal = offer.producto.precioVenta;
                const precioOferta = precioOriginal - (precioOriginal * offer.discountPercent / 100);

                return (
                  <div key={offer.id} className="relative bg-card border border-border/50 rounded-[2.5rem] p-6 shadow-md hover:shadow-xl transition-all group overflow-hidden flex flex-col md:flex-row gap-6">
                    
                    {/* Badge de Descuento flotante */}
                    <div className="absolute top-0 left-0 bg-orange-500 text-white font-black px-4 py-2 rounded-br-2xl z-20 text-sm italic">
                      -{offer.discountPercent}%
                    </div>

                    {/* IMAGEN DEL EQUIPO */}
                    <div className="w-full md:w-32 h-32 relative rounded-2xl overflow-hidden bg-secondary/50 shrink-0">
                      {offer.producto.imagenes?.[0] ? (
                        <Image src={offer.producto.imagenes[0].url} alt="" fill className="object-cover" />
                      ) : (
                        <Smartphone className="m-auto opacity-20" size={40} />
                      )}
                    </div>

                    {/* INFO Y PRECIOS */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter line-clamp-1">{offer.producto.modelo}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{offer.producto.marca}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <form action={handleToggle}>
                            <Button type="submit" variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                              {offer.isActive ? <ToggleRight className="text-orange-500 w-6 h-6" /> : <ToggleLeft className="text-muted-foreground w-6 h-6" />}
                            </Button>
                          </form>
                          <form action={handleDelete}>
                            <Button type="submit" variant="ghost" size="icon" className="rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500">
                              <Trash2 size={18} />
                            </Button>
                          </form>
                        </div>
                      </div>

                      <div className="flex items-end gap-3 pt-2">
                         <div className="text-2xl font-black text-orange-600 italic tracking-tighter">
                            RD$ {precioOferta.toLocaleString()}
                         </div>
                         <div className="text-sm font-bold text-muted-foreground line-through pb-1 opacity-50">
                            RD$ {precioOriginal.toLocaleString()}
                         </div>
                      </div>

                      <div className={`mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-green-600'}`}>
                        <Clock size={14} /> 
                        {isExpired ? 'Finalizada' : `Cierra: ${new Date(offer.expiresAt).toLocaleDateString()} ${new Date(offer.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                      </div>
                    </div>
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