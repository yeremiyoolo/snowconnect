"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, X, Smartphone, Battery, Database, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Movemos la lógica a un componente interno
function CompararContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",") || [];
  const [productos, setProductos] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompareProducts() {
      if (ids.length === 0) return;
      try {
        const res = await fetch("/api/productos");
        const allProducts = await res.json();
        // Filtramos solo los que están en la URL
        const filtered = allProducts.filter((p: any) => ids.includes(p.id));
        setProductos(filtered);
      } catch (error) {
        console.error("Error cargando comparativa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompareProducts();
  }, [searchParams, ids]); // Agregamos dependencias correctas

  if (ids.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Smartphone size={64} className="text-gray-200 mb-4" />
        <h1 className="text-2xl font-black uppercase italic">No hay equipos para comparar</h1>
        <p className="text-gray-500 mb-8">Selecciona al menos dos equipos en el catálogo.</p>
        <Link href="/catalogo">
          <Button className="rounded-full px-8 bg-black">Volver al Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBFBFD] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/catalogo" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Compara y <span className="text-blue-600">Elige</span>
          </h1>
          <p className="text-gray-500 font-medium mt-4">Analiza las especificaciones técnicas lado a lado.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((prod) => {
            const imagenes = JSON.parse(prod.fotosJson || "[]");
            const imagenPrincipal = imagenes[0] || "/placeholder-phone.png";

            return (
              <div key={prod.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
                {/* Cabecera del producto en la tabla */}
                <div className="relative w-full aspect-square mb-8 bg-[#F5F5F7] rounded-[2rem] p-8">
                  <Image 
                    src={imagenPrincipal} 
                    alt={prod.modelo} 
                    fill 
                    className="object-contain mix-blend-multiply p-4"
                  />
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <h2 className="text-2xl font-black uppercase italic leading-tight">{prod.modelo}</h2>
                    <p className="text-blue-600 font-bold uppercase text-xs tracking-widest">{prod.marca}</p>
                  </div>

                  <div className="text-3xl font-black text-gray-900">
                    ${Number(prod.precioVenta).toLocaleString()}
                  </div>

                  {/* Lista de Especificaciones */}
                  <div className="space-y-4 pt-6 border-t border-gray-50">
                    <SpecRow icon={<Database size={18}/>} label="Capacidad" value={prod.almacenamiento} />
                    <SpecRow icon={<Battery size={18}/>} label="Salud Batería" value={`${prod.bateria || '90'}%`} />
                    <SpecRow icon={<Smartphone size={18}/>} label="Color" value={prod.color} />
                    <SpecRow icon={<ShieldCheck size={18}/>} label="Garantía" value="30 Días" />
                  </div>

                  <Link href={`/producto/${prod.id}`} className="block pt-6">
                    <Button className="w-full h-14 rounded-2xl bg-black text-white font-black uppercase italic tracking-widest hover:scale-[1.02] transition-transform">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// 2. Componente Principal con Suspense (Requerido por Next.js para useSearchParams)
export default function CompararPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <CompararContent />
    </Suspense>
  );
}

function SpecRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 text-gray-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}