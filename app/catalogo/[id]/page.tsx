import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  Smartphone, Battery, Cpu, Camera, ShieldCheck, 
  Truck, Zap, Star, ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/catalogo/add-to-cart-button"; 
import { ProductGallery } from "@/components/catalogo/product-gallery";

interface ProductoPageProps {
  params: {
    id: string;
  };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { id } = await params;

  const producto = await prisma.producto.findUnique({
    where: { id: id },
    include: {
      imagenes: true,    
      variantes: true,   
      specs: true,       
    },
  });

  if (!producto) notFound();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        
        <Link href="/catalogo" className="inline-flex items-center gap-2 text-xs font-black uppercase opacity-50 hover:opacity-100 mb-10 transition-all group tracking-widest">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          <ProductGallery 
            imagenes={producto.imagenes} 
            nombre={producto.nombre} 
            enOferta={producto.enOferta} 
          />

          <div className="flex flex-col justify-center">
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="rounded-full px-4 py-1 font-black uppercase tracking-widest text-[10px] border-primary/30 text-primary bg-primary/5">
                  {producto.marca}
                </Badge>
                <Badge variant="outline" className="rounded-full px-4 py-1 font-black uppercase tracking-widest text-[10px] border-zinc-500/30">
                  {producto.condicion}
                </Badge>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-[0.9]">
                {producto.modelo}
              </h1>

              <div className="flex items-center gap-4">
                 <div className="flex text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor"/>)}
                 </div>
                 <span className="text-xs font-black opacity-30 uppercase tracking-[0.2em] italic">Garantía SnowConnect</span>
              </div>
            </div>

            <p className="text-muted-foreground text-xl font-medium leading-relaxed mb-10 max-w-xl">
              {producto.descripcion || "Este equipo ha sido inspeccionado por nuestros técnicos para garantizar el mejor rendimiento."}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-secondary/40 backdrop-blur-md p-5 rounded-[2rem] border border-border/40 text-center hover:bg-secondary/60 transition-colors">
                <Smartphone className="mx-auto mb-3 text-primary" size={24} />
                <p className="text-[10px] font-black uppercase opacity-40 mb-1 tracking-widest">Capacidad</p>
                <p className="font-black text-sm italic">{producto.almacenamiento || "N/A"}</p>
              </div>
              <div className="bg-secondary/40 backdrop-blur-md p-5 rounded-[2rem] border border-border/40 text-center hover:bg-secondary/60 transition-colors">
                <Battery className="mx-auto mb-3 text-primary" size={24} />
                <p className="text-[10px] font-black uppercase opacity-40 mb-1 tracking-widest">Salud</p>
                <p className="font-black text-sm italic">{producto.bateria ? `${producto.bateria}%` : "N/A"}</p>
              </div>
              <div className="bg-secondary/40 backdrop-blur-md p-5 rounded-[2rem] border border-border/40 text-center hover:bg-secondary/60 transition-colors">
                <ShieldCheck className="mx-auto mb-3 text-primary" size={24} />
                <p className="text-[10px] font-black uppercase opacity-40 mb-1 tracking-widest">Estado</p>
                <p className="font-black text-sm uppercase italic tracking-tighter">{producto.estado}</p>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black text-primary tracking-tighter italic">
                  RD$ {producto.precioVenta.toLocaleString()}
                </span>
                {producto.precioAnterior && producto.precioAnterior > 0 && (
                  <span className="text-2xl font-bold text-muted-foreground line-through opacity-30 italic">
                    RD$ {producto.precioAnterior.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 text-green-500 font-black uppercase text-[10px] tracking-[0.2em] bg-green-500/5 w-fit px-4 py-2 rounded-full border border-green-500/10">
                 <Zap size={14} fill="currentColor" className="animate-pulse" /> Envío disponible en todo el país
              </div>
            </div>

            <Separator className="mb-10 opacity-10" />

            <div className="space-y-6">
              {/* 🔥 AQUÍ ESTÁ EL BOTÓN LIMPIO SIN COLORES */}
              <AddToCartButton 
                product={{
                  id: producto.id,
                  name: `${producto.marca} ${producto.modelo}`,
                  price: producto.precioVenta,
                  image: producto.imagenes[0]?.url || "/placeholder.png",
                }}
              />
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 justify-center border border-border/50 py-3 rounded-2xl italic">
                    <Truck size={14}/> Entrega 24/48h
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 justify-center border border-border/50 py-3 rounded-2xl italic">
                    <ShieldCheck size={14}/> Garantía Local
                 </div>
              </div>
            </div>
          </div>
        </div>

        {producto.specs && (
          <div className="mt-40">
             <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent mb-20" />
             <h2 className="text-4xl font-black uppercase italic mb-16 tracking-tighter">
                Ficha <span className="text-primary underline decoration-4 underline-offset-8">Técnica</span>
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <SpecCard icon={<Cpu size={20}/>} label="Procesador" value={producto.specs.procesador} />
                <SpecCard icon={<Camera size={20}/>} label="Cámara" value={producto.specs.camara} />
                <SpecCard icon={<Smartphone size={20}/>} label="Pantalla" value={producto.specs.pantalla} />
                <SpecCard icon={<Zap size={20}/>} label="Carga" value={producto.specs.bateria} />
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SpecCard({ icon, label, value }: { icon: any, label: string, value: string | null }) {
    if (!value) return null;
    return (
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-border/50 flex flex-col gap-3 group hover:border-primary/50 transition-all">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{label}</p>
            <p className="font-black text-sm uppercase tracking-tight italic">{value}</p>
        </div>
    );
}