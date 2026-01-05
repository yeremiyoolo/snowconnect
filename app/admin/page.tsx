import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // <--- Importante para leer la DB
import Link from "next/link";
import { Package, DollarSign, Users, TrendingUp, Plus, ShoppingCart } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  // --- 1. OBTENER DATOS REALES DE LA BASE DE DATOS ---

  // A. Cantidad de móviles disponibles (Stock)
  const stockCount = await prisma.producto.count({
    where: { estado: "DISPONIBLE" }
  });

  // B. Calcular ventas de HOY
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Desde las 00:00 de hoy

  const ventasHoy = await prisma.venta.aggregate({
    _sum: { precioVenta: true, margen: true },
    where: { createdAt: { gte: hoy } }
  });

  // C. Total de Usuarios registrados
  const userCount = await prisma.user.count();

  // D. Formatear dinero (para que se vea bonito con $)
  const dineroVendido = ventasHoy._sum.precioVenta || 0;
  const beneficioHoy = ventasHoy._sum.margen || 0;

  // --- FIN DE LA LÓGICA DE DATOS ---

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          👋 Bienvenido, {session.user?.name}
        </h1>
        <p className="text-gray-600">Resumen de tu negocio hoy.</p>
      </div>

      {/* Estadísticas REALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Stock */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">En Stock</h3>
            <div className="bg-blue-500 p-2 rounded-full">
              <Package className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{stockCount}</div>
          <p className="text-xs text-gray-500 mt-1">Móviles listos para vender</p>
        </div>

        {/* Card 2: Ventas Hoy */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Ventas Hoy</h3>
            <div className="bg-green-500 p-2 rounded-full">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">${dineroVendido}</div>
          <p className="text-xs text-green-600 mt-1 font-semibold">
            +${beneficioHoy} de ganancia pura
          </p>
        </div>

        {/* Card 3: Usuarios */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Usuarios</h3>
            <div className="bg-purple-500 p-2 rounded-full">
              <Users className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{userCount}</div>
          <p className="text-xs text-gray-500 mt-1">Registrados en el sistema</p>
        </div>

        {/* Card 4: Margen Total (Ejemplo de cálculo rápido) */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Rentabilidad</h3>
            <div className="bg-orange-500 p-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {dineroVendido > 0 ? ((beneficioHoy / dineroVendido) * 100).toFixed(1) : 0}%
          </div>
          <p className="text-xs text-gray-500 mt-1">Margen de beneficio hoy</p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
          <div className="space-y-4">
            <Link href="/admin/productos/nuevo" className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              <Plus className="mr-2 h-4 w-4" /> Agregar Producto
            </Link>
            <Link href="/admin/ventas/nueva" className="flex items-center justify-center w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition">
              <ShoppingCart className="mr-2 h-4 w-4" /> Nueva Venta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}