"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFlashOffer } from "@/actions/ofertas-flash/crear-oferta";
import { toast } from "sonner";
import { Zap, Clock, Percent, Package, Loader2 } from "lucide-react";

export default function CreateOfferForm({ productos }: { productos: any[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const porcentaje = formData.get("porcentaje");
    const duracion = formData.get("duracion");

    // Validación local rápida
    if (!selectedProduct) return toast.error("Selecciona un equipo");
    if (!porcentaje) return toast.error("Indica el porcentaje");
    if (!duracion) return toast.error("Indica la duración en horas");

    setLoading(true);

    try {
      // 🍎 SINCRONIZACIÓN TOTAL CON EL SERVIDOR:
      // Usamos exactamente los nombres que espera tu archivo 'crear-oferta.ts'
      const syncData = new FormData();
      syncData.append("productoId", selectedProduct);
      syncData.append("porcentaje", porcentaje.toString());
      syncData.append("duracion", duracion.toString());

      const res = await createFlashOffer(syncData);
      
      if (res?.success) {
        toast.success("¡Oferta Flash activada correctamente!");
        (e.target as HTMLFormElement).reset();
        setSelectedProduct("");
      } else {
        toast.error(res?.error || "Error al procesar la oferta");
      }
    } catch (error) {
      toast.error("Error crítico de comunicación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-orange-500/30 rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        
        {/* 1. SELECCIÓN DE EQUIPO */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
            <Package size={14}/> 1. Equipo en Oferta
          </Label>
          <Select onValueChange={setSelectedProduct} value={selectedProduct}>
            <SelectTrigger className="h-14 rounded-2xl font-bold bg-secondary/30 border-transparent">
              <SelectValue placeholder="Selecciona un equipo..." />
            </SelectTrigger>
            <SelectContent>
              {productos.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.marca} {p.modelo} — RD$ {p.precioVenta.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 2. PORCENTAJE (Tu servidor lo llama "porcentaje") */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
              <Percent size={14}/> 2. Descuento (%)
            </Label>
            <Input 
              name="porcentaje" 
              type="number" 
              placeholder="15" 
              className="h-14 rounded-2xl font-black text-2xl bg-secondary/30 border-transparent text-center" 
              required 
            />
          </div>

          {/* 3. DURACIÓN (Tu servidor lo llama "duracion" y espera horas) */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
              <Clock size={14}/> 3. Horas Activo
            </Label>
            <Input 
              name="duracion" 
              type="number" 
              placeholder="24" 
              className="h-14 rounded-2xl font-black text-2xl bg-secondary/30 border-transparent text-center" 
              required 
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-16 rounded-[1.8rem] bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase tracking-widest text-sm gap-3 shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} className="fill-white" />}
          ACTIVAR OFERTA FLASH
        </Button>

      </form>
    </div>
  );
}