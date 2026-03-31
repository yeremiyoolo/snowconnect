"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Tag, CheckCircle2, AlertCircle, X } from "lucide-react";
import { validateCoupon } from "@/actions/cupones/validate-coupon";
import { cn } from "@/lib/utils";

// Definimos la estructura exacta del cupón para evitar errores
interface DiscountData {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
}

interface CouponInputProps {
  userId: string;
  onApply: (discount: DiscountData | null) => void;
}

export default function CouponInput({ userId, onApply }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  // Manejar cambios en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase()); // Forzamos mayúsculas visualmente
    if (status === "error") {
      setStatus("idle"); // Borramos el error si el usuario intenta corregirlo
      setMsg("");
    }
  };

  async function handleRedeem() {
    if (!code.trim()) return;
    
    setLoading(true);
    setMsg("");
    setStatus("idle");

    try {
      const result = await validateCoupon(code, userId);

      if (result.error) {
        setStatus("error");
        setMsg(result.error);
        onApply(null);
      } else if (result.discount) {
        setStatus("success");
        // Formateamos el mensaje bonito
        const valor = result.discount.type === 'PERCENTAGE' 
          ? `${result.discount.value}%` 
          : `$${result.discount.value}`;
        
        setMsg(`¡Ahorras un ${valor}!`);
        onApply(result.discount as DiscountData);
      }
    } catch (error) {
      setStatus("error");
      setMsg("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // Función para quitar el cupón manualmente
  const clearCoupon = () => {
    setCode("");
    setStatus("idle");
    setMsg("");
    onApply(null);
  };

  return (
    <div className={cn(
      "space-y-3 p-4 rounded-xl border transition-all duration-300",
      status === "success" ? "bg-green-50/50 border-green-200" : "bg-secondary/30 border-border"
    )}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Tag size={16} className={status === "success" ? "text-green-600" : "text-primary"} />
          <span className={cn("text-sm font-bold", status === "success" ? "text-green-700" : "text-foreground")}>
            {status === "success" ? "Cupón Aplicado" : "¿Tienes un cupón?"}
          </span>
        </div>
        {status === "success" && (
          <Button variant="ghost" size="sm" onClick={clearCoupon} className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full">
            <X size={14} />
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input 
          placeholder="CÓDIGO" 
          value={code}
          onChange={handleChange}
          className={cn(
            "uppercase font-mono tracking-widest transition-all",
            status === "success" 
              ? "bg-green-100 border-green-300 text-green-800 font-bold focus-visible:ring-0" 
              : "bg-background"
          )}
          disabled={status === "success" || loading}
          onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
        />
        
        {status !== "success" && (
          <Button 
            onClick={handleRedeem} 
            disabled={loading || !code}
            className="font-bold min-w-[90px]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Canjear"}
          </Button>
        )}
      </div>

      {/* Mensajes de Estado con Animación */}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-500 text-xs font-medium animate-in slide-in-from-top-1">
          <AlertCircle size={14} /> {msg}
        </div>
      )}
      
      {status === "success" && (
        <div className="flex items-center gap-2 text-green-600 text-xs font-bold animate-in slide-in-from-top-1">
          <CheckCircle2 size={14} /> {msg}
        </div>
      )}
    </div>
  );
}