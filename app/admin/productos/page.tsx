"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image" // <--- Importante para las fotos
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge" // <--- Usamos Badge para estados
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Smartphone, 
  Filter, 
  Download,
  ImageIcon
} from "lucide-react"

// Importamos tu botón de exportar (asegúrate de haberlo creado en el paso anterior)
import { ExportButton } from "@/components/admin/export-button"

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
  fotosJson: string | null // <--- Agregamos este campo
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
      }
    } catch (error) {
      console.error("Error fetching productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarProducto = async (id: string) => {
    if (!confirm("¿Estás seguro? Esta acción es irreversible.")) return
    
    try {
      const response = await fetch(`/api/productos/${id}`, { method: "DELETE" })
      if (response.ok) {
        setProductos(productos.filter(p => p.id !== id))
        // Aquí podrías usar toast({ title: "Producto eliminado" }) si tienes el hook
      } else {
        alert("No se pudo eliminar")
      }
    } catch (error) {
      alert("Error de conexión")
    }
  }

  // --- Lógica para obtener la primera imagen ---
  const getImagenPrincipal = (jsonString: string | null) => {
    if (!jsonString) return null
    try {
      const fotos = JSON.parse(jsonString)
      return Array.isArray(fotos) && fotos.length > 0 ? fotos[0] : null
    } catch {
      return null
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const term = search.toLowerCase()
    const matchesSearch = 
      producto.marca.toLowerCase().includes(term) ||
      producto.modelo.toLowerCase().includes(term) ||
      producto.imei.includes(term) ||
      producto.color.toLowerCase().includes(term)
    
    const matchesEstado = !filterEstado || producto.estado === filterEstado
    return matchesSearch && matchesEstado
  })

  // Preparar datos para Excel
  const exportData = filteredProductos.map(p => ({
    IMEI: p.imei,
    Marca: p.marca,
    Modelo: p.modelo,
    Color: p.color,
    Estado: p.estado,
    Costo: p.precioCompra,
    PrecioVenta: p.precioVenta,
    Margen: `${p.margen.toFixed(2)}%`,
    FechaIngreso: new Date(p.fechaCompra).toLocaleDateString()
  }))

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        Cargando inventario...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header con Acciones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Inventario
            <Badge variant="outline" className="text-gray-500 font-normal ml-2">
              {productos.length} equipos
            </Badge>
          </h1>
          <p className="text-gray-500 font-medium">Gestiona tu stock en tiempo real.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {/* Botón de Exportar Integrado */}
          <ExportButton data={exportData} filename="inventario_snowconnect" label="Excel" />
          
          <Button asChild className="bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200 gap-2 w-full md:w-auto">
            <Link href="/admin/productos/nuevo">
              <Plus size={16} /> Nuevo Producto
            </Link>
          </Button>
        </div>
      </div>

      {/* Barra de Herramientas (Búsqueda + Filtros) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar IMEI, Modelo, Marca..."
            className="pl-10 bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
           {["", "NUEVO", "SEMINUEVO", "RECONDICIONADO"].map((estado) => (
             <button
                key={estado}
                onClick={() => setFilterEstado(estado)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  filterEstado === estado 
                    ? "bg-gray-900 text-white border-gray-900" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
             >
               {estado === "" ? "Todos" : estado}
             </button>
           ))}
        </div>
      </div>

      {/* Tabla Visual */}
      <Card className="border-none shadow-sm ring-1 ring-gray-100 bg-white rounded-[1.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] text-center">Foto</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Finanzas</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    No se encontraron productos.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProductos.map((prod) => {
                  const img = getImagenPrincipal(prod.fotosJson)
                  return (
                    <TableRow key={prod.id} className="group hover:bg-gray-50/50 transition-colors">
                      {/* Columna FOTO */}
                      <TableCell className="py-4">
                        <div className="w-12 h-12 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden relative">
                          {img ? (
                            <Image src={img} alt={prod.modelo} fill className="object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-200" size={20} />
                          )}
                        </div>
                      </TableCell>
                      
                      {/* Columna INFO */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{prod.modelo}</span>
                          <span className="text-xs text-gray-500 font-mono tracking-wide">{prod.imei}</span>
                          <span className="text-[10px] text-gray-400">{prod.color} · {prod.marca}</span>
                        </div>
                      </TableCell>

                      {/* Columna ESTADO */}
                      <TableCell>
                         <Badge variant="secondary" className={`
                            ${prod.estado === 'NUEVO' ? 'bg-emerald-100 text-emerald-700' : ''}
                            ${prod.estado === 'SEMINUEVO' ? 'bg-amber-100 text-amber-700' : ''}
                            ${prod.estado === 'RECONDICIONADO' ? 'bg-blue-100 text-blue-700' : ''}
                            border-transparent font-bold
                         `}>
                           {prod.estado}
                         </Badge>
                      </TableCell>

                      {/* Columna FINANZAS */}
                      <TableCell>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-gray-900">
                             ${prod.precioVenta.toLocaleString()}
                           </span>
                           <span className="text-[10px] text-gray-400">
                             Costo: ${prod.precioCompra.toLocaleString()}
                           </span>
                           <span className={`text-[10px] font-bold ${prod.margen > 15 ? 'text-green-600' : 'text-orange-500'}`}>
                             Margen: {prod.margen.toFixed(0)}%
                           </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-gray-500">
                        {new Date(prod.fechaCompra).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/productos/${prod.id}/editar`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => eliminarProducto(prod.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}