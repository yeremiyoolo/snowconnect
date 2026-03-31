"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { crearProducto } from "@/actions/productos/crear-producto"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, Plus, X, Save, Palette, Smartphone, 
  DollarSign, Battery, HardDrive, TrendingUp, Tag, Image as ImageIcon, Barcode, UploadCloud, MonitorSmartphone 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProductoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ESTADOS ---
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [variantes, setVariantes] = useState([{ color: "", cantidad: 1 }]);
  const [imagenes, setImagenes] = useState<string[]>([]);
  
  // Estado para generar nombre automático en la vista previa (Opcional)
  const [marca, setMarca] = useState("Apple");
  const [modelo, setModelo] = useState("");

  // --- FUNCIONES ---
  const agregarVariante = () => setVariantes([...variantes, { color: "", cantidad: 1 }]);
  const eliminarVariante = (index: number) => setVariantes(variantes.filter((_, i) => i !== index));
  const updateVariante = (index: number, campo: 'color' | 'cantidad', valor: string | number) => {
    const nuevas = [...variantes];
    // @ts-ignore
    nuevas[index][campo] = valor;
    setVariantes(nuevas);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) setImagenes((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const eliminarImagen = (index: number) => setImagenes(imagenes.filter((_, i) => i !== index));
  const triggerFileInput = () => fileInputRef.current?.click();

  const totalStock = variantes.reduce((acc, curr) => acc + Number(curr.cantidad), 0);
  const costo = parseFloat(precioCompra) || 0;
  const venta = parseFloat(precioVenta) || 0;
  const ganancia = venta - costo;
  const margen = venta > 0 ? ((ganancia / venta) * 100).toFixed(1) : "0";

  // --- SUBMIT ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("variantes", JSON.stringify(variantes));
    formData.append("imagenes", JSON.stringify(imagenes));
    formData.append("stockTotal", totalStock.toString());
    
    // Generamos el nombre automáticamente aquí
    const almacenamiento = formData.get("almacenamiento") as string;
    const nombreAuto = `${marca} ${modelo} ${almacenamiento}`;
    formData.set("nombre", nombreAuto);

    const resultado = await crearProducto(formData);

    if (resultado?.error) {
      alert("❌ Error: " + resultado.error);
      setLoading(false);
    } else {
      alert("✅ Producto registrado exitosamente");
      router.push("/admin/productos");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* === COLUMNA PRINCIPAL (8/12) === */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. INFORMACIÓN GENERAL (SIMPLIFICADA) */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Información del Equipo</CardTitle>
              <CardDescription>Detalles básicos. El nombre se generará solo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Select name="marca" value={marca} onValueChange={setMarca}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apple">Apple</SelectItem>
                      <SelectItem value="Samsung">Samsung</SelectItem>
                      <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input 
                    name="modelo" 
                    placeholder="Ej: iPhone 15 Pro" 
                    className="font-medium" 
                    required 
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                  />
                </div>
              </div>

              {/* HE QUITADO EL CAMPO "NOMBRE" MANUALMENTE */}
              
              <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-dashed">
                 <span className="font-bold text-foreground">Vista Previa:</span> {marca} {modelo} (Capacidad...)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Barcode size={14} className="text-muted-foreground" /> IMEI / Serie (Opcional)
                  </Label>
                  <Input name="imei" placeholder="Ej: 356400..." className="font-mono text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea name="descripcion" placeholder="Describe el estado estético, accesorios, etc." rows={3} className="resize-none" />
              </div>
            </CardContent>
          </Card>

          {/* 2. ESPECIFICACIONES Y MEDIA */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Multimedia y Specs</CardTitle>
              <CardDescription>Fotos del producto y características técnicas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* ZONA DE CARGA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Galería de Imágenes</Label>
                    <span className="text-xs text-muted-foreground">{imagenes.length} subidas</span>
                </div>
                
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />

                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-muted-foreground/25 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center gap-3 text-center"
                >
                  <div className="p-3 rounded-full bg-muted">
                    <UploadCloud className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Haz clic para subir imágenes</p>
                    <p className="text-xs text-muted-foreground mt-1">Soporta JPG, PNG y WEBP</p>
                  </div>
                </div>

                {/* Grid de Previsualización */}
                {imagenes.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                      {imagenes.map((url, i) => (
                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                          <Image src={url} alt="Preview" fill className="object-cover" />
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); eliminarImagen(i); }}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                )}
              </div>

              <Separator />

              {/* Specs Técnicos */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground">
                    <HardDrive size={12} /> Almacenamiento
                  </Label>
                  <Select name="almacenamiento" defaultValue="128GB">
                    <SelectTrigger> <SelectValue /> </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="64GB">64 GB</SelectItem>
                      <SelectItem value="128GB">128 GB</SelectItem>
                      <SelectItem value="256GB">256 GB</SelectItem>
                      <SelectItem value="512GB">512 GB</SelectItem>
                      <SelectItem value="1TB">1 TB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground">
                    <Battery size={12} /> Batería
                  </Label>
                  <div className="relative">
                    <Input type="number" name="bateria" placeholder="100" min="1" max="100" className="pl-3" />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground">
                    <Tag size={12} /> Condición
                  </Label>
                  <Select name="condicion" defaultValue="NUEVO">
                    <SelectTrigger> <SelectValue /> </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NUEVO">✨ Nuevo</SelectItem>
                      <SelectItem value="SEMI_NUEVO">👌 Semi Nuevo</SelectItem>
                      <SelectItem value="USADO">🔄 Usado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* === COLUMNA LATERAL (4/12) === */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 3. FINANZAS Y PRECIOS */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Costo Adquisición</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input 
                        type="number" 
                        name="precioCompra"
                        value={precioCompra}
                        onChange={(e) => setPrecioCompra(e.target.value)}
                        placeholder="0.00" 
                        className="pl-7"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Precio Venta</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-foreground font-semibold">$</span>
                      <Input 
                        type="number" 
                        name="precioVenta"
                        value={precioVenta}
                        onChange={(e) => setPrecioVenta(e.target.value)}
                        placeholder="0.00" 
                        className="pl-7 font-bold text-lg"
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 border border-muted">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-muted-foreground">Ganancia Estimada</span>
                      <span className="text-xs font-bold bg-white dark:bg-black px-2 py-0.5 rounded border">{margen}%</span>
                   </div>
                   <div className={cn("text-2xl font-black tracking-tight", ganancia >= 0 ? "text-green-600" : "text-red-500")}>
                      ${ganancia.toLocaleString()}
                   </div>
                </div>
            </CardContent>
          </Card>

          {/* 4. STOCK Y VARIANTES */}
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Inventario</CardTitle>
              <span className="text-xs font-mono bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded">
                Total: {totalStock}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {variantes.map((v, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Input 
                        value={v.color} 
                        onChange={(e) => updateVariante(index, 'color', e.target.value)}
                        placeholder="Color" 
                        className="h-9 text-sm"
                        required 
                      />
                    </div>
                    <div className="w-20">
                      <Input 
                        type="number" 
                        min="1"
                        value={v.cantidad} 
                        onChange={(e) => updateVariante(index, 'cantidad', e.target.value)}
                        className="h-9 text-center font-bold"
                        required 
                      />
                    </div>
                    {variantes.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => eliminarVariante(index)}
                        className="h-9 w-9 text-muted-foreground hover:text-red-600"
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={agregarVariante}
                className="w-full"
              >
                <Plus size={14} className="mr-2" /> Agregar Variante
              </Button>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            size="lg"
            className="w-full font-bold shadow-lg"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <><Save className="mr-2 h-4 w-4" /> Guardar Producto</>}
          </Button>

        </div>
      </div>
    </form>
  );
}