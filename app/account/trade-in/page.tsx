import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  RefreshCcw, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight,
  DollarSign
} from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function TradeInPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) redirect("/auth/login");

  // OBTENER COTIZACIONES REALES
  const quotes = await prisma.quoteRequest.findMany({
    where: { 
        user: { email: session.user.email } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-foreground">Mis Ventas (Trade-In)</h2>
            <p className="text-muted-foreground text-sm">Gestiona los equipos que estás vendiendo a SnowConnect.</p>
        </div>
        <Link href="/sell">
            <Button className="rounded-xl font-bold bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all">
                <RefreshCcw size={16} className="mr-2" /> Vender otro equipo
            </Button>
        </Link>
      </div>

      <div className="space-y-6">
        
        {quotes.length === 0 ? (
            // ESTADO VACÍO MEJORADO
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-3xl border border-border text-center shadow-sm">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 text-muted-foreground animate-pulse">
                    <Smartphone size={40} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Tu historial está vacío</h3>
                <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                    ¿Tienes un iPhone viejo en una gaveta? Cotízalo ahora y recibe dinero o crédito para uno nuevo.
                </p>
                <Link href="/sell">
                    <Button variant="outline" className="border-border text-foreground hover:bg-secondary font-bold">
                        Iniciar Cotización <ArrowRight size={16} className="ml-2" />
                    </Button>
                </Link>
            </div>
        ) : (
            // GRID DE TARJETAS
            <div className="grid grid-cols-1 gap-4">
                {quotes.map((quote) => (
                    <QuoteCard key={quote.id} quote={quote} />
                ))}
            </div>
        )}

      </div>
    </div>
  );
}

// Componente de Tarjeta
function QuoteCard({ quote }: { quote: any }) {
    
    // Configuración visual según el estado
    const statusConfig: any = {
        PENDING: { 
            color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", 
            icon: Clock, 
            label: "En Revisión" 
        },
        REVIEWED: { 
            color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", 
            icon: DollarSign, 
            label: "Oferta Disponible" 
        },
        COMPLETED: { 
            color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", 
            icon: CheckCircle2, 
            label: "Pagado" 
        },
        REJECTED: { 
            color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", 
            icon: XCircle, 
            label: "Rechazado" 
        },
    };

    const config = statusConfig[quote.status] || statusConfig["PENDING"];
    const StatusIcon = config.icon;

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative transition-all hover:border-primary/30 group">
            
            <div className="p-6 flex flex-col sm:flex-row gap-6">
                
                {/* IMAGEN DEL EQUIPO */}
                <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-secondary border border-border flex-shrink-0 flex items-center justify-center">
                    {quote.images && quote.images.length > 0 ? (
                        <Image src={quote.images[0]} alt={quote.model} fill className="object-cover transition-transform group-hover:scale-105" />
                    ) : (
                        <Smartphone className="text-muted-foreground/50" size={32} />
                    )}
                </div>

                {/* INFO PRINCIPAL */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">{quote.brand} {quote.model}</h3>
                            <p className="text-muted-foreground text-sm font-medium mt-1">
                                {quote.storage} • Condición: {quote.condition}
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground/60 mt-2 uppercase">
                                ID: #{quote.id.slice(-6)}
                            </p>
                        </div>
                        
                        {/* BADGE DE ESTADO */}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
                            <StatusIcon size={12} />
                            {config.label}
                        </div>
                    </div>

                    {/* FOOTER CONTEXTUAL */}
                    <div className="mt-4 pt-4 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        
                        {/* Mensaje según estado */}
                        {quote.status === "PENDING" && (
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Clock size={14} /> El equipo está analizando tus fotos.
                            </p>
                        )}
                        
                        {quote.status === "REVIEWED" && (
                             <div className="w-full flex items-center justify-between bg-purple-500/5 px-4 py-2 rounded-lg border border-purple-500/10">
                                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Oferta estimada:</span>
                                <span className="text-lg font-black text-foreground">
                                    RD$ {quote.finalPrice?.toLocaleString() || "Pendiente"}
                                </span>
                             </div>
                        )}

                        {quote.status === "COMPLETED" && (
                            <div className="w-full flex items-center justify-between">
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <CheckCircle2 size={14} /> Venta finalizada
                                </span>
                                <span className="text-xl font-black text-foreground">
                                    RD$ {quote.finalPrice?.toLocaleString()}
                                </span>
                            </div>
                        )}

                        {quote.status === "REJECTED" && (
                             <p className="text-xs text-red-600/80">
                                No pudimos aceptar este equipo. Revisa tu correo para más detalles.
                             </p>
                        )}

                        {/* Botón de Acción (Solo si está Reviewed) */}
                        {quote.status === "REVIEWED" && (
                            <Button size="sm" className="w-full sm:w-auto font-bold">
                                Ver Detalles
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}