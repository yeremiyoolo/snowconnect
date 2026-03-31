import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  User, Calendar, ShoppingBag, Truck, 
  CheckCircle2, XCircle, Clock, MessageCircle, Search, 
  DollarSign, PackageX, Smartphone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cancelOrder, completeOrderSale } from "@/app/actions/admin/orders";

export const dynamic = 'force-dynamic';

interface OrdersPageProps {
  searchParams: Promise<{
    filter?: string;
    q?: string;
  }>;
}

const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
    PENDING: { label: "Pendiente / Reservado", color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20", icon: <Clock size={12}/> },
    PAID: { label: "Venta Registrada", color: "bg-green-500/10 text-green-700 border-green-500/20", icon: <CheckCircle2 size={12}/> },
    SHIPPED: { label: "Enviado", color: "bg-blue-500/10 text-blue-700 border-blue-500/20", icon: <Truck size={12}/> },
    CANCELLED: { label: "Cancelado / Liberado", color: "bg-red-500/10 text-red-700 border-red-500/20", icon: <XCircle size={12}/> },
  };
  const config = configs[status] || configs.PENDING;
  return (
    <Badge className={`${config.color} border flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit`}>
      {config.icon} {config.label}
    </Badge>
  );
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const currentFilter = params?.filter || "ALL";
  const searchQuery = params?.q || "";

  // 1. Obtener todas las órdenes para las métricas globales
  const allOrders = await prisma.order.findMany({
    include: { items: true },
  });

  const pendientes = allOrders.filter(o => o.status === "PENDING");
  const pagados = allOrders.filter(o => o.status === "PAID");
  
  const dineroPendiente = pendientes.reduce((acc, o) => acc + o.total, 0);
  const dineroCobrado = pagados.reduce((acc, o) => acc + o.total, 0);

  // 2. Construir la consulta con filtros
  const whereClause: any = {};
  if (currentFilter !== "ALL") {
    whereClause.status = currentFilter;
  }
  if (searchQuery) {
    whereClause.OR = [
      { orderNumber: { contains: searchQuery, mode: "insensitive" } },
      { user: { name: { contains: searchQuery, mode: "insensitive" } } },
      { phone: { contains: searchQuery } },
    ];
  }

  // 3. Traer las órdenes filtradas
  const orders = await prisma.order.findMany({
    where: whereClause,
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const filtros = [
    { id: "ALL", label: "Todas" },
    { id: "PENDING", label: "Pendientes" },
    { id: "PAID", label: "Pagadas" },
    { id: "CANCELLED", label: "Canceladas" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-[1600px] mx-auto">
      
      {/* CABECERA Y MÉTRICAS */}
      <div className="flex flex-col xl:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Gestión de <span className="text-primary">Pedidos</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Control de reservas web, liberaciones y confirmación de ventas
          </p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] min-w-[200px] shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><Clock size={12}/> Por Cobrar</p>
            <p className="text-2xl font-black text-yellow-600 italic tracking-tighter mt-1">${dineroPendiente.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">{pendientes.length} equipos reservados</p>
          </div>
          <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] min-w-[200px] shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12}/> Cobrado (Web)</p>
            <p className="text-2xl font-black text-green-600 italic tracking-tighter mt-1">${dineroCobrado.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">{pagados.length} ventas cerradas</p>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="bg-card p-4 rounded-[2rem] border border-border/50 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Pestañas / Tabs */}
        <div className="flex bg-secondary/30 p-1.5 rounded-full overflow-x-auto w-full lg:w-auto">
          {filtros.map(f => (
            <Link key={f.id} href={`/admin/ordenes?filter=${f.id}${searchQuery ? `&q=${searchQuery}` : ''}`}>
              <div className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer transition-all whitespace-nowrap ${currentFilter === f.id ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                {f.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Buscador */}
        <form method="GET" action="/admin/ordenes" className="relative w-full lg:w-[400px]">
          {currentFilter !== "ALL" && <input type="hidden" name="filter" value={currentFilter} />}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            name="q" 
            defaultValue={searchQuery}
            placeholder="Buscar por # Orden o Cliente..." 
            className="pl-12 h-12 rounded-full bg-secondary/20 border-transparent focus:bg-background"
          />
        </form>
      </div>

      {/* LISTA DE ÓRDENES */}
      {orders.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[3rem] bg-card/30">
          <PackageX className="text-muted-foreground/30 mb-4" size={48} />
          <p className="text-lg font-black text-muted-foreground uppercase italic tracking-widest">No se encontraron pedidos</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            let cleanPhone = order.phone?.replace(/\D/g, '') || "";
            if (cleanPhone.length === 10) cleanPhone = `1${cleanPhone}`; 

            const orderNum = order.orderNumber || order.id.slice(-6).toUpperCase();
            const itemsList = (order.items as any[]).map(i => `- ${i.productName} (x${i.quantity})`).join('\n');
            
            const whatsappText = `*¡Hola ${order.user?.name}!* 👋❄️\n\nLe escribimos de *SnowConnect* respecto a su reserva *#${orderNum}*.\n\n📦 *Equipos:*\n${itemsList}\n💰 *Total:* RD$ ${order.total.toLocaleString()}\n\n¿Desea coordinar el pago y la entrega para liberar su equipo? Quedamos a su orden.`;
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;

            const handleCancel = cancelOrder.bind(null, order.id);
            const handleComplete = completeOrderSale.bind(null, order.id);

            return (
              <div key={order.id} className="bg-card border border-border/50 rounded-[2.5rem] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
                
                {/* INFO PRINCIPAL (Izquierda) */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="text-[10px] font-black bg-secondary px-3 py-1 rounded-full uppercase tracking-widest text-muted-foreground">#{orderNum}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-primary/10 text-primary flex items-center justify-center">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">{order.user?.name || "Usuario Web"}</h3>
                      <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                         {order.phone && <span>• Tel: {order.phone}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EQUIPOS (Centro) */}
                <div className="flex-1 bg-secondary/10 rounded-[1.5rem] p-5 border border-border/50">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5"><Smartphone size={12}/> Equipos Reservados</p>
                  <div className="space-y-3">
                    {(order.items as any[]).map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-foreground line-clamp-1 pr-4 uppercase italic tracking-tight">{item.productName}</span>
                        <span className="font-black text-primary whitespace-nowrap">RD$ {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACCIONES Y TOTAL (Derecha) */}
                <div className="flex-1 flex flex-col justify-between items-end gap-6 border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-8">
                  
                  <div className="text-right w-full">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Monto Total</p>
                    <p className="text-4xl font-black text-foreground tracking-tighter italic">RD$ {order.total.toLocaleString()}</p>
                  </div>

                  <div className="w-full flex flex-col sm:flex-row lg:flex-col gap-2">
                    {order.status === "PENDING" ? (
                      <>
                        <a href={order.phone ? whatsappUrl : "#"} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-black h-12 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 gap-2">
                            <MessageCircle size={16} /> Escribir por WhatsApp
                          </Button>
                        </a>
                        <div className="flex gap-2 w-full">
                          <form action={handleComplete} className="flex-1">
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-xl text-[10px] uppercase tracking-widest shadow-lg gap-1.5">
                              <CheckCircle2 size={16} /> Aprobar
                            </Button>
                          </form>
                          <form action={handleCancel} className="flex-1">
                            <Button type="submit" variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 font-black h-12 rounded-xl text-[10px] uppercase tracking-widest gap-1.5">
                              <XCircle size={16} /> Cancelar
                            </Button>
                          </form>
                        </div>
                      </>
                    ) : (
                      <div className="w-full bg-secondary/30 border border-border/50 p-4 rounded-xl text-center">
                        <p className="text-xs font-black uppercase text-muted-foreground tracking-widest flex items-center justify-center gap-2">
                          {order.status === "PAID" ? <><CheckCircle2 size={16} className="text-green-500"/> Venta Cerrada</> : <><XCircle size={16} className="text-red-500"/> Pedido Cancelado</>}
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