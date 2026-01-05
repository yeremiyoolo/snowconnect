import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar sesión en el servidor (más seguro y rápido)
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    console.log("❌ No hay sesión - redirigiendo a login")
    redirect("/auth/login")
  }
  
  if (session.user.role !== "ADMIN") {
    console.log("❌ Usuario no es ADMIN - rol:", session.user.role)
    redirect("/")
  }
  
  console.log("✅ Layout Admin - Usuario:", session.user.email)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                🏪 Tienda Móviles
              </Link>
              <nav className="ml-10 flex space-x-4">
                <Link 
                  href="/admin" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/productos" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  Productos
                </Link>
                <Link 
                  href="/admin/productos/nuevo" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  + Nuevo Producto
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                👤 {session.user.email}
              </span>
              <form action="/api/auth/signout" method="POST">
                <Button 
                  type="submit"
                  variant="outline"
                  size="sm"
                >
                  Cerrar Sesión
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      
      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Sistema de Gestión de Tienda de Móviles © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
