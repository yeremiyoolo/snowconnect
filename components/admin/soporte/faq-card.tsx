"use client";

import { useState } from "react";
import { updateFaqItem, toggleFaqVisibility } from "@/actions/admin/faq-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Eye, EyeOff, HelpCircle, Tag, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqCard({ faq }: { faq: any }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateFaqItem(formData);
    setLoading(false);

    if (res.success) {
      toast.success("Pregunta actualizada con éxito");
    } else {
      toast.error(res.error || "Error al guardar");
    }
  }

  const handleToggle = async () => {
    const res = await toggleFaqVisibility(faq.id, faq.isVisible);
    if (res.success) {
      toast.success(faq.isVisible ? "Pregunta oculta en la web" : "Pregunta visible en la web");
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-[2.5rem] p-6 lg:p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="id" value={faq.id} />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <Badge variant="outline" className="bg-secondary/30 text-[10px] font-black uppercase tracking-widest">
              {faq.category}
            </Badge>
          </div>
          <Button 
            type="button" 
            onClick={handleToggle}
            variant="ghost" 
            size="sm" 
            className={cn("rounded-full px-3 h-8 gap-2 text-[10px] font-black uppercase tracking-widest", 
              faq.isVisible ? "text-green-600 hover:bg-green-50" : "text-muted-foreground hover:bg-secondary")}
          >
            {faq.isVisible ? <><Eye size={14}/> Visible</> : <><EyeOff size={14}/> Oculto</>}
          </Button>
        </div>

        {/* Campos */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12}/> La Pregunta
            </label>
            <Input 
              name="question" 
              defaultValue={faq.question} 
              className="h-12 rounded-xl font-bold border-border/50 focus:border-primary bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Tag size={12}/> Respuesta Detallada
            </label>
            <Textarea 
              name="answer" 
              defaultValue={faq.answer} 
              className="min-h-[120px] rounded-xl border-border/50 focus:border-primary bg-background resize-none text-sm p-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Categoría</label>
              <select 
                name="category" 
                defaultValue={faq.category}
                className="w-full h-11 rounded-xl bg-secondary/30 border border-border/50 text-xs font-bold px-3 outline-none"
              >
                <option value="GENERAL">General</option>
                <option value="VENTAS">Ventas</option>
                <option value="ENVIOS">Envíos</option>
                <option value="GARANTIA">Garantía</option>
                <option value="REPARACIONES">Reparaciones</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20">
                <Save size={16}/> {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}