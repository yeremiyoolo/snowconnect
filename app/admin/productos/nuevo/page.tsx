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
import { Package, Save, ArrowLeft, Loader2, Battery } from "lucide-react" // <--- Importamos Battery
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
    bateria: "100", // <--- NUEVO CAMPO BATERÍA (Default 100)
    descripcion: "",
    fotos: [] as string[]
  })

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
      if (!formData.imei || formData.imei.length < 15) {
        throw new Error("El IMEI debe tener al menos 15 dígitos")
      }
      if (!formData.modelo.trim()) {
        throw new Error("El modelo es obligatorio")
      }
      if (!formData.precioCompra || parseFloat(formData.precioCompra) <= 0) {
        throw new Error("El precio de compra no es válido")
      }

      // Validar batería
      const bat = parseInt(formData.bateria)
      if (isNaN(bat) || bat < 0 || bat > 100) {
        throw new Error("El porcentaje de batería debe estar entre 0 y 100")
      }

      console.log("📤 Enviando datos...", formData)

      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      let data;
      const textResponse = await response.text();
      
      try {
        data = textResponse ? JSON.parse(textResponse) : {}; 
      } catch (e) {
        throw new Error(`Error del servidor (${response.status}).`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Error al guardar: ${response.statusText}`)
      }

      setSuccess(`✅ Producto creado exitosamente!`)
      
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

              {/* --- SECCIÓN DE PRECIOS Y BATERÍA --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precioCompra">Costo Compra ($) *</Label>
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
                  <Label htmlFor="precioVenta">Precio Venta ($) *</Label>
                  <Input
                    id="precioVenta"
                    name="precioVenta"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.precioVenta}
                    onChange={handleChange}
                    required
                    className="font-bold text-blue-600"
                  />
                </div>

                {/* --- NUEVO INPUT DE BATERÍA --- */}
                <div className="space-y-2">
                  <Label htmlFor="bateria" className="flex items-center gap-1 text-green-600 font-bold">
                    <Battery className="w-4 h-4" /> Batería (%)
                  </Label>
                  <div className="relative">
                    <Input
                      id="bateria"
                      name="bateria"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="100"
                      value={formData.bateria}
                      onChange={handleChange}
                      className="font-bold pr-8"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              {formData.precioCompra && formData.precioVenta && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                  <strong>Margen estimado:</strong> ${ (parseFloat(formData.precioVenta) - parseFloat(formData.precioCompra)).toFixed(2) }
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Detalles adicionales..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Fotos del Producto</Label>
                <UploadFotos 
                  value={formData.fotos} 
                  onChange={(nuevasFotos) => setFormData(prev => ({ ...prev, fotos: nuevasFotos }))} 
                />
              </div>

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