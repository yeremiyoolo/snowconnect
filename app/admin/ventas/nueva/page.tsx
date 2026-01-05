"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ShoppingCart, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  FileText,
  DollarSign,
  Package
} from "lucide-react"

type Producto = {
  id: string
  imei: string
  marca: string
  modelo: string
  color: string
  estado: string
  precioVenta: number
  precioCompra: number
  almacenamiento: string
  ram: string
}

export default function NuevaVentaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [loadingProductos, setLoadingProductos] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [productos, setProductos] = useState<Producto[]>([])
  const [formData, setFormData] = useState({
    productoId: "",
    cliente: "",
    notas: ""
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/login")
      return
    }
    
    cargarProductosDisponibles()
  }, [session, status, router])

  const cargarProductosDisponibles = async () => {
    try {
      const response = await fetch("/api/productos")
      const data = await response.json()
      
      // FIX: Manejar si la API devuelve un Array directo o un objeto con data
      let productosArray = []
      if (Array.isArray(data)) {
        productosArray = data
      } else if (data.data && Array.isArray(data.data)) {
        productosArray = data.data
      }

      if (productosArray.length > 0) {
        // Filtrar solo productos NO vendidos
        const disponibles = productosArray.filter((p: Producto) => p.estado !== "VENDIDO")
        setProductos(disponibles)
      } else {
        console.log("No se encontraron productos o el formato es incorrecto")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Error al cargar productos")
    } finally {
      setLoadingProductos(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!formData.productoId) {
        throw new Error("Selecciona un producto para vender")
      }
      
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Error al registrar venta")
      }

      setSuccess(`✅ Venta registrada!`)
      
      setTimeout(() => {
        router.push("/admin/ventas")
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const productoSeleccionado = productos.find(p => p.id === formData.productoId)
  const ganancia = productoSeleccionado 
    ? productoSeleccionado.precioVenta - productoSeleccionado.precioCompra 
    : 0

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center px-4 py-2 mb-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Panel
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="mr-3 h-8 w-8" />
              Registrar Venta
            </h1>
            <p className="text-gray-600 mt-2">Vende un producto del inventario</p>
          </div>
          
          <div className="text-sm bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-blue-700 font-medium">
              {productos.length} productos disponibles
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              {/* Paso 1: Seleccionar Producto */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  1. Seleccionar Producto
                </h2>
                
                {loadingProductos ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                    <p className="mt-3 text-gray-600">Cargando productos disponibles...</p>
                  </div>
                ) : productos.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Package className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-3 text-gray-600">No hay productos disponibles para vender</p>
                    <Link
                      href="/admin/productos/nuevo"
                      className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Agregar productos al inventario →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <select
                      name="productoId"
                      value={formData.productoId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                      required
                    >
                      <option value="">-- Selecciona un producto --</option>
                      {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                          {producto.marca} {producto.modelo} - {producto.color} - ${producto.precioVenta}
                        </option>
                      ))}
                    </select>

                    {productoSeleccionado && (
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><p className="text-sm text-gray-500">Marca</p><p className="font-medium">{productoSeleccionado.marca}</p></div>
                          <div><p className="text-sm text-gray-500">Modelo</p><p className="font-medium">{productoSeleccionado.modelo}</p></div>
                          <div><p className="text-sm text-gray-500">Color</p><p className="font-medium">{productoSeleccionado.color}</p></div>
                          <div><p className="text-sm text-gray-500">Precio Venta</p><p className="font-medium text-green-600">${productoSeleccionado.precioVenta}</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Paso 2: Info Cliente */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  2. Información del Cliente
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleChange}
                    placeholder="Nombre del Cliente"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Paso 3: Notas */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  3. Notas Adicionales
                </h2>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading || productos.length === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <DollarSign className="mr-2 h-5 w-5" />}
                  Registrar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}