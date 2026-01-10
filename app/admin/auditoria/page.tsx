"use client";

import { useEffect, useState } from "react";
import { History, ShieldAlert, User, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shadow-sm">
            <ShieldAlert size={24} />
          </div>
          <div>
             <h1 className="text-3xl font-black text-gray-900 tracking-tight">Registro de Auditoría</h1>
             <p className="text-gray-500 font-medium">Movimientos sensibles y seguridad interna.</p>
          </div>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border text-xs font-bold text-gray-500 shadow-sm">
          {logs.length} Movimientos recientes
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400 flex flex-col items-center">
            <Loader2 className="animate-spin mb-2" />
            Cargando registros de seguridad...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-20 text-center text-gray-400 flex flex-col items-center">
            <History className="mb-4 text-gray-200" size={64} />
            <h3 className="text-lg font-bold text-gray-900">Sin movimientos</h3>
            <p>No hay registros de auditoría aún en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-xs uppercase text-gray-400 font-bold tracking-wider">
                <tr>
                  <th className="p-6">Usuario (Staff)</th>
                  <th className="p-6">Acción</th>
                  <th className="p-6">Detalles del Cambio</th>
                  <th className="p-6 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs border border-gray-200 uppercase">
                          {log.user?.name?.[0] || <User size={14} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{log.user?.name || "Desconocido"}</p>
                          <p className="text-[10px] text-gray-400">{log.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider
                        ${log.accion === 'CREAR' ? 'bg-green-100 text-green-700' : 
                          log.accion === 'EDITAR' ? 'bg-blue-100 text-blue-700' : 
                          log.accion === 'ELIMINAR' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {log.accion}
                      </span>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{log.entidad}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-start gap-2 max-w-md">
                        <FileText size={16} className="text-gray-300 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">{log.detalles}</p>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {format(new Date(log.createdAt), "dd MMM, yyyy", { locale: es })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(log.createdAt), "hh:mm a")}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}