"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/wishlist-context";
import { Trash2, HeartOff, ArrowRight } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu"; // Usamos componentes consistentes si los tienes
// Si no tienes una Navbar exportada, usa la estructura directa:

export default function WishlistPage() {
  // CORRECCIÓN: Usamos 'wishlist' en lugar de 'items'
  const { wishlist, removeFromWishlist } = useWishlist();
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extraemos solo los IDs para filtrar
    const wishlistIds = wishlist.map(item => item.id);

    if (wishlistIds.length > 0) {
      fetch("/api/productos")
        .then(res => res.json())
        .then((data: any[]) => {
          // Filtramos los productos que coinciden con nuestros IDs guardados
          const favoritos = data.filter(p => wishlistIds.includes(p.id));
          setProductos(favoritos);
          setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    } else {
      setProductos([]);
      setLoading(false);
    }
  }, [wishlist]); // Escuchamos cambios en 'wishlist'

  return (
    <div className="min-h-screen bg-[#FBFBFD]">
      
      {/* Navbar Simple (o puedes importar tu Navbar global) */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
           <Link href="/" className="font-black text-xl tracking-tight uppercase">Snow<span className="text-gray-400">Connect</span></Link>
           <Link href="/catalogo" className="text-sm font-bold text-gray-500 hover:text-black">Seguir comprando</Link>
        </div>
      </nav>

      <div className="pt-12 pb-24 max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">Tu Lista de <span className="text-red-500">Deseos</span></h1>
            <p className="text-gray-500 text-lg font-medium">Guarda aquí lo que te enamora para no perderlo de vista.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[1,2,3].map(i => <div key={i} className="h-96 bg-gray-100 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
               <HeartOff size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Aún no tienes favoritos</h3>
            <p className="text-gray-500 mb-8 max-w-md">Explora nuestro catálogo y dale al corazón ❤️ en los equipos que te gusten.</p>
            <Link href="/catalogo" className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-gray-200">
              Ir al Catálogo <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productos.map((prod) => {
              // Parseo seguro de imagen
              let imagen = "/placeholder-phone.png";
              try {
                 const parsed = JSON.parse(prod.fotosJson || "[]");
                 if(parsed.length > 0) imagen = parsed[0];
              } catch(e) {}

              return (
                <div key={prod.id} className="group bg-white p-5 rounded-[2.5rem] border border-gray-100 hover:border-red-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col">
                  
                  {/* Botón Eliminar */}
                  <button 
                    onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(prod.id);
                    }}
                    className="absolute top-5 right-5 z-20 w-10 h-10 bg-white border border-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 size={16} />
                  </button>

                  <Link href={`/producto/${prod.id}`} className="flex-1 flex flex-col">
                    <div className="relative aspect-[4/5] mb-6 rounded-2xl overflow-hidden bg-gray-50/50">
                       <Image src={imagen} alt={prod.modelo} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="mt-auto">
                        <h3 className="font-black text-gray-900 text-lg mb-1 leading-tight uppercase italic">{prod.modelo}</h3>
                        <p className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-widest">{prod.marca} • {prod.almacenamiento}</p>
                        
                        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                            <span className="text-xl font-black text-gray-900 tracking-tight">${Number(prod.precioVenta).toLocaleString()}</span>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                Ver <ArrowRight size={12}/>
                            </span>
                        </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}