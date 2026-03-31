"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { crearProducto } from "@/actions/productos/crear-producto"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Battery, HardDrive, Tag, Barcode, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

export default function ProductoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ESTADOS ---
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [imagenes, setImagenes] = useState<string[]>([]);
  
  // 🔥 Nuevo: Estados simples para el equipo único
  const [color, setColor] = useState("Único");
  const [stock, setStock] = useState(1);

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

  // Cálculos
  const costo = parseFloat(precioCompra) || 0;
  const venta = parseFloat(precioVenta) || 0;
  const ganancia = venta - costo;
  const margen = venta > 0 ? ((ganancia / venta) * 100).toFixed(1) : "0";

  // --- SUBMIT ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // 🍎 MAGIA: Convertimos el color simple al formato que tu backend ya entiende
    // Así no rompemos nada de tu código de servidor
    formData.append("variantes", JSON.stringify([{ color: color, cantidad: stock }]));
    formData.append("imagenes", JSON.stringify(imagenes));
    formData.append("stockTotal", stock.toString());

    const resultado = await crearProducto(formData);

    if (resultado?.error) {
      toast.error("❌ Error: " + resultado.error);
      setLoading(false);
    } else {
      toast.success("✅ Equipo registrado exitosamente");
      router.push("/admin/productos");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 animate-in fade-in duration-500">
      
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* === COLUMNA PRINCIPAL (8/12) === */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. INFORMACIÓN GENERAL */}
          <Card className="border-border/50 shadow-xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Identificación del Equipo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Marca</Label>
                  <Select name="marca" defaultValue="Apple">
                    <SelectTrigger className="h-12 rounded-xl">
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
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Modelo Exacto</Label>
                  <Input name="modelo" placeholder="Ej: iPhone 15 Pro Max" className="h-12 rounded-xl font-bold" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Título para la Web</Label>
                <Input name="nombre" placeholder="Ej: iPhone 15 Pro Max 256GB - Titanio Natural" className="h-12 rounded-xl font-bold" required />
              </div>

              <div className="space-y-2 bg-secondary/20 p-4 rounded-2xl border border-border/50">
                <Label className="flex items-center gap-2 text-xs uppercase font-black text-primary">
                  <Barcode size={16} /> IMEI / Serie del Dispositivo (Opcional pero recomendado)
                </Label>
                <Input name="imei" placeholder="Escribe el IMEI aquí..." className="h-12 rounded-xl font-mono text-lg bg-background" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Descripción (Opcional)</Label>
                <Textarea name="descripcion" placeholder="Describe rasguños, detalles o condición de la batería..." rows={3} className="resize-none rounded-xl" />
              </div>
            </CardContent>
          </Card>

          {/* 2. ESPECIFICACIONES Y MEDIA */}
          <Card className="border-border/50 shadow-xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Multimedia y Specs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* ZONA DE CARGA DE IMÁGENES */}
              <div className="space-y-4">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Fotos Reales del Equipo</Label>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />

                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-[2rem] p-10 transition-all cursor-pointer flex flex-col items-center gap-3 text-center"
                >
                  <div className="p-4 rounded-2xl bg-primary/20 text-primary">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-black uppercase tracking-tight">Haz clic para subir fotos</p>
                    <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-widest">Soporta JPG, PNG y WEBP</p>
                  </div>
                </div>

                {imagenes.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-4">
                      {imagenes.map((url, i) => (
                        <div key={i} className="relative group aspect-[4/5] rounded-2xl overflow-hidden border-2 border-border/50 bg-muted">
                          <Image src={url} alt="Preview" fill className="object-cover" />
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); eliminarImagen(i); }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                )}
              </div>

              <Separator className="opacity-30" />

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground">
                    <HardDrive size={14} /> Almacenamiento
                  </Label>
                  <Select name="almacenamiento" defaultValue="128GB">
                    <SelectTrigger className="h-12 rounded-xl font-bold"> <SelectValue /> </SelectTrigger>
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
                    <Battery size={14} /> Vida Batería
                  </Label>
                  <div className="relative">
                    <Input type="number" name="bateria" placeholder="100" min="1" max="100" className="pl-4 h-12 rounded-xl font-bold" />
                    <span className="absolute right-4 top-3 text-sm font-black text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground">
                    <Tag size={14} /> Estado
                  </Label>
                  <Select name="condicion" defaultValue="NUEVO">
                    <SelectTrigger className="h-12 rounded-xl font-bold"> <SelectValue /> </SelectTrigger>
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
          
          {/* 3. FINANZAS */}
          <Card className="border-border/50 shadow-xl rounded-[2rem] bg-gradient-to-b from-card to-secondary/10">
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Costo de Adquisición</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-muted-foreground font-bold">RD$</span>
                      <Input 
                        type="number" 
                        name="precioCompra"
                        value={precioCompra}
                        onChange={(e) => setPrecioCompra(e.target.value)}
                        placeholder="0.00" 
                        className="pl-12 h-12 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-primary">Precio Venta Público</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-foreground font-black">RD$</span>
                      <Input 
                        type="number" 
                        name="precioVenta"
                        value={precioVenta}
                        onChange={(e) => setPrecioVenta(e.target.value)}
                        placeholder="0.00" 
                        className="pl-12 h-14 rounded-xl font-black text-xl border-primary/30 focus:border-primary"
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-background p-5 border border-border shadow-inner">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Beneficio</span>
                      <span className="text-[10px] font-black bg-primary text-white px-2 py-1 rounded-md">{margen}%</span>
                   </div>
                   <div className={cn("text-3xl font-black tracking-tighter italic", ganancia >= 0 ? "text-green-500" : "text-red-500")}>
                      ${ganancia.toLocaleString()}
                   </div>
                </div>
            </CardContent>
          </Card>

          {/* 4. COLOR Y STOCK */}
          <Card className="border-border/50 shadow-xl rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Color y Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Color del Equipo</Label>
                <Input 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  placeholder="Ej: Titanio Natural" 
                  className="h-12 rounded-xl font-bold" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground">Cantidad (Normalmente 1)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={stock} 
                  onChange={(e) => setStock(Number(e.target.value))} 
                  className="h-12 rounded-xl font-bold text-center" 
                  required 
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <><Save className="mr-2 h-5 w-5" /> Publicar Equipo</>}
          </Button>

        </div>
      </div>
    </form>
  );
}