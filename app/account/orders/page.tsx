import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, Truck, CheckCircle, ExternalLink, Clock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login");

  // OBTENER PEDIDOS REALES
  const orders = await prisma.order.findMany({
    where: { user: { email: session.user.email } },
    include: { items: true }, 
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold text-foreground">Mis Pedidos</h2>
        <p className="text-muted-foreground text-sm">Rastrea tus compras y descarga facturas.</p>
      </div>

      <div className="space-y-6">
        
        {orders.length === 0 ? (
            // ESTADO VACÍO (Adaptado a Dark Mode)
            <div className="text-center py-16 bg-card rounded-3xl border border-border shadow-sm">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <ShoppingBag size={32} />
                </div>
                <h3 className="text-lg font-bold text-foreground">No has realizado pedidos</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6 text-sm">
                    Explora nuestro catálogo y encuentra tu próximo iPhone.
                </p>
                <Link href="/catalogo">
                    <Button className="rounded-xl font-bold px-6">
                        Ir al Catálogo
                    </Button>
                </Link>
            </div>
        ) : (
            // LISTA DE PEDIDOS
            orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))
        )}

      </div>
    </div>
  );
}

// Tarjeta de Pedido
function OrderCard({ order }: { order: any }) {
    
    // Configuración visual según estado (Colores adaptables con opacidad)
    const statusConfig: any = {
        PENDING: { 
            label: "Procesando", 
            style: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", 
            bar: "bg-yellow-500",
            icon: Clock, 
            progress: "w-1/4" 
        },
        PROCESSING: { 
            label: "Empacando", 
            style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", 
            bar: "bg-blue-500",
            icon: Package, 
            progress: "w-2/4" 
        },
        SHIPPED: { 
            label: "En Camino", 
            style: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", 
            bar: "bg-purple-500",
            icon: Truck, 
            progress: "w-3/4" 
        },
        DELIVERED: { 
            label: "Entregado", 
            style: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", 
            bar: "bg-green-500",
            icon: CheckCircle, 
            progress: "w-full" 
        },
    };

    const config = statusConfig[order.status] || statusConfig["PENDING"];
    const StatusIcon = config.icon;

    return (
        // CORRECCIÓN: bg-card y border-border
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
            
            {/* Header del Pedido */}
            <div className="bg-secondary/40 p-6 border-b border-border flex flex-wrap gap-4 justify-between items-center">
                <div className="flex gap-6 text-sm">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Pedido</p>
                        <p className="font-bold text-foreground">{order.orderNumber || `#${order.id.slice(-6).toUpperCase()}`}</p>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Fecha</p>
                        <p className="font-medium text-foreground">
                            {new Date(order.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Total</p>
                        <p className="font-black text-foreground">RD$ {order.total.toLocaleString()}</p>
                    </div>
                </div>
                {/* Botón Factura */}
                <button className="text-xs font-bold text-primary hover:underline border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-lg transition-colors hover:bg-primary/10">
                    Ver Factura
                </button>
            </div>

            <div className="p-6">
                {/* Barra de Progreso */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <StatusIcon size={18} className={config.style.split(' ')[1]} /> 
                        {/* Extraemos el color de texto del config style para el icono */}
                        
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${config.style}`}>
                            {config.label}
                        </span>
                        
                        {order.status === 'SHIPPED' && (
                            <span className="text-muted-foreground text-sm flex items-center gap-1">
                                • {order.carrier}
                            </span>
                        )}
                    </div>
                    
                    {/* Background de barra: bg-secondary */}
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full ${config.bar} ${config.progress} rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor] opacity-80`}></div>
                    </div>
                </div>

                {/* Lista de Productos */}
                <div className="space-y-4">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 bg-secondary rounded-xl overflow-hidden border border-border flex items-center justify-center shrink-0">
                                <Package size={20} className="text-muted-foreground" />
                                {/* Aquí iría la imagen real si existiera */}
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">{item.productName || item.modelo}</h3>
                                <p className="text-muted-foreground text-sm">
                                    Cant: {item.quantity} • RD$ {item.price.toLocaleString()}
                                </p>
                                {item.imei && (
                                    <p className="text-[10px] font-mono text-muted-foreground mt-1 bg-secondary inline-block px-1 rounded border border-border">
                                        IMEI: {item.imei}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Tracking Footer */}
            {order.trackingNumber && (
                <div className="bg-secondary/30 p-4 border-t border-border flex justify-end">
                    <Link href="#" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                        Rastrear Paquete <ExternalLink size={14} />
                    </Link>
                </div>
            )}
        </div>
    );
}