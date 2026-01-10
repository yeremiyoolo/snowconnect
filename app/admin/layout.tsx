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
  ShieldAlert // <--- NUEVO ICONO PARA AUDITORÍA
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
    // FONDO: Usamos el mismo #FBFBFD de tu landing page
    <div className="flex min-h-screen bg-[#FBFBFD] font-sans text-gray-900">
      
      {/* --- SIDEBAR PREMIUM (Light) --- */}
      <aside className="w-72 fixed inset-y-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-[2px_0_20px_rgba(0,0,0,0.02)] flex flex-col">
        
        {/* Header del Sidebar */}
        <div className="p-8 pb-4">
          <Link href="/" className="flex items-center gap-3 group">
             {/* Logo con sombra suave igual que en el home */}
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
              <Image src="/logo.png" alt="SnowConnect" fill className="object-cover scale-110" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-gray-900 uppercase">
                Snow<span className="text-gray-400">Admin</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navegación Estilo "Cápsula" */}
        <nav className="flex-1 px-6 space-y-1.5 mt-6 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Menu Principal</p>
          
          <SidebarItem href="/admin" icon={<LayoutDashboard size={18} />} label="Resumen" />
          <SidebarItem href="/admin/productos" icon={<Package size={18} />} label="Inventario" />
          <SidebarItem href="/admin/ventas" icon={<ShoppingCart size={18} />} label="Ventas" />
          <SidebarItem href="/admin/usuarios" icon={<Users size={18} />} label="Clientes & Staff" />

          {/* SECCIÓN MARKETING */}
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-6">Marketing</p>
          <SidebarItem href="/admin/marketing/testimonios" icon={<MessageSquare size={18} />} label="Reseñas" />

          {/* SECCIÓN SEGURIDAD (AQUÍ ESTÁ TU OJO QUE TODO LO VE) */}
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-6">Seguridad</p>
          <SidebarItem href="/admin/auditoria" icon={<ShieldAlert size={18} />} label="Auditoría Logs" />
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-6 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 mb-4 border border-gray-100">
             <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-gray-900 text-sm border border-gray-100">
                {session.user.name?.[0] || "A"}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{session.user.name}</p>
                <p className="text-xs text-gray-500 truncate">Administrador</p>
             </div>
          </div>

          <Link 
             href="/api/auth/signout"
             className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 ml-72">
        {/* Topbar Flotante */}
        <header className="sticky top-0 z-40 bg-[#FBFBFD]/80 backdrop-blur-md px-10 py-6 flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
               <p className="text-sm text-gray-500 font-medium">Bienvenido de vuelta, {session.user.name?.split(' ')[0]}</p>
            </div>
            
            <div className="w-full max-w-md">
                {/* Buscador Cmd+K */}
                <div className="bg-white border border-gray-200/50 shadow-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <Search size={16} className="text-gray-400" />
                    <div className="w-full"><CommandMenu /></div>
                </div>
            </div>
        </header>

        {/* Área de contenido con padding amplio */}
        <div className="px-10 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}

// Componente helper para links
function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-5 py-3.5 rounded-[1.2rem] text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] transition-all duration-200 group border border-transparent hover:border-gray-100"
    >
      <span className="text-gray-400 group-hover:text-blue-600 transition-colors group-hover:scale-110 transform duration-200">{icon}</span>
      {label}
    </Link>
  );
}