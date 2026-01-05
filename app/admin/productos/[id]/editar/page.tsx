"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import UploadFotos from "@/components/upload-fotos"
import Link from "next/link"

const estados = ["NUEVO", "USADO_EXCELENTE", "USADO_BUENO", "USADO_REGULAR", "REACONDICIONADO", "VENDIDO"]

export default function EditarProductoPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/productos/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Error cargando")
        return res.json()
      })
      .then(data => {
        setFormData({
          ...data,
          fotos: data.fotos || []
        })
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/productos/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      if(res.ok) {
        router.push("/admin/productos")
        router.refresh()
      } else {
        alert("Error al actualizar")
      }
    } catch(e) {
      alert("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>
  if (!formData) return <div className="p-8">Producto no encontrado</div>

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/productos" className="flex items-center text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar y Volver
        </Link>
        <h1 className="text-3xl font-bold">Editar: {formData.marca} {formData.modelo}</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Actualizar Datos</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marca</Label>
                <Input value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input value={formData.modelo} onChange={e => setFormData({...formData, modelo: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>IMEI</Label>
                <Input value={formData.imei} onChange={e => setFormData({...formData, imei: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formData.estado} onValueChange={val => setFormData({...formData, estado: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{estados.map(e => <SelectItem key={e} value={e}>{e.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Almacenamiento</Label>
                <Input value={formData.almacenamiento} onChange={e => setFormData({...formData, almacenamiento: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Precio Compra ($)</Label>
                <Input type="number" value={formData.precioCompra} onChange={e => setFormData({...formData, precioCompra: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Precio Venta ($)</Label>
                <Input type="number" value={formData.precioVenta} onChange={e => setFormData({...formData, precioVenta: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={formData.descripcion || ""} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
            </div>
            
            <UploadFotos value={formData.fotos} onChange={fotos => setFormData({...formData, fotos})} />

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />} 
              Guardar Cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}