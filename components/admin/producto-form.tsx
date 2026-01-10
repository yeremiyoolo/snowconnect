"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import UploadFotos from "@/components/upload-fotos";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, Battery } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const marcas = ["Apple", "Samsung", "Xiaomi", "Huawei", "Motorola", "Oppo", "Vivo", "OnePlus", "Google", "Otro"];
const estados = ["NUEVO", "USADO_EXCELENTE", "USADO_BUENO", "USADO_REGULAR", "REACONDICIONADO", "VENDIDO"];
const capacidades = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const ramOptions = ["4GB", "6GB", "8GB", "12GB", "16GB"];

// Schema de validación
const formSchema = z.object({
  imei: z.string().min(1, "El IMEI es requerido"),
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  color: z.string().min(1, "El color es requerido"),
  almacenamiento: z.string().min(1, "El almacenamiento es requerido"),
  ram: z.string().optional(),
  estado: z.string().default("DISPONIBLE"),
  precioCompra: z.coerce.number().min(0),
  precioVenta: z.coerce.number().min(0),
  precioAnterior: z.coerce.number().optional(),
  bateriaScore: z.coerce.number().min(0).max(100).default(100),
  descripcion: z.string().optional(),
  fotosJson: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductoFormProps {
  initialData?: any;
}

export function ProductoForm({ initialData }: ProductoFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // CORRECCIÓN: Quitamos "Partial<FormValues>" y aseguramos que NADA sea undefined en campos obligatorios.
  const defaultValues: FormValues = {
    imei: initialData?.imei || "", // Si es undefined, ponemos ""
    marca: initialData?.marca || "Apple",
    modelo: initialData?.modelo || "",
    color: initialData?.color || "",
    almacenamiento: initialData?.almacenamiento || "128GB",
    ram: initialData?.ram || "8GB",
    estado: initialData?.estado || "USADO_EXCELENTE",
    precioCompra: initialData ? Number(initialData.precioCompra) : 0,
    precioVenta: initialData ? Number(initialData.precioVenta) : 0,
    precioAnterior: initialData?.precioAnterior ? Number(initialData.precioAnterior) : undefined,
    // Recuperar batería de forma segura
    bateriaScore: initialData 
      ? (Number(initialData.specs?.bateriaScore) || Number(initialData.bateriaScore) || 100) 
      : 100,
    descripcion: initialData?.descripcion || "",
    fotosJson: initialData?.fotosJson || "[]",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues, // Ahora defaultValues coincide perfectamente con el Schema
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const url = initialData ? `/api/productos/${initialData.id}` : `/api/productos`;
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar");
      }

      toast({
        title: "¡Éxito!",
        description: `Producto ${initialData ? "actualizado" : "creado"} correctamente`,
        className: "bg-green-50 border-green-200 text-green-800",
      });

      router.push("/admin/productos");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el producto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SECCIÓN 1: DETALLES PRINCIPALES */}
          <Card className="md:col-span-2 shadow-sm border-gray-200">
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="imei"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IMEI / Serial</FormLabel>
                    <FormControl>
                      <Input placeholder="Escanea o escribe el IMEI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marcas.map(marca => (
                          <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: iPhone 13 Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Azul Alpino" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="almacenamiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GB</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {capacidades.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="ram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RAM</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                             <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ramOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                             <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estados.map(e => <SelectItem key={e} value={e}>{e.replace(/_/g, ' ')}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

            </CardContent>
          </Card>

          {/* SECCIÓN 2: PRECIOS Y BATERÍA */}
          <Card className="shadow-sm border-gray-200">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="precioCompra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="precioVenta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venta ($)</FormLabel>
                      <FormControl>
                        <Input type="number" className="font-bold text-blue-600" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="precioAnterior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Tachado (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bateriaScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-green-600 font-bold">
                      <Battery className="w-4 h-4" /> Batería (%)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                         <Input type="number" min="0" max="100" {...field} className="pl-9 font-bold text-lg" />
                         <span className="absolute left-3 top-2.5 text-gray-400">%</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>

          {/* SECCIÓN 3: FOTOS */}
          <Card className="shadow-sm border-gray-200">
            <CardContent className="pt-6">
               <FormField
                control={form.control}
                name="fotosJson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Galería de Fotos</FormLabel>
                    <FormControl>
                      <UploadFotos 
                        value={field.value ? JSON.parse(field.value) : []}
                        onChange={(urls) => field.onChange(JSON.stringify(urls))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4">
                 <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas / Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detalles extra..." {...field} rows={3} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 sticky bottom-4 bg-white/80 backdrop-blur p-4 rounded-xl border border-gray-200 shadow-lg z-10">
           <Button type="button" variant="ghost" onClick={() => router.back()}>
             Cancelar
           </Button>
           <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[200px] shadow-md shadow-blue-200">
             {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
             {initialData ? "Guardar Cambios" : "Crear Producto"}
           </Button>
        </div>
      </form>
    </Form>
  );
}