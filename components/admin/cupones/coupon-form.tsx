"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// 🍎 Usamos tu acción existente
import { createCoupon } from "@/actions/admin/create-coupon";
import { toast } from "sonner";
import { Percent, Calendar, Hash, Save, Loader2, Users, DollarSign, Zap } from "lucide-react";

export function CouponForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createCoupon(formData);
    setLoading(false);

    if (res.success) {
      toast.success("Cupón creado exitosamente");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error || "Error al crear cupón");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-border/50 rounded-[3rem] p-10 shadow-2xl space-y-8 group">
      
      <div className="space-y-6">
        {/* CÓDIGO GRANDOTE Y LLAMATIVO */}
        <div className="space-y-2 bg-secondary/30 p-5 rounded-2xl border border-dashed border-border group-focus-within:border-primary transition-all">
          <Label className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 mb-1.5"><Hash size={12}/> Código del Cupón</Label>
          <Input 
            name="code" 
            placeholder="SNOW2026" 
            className="h-16 px-6 rounded-xl font-black uppercase italic text-3xl tracking-tighter bg-background border-transparent group-focus-within:ring-2 group-focus-within:ring-primary/20" 
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tipo Descuento</Label>
            <Select name="type" defaultValue="PERCENTAGE">
              <SelectTrigger className="h-12 rounded-xl font-bold bg-secondary/30 border-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Porcentaje (%)</SelectItem>
                <SelectItem value="FIXED">Monto Fijo (RD$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Valor</Label>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input name="value" type="number" placeholder="10" className="h-12 pl-12 rounded-xl font-bold bg-secondary/30 border-transparent" required />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Límite de Usos</Label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input name="maxUses" type="number" placeholder="100" className="h-12 pl-12 rounded-xl font-bold bg-secondary/30 border-transparent" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fecha Expiración</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input name="expiresAt" type="date" className="h-12 pl-12 rounded-xl font-bold bg-secondary/30 border-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* 🍎 BOTÓN MEJORADO A ESTILO APPLE PREMIUM: Gradiente, pulso y resplandor */}
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:from-[#00b4e6] hover:to-[#006bd6] text-white font-black uppercase tracking-widest text-sm gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:drop-shadow-[0_0_15px_rgba(0,198,255,0.6)]"
      >
        {loading ? (
            <Loader2 className="animate-spin" />
        ) : (
            <Zap size={20} className="fill-white animate-pulse" /> 
        )}
        Crear Cupón Snow ❄️
      </Button>
    </form>
  );
}