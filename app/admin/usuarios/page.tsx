import { prisma } from "@/lib/prisma";
import { User, Mail, Calendar, Search, Smartphone, Award, ExternalLink, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserRoleButton from "./user-role-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

interface UsersPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminUsuariosPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const searchQuery = params?.q || "";

  // 1. Obtener usuarios con sus órdenes para calcular el Customer Lifetime Value (CLV)
  const users = await prisma.user.findMany({
    where: searchQuery ? {
      OR: [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
        { telefono: { contains: searchQuery } },
      ]
    } : undefined,
    include: {
      orders: { where: { status: "PAID" } },
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const totalUsuarios = await prisma.user.count();
  const usuariosVip = users.filter(u => u._count.orders >= 3).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-[1600px] mx-auto">
      
      {/* CABECERA Y MÉTRICAS */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase mb-1">
            Comunidad <span className="text-primary">SnowConnect</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-70">
            Base de datos de clientes y gestión de permisos
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] shadow-sm flex flex-col justify-center min-w-[160px]">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><User size={12}/> Registrados</p>
              <p className="text-2xl font-black text-foreground italic mt-1">{totalUsuarios}</p>
           </div>
           <div className="bg-card border border-border/50 px-6 py-4 rounded-[2rem] shadow-sm flex flex-col justify-center min-w-[160px]">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5"><Award size={12}/> Clientes VIP</p>
              <p className="text-2xl font-black text-primary italic mt-1">{usuariosVip}</p>
           </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-card p-4 rounded-[2.5rem] border border-border/50 shadow-sm">
        <form method="GET" action="/admin/usuarios" className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            name="q" 
            defaultValue={searchQuery}
            placeholder="Buscar por nombre, correo o teléfono..." 
            className="pl-14 h-16 rounded-full bg-secondary/20 border-transparent focus:bg-background text-lg"
          />
        </form>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-card border border-border/50 rounded-[3rem] overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-6 px-8 font-black uppercase text-[10px] tracking-widest">Usuario</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Contacto</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Actividad</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Rol</TableHead>
              <TableHead className="text-right px-8 font-black uppercase text-[10px] tracking-widest">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const totalGastado = user.orders.reduce((acc, o) => acc + o.total, 0);
              const isVIP = user._count.orders >= 3;

              return (
                <TableRow key={user.id} className="group hover:bg-secondary/10 transition-colors border-b-border/30">
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black uppercase tracking-tighter">
                          {user.name?.slice(0, 2) || "SC"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-black text-foreground uppercase italic tracking-tight flex items-center gap-2">
                          {user.name || "Usuario Web"}
{isVIP && <span title="Cliente VIP"><Award size={14} className="text-primary fill-primary" /></span>}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                          Miembro desde {new Date(user.createdAt).getFullYear()}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Mail size={12} className="text-muted-foreground" /> {user.email}
                      </div>
                      {user.telefono && (
                        <div className="flex items-center gap-2 text-xs font-bold text-primary">
                          <Smartphone size={12} /> {user.telefono}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-700 font-black text-[9px] uppercase tracking-widest">
                        Gastado: RD$ {totalGastado.toLocaleString()}
                      </Badge>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase ml-1">
                        {user._count.orders} compras exitosas
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <UserRoleButton userId={user.id} currentRole={user.role} />
                  </TableCell>

                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      {user.telefono && (
                        <a href={`https://wa.me/${user.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-green-600 hover:bg-green-50">
                            <MessageCircle size={18} />
                          </Button>
                        </a>
                      )}
                      <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-secondary">
                        <ExternalLink size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}