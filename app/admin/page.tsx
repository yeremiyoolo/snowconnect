import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, DollarSign, Users, TrendingUp, Plus, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login")
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          👋 Bienvenido, {session.user?.name || "Administrador"}
        </h1>
        <p className="text-gray-600">Panel de administración de la tienda</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Productos en Stock", value: "0", icon: Package, color: "bg-blue-500" },
          { title: "Ventas Hoy", value: "$0", icon: DollarSign, color: "bg-green-500" },
          { title: "Proveedores", value: "0", icon: Users, color: "bg-purple-500" },
          { title: "Margen Promedio", value: "0%", icon: TrendingUp, color: "bg-orange-500" }
        ].map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-full`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">+0% desde ayer</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/productos/nuevo">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Nuevo Producto
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/ventas/nueva">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Registrar Nueva Venta
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de datos</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ Conectada</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Autenticación</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ Activa</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sesión activa</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ {session.user?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje de bienvenida */}
      <Card>
        <CardHeader>
          <CardTitle>🎉 ¡Sistema Listo!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Tu sistema de gestión de móviles está funcionando correctamente.</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Agrega tu primer producto desde "Acciones Rápidas"</li>
            <li>Gestiona tu inventario desde el menú "Productos"</li>
            <li>Realiza tu primera venta</li>
            <li>Revisa los reportes de inventario</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
