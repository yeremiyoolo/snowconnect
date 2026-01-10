"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, X, Loader2, Search } from "lucide-react";
import { ExportButton } from "@/components/admin/export-button";
import { Input } from "@/components/ui/input";
import { DownloadReceiptBtn } from "@/components/admin/download-receipt-btn"; // <--- IMPORTACIÓN DEL BOTÓN PDF

export default function HistorialVentasPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ventaEditando, setVentaEditando] = useState<any | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargarVentas = () => {
    setLoading(true);
    fetch("/api/ventas")
      .then((res) => res.json())
      .then((data) => {
        setVentas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => { 
        console.error(err); 
        setLoading(false); 
      });
  };

  useEffect(() => { cargarVentas(); }, []);

  // Filtrado simple
  const ventasFiltradas = ventas.filter(v => 
     v.cliente?.toLowerCase().includes(search.toLowerCase()) || 
     v.producto?.modelo?.toLowerCase().includes(search.toLowerCase()) ||
     v.producto?.imei?.toLowerCase().includes(search.toLowerCase())
  );

  const exportData = ventasFiltradas.map(v => ({
      Fecha: new Date(v.createdAt).toLocaleDateString(),
      Cliente: v.cliente,
      Producto: v.producto?.modelo,
      IMEI: v.producto?.imei,
      Precio: v.precioVenta,
      Ganancia: v.margen
  }));

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const res = await fetch(`/api/ventas/${ventaEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: ventaEditando.cliente,
          precioVenta: Number(ventaEditando.precioVenta),
          notas: ventaEditando.notas
        }),
      });
      if (res.ok) { 
        setVentaEditando(null); 
        cargarVentas(); 
      }
    } catch (error) { 
      alert("Error de conexión"); 
    } finally { 
      setGuardando(false); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ventas</h1>
           <p className="text-gray-500 font-medium">Historial de transacciones y facturación.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <ExportButton data={exportData} filename="ventas_snowconnect" label="Reporte CSV" />
           <Link 
             href="/admin/ventas/nueva" 
             className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition flex items-center justify-center font-bold text-sm shadow-lg gap-2"
           >
             <Plus size={16} /> Nueva Venta
           </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
               placeholder="Buscar por cliente, modelo o IMEI..." 
               className="pl-10 bg-gray-50 border-transparent rounded-xl focus:bg-white transition-all"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center">
             <Loader2 className="animate-spin mb-2" /> Cargando historial...
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-400 font-bold tracking-wider">
              <tr>
                <th className="p-6">Detalle Producto</th>
                <th className="p-6">Cliente</th>
                <th className="p-6">Economía</th>
                <th className="p-6 text-right">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ventasFiltradas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50/80 transition group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            Sale
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{venta.producto?.modelo || "Producto Eliminado"}</p>
                            <p className="text-xs text-gray-400 font-mono">{venta.producto?.imei}</p>
                        </div>
                    </div>
                  </td>
                  <td className="p-6">
                     <p className="font-medium text-gray-700">{venta.cliente || "Consumidor Final"}</p>
                     <p className="text-[10px] text-gray-400">{new Date(venta.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                        <span className="font-black text-gray-900">${venta.precioVenta.toLocaleString()}</span>
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                            +{venta.margen?.toLocaleString()} ganancia
                        </span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        
                        {/* BOTÓN DE DESCARGA PDF INTEGRADO */}
                        <DownloadReceiptBtn venta={venta} />

                        <button 
                           onClick={() => setVentaEditando({...venta})} 
                           className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                           title="Editar Venta"
                        >
                          <Edit size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Edición Simple */}
      {ventaEditando && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Editar Venta</h2>
              <button onClick={() => setVentaEditando(null)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={guardarCambios} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Cliente</label>
                <Input 
                  value={ventaEditando.cliente} 
                  onChange={(e) => setVentaEditando({...ventaEditando, cliente: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Precio Real Venta</label>
                <Input 
                  type="number" 
                  value={ventaEditando.precioVenta} 
                  onChange={(e) => setVentaEditando({...ventaEditando, precioVenta: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Notas Internas</label>
                <Input 
                  value={ventaEditando.notas || ""} 
                  onChange={(e) => setVentaEditando({...ventaEditando, notas: e.target.value})}
                  className="mt-1"
                  placeholder="Ej: Pago parcial, garantía especial..."
                />
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setVentaEditando(null)} className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-sm">Cancelar</button>
                <button type="submit" disabled={guardando} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm flex justify-center items-center gap-2">
                  {guardando && <Loader2 className="animate-spin" size={16} />} Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}