"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2, Star, MessageSquare } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function ModeracionTestimonios() {
  const [testimonios, setTestimonios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    fetch("/api/testimonios") // Trae todos (activos e inactivos)
      .then(res => res.json())
      .then(data => {
        setTestimonios(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { cargar(); }, []);

  const toggleEstado = async (id: string, estadoActual: boolean) => {
    await fetch(`/api/testimonios/${id}`, {
      method: "PUT",
      body: JSON.stringify({ activo: !estadoActual })
    });
    cargar();
  };

  const borrar = async (id: string) => {
    if (!confirm("¿Eliminar reseña permanentemente?")) return;
    await fetch(`/api/testimonios/${id}`, { method: "DELETE" });
    cargar();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reseñas y Testimonios</h1>
          <p className="text-gray-500 font-medium">Modera lo que dicen los clientes en tu web.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {testimonios.map((t) => (
            <div key={t.id} className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${t.activo ? 'bg-white border-green-100 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
              
              <div className="flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${t.activo ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                  {t.nombre.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{t.nombre}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < t.calificacion ? "fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic max-w-xl">"{t.mensaje}"</p>
                  <p className="text-xs text-gray-400 mt-2 font-mono">ID: {t.id.slice(-6)} • {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={() => toggleEstado(t.id, t.activo)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${t.activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-900 text-white hover:bg-black'}`}
                >
                  {t.activo ? <><Check size={14} /> Publicado</> : "Aprobar"}
                </button>
                <button 
                  onClick={() => borrar(t.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </div>
          ))}
          {testimonios.length === 0 && (
             <div className="text-center py-12 bg-gray-50 rounded-2xl border-dashed border-2 border-gray-200">
                <MessageSquare className="mx-auto text-gray-300 mb-2" size={40} />
                <p className="text-gray-400 font-medium">Aún no hay reseñas registradas.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}