import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { HelpCircle, Search, Plus, MessageCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaqCard } from "@/components/admin/soporte/faq-card";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

interface SupportPageProps {
  searchParams: Promise<{
    filter?: string;
    q?: string;
  }>;
}

export default async function AdminSoportePage({ searchParams }: SupportPageProps) {
  const params = await searchParams;
  const currentFilter = params?.filter || "ALL";
  const searchQuery = params?.q || "";

  // 1. Obtener datos
  const allFaqs = await prisma.faqItem.findMany({
    orderBy: { order: 'asc' }
  });

  // 2. Filtrado manual para las métricas
  const visibles = allFaqs.filter(f => f.isVisible);

  // 3. Construir query de búsqueda
  const whereClause: any = {};
  if (currentFilter !== "ALL") whereClause.category = currentFilter;
  if (searchQuery) {
    whereClause.OR = [
      { question: { contains: searchQuery, mode: "insensitive" } },
      { answer: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const faqs = await prisma.faqItem.findMany({
    where: whereClause,
    orderBy: { order: 'asc' }
  });

  const filtros = [
    { id: "ALL", label: "Todo" },
    { id: "GENERAL", label: "General" },
    { id: "VENTAS", label: "Ventas" },
    { id: "GARANTIA", label: "Garantía" },
    { id: "ENVIOS", label: "Envíos" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-[1600px] mx-auto">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Centro de <span className="text-primary">Soporte</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Gestiona la base de conocimientos y ayuda al cliente
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><Info size={12}/> FAQs Publicadas</p>
              <p className="text-2xl font-black text-foreground italic tracking-tighter mt-1">{visibles.length} Activas</p>
           </div>
           <Button className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs px-8 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
             <Plus size={18} className="mr-2" /> Nueva FAQ
           </Button>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-card p-4 rounded-[2rem] border border-border/50 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex bg-secondary/30 p-1.5 rounded-full overflow-x-auto w-full lg:w-auto">
          {filtros.map(f => (
            <Link key={f.id} href={`/admin/soporte?filter=${f.id}${searchQuery ? `&q=${searchQuery}` : ''}`}>
              <div className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer transition-all whitespace-nowrap ${currentFilter === f.id ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                {f.label}
              </div>
            </Link>
          ))}
        </div>

        <form method="GET" action="/admin/soporte" className="relative w-full lg:w-[400px]">
          {currentFilter !== "ALL" && <input type="hidden" name="filter" value={currentFilter} />}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            name="q" 
            defaultValue={searchQuery}
            placeholder="Buscar por palabra clave..." 
            className="pl-12 h-12 rounded-full bg-secondary/20 border-transparent focus:bg-background"
          />
        </form>
      </div>

      {/* LISTA DE FAQS */}
      {faqs.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[3rem] bg-card/30">
          <HelpCircle className="text-muted-foreground/30 mb-4" size={48} />
          <p className="text-lg font-black text-muted-foreground uppercase italic tracking-widest">No hay preguntas registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq) => (
            <FaqCard key={faq.id} faq={faq} />
          ))}
        </div>
      )}
    </div>
  );
}