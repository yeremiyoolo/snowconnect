import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Wrench, CheckCircle2, AlertCircle, Search, Clock, BadgeDollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RepairCard } from "@/components/admin/reparaciones/repair-card";

export const dynamic = 'force-dynamic';

interface RepairsPageProps {
  searchParams: Promise<{
    filter?: string;
    q?: string;
  }>;
}

export default async function AdminReparacionesPage({ searchParams }: RepairsPageProps) {
  const params = await searchParams;
  const currentFilter = params?.filter || "ACTIVE";
  const searchQuery = params?.q || "";

  // 1. Obtener todos los tickets para las métricas globales
  const allTickets = await prisma.repairTicket.findMany({ include: { user: true } });

  const activos = allTickets.filter(t => ["PENDING", "REPAIRING", "WAITING_PARTS"].includes(t.status));
  const listos = allTickets.filter(t => t.status === "READY");
  const ingresosEst = allTickets.filter(t => t.status !== "CANCELLED").reduce((acc, t) => acc + (t.cost || 0), 0);

  // 2. Construir la consulta con filtros
  const whereClause: any = {};
  if (currentFilter === "ACTIVE") {
    whereClause.status = { in: ["PENDING", "REPAIRING", "WAITING_PARTS"] };
  } else if (currentFilter === "READY") {
    whereClause.status = "READY";
  } else if (currentFilter === "COMPLETED") {
    whereClause.status = { in: ["DELIVERED", "CANCELLED"] };
  }

  if (searchQuery) {
    whereClause.OR = [
      { ticketNumber: { contains: searchQuery, mode: "insensitive" } },
      { deviceModel: { contains: searchQuery, mode: "insensitive" } },
      { user: { name: { contains: searchQuery, mode: "insensitive" } } },
    ];
  }

  // 3. Traer los tickets filtrados
  const tickets = await prisma.repairTicket.findMany({
    where: whereClause,
    include: { user: true },
    orderBy: { updatedAt: "desc" },
  });

  const filtros = [
    { id: "ALL", label: "Todos" },
    { id: "ACTIVE", label: `En Taller (${activos.length})` },
    { id: "READY", label: `Listos (${listos.length})` },
    { id: "COMPLETED", label: "Entregados" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-[1600px] mx-auto">
      
      {/* CABECERA Y MÉTRICAS */}
      <div className="flex flex-col xl:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Centro de <span className="text-primary">Taller</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Diagnósticos, reparaciones y entregas
          </p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] min-w-[200px] shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><AlertCircle size={12}/> Trabajo Activo</p>
            <p className="text-2xl font-black text-orange-600 italic tracking-tighter mt-1">{activos.length} Equipos</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">Siendo reparados ahora</p>
          </div>
          <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] min-w-[200px] shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><BadgeDollarSign size={12}/> Dinero Proyectado</p>
            <p className="text-2xl font-black text-green-600 italic tracking-tighter mt-1">${ingresosEst.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">Costo total de tickets</p>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="bg-card p-4 rounded-[2rem] border border-border/50 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        
        <div className="flex bg-secondary/30 p-1.5 rounded-full overflow-x-auto w-full lg:w-auto">
          {filtros.map(f => (
            <Link key={f.id} href={`/admin/reparaciones?filter=${f.id}${searchQuery ? `&q=${searchQuery}` : ''}`}>
              <div className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer transition-all whitespace-nowrap ${currentFilter === f.id ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                {f.label}
              </div>
            </Link>
          ))}
        </div>

        <form method="GET" action="/admin/reparaciones" className="relative w-full lg:w-[400px]">
          {currentFilter !== "ACTIVE" && <input type="hidden" name="filter" value={currentFilter} />}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            name="q" 
            defaultValue={searchQuery}
            placeholder="Buscar ID, Cliente o Modelo..." 
            className="pl-12 h-12 rounded-full bg-secondary/20 border-transparent focus:bg-background"
          />
        </form>
      </div>

      {/* LISTA DE TICKETS */}
      {tickets.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[3rem] bg-card/30">
          <Wrench className="text-muted-foreground/30 mb-4" size={48} />
          <p className="text-lg font-black text-muted-foreground uppercase italic tracking-widest">No hay tickets en esta sección</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <RepairCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}