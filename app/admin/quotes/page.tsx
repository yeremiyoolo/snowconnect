import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from "next/link";
import { 
  Smartphone, User, Calendar, CheckCircle2, 
  XCircle, Clock, MessageCircle, ImageIcon, Search, Tag, Inbox
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateQuoteStatus } from "@/actions/admin/quote-actions";

export const dynamic = 'force-dynamic';

interface QuotesPageProps {
  searchParams: Promise<{
    filter?: string;
    q?: string;
  }>;
}

const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
    PENDING: { label: "En Revisión", color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20", icon: <Clock size={12}/> },
    COMPLETED: { label: "Comprado / Aceptado", color: "bg-green-500/10 text-green-700 border-green-500/20", icon: <CheckCircle2 size={12}/> },
    REJECTED: { label: "Rechazado", color: "bg-red-500/10 text-red-700 border-red-500/20", icon: <XCircle size={12}/> },
  };
  const config = configs[status] || configs.PENDING;
  return (
    <Badge className={`${config.color} border flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit`}>
      {config.icon} {config.label}
    </Badge>
  );
};

export default async function AdminQuotesPage({ searchParams }: QuotesPageProps) {
  const params = await searchParams;
  const currentFilter = params?.filter || "ALL";
  const searchQuery = params?.q || "";

  // 1. Obtener todas para métricas
  const allQuotes = await prisma.quoteRequest.findMany();
  const pendientes = allQuotes.filter(q => q.status === "PENDING");

  // 2. Construir Filtros
  const whereClause: any = {};
  if (currentFilter !== "ALL") {
    whereClause.status = currentFilter;
  }
  if (searchQuery) {
    whereClause.OR = [
      { model: { contains: searchQuery, mode: "insensitive" } },
      { customerName: { contains: searchQuery, mode: "insensitive" } },
      { customerPhone: { contains: searchQuery } },
    ];
  }

  // 3. Traer datos reales
  const quotes = await prisma.quoteRequest.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  const filtros = [
    { id: "ALL", label: "Todas" },
    { id: "PENDING", label: `Pendientes (${pendientes.length})` },
    { id: "COMPLETED", label: "Aceptadas" },
    { id: "REJECTED", label: "Rechazadas" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-[1600px] mx-auto">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Bandeja de <span className="text-primary">Cotizaciones</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Evalúa equipos de clientes, negocia y compra stock
          </p>
        </div>
      </div>

      {/* BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="bg-card p-4 rounded-[2rem] border border-border/50 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Pestañas / Tabs */}
        <div className="flex bg-secondary/30 p-1.5 rounded-full overflow-x-auto w-full lg:w-auto">
          {filtros.map(f => (
            <Link key={f.id} href={`/admin/quotes?filter=${f.id}${searchQuery ? `&q=${searchQuery}` : ''}`}>
              <div className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer transition-all whitespace-nowrap ${currentFilter === f.id ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                {f.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Buscador */}
        <form method="GET" action="/admin/quotes" className="relative w-full lg:w-[400px]">
          {currentFilter !== "ALL" && <input type="hidden" name="filter" value={currentFilter} />}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            name="q" 
            defaultValue={searchQuery}
            placeholder="Buscar por Modelo o Cliente..." 
            className="pl-12 h-12 rounded-full bg-secondary/20 border-transparent focus:bg-background"
          />
        </form>
      </div>

      {/* LISTA DE COTIZACIONES */}
      {quotes.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[3rem] bg-card/30">
          <Inbox className="text-muted-foreground/30 mb-4" size={48} />
          <p className="text-lg font-black text-muted-foreground uppercase italic tracking-widest">No hay solicitudes aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {quotes.map((quote) => {
            let cleanPhone = quote.customerPhone?.replace(/\D/g, '') || "";
            if (cleanPhone.length === 10) cleanPhone = `1${cleanPhone}`; 

            const whatsappText = `*¡Hola ${quote.customerName}!* 👋❄️\n\nLe escribimos de *SnowConnect* respecto a la cotización que solicitó para su *${quote.brand} ${quote.model}*.\n\nHemos revisado su solicitud y nos gustaría ofrecerle...`;
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;

            const handleApprove = updateQuoteStatus.bind(null, quote.id, "COMPLETED");
            const handleReject = updateQuoteStatus.bind(null, quote.id, "REJECTED");

            return (
              <div key={quote.id} className="bg-card border border-border/50 rounded-[2.5rem] p-6 lg:p-8 flex flex-col gap-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
                
                {/* CABECERA: ESTADO Y CLIENTE */}
                <div className="flex justify-between items-start gap-4 border-b border-border/50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1rem] bg-primary/10 text-primary flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-foreground tracking-tight">{quote.customerName}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-widest">
                         <span>{quote.customerPhone}</span>
                         <span>•</span>
                         <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={quote.status} />
                </div>

                {/* CUERPO: EQUIPO Y FOTOS */}
                <div className="flex flex-col sm:flex-row gap-6">
                  
                  {/* INFO EQUIPO */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1"><Smartphone size={12}/> Equipo Ofertado</p>
                      <p className="text-2xl font-black text-foreground italic tracking-tighter">{quote.brand} {quote.model}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                       <Badge variant="outline" className="bg-secondary/30 text-[10px] uppercase font-bold tracking-widest">
                         {quote.storage}
                       </Badge>
                       <Badge variant="outline" className="bg-secondary/30 text-[10px] uppercase font-bold tracking-widest">
                         Condición: {quote.condition}
                       </Badge>
                    </div>

                    <div className="bg-secondary/10 p-4 rounded-2xl border border-border/50 mt-4">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1.5"><Tag size={12}/> Detalles del Cliente</p>
                       <p className="text-xs font-medium text-foreground italic">"{quote.details || 'Sin detalles extra'}"</p>
                    </div>
                  </div>

                  {/* FOTOS */}
                  <div className="sm:w-32 flex flex-col gap-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1.5"><ImageIcon size={12}/> Evidencia</p>
                    <div className="flex sm:flex-col gap-2 overflow-auto">
                      {quote.images && quote.images.length > 0 ? (
                        quote.images.map((img, i) => (
                          <a key={i} href={img} target="_blank" rel="noreferrer" className="relative w-16 h-16 sm:w-full sm:h-20 rounded-xl overflow-hidden border border-border/50 hover:opacity-80 transition-opacity shrink-0">
                            <Image src={img} alt="Evidencia" fill className="object-cover" />
                          </a>
                        ))
                      ) : (
                        <div className="w-full h-20 rounded-xl bg-secondary/30 border border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground/50">
                          <ImageIcon size={16} className="mb-1"/>
                          <span className="text-[8px] font-bold uppercase tracking-widest">Sin fotos</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* ACCIONES */}
                <div className="border-t border-border/50 pt-6 mt-2 flex flex-col sm:flex-row gap-3">
                  
                  <a href={quote.customerPhone ? whatsappUrl : "#"} target="_blank" rel="noopener noreferrer" className="flex-[1.5]">
                    <Button className="w-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-black h-12 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 gap-2">
                      <MessageCircle size={16} /> Negociar por WhatsApp
                    </Button>
                  </a>

                  {quote.status === "PENDING" && (
                    <div className="flex flex-1 gap-2">
<form action={async () => { await handleApprove(); }} className="flex-1">
                          <Button type="submit" variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50 font-black h-12 rounded-xl text-[10px] uppercase tracking-widest gap-1.5 px-0">
                          <CheckCircle2 size={16} /> Aceptar
                        </Button>
                      </form>
<form action={async () => { await handleReject(); }} className="flex-1">
                          <Button type="submit" variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 font-black h-12 rounded-xl text-[10px] uppercase tracking-widest gap-1.5 px-0">
                          <XCircle size={16} /> Rechazar
                        </Button>
                      </form>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}