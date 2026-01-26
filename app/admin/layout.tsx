import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Search,
  MessageSquare,
  ShieldAlert,
  RefreshCcw,
  Wrench,
  MessageCircleQuestion 
} from "lucide-react";
import { CommandMenu } from "@/components/admin/command-menu"; 

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
      <aside className="w-72 fixed inset-y-0 left-0 z-50 bg-card/80 backdrop-blur-xl border-r border-border shadow-lg shadow-black/5 flex flex-col transition-colors duration-300">
        
        {/* Header del Sidebar */}
        <div className="p-8 pb-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-border shadow-sm group-hover:shadow-md transition-all duration-300 bg-background flex items-center justify-center">
              <Image src="/logo.png" alt="SnowConnect" fill className="object-cover scale-110" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-foreground uppercase transition-colors">
                Snow<span className="text-muted-foreground">Admin</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-6 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
          
          <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Menu Principal</p>
          <SidebarItem href="/admin" icon={<LayoutDashboard size={18} />} label="Resumen" />
          <SidebarItem href="/admin/productos" icon={<Package size={18} />} label="Inventario" />
          <SidebarItem href="/admin/ventas" icon={<ShoppingCart size={18} />} label="Ventas" />

          {/* SECCIÓN SERVICIOS (REORDENADA) */}
          <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-6">Servicios</p>
          
          {/* 1. Trade-In */}
          <SidebarItem href="/admin/quotes" icon={<RefreshCcw size={18} />} label="Cotizaciones (Trade-In)" />
          
          {/* 2. Taller */}
          <SidebarItem href="/admin/reparaciones" icon={<Wrench size={18} />} label="Taller (Hardware)" />
          
          {/* 3. Soporte */}
          <SidebarItem href="/admin/soporte" icon={<MessageCircleQuestion size={18} />} label="Mesa de Ayuda" />
          

          {/* SECCIÓN GESTIÓN */}
          <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-6">Gestión</p>
          <SidebarItem href="/admin/usuarios" icon={<Users size={18} />} label="Clientes & Staff" />

          {/* SECCIÓN MARKETING */}
          <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-6">Marketing</p>
          <SidebarItem href="/admin/marketing/testimonios" icon={<MessageSquare size={18} />} label="Reseñas" />

          {/* SECCIÓN SEGURIDAD */}
          <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-6">Seguridad</p>
          <SidebarItem href="/admin/auditoria" icon={<ShieldAlert size={18} />} label="Auditoría Logs" />
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-6 border-t border-border">
          <div className="bg-secondary/50 rounded-2xl p-4 flex items-center gap-3 mb-4 border border-border/50">
             <div className="w-10 h-10 rounded-full bg-background shadow-sm flex items-center justify-center font-bold text-foreground text-sm border border-border">
                {session.user.name?.[0] || "A"}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">Administrador</p>
             </div>
          </div>

          <Link 
             href="/api/auth/signout"
             className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 ml-72">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-transparent dark:border-border/40 px-10 py-6 flex justify-between items-center transition-all duration-300">
            <div>
               <h1 className="text-2xl font-black text-foreground tracking-tight">Panel de Control</h1>
               <p className="text-sm text-muted-foreground font-medium">Bienvenido de vuelta, {session.user.name?.split(' ')[0]}</p>
            </div>
            
            <div className="w-full max-w-md">
                <div className="bg-card border border-border shadow-sm rounded-full px-4 py-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Search size={16} className="text-muted-foreground" />
                    <div className="w-full"><CommandMenu /></div>
                </div>
            </div>
        </header>

        <div className="px-10 pb-10 mt-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper para los botones del menú
function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-5 py-3.5 rounded-[1.2rem] text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary hover:shadow-sm transition-all duration-200 group border border-transparent hover:border-border/50"
    >
      <span className="text-muted-foreground/70 group-hover:text-primary transition-colors group-hover:scale-110 transform duration-200">
        {icon}
      </span>
      {label}
    </Link>
  );
}