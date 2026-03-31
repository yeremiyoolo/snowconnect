"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMisTickets } from "@/app/actions/client/repair-actions";
import { 
  Wrench, 
  Activity, 
  Smartphone, 
  Calendar, 
  DollarSign, 
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// 1. EL TRADUCTOR DE ESTADOS (Adaptado para modo claro y oscuro)
// ------------------------------------------------------------------
const getStatusInfo = (status: string) => {
  // Explicación: Definimos colores suaves para modo claro y
  // colores oscuros y bordes sutiles con 'dark:' para modo negro.
  switch (status) {
    case "PENDING": 
      return { 
        text: "Pendiente / Recibido", 
        color: "text-yellow-700 bg-yellow-100 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900" 
      };
    case "REPAIRING": 
      return { 
        text: "En Reparación en Taller", 
        color: "text-blue-700 bg-blue-100 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900" 
      };
    case "WAITING_PARTS": 
      return { 
        text: "Esperando Piezas", 
        color: "text-orange-700 bg-orange-100 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-900" 
      };
    case "READY": 
      return { 
        text: "Listo para Entrega", 
        color: "text-green-700 bg-green-100 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900" 
      };
    case "DELIVERED": 
      return { 
        text: "Entregado", 
        color: "text-zinc-700 bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700" 
      };
    case "CANCELLED": 
      return { 
        text: "Cancelado", 
        color: "text-red-700 bg-red-100 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900" 
      };
    default: 
      return { 
        text: "Pendiente / Recibido", 
        color: "text-yellow-700 bg-yellow-100 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900" 
      };
  }
};

export default function MisReparacionesPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMisTickets = async () => {
      if (session?.user?.email) {
        const data = await getMisTickets(session.user.email);
        setTickets(data);
      }
      setLoading(false);
    };

    if (session) {
      cargarMisTickets();
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // Explicación: min-h-screen y bg-background aseguran que todo el fondo
    // de la página cambie a negro si está activo el modo oscuro.
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-background text-foreground">
      
      {/* Título adaptable */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
          Mis Reparaciones
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">
          Da seguimiento al estado de tus equipos en nuestro taller.
        </p>
      </div>

      {tickets.length === 0 ? (
        // Estado vacío adaptable (bg-white -> bg-zinc-900)
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-zinc-400">
            <Wrench size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No tienes reparaciones activas</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            Cuando dejes un equipo en nuestra tienda para diagnóstico o reparación, aparecerá aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => {
            const costo = ticket.cost || 0;
            const notas = ticket.notes || "";
            const fecha = ticket.createdAt ? new Date(ticket.createdAt) : new Date();
            const estado = getStatusInfo(ticket.status);

            return (
              // 🔥 TARJETA DEL TICKET ADAPTABLE 🔥
              // bg-white -> dark:bg-zinc-900
              // border-zinc-200 -> dark:border-zinc-800
              <div key={ticket.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all">
                
                {/* Cabecera Adaptable (border-zinc-100 -> dark:border-zinc-800) */}
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* El icono negro se ve bien en ambos, pero lo ajustamos un poco */}
                    <div className="w-12 h-12 rounded-2xl bg-black dark:bg-zinc-800 flex items-center justify-center text-white shadow-lg">
                      <Wrench size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Ticket ID</h3>
                      {/* Texto ID: text-zinc-900 -> dark:text-white */}
                      <p className="font-mono font-black text-zinc-900 dark:text-white text-lg">{ticket.ticketNumber || ticket.id}</p>
                    </div>
                  </div>
                  
                  {/* Etiqueta de color dinámica (Ya tiene el 'dark:' adentro) */}
                  <div className={cn("px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest flex items-center gap-2 w-fit", estado.color)}>
                     <Activity size={14} className={ticket.status === "READY" || ticket.status === "DELIVERED" ? "" : "animate-pulse"} />
                     {estado.text}
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="space-y-6">
                    <div>
                      {/* Textos secundarios: text-zinc-400 (está bien) */}
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                         <Smartphone size={14} /> Equipo Recibido
                      </span>
                      {/* Texto principal adaptable */}
                      <p className="font-bold text-zinc-900 dark:text-white capitalize">{ticket.deviceModel}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{ticket.issue}</p>
                    </div>

                    <div className="flex gap-8">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Calendar size={14} /> Entrada
                        </span>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {fecha.toLocaleDateString("es-DO", { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                          <DollarSign size={14} /> Costo Estimado
                        </span>
                        {/* Costo: text-zinc-500 -> dark:text-zinc-400 (El rojo se queda igual) */}
                        <p className={cn("font-bold", costo > 0 ? "text-red-600" : "text-zinc-500 dark:text-zinc-400")}>
                          {costo > 0 ? `RD$${costo.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "Pendiente"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CAJA DE NOTAS ADAPTABLE */}
                  {/* bg-zinc-50 -> dark:bg-zinc-800 */}
                  {/* border-zinc-100 -> dark:border-zinc-700 */}
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-700 flex flex-col h-full">
                    {/* Texto notas adaptable */}
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                      <MessageSquare size={14} /> Notas del Técnico
                    </span>
                    
                    {notas !== "" ? (
                      <p className="text-sm text-zinc-700 dark:text-zinc-200 font-medium leading-relaxed italic">
                        "{notas}"
                      </p>
                    ) : (
                      // Placeholder adaptable
                      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                         <MessageSquare size={24} className="text-zinc-400" />
                         <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                           El técnico no ha agregado notas adicionales por el momento.
                         </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}