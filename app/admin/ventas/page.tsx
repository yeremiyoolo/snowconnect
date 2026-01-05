"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, X, Save, Loader2 } from "lucide-react";

export default function HistorialVentasPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    cargarVentas();
  }, []);

  const abrirEdicion = (venta: any) => {
    setVentaEditando({ ...venta });
  };

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
      } else {
        alert("Error al guardar");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-6">
      {/* Encabezado igual a tu estilo */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Ventas</h1>
        <Link 
          href="/admin/ventas/nueva" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Venta
        </Link>
      </div>

      {/* Tabla con el estilo de tus Cards */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando ventas...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Producto</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Precio</th>
                <th className="p-4 text-sm font-semibold text-green-600">Ganancia</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ventas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{venta.producto?.modelo}</p>
                    <p className="text-xs text-gray-500">{venta.producto?.imei}</p>
                  </td>
                  <td className="p-4 text-gray-600">{venta.cliente}</td>
                  <td className="p-4 font-bold text-gray-800">${venta.precioVenta}</td>
                  <td className="p-4 font-bold text-green-600">+${venta.margen}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => abrirEdicion(venta)} className="text-blue-600 hover:text-blue-800 p-1">
                      <Edit className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal - Estilo consistente con tu Dashboard */}
      {ventaEditando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Editar Venta</h2>
              <button onClick={() => setVentaEditando(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <form onSubmit={guardarCambios} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <input 
                  type="text" 
                  value={ventaEditando.cliente} 
                  onChange={(e) => setVentaEditando({...ventaEditando, cliente: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio de Venta</label>
                <input 
                  type="number" 
                  value={ventaEditando.precioVenta} 
                  onChange={(e) => setVentaEditando({...ventaEditando, precioVenta: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setVentaEditando(null)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancelar</button>
                <button type="submit" disabled={guardando} className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex justify-center">
                  {guardando ? <Loader2 className="h-5 w-5 animate-spin" /> : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}