"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ShoppingCart, 
  Plus, 
  Calendar, 
  User, 
  DollarSign,
  Package,
  TrendingUp,
  Search,
  Filter
} from "lucide-react"

type Venta = {
  id: string
  precioVenta: number
  cliente: string | null
  notas: string | null
  createdAt: string
  producto: {
    id: string
    marca: string
    modelo: string
    color: string
    imei: string
  }
}

export default function VentasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [totalVentas, setTotalVentas] = useState(0)
  const [gananciaTotal, setGananciaTotal] = useState(0)

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/login")
      return
    }
    
    cargarVentas()
  }, [session, status, router])

  const cargarVentas = async () => {
    try {
      const response = await fetch("/api/ventas")
      const data = await response.json()
      
      if (data.success) {
        setVentas(data.data)
        calcularEstadisticas(data.data)
      }
    } catch (error) {
      console.error("Error cargando ventas:", error)
    } finally {
      setLoading(false)
    }
  }

  const calcularEstadisticas = (ventasData: Venta[]) => {
    const total = ventasData.reduce((sum, venta) => sum + venta.precioVenta, 0)
    setTotalVentas(total)
    // Nota: Para ganancia real necesitaríamos el precioCompra de cada producto
    // Por ahora calculamos un estimado (80% del precioVenta como ganancia)
    const gananciaEstimada = ventasData.reduce((sum, venta) => sum + (venta.precioVenta * 0.8), 0)
    setGananciaTotal(gananciaEstimada)
  }

  const filteredVentas = ventas.filter(venta =>
    venta.producto.marca.toLowerCase().includes(search.toLowerCase()) ||
    venta.producto.modelo.toLowerCase().includes(search.toLowerCase()) ||
    (venta.cliente && venta.cliente.toLowerCase().includes(search.toLowerCase())) ||
    venta.producto.imei.toLowerCase().includes(search.toLowerCase())
  )

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const formatCurrency = (monto: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD"
    }).format(monto)
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Cargando ventas...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="mr-3 h-8 w-8" />
              Historial de Ventas
            </h1>
            <p className="text-gray-600 mt-2">
              {ventas.length} ventas registradas • Total: {formatCurrency(totalVentas)}
            </p>
          </div>
          <Link
            href="/admin/ventas/nueva"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Venta
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Ventas</p>
                <p className="text-2xl font-bold">{ventas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold">{formatCurrency(totalVentas)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ganancia Estimada</p>
                <p className="text-2xl font-bold">{formatCurrency(gananciaTotal)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, marca, modelo o IMEI..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </button>
              <button 
                onClick={cargarVentas}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de ventas */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {filteredVentas.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {search ? "No hay ventas que coincidan" : "No hay ventas registradas"}
              </h3>
              <p className="mt-2 text-gray-500">
                {search
                  ? "Intenta con otros términos de búsqueda"
                  : "Registra tu primera venta"}
              </p>
              {!search && (
                <div className="mt-6">
                  <Link
                    href="/admin/ventas/nueva"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Primera Venta
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVentas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {venta.producto.marca} {venta.producto.modelo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {venta.producto.color} • IMEI: {venta.producto.imei.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {venta.cliente || "Sin cliente registrado"}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(venta.precioVenta)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">
                            {formatFecha(venta.createdAt)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <button
                          onClick={() => alert(`Notas: ${venta.notas || "Sin notas"}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resumen mensual (simplificado) */}
        {ventas.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📈 Resumen de Ventas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Venta Promedio</p>
                <p className="text-xl font-bold">
                  {formatCurrency(totalVentas / ventas.length)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ventas Hoy</p>
                <p className="text-xl font-bold">
                  {ventas.filter(v => {
                    const hoy = new Date().toDateString()
                    const fechaVenta = new Date(v.createdAt).toDateString()
                    return hoy === fechaVenta
                  }).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Venta Más Alta</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Math.max(...ventas.map(v => v.precioVenta)))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Clientes Únicos</p>
                <p className="text-xl font-bold">
                  {new Set(ventas.filter(v => v.cliente).map(v => v.cliente)).size}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
