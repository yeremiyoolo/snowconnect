import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Settings 
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Verificar sesión y rol
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- SIDEBAR (Menú Lateral) --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        {/* Título / Logo */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            SnowConnect<span className="text-blue-500">.</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Panel de Administración</p>
        </div>

        {/* Enlaces de Navegación */}
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link 
            href="/admin/productos" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition-colors"
          >
            <Package className="h-5 w-5" />
            <span className="font-medium">Productos</span>
          </Link>

          <Link 
            href="/admin/ventas" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">Ventas</span>
          </Link>

          <Link 
            href="/admin/usuarios" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Usuarios</span>
          </Link>
        </nav>

        {/* Footer del Menú */}
        <div className="p-4 border-t border-slate-700">
          <Link 
             href="/api/auth/signout"
             className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Barra superior simple (opcional) */}
        <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Vista General</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hola, {session.user.name}</span>
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {session.user.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Aquí se inyecta lo que pusimos en page.tsx */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}