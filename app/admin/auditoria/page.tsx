import { prisma } from "@/lib/prisma";
import { 
  History, 
  User as UserIcon, 
  ShieldAlert, 
  Activity, 
  Search, 
  Calendar,
  Box,
  ShoppingCart,
  Settings,
  Database
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const dynamic = 'force-dynamic';

export default async function AdminAuditoriaPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 100 // Limitamos a los últimos 100 para no saturar
  });

  // Función para asignar iconos según la entidad
  const getEntityIcon = (entidad: string) => {
    switch (entidad.toUpperCase()) {
      case 'PRODUCTO': return <Box size={14} />;
      case 'ORDEN': case 'VENTA': return <ShoppingCart size={14} />;
      case 'USUARIO': return <UserIcon size={14} />;
      case 'SETTINGS': return <Settings size={14} />;
      default: return <Database size={14} />;
    }
  };

  // Función para colores de acciones
  const getActionColor = (accion: string) => {
    const a = accion.toUpperCase();
    if (a.includes('DELETE') || a.includes('ELIMINAR')) return "bg-red-500/10 text-red-600 border-red-500/20";
    if (a.includes('CREATE') || a.includes('CREAR')) return "bg-green-500/10 text-green-600 border-green-500/20";
    if (a.includes('UPDATE') || a.includes('ACTUALIZAR')) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 md:p-10 max-w-[1700px] mx-auto pb-32">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Logs de <span className="text-primary">Auditoría</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Registro histórico de movimientos y seguridad del sistema
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-card border border-border/50 px-8 py-5 rounded-[2.5rem] shadow-xl flex flex-col justify-center min-w-[180px]">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><Activity size={12}/> Eventos Hoy</p>
              <p className="text-3xl font-black text-foreground italic mt-1.5">{logs.length}</p>
           </div>
        </div>
      </div>

      {/* BUSCADOR RÁPIDO (Visual) */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <Input 
          placeholder="Filtrar actividad por acción, usuario o entidad..." 
          className="h-16 pl-16 rounded-[2rem] bg-card border-border/50 shadow-sm text-lg italic font-medium"
        />
      </div>

      {/* TABLA DE AUDITORÍA */}
      <div className="bg-card border border-border/50 rounded-[3rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="py-6 px-8 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Admin / Usuario</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Acción</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Entidad / ID</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Detalles del Cambio</TableHead>
              <TableHead className="text-right px-8 font-black uppercase text-[10px] tracking-widest text-muted-foreground text-primary">Fecha / Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="group hover:bg-secondary/10 transition-colors border-b-border/30">
                {/* USUARIO */}
                <TableCell className="py-5 px-8">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-border/50">
                      <AvatarImage src={log.user.image || ""} />
                      <AvatarFallback className="font-black text-xs bg-primary/10 text-primary">
                        {log.user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-black text-xs uppercase italic text-foreground leading-none">{log.user.name}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">ID: {log.userId.slice(-6)}</p>
                    </div>
                  </div>
                </TableCell>

                {/* ACCIÓN */}
                <TableCell>
                  <Badge className={`rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest border ${getActionColor(log.accion)}`}>
                    {log.accion}
                  </Badge>
                </TableCell>

                {/* ENTIDAD */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-secondary/50 rounded-lg text-muted-foreground">
                      {getEntityIcon(log.entidad)}
                    </div>
                    <div>
                      <p className="font-bold text-[10px] uppercase tracking-tighter">{log.entidad}</p>
                      <p className="text-[9px] font-medium text-muted-foreground font-mono">#{log.entidadId.slice(-8)}</p>
                    </div>
                  </div>
                </TableCell>

                {/* DETALLES */}
                <TableCell className="max-w-[300px]">
                  <p className="text-xs font-medium text-muted-foreground italic leading-relaxed line-clamp-2">
                    {log.detalles}
                  </p>
                </TableCell>

                {/* FECHA */}
                <TableCell className="text-right px-8">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-foreground italic flex items-center justify-end gap-1.5">
                      <Calendar size={12} className="text-primary"/> 
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {logs.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <History size={48} className="mb-4" />
            <p className="font-black uppercase text-xs tracking-widest">No hay registros de actividad aún</p>
          </div>
        )}
      </div>

    </div>
  );
}