"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Package, Plus, Search, Edit, Trash2, Smartphone, Filter } from "lucide-react"
import Link from "next/link"

type Producto = {
  id: string
  imei: string
  marca: string
  modelo: string
  color: string
  estado: string
  precioCompra: number
  precioVenta: number
  margen: number
  fechaCompra: string
  fechaVenta: string | null
}

export default function ProductosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("")

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/login")
    } else {
      fetchProductos()
    }
  }, [session, status, router])

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos")
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      } else {
        console.error("Error en la respuesta:", response.status)
      }
    } catch (error) {
      console.error("Error fetching productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarProducto = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) return
    
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        // Actualizar la lista localmente
        setProductos(productos.filter(p => p.id !== id))
        alert("✅ Producto eliminado correctamente")
      } else {
        const error = await response.json()
        alert(`❌ Error: ${error.error || "No se pudo eliminar el producto"}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("❌ Error de conexión al servidor")
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = 
      producto.marca.toLowerCase().includes(search.toLowerCase()) ||
      producto.modelo.toLowerCase().includes(search.toLowerCase()) ||
      producto.imei.includes(search) ||
      producto.color.toLowerCase().includes(search.toLowerCase())
    
    const matchesEstado = !filterEstado || producto.estado === filterEstado
    
    return matchesSearch && matchesEstado
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const calcularValorTotal = () => {
    return productos.reduce((total, producto) => total + producto.precioVenta, 0)
  }

  const calcularProductosNuevos = () => {
    return productos.filter(p => p.estado === "NUEVO").length
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-lg text-gray-600">Cargando productos...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8" />
            Productos en Inventario
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona todos los teléfonos en stock
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por marca, modelo, color o IMEI..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filterEstado === "" ? "default" : "outline"}
                onClick={() => setFilterEstado("")}
              >
                Todos ({productos.length})
              </Button>
              <Button 
                variant={filterEstado === "NUEVO" ? "default" : "outline"}
                onClick={() => setFilterEstado("NUEVO")}
              >
                Nuevos ({productos.filter(p => p.estado === "NUEVO").length})
              </Button>
              <Button 
                variant={filterEstado === "SEMINUEVO" ? "default" : "outline"}
                onClick={() => setFilterEstado("SEMINUEVO")}
              >
                Seminuevos ({productos.filter(p => p.estado === "SEMINUEVO").length})
              </Button>
              <Button 
                variant={filterEstado === "RECONDICIONADO" ? "default" : "outline"}
                onClick={() => setFilterEstado("RECONDICIONADO")}
              >
                Reacond. ({productos.filter(p => p.estado === "RECONDICIONADO").length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Productos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <Smartphone className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {productos.length === 0 ? "No hay productos registrados" : "No se encontraron productos"}
              </h3>
              <p className="text-gray-500 mb-6">
                {productos.length === 0 
                  ? "Comienza agregando tu primer producto al inventario" 
                  : "Intenta con otros términos de búsqueda"}
              </p>
              {productos.length === 0 && (
                <Button asChild>
                  <Link href="/admin/productos/nuevo">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Producto
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>IMEI</TableHead>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Precio Compra</TableHead>
                    <TableHead>Precio Venta</TableHead>
                    <TableHead>Margen</TableHead>
                    <TableHead>Fecha Compra</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProductos.map((producto, index) => (
                    <TableRow key={producto.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {producto.imei.length > 10 
                          ? `${producto.imei.substring(0, 8)}...` 
                          : producto.imei}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{producto.marca}</div>
                        <div className="text-sm text-gray-500">{producto.modelo}</div>
                      </TableCell>
                      <TableCell>{producto.color}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          producto.estado === "NUEVO"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : producto.estado === "SEMINUEVO"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                          {producto.estado}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        {formatCurrency(producto.precioCompra)}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        {formatCurrency(producto.precioVenta)}
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${
                          producto.margen > 20 ? "text-green-600" : 
                          producto.margen > 10 ? "text-yellow-600" : 
                          "text-red-600"
                        }`}>
                          {producto.margen.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(producto.fechaCompra)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            asChild
                            title="Editar producto"
                          >
                            <Link href={`/admin/productos/${producto.id}/editar`}>
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => eliminarProducto(producto.id)}
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen y Estadísticas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{productos.length}</div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Package className="h-3 w-3" />
              Total Productos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calcularValorTotal())}
            </div>
            <p className="text-sm text-gray-600">Valor Total Inventario</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {calcularProductosNuevos()}
            </div>
            <p className="text-sm text-gray-600">Productos Nuevos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {filteredProductos.length}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Mostrando
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      {productos.length === 0 && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3">📋 ¿Cómo comenzar?</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Haz clic en "Nuevo Producto" para agregar tu primer teléfono</li>
              <li>Completa todos los campos del formulario</li>
              <li>Guarda el producto y aparecerá en esta lista</li>
              <li>Puedes editar o eliminar productos en cualquier momento</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}