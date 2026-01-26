import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/landing/product-card";
import { SlidersHorizontal, Search, Smartphone, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// Forzar render dinámico para que los filtros funcionen en tiempo real
export const dynamic = 'force-dynamic';

interface CatalogoProps {
  searchParams: {
    marca?: string;
    q?: string;
    oferta?: string;
  };
}

export default async function CatalogoPage({ searchParams }: CatalogoProps) {
  const params = await searchParams;

  // 1. Construir filtros dinámicos
  const where: any = {
    estado: { not: "VENDIDO" }, 
  };

  if (params.marca) where.marca = { equals: params.marca, mode: 'insensitive' };
  if (params.oferta === "true") where.enOferta = true;
  if (params.q) {
    where.OR = [
      { modelo: { contains: params.q, mode: "insensitive" } },
      { marca: { contains: params.q, mode: "insensitive" } },
    ];
  }

  // 2. Obtener productos (INCLUYENDO ALMACENAMIENTO)
  const productosRaw = await prisma.producto.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { 
        specs: true,
        almacenamiento: true // <--- CORRECCIÓN CLAVE
    },
  });

  // 3. Procesar productos para aplanar el objeto de almacenamiento
  const productos = productosRaw.map(p => ({
    ...p,
    almacenamiento: p.almacenamiento && p.almacenamiento.length > 0 
        ? p.almacenamiento[0].capacidad 
        : null
  }));

  const filtros = ["Todos", "Apple", "Samsung", "Ofertas"];

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 px-4 md:px-8">
      
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- 1. CABECERA LIMPIA (FILTROS + BUSCADOR) --- */}
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6 mb-10">
          
          {/* IZQUIERDA: Botones de Filtro */}
          <div className="flex flex-wrap gap-2">
             {filtros.map((tag) => {
               const isActive = tag === "Todos" 
                 ? !params.marca && !params.oferta
                 : params.marca === tag || (tag === "Ofertas" && params.oferta === "true");
               
               let href = "/catalogo";
               if (tag !== "Todos") {
                  if (tag === "Ofertas") href = "/catalogo?oferta=true";
                  else href = `/catalogo?marca=${tag}`;
               }

               return (
                 <Link key={tag} href={href}>
                   <div className={`
                      px-6 py-2.5 rounded-full text-sm font-bold border transition-all cursor-pointer shadow-sm
                      ${isActive 
                        ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-105" 
                        : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:bg-secondary"}
                   `}>
                     {tag}
                   </div>
                 </Link>
               );
             })}
          </div>

          {/* DERECHA: Buscador */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <form className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                name="q"
                placeholder="Buscar modelo..." 
                className="pl-10 h-11 rounded-full bg-card border-border shadow-sm focus:ring-2 focus:ring-primary/20"
                defaultValue={params.q}
              />
            </form>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-full shrink-0 border-border bg-card shadow-sm hover:bg-secondary">
               <SlidersHorizontal className="w-4 h-4 text-foreground" />
            </Button>
          </div>
        </div>

        {/* --- 2. SECCIÓN "EXPLORA EL ECOSISTEMA" (Solo si no hay búsqueda) --- */}
        {!params.q && !params.marca && (
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Zap className="text-yellow-500 fill-yellow-500" size={20} />
              Explora el Ecosistema
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-64">
                {/* Card 1: Apple */}
                <Link href="/catalogo?marca=Apple" className="md:col-span-2 relative group overflow-hidden rounded-[2rem] bg-black cursor-pointer shadow-lg shadow-black/5">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                   <div className="absolute bottom-0 left-0 p-8">
                      <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-1">Mundo Apple</h3>
                      <p className="text-gray-300 text-sm font-medium">iPhone, iPad y todo el ecosistema.</p>
                   </div>
                </Link>

                {/* Card 2: Samsung */}
                <Link href="/catalogo?marca=Samsung" className="relative group overflow-hidden rounded-[2rem] bg-blue-950 cursor-pointer shadow-lg shadow-blue-900/10">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/40 to-transparent" />
                   <div className="absolute bottom-0 left-0 p-8">
                      <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter mb-1">Samsung</h3>
                      <p className="text-blue-100 text-xs font-medium">Innovación y pantallas increíbles.</p>
                   </div>
                </Link>

                {/* Card 3: Garantía */}
                <div className="relative group overflow-hidden rounded-[2rem] bg-card border border-border flex flex-col items-center justify-center text-center p-6 shadow-lg shadow-black/5">
                   <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                      <ShieldCheck size={28} />
                   </div>
                   <h3 className="text-foreground text-lg font-black uppercase tracking-tight">Garantía Snow™</h3>
                   <p className="text-muted-foreground text-xs mt-2 font-medium">Calidad certificada o te devolvemos tu dinero.</p>
                </div>
            </div>
          </div>
        )}

        {/* --- 3. LISTA DE PRODUCTOS --- */}
        <div>
           <div className="flex items-center gap-3 mb-8 opacity-40">
              <Smartphone size={18} className="text-foreground" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Inventario Disponible</span>
              <div className="h-[1px] bg-border flex-1" />
           </div>

           {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {productos.map((prod, index) => (
                <ProductCard 
                    key={prod.id} 
                    product={JSON.parse(JSON.stringify(prod))} 
                    index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-[2rem] border border-border">
               <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">
                 🔍
               </div>
               <h3 className="text-2xl font-black text-foreground tracking-tight">Sin resultados</h3>
               <p className="text-muted-foreground mt-2 max-w-md font-medium">
                 No encontramos dispositivos con esos criterios.
               </p>
               <Link href="/catalogo" className="mt-8">
                 <Button variant="outline" className="rounded-full px-8 h-12 border-border text-foreground hover:bg-secondary">
                    Limpiar Filtros
                 </Button>
               </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}