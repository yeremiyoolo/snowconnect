"use client";

import { useState } from "react";
import { updateRepairTicket } from "@/app/actions/admin/repair-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, MessageCircle, User, Smartphone, AlertCircle, DollarSign, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export function RepairCard({ ticket }: { ticket: any }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateRepairTicket(formData);
    setLoading(false);

    if (res.success) {
      toast.success("Diagnóstico actualizado con éxito");
    } else {
      toast.error(res.error || "Hubo un error al guardar");
    }
  }

  const statusColors: any = {
    PENDING: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    REPAIRING: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    WAITING_PARTS: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    READY: "bg-green-500/10 text-green-700 border-green-500/20",
    DELIVERED: "bg-zinc-500/10 text-zinc-700 border-zinc-500/20",
    CANCELLED: "bg-red-500/10 text-red-700 border-red-500/20",
  };

  const statusLabels: any = {
    PENDING: "Recibido / Pendiente",
    REPAIRING: "En Taller",
    WAITING_PARTS: "Esperando Piezas",
    READY: "Listo para Entrega",
    DELIVERED: "Entregado al Cliente",
    CANCELLED: "Cancelado",
  };

  let cleanPhone = ticket.user?.telefono?.replace(/\D/g, '') || "";
  if (cleanPhone.length === 10) cleanPhone = `1${cleanPhone}`; 
  const whatsappText = `*¡Hola ${ticket.user?.name}!* 👋❄️\n\nLe escribimos de *SnowConnect* respecto a su equipo en reparación: *${ticket.deviceModel}* (Ticket #${ticket.ticketNumber}).\n\nEl estado actual es: *${statusLabels[ticket.status]}*.\n\nCosto estimado: RD$ ${ticket.cost?.toLocaleString() || "Por definir"}\n\nCualquier duda, estamos a su orden.`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 lg:p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col xl:flex-row gap-8 group">
      
      {/* LADO IZQUIERDO: Info del Cliente y Falla */}
      <div className="flex-1 space-y-6">
        
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <Badge className={cn("border flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", statusColors[ticket.status] || statusColors.PENDING)}>
            {statusLabels[ticket.status]}
          </Badge>
          <span className="text-[10px] font-black bg-secondary px-3 py-1 rounded-full uppercase tracking-widest text-muted-foreground">
            Ticket #{ticket.ticketNumber}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[1.2rem] bg-primary/10 text-primary flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Propietario</p>
            <h3 className="text-xl font-black text-foreground tracking-tight">{ticket.user?.name || "Sin Nombre"}</h3>
            <p className="text-xs font-bold text-muted-foreground">{ticket.user?.telefono || ticket.user?.email}</p>
          </div>
        </div>

        <div className="bg-secondary/10 rounded-[1.5rem] p-5 border border-border/50 space-y-4">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1"><Smartphone size={12}/> Equipo a Reparar</p>
            <p className="text-2xl font-black text-foreground italic tracking-tighter uppercase">{ticket.deviceModel}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1"><AlertCircle size={12}/> Problema Reportado</p>
            <p className="text-sm font-medium text-foreground italic">"{ticket.issue}"</p>
          </div>
        </div>

      </div>

      {/* LADO DERECHO: Formulario de Actualización */}
      <div className="flex-[1.5] border-t xl:border-t-0 xl:border-l border-border/50 pt-6 xl:pt-0 xl:pl-8">
        <form onSubmit={handleSubmit} className="h-full flex flex-col gap-6">
          <input type="hidden" name="id" value={ticket.id} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cambiar Estado</label>
              <select 
                name="status"
                defaultValue={ticket.status}
                className="w-full h-12 rounded-xl bg-background border border-border/50 text-sm font-bold px-4 focus:ring-2 focus:ring-primary transition-all outline-none uppercase tracking-tight"
              >
                <option value="PENDING">Recibido / Pendiente</option>
                <option value="REPAIRING">En Taller</option>
                <option value="WAITING_PARTS">Esperando Piezas</option>
                <option value="READY">Listo para Entrega</option>
                <option value="DELIVERED">Entregado al Cliente</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Costo a Cobrar (RD$)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  name="cost"
                  type="number"
                  defaultValue={ticket.cost || 0}
                  className="pl-10 h-12 rounded-xl font-black text-lg bg-background border-border/50 focus:border-primary"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Notas Clínicas (Visibles al cliente)</label>
            <Textarea 
              name="notes"
              defaultValue={ticket.notes || ""}
              placeholder="Detalla qué piezas se cambiaron, diagnósticos o indicaciones para el cliente..."
              className="flex-1 min-h-[100px] rounded-xl bg-background border-border/50 resize-none text-sm p-4 focus:border-primary"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {ticket.user?.telefono ? (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button type="button" className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-black h-12 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 gap-2">
                  <MessageCircle size={16} /> Notificar
                </Button>
              </a>
            ) : (
              <Button type="button" disabled className="w-full sm:w-auto bg-secondary text-muted-foreground font-black h-12 rounded-xl text-[10px] uppercase tracking-widest gap-2">
                <MessageCircle size={16} /> Sin Teléfono
              </Button>
            )}

            <Button type="submit" disabled={loading} className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 gap-2">
              <Save size={16} /> {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}