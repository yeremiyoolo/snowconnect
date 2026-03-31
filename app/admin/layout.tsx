import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ShoppingBag, 
  Users, 
  LogOut, 
  MessageSquare,
  ShieldAlert,
  RefreshCcw,
  Wrench,
  MessageCircleQuestion,
  TicketPercent, 
  Zap,
  ChevronRight            
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-80 fixed inset-y-0 left-0 z-50 bg-card/80 backdrop-blur-xl border-r border-border shadow-lg shadow-black/5 flex flex-col transition-colors duration-300">
        
        {/* LOGO SNOWADMIN */}
        <div className="p-6 pb-2">
          <Link href="/" className="group block">
            <div className="flex items-center gap-3.5 bg-secondary/40 p-4 rounded-[2.5rem] border border-border/40 shadow-sm transition-all duration-500 hover:bg-secondary/80 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 active:scale-95">
              <div className="relative w-14 h-14 rounded-full bg-white p-0.5 flex items-center justify-center shadow-md border border-border/50 shrink-0 overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="SnowConnect" 
                  width={80} 
                  height={80} 
                  className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105" 
                  priority 
                />
              </div>
              <div className="flex flex-col leading-none flex-1 overflow-hidden">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black tracking-tighter text-foreground italic uppercase truncate">
                    Snow<span className="text-primary group-hover:animate-pulse">Admin</span>
                  </span>
                  <ChevronRight size={14} className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                </div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-70">
                  Control Core
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 px-6 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 mt-4 opacity-50">Menú Principal</p>
          <SidebarItem href="/admin" icon={<LayoutDashboard size={18} />} label="Resumen" />
          <SidebarItem href="/admin/productos" icon={<Package size={18} />} label="Inventario" />
          <SidebarItem href="/admin/ventas" icon={<ShoppingCart size={18} />} label="Ventas (Local)" />
          <SidebarItem href="/admin/ordenes" icon={<ShoppingBag size={18} />} label="Pedidos (Web)" />

          <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 mt-8 opacity-50">Servicios</p>
          <SidebarItem href="/admin/quotes" icon={<RefreshCcw size={18} />} label="Cotizaciones" />
          <SidebarItem href="/admin/reparaciones" icon={<Wrench size={18} />} label="Taller" />
          <SidebarItem href="/admin/soporte" icon={<MessageCircleQuestion size={18} />} label="Ayuda" />
          
          <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 mt-8 opacity-50">Gestión</p>
          <SidebarItem href="/admin/usuarios" icon={<Users size={18} />} label="Clientes" />

          <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 mt-8 opacity-50">Marketing</p>
          <SidebarItem href="/admin/cupones" icon={<TicketPercent size={18} />} label="Cupones" />
          <SidebarItem href="/admin/ofertas-flash" icon={<Zap size={18} />} label="Ofertas Flash" />
          <SidebarItem href="/admin/marketing/testimonios" icon={<MessageSquare size={18} />} label="Reseñas" />

          <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 mt-8 opacity-50">Seguridad</p>
          <SidebarItem href="/admin/auditoria" icon={<ShieldAlert size={18} />} label="Auditoría" />
        </nav>

        {/* PERFIL */}
        <div className="p-6 border-t border-border/50 bg-secondary/20 mt-auto">
          <div className="bg-card/50 rounded-3xl p-4 flex items-center gap-3 mb-4 border border-border/50 shadow-sm overflow-hidden">
             <div className="w-10 h-10 rounded-full bg-primary/10 shadow-inner flex items-center justify-center font-black text-primary text-xs border border-primary/20 shrink-0">
                {session.user.name?.[0] || "A"}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-black text-foreground truncate uppercase italic tracking-tighter leading-none">{session.user.name}</p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Master Admin</p>
             </div>
          </div>
          <Link href="/api/auth/signout" className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 active:scale-95">
            <LogOut size={14} /> Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* --- ÁREA DE CONTENIDO (Limpia sin buscador) --- */}
      <main className="flex-1 ml-80 transition-all duration-300">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 px-10 py-8 flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Panel de <span className="text-primary">Control</span></h1>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1.5">Bienvenido de vuelta, {session.user.name?.split(' ')[0]}</p>
            </div>
            
            {/* El buscador ha sido removido de aquí para un diseño más limpio */}
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sistema Operativo</span>
            </div>
        </header>

        <div className="px-10 pb-20 mt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3.5 px-5 py-3.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:shadow-sm transition-all duration-300 group border border-transparent hover:border-border/50">
      <span className="text-muted-foreground/50 group-hover:text-primary transition-all group-hover:scale-110">{icon}</span>
      {label}
    </Link>
  );
}