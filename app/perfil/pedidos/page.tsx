import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function MisPedidosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login");

  // Buscamos las ventas asociadas a este usuario
  const ventas = await prisma.venta.findMany({
    where: {
      userId: session.user.id, // Asegúrate de que el userId se guarda en la Venta
    },
    include: {
      producto: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FBFBFD] pb-24">
      {/* Header Simple */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <h1 className="text-lg font-black uppercase tracking-tight text-gray-900">Historial de Compras</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {ventas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes pedidos</h3>
            <p className="text-gray-500 mb-6">Explora nuestro catálogo y encuentra tu próximo equipo.</p>
            <Link href="/catalogo" className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition-colors">
              Ir al Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {ventas.map((venta) => {
               // Parsear foto
               let foto = "/placeholder-phone.png";
               try {
                 const parsed = JSON.parse(venta.producto.fotosJson || "[]");
                 if (parsed.length > 0) foto = parsed[0];
               } catch (e) {}

               return (
                <div key={venta.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  {/* Foto Producto */}
                  <div className="relative w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0">
                    <Image src={foto} alt={venta.producto.modelo} fill className="object-contain p-2" />
                  </div>
                  
                  {/* Detalles */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">{venta.producto.modelo}</h3>
                      <Badge variant="outline" className="w-fit mx-auto sm:mx-0 bg-green-50 text-green-700 border-green-200">
                        Completado
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-500">{venta.producto.almacenamiento} • {venta.producto.color}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-400 font-medium pt-2">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(venta.createdAt).toLocaleDateString()}</span>
                      <span className="text-gray-300">|</span>
                      <span>ID: {venta.id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="text-right">
                    <span className="block text-xl font-black text-gray-900">${venta.precioVenta.toLocaleString()}</span>
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}