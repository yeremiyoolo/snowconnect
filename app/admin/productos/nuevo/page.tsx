"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import UploadFotos from "@/components/upload-fotos"

const marcas = ["Apple", "Samsung", "Xiaomi", "Huawei", "Motorola", "Oppo", "Vivo", "OnePlus", "Google", "Otro"]
const estados = ["NUEVO", "USADO_EXCELENTE", "USADO_BUENO", "USADO_REGULAR", "REACONDICIONADO", "VENDIDO"]
const capacidades = ["64GB", "128GB", "256GB", "512GB", "1TB"]
const ramOptions = ["4GB", "6GB", "8GB", "12GB", "16GB"]

export default function NuevoProductoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState({
    imei: "",
    marca: "Apple",
    modelo: "",
    color: "",
    almacenamiento: "128GB",
    ram: "8GB",
    estado: "USADO_EXCELENTE",
    precioCompra: "",
    precioVenta: "",
    descripcion: "",
    fotos: [] as string[]
  })

  // Protección de ruta para Admin
  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/login")
    }
  }, [session, status, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // 1. Validaciones locales
      if (!formData.imei || formData.imei.length < 15) {
        throw new Error("El IMEI debe tener al menos 15 dígitos")
      }
      if (!formData.modelo.trim()) {
        throw new Error("El modelo es obligatorio")
      }
      if (!formData.precioCompra || parseFloat(formData.precioCompra) <= 0) {
        throw new Error("El precio de compra no es válido")
      }

      console.log("📤 Enviando datos...", { ...formData, fotos: `[${formData.fotos.length} imágenes]` })

      // 2. Enviar datos a la API
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // 3. Manejo seguro de la respuesta (evita el error "Unexpected end of JSON")
      let data;
      const textResponse = await response.text(); // Leemos como texto primero
      
      try {
        data = textResponse ? JSON.parse(textResponse) : {}; 
      } catch (e) {
        console.error("Error parseando JSON:", textResponse);
        throw new Error(`Error del servidor (${response.status}). Es posible que la imagen sea muy pesada o la base de datos esté llena.`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Error al guardar: ${response.statusText}`)
      }

      // 4. Éxito
      setSuccess(`✅ Producto creado exitosamente!`)
      
      // Redirigir
      setTimeout(() => {
        router.push("/admin/productos")
        router.refresh()
      }, 1500)

    } catch (err: any) {
      console.error("❌ Error en submit:", err)
      setError(err.message || "Ocurrió un error desconocido")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/admin/productos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Package className="mr-3 h-8 w-8" />
          Agregar Nuevo Producto
        </h1>
        <p className="text-gray-600">Registra un nuevo teléfono móvil en el inventario</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>📱 Información del Dispositivo</CardTitle>
            <CardDescription>
              Completa todos los campos requeridos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* IMEI y Marca */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imei">IMEI *</Label>
                  <Input
                    id="imei"
                    name="imei"
                    placeholder="15 dígitos"
                    value={formData.imei}
                    onChange={handleChange}
                    required
                    maxLength={20}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marca">Marca *</Label>
                  <Select value={formData.marca} onValueChange={(value) => handleSelectChange("marca", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas.map(marca => (
                        <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Modelo y Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Input
                    id="modelo"
                    name="modelo"
                    placeholder="Ej: iPhone 15 Pro"
                    value={formData.modelo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    name="color"
                    placeholder="Ej: Negro Espacial"
                    value={formData.color}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Especificaciones Técnicas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="almacenamiento">Almacenamiento</Label>
                  <Select value={formData.almacenamiento} onValueChange={(value) => handleSelectChange("almacenamiento", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {capacidades.map(cap => (
                        <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Select value={formData.ram} onValueChange={(value) => handleSelectChange("ram", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ramOptions.map(ram => (
                        <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map(estado => (
                        <SelectItem key={estado} value={estado}>
                          {estado.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Precios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precioCompra">Precio de Compra ($) *</Label>
                  <Input
                    id="precioCompra"
                    name="precioCompra"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.precioCompra}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precioVenta">Precio de Venta ($) *</Label>
                  <Input
                    id="precioVenta"
                    name="precioVenta"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.precioVenta}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Margen Calculado (Visual) */}
              {formData.precioCompra && formData.precioVenta && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                  <strong>Margen estimado:</strong> ${ (parseFloat(formData.precioVenta) - parseFloat(formData.precioCompra)).toFixed(2) }
                </div>
              )}

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Detalles adicionales: condición de la batería, accesorios incluidos, etc."
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* Componente de Fotos (Controlado) */}
              <div className="space-y-2">
                <UploadFotos 
                  value={formData.fotos} 
                  onChange={(nuevasFotos) => setFormData(prev => ({ ...prev, fotos: nuevasFotos }))} 
                />
              </div>

              {/* Mensajes de Estado */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Botones de Acción */}
              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Producto
                    </>
                  )}
                </Button>
                
                <Button type="button" variant="outline" onClick={() => router.push('/admin/productos')}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}