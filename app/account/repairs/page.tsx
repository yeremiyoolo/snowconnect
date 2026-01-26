import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  Wrench, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Smartphone, 
  ArrowRight 
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RepairsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) redirect("/auth/login");

  // 1. BUSCAR TICKETS REALES EN LA DB
  const tickets = await prisma.repairTicket.findMany({
    where: { 
        user: { email: session.user.email } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Reparaciones (Taller)</h2>
        <p className="text-muted-foreground text-sm">Seguimiento en tiempo real de tus equipos en servicio técnico.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {tickets.length === 0 ? (
            // ESTADO VACÍO (Sin reparaciones)
            <div className="bg-card border-2 border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                    <Wrench size={32} />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">Historial limpio</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 leading-relaxed">
                    No tienes equipos en el taller actualmente. Si necesitas una reparación, visita nuestra tienda.
                </p>
                <Link href="/servicios">
                    <Button variant="outline" className="font-bold border-border text-foreground hover:bg-secondary">
                        Ver precios de servicios <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        ) : (
            // LISTA DE TICKETS REALES
            tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
            ))
        )}

      </div>
    </div>
  );
}

// Componente visual de la tarjeta
function TicketCard({ ticket }: { ticket: any }) {
    
    // Configuración de colores según el estado
    const statusConfig: any = {
        RECEIVED: { 
            label: "Recibido", 
            style: "bg-secondary text-muted-foreground border-border", 
            icon: Clock 
        },
        DIAGNOSING: { 
            label: "Diagnosticando", 
            style: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", 
            icon: Smartphone 
        },
        REPAIRING: { 
            label: "En Reparación", 
            style: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 animate-pulse", 
            icon: Wrench 
        },
        READY: { 
            label: "Listo para retirar", 
            style: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", 
            icon: CheckCircle2 
        },
    };

    const config = statusConfig[ticket.status] || statusConfig["RECEIVED"];
    const StatusIcon = config.icon;

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-all hover:border-primary/30 group">
            
            {/* Header del Ticket */}
            <div className="bg-secondary/30 p-6 border-b border-border flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-card border border-border rounded-lg text-muted-foreground shadow-sm">
                        <Wrench size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ticket ID</p>
                        <p className="font-bold text-foreground font-mono">{ticket.ticketNumber || `#${ticket.id.slice(-6)}`}</p>
                    </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 border ${config.style}`}>
                    <StatusIcon size={14} />
                    {config.label}
                </span>
            </div>
            
            <div className="p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-foreground mb-1">{ticket.deviceModel}</h3>
                    <p className="text-sm font-bold text-muted-foreground">{ticket.issue}</p>
                </div>

                <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 text-sm text-muted-foreground italic mb-6">
                    "{ticket.notes || "El técnico no ha agregado notas adicionales por el momento."}"
                </div>
                
                {/* Detalles Técnicos Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-secondary/10 p-4 rounded-xl mb-6 border border-border/50">
                    <div>
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-1">Entrada</p>
                        <p className="font-bold text-foreground">
                            {new Date(ticket.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-1">Costo Estimado</p>
                        <p className="font-bold text-foreground">
                            {ticket.cost ? `RD$ ${ticket.cost.toLocaleString()}` : "Pendiente"}
                        </p>
                    </div>
                     <div className="col-span-2">
                        <p className="text-muted-foreground text-[10px] uppercase font-bold mb-1">Diagnóstico Actual</p>
                        <p className="font-bold text-foreground truncate">
                            {ticket.status === 'RECEIVED' ? 'En espera de revisión' : 'Proceso iniciado por taller'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                        href={`https://wa.me/18290000000?text=Hola, quiero saber sobre mi ticket ${ticket.ticketNumber}`} 
                        target="_blank"
                        className="w-full"
                    >
                        <Button className="w-full font-bold bg-foreground text-background hover:bg-foreground/90 gap-2 h-11 rounded-xl">
                            <MessageSquare size={18} />
                            Consultar al Técnico
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}