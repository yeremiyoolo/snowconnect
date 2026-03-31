"use client";

import { useState } from "react";
import { Lock, Laptop, KeyRound, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function SecurityPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState<"REQUEST" | "VERIFY">("REQUEST");
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 1. Solicitar Código
  const handleRequestCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: session?.user?.email }),
      });
      if (res.ok) {
        toast.success("Código enviado a tu correo");
        setStep("VERIFY");
      } else {
        toast.error("Error al enviar código");
      }
    } catch (e) {
      toast.error("Error de conexión");
    }
    setLoading(false);
  };

  // 2. Cambiar Contraseña
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Las contraseñas no coinciden");
    if (newPassword.length < 8) return toast.error("Mínimo 8 caracteres");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ 
          email: session?.user?.email,
          code: otpCode,
          newPassword 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Contraseña actualizada con éxito");
        setStep("REQUEST");
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Error al cambiar contraseña");
      }
    } catch (e) {
      toast.error("Error de servidor");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Seguridad Blindada</h2>
        <p className="text-muted-foreground">Protegemos tu cuenta con estándares bancarios.</p>
      </div>

      {/* SECCIÓN DE CONTRASEÑA */}
      <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-secondary/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Lock size={20} />
            </div>
            <div>
                <h3 className="font-bold text-foreground text-lg">Contraseña & Verificación</h3>
                <p className="text-xs text-muted-foreground">Usamos verificación por correo para cambios sensibles.</p>
            </div>
        </div>

        <div className="p-8">
            {step === "REQUEST" ? (
                <div className="space-y-6">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 text-yellow-600 dark:text-yellow-400">
                        <ShieldAlert className="shrink-0" />
                        <p className="text-sm font-medium">
                            Por tu seguridad, para cambiar tu contraseña primero debemos verificar que eres tú enviando un código a 
                            <span className="font-bold ml-1">{session?.user?.email}</span>.
                        </p>
                    </div>
                    <Button 
                        onClick={handleRequestCode} 
                        disabled={loading}
                        className="font-bold px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                        {loading ? "Enviando..." : "Enviar Código de Seguridad"}
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleChangePassword} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Código de Verificación (6 dígitos)</label>
                        <Input 
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="000000" 
                            className="bg-secondary/50 border-border h-12 text-center text-2xl tracking-[0.5em] font-mono"
                            maxLength={6}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Nueva Contraseña</label>
                            <Input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••" 
                                className="bg-secondary/50 border-border h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Confirmar Nueva</label>
                            <Input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••" 
                                className="bg-secondary/50 border-border h-11"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button type="submit" disabled={loading} className="font-bold px-8 h-11 bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none">
                            {loading ? "Verificando..." : "Confirmar Cambio"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setStep("REQUEST")} className="h-11">
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}
        </div>
      </section>

      {/* SECCIÓN DE SESIONES */}
      <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
        <div className="p-6 border-b border-border bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <Laptop size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-foreground text-lg">Sesiones Activas</h3>
                    <p className="text-xs text-muted-foreground">Controla dónde está abierta tu cuenta.</p>
                </div>
            </div>
            
            <Button variant="destructive" size="sm" className="font-bold rounded-xl h-9">
                Cerrar todas las sesiones
            </Button>
        </div>
        
        {/* ... (Mantén el contenido visual de sesiones que ya tenías, estaba bien) ... */}
         <div className="p-6 flex items-center gap-5 bg-primary/5">
             <div className="relative">
                 <div className="w-14 h-14 bg-background border-2 border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                     <Laptop size={28} />
                 </div>
                 <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-zinc-900"></span>
                 </span>
             </div>
             
             <div className="flex-1">
                 <div className="flex items-center gap-2">
                     <p className="font-black text-foreground text-lg">Este Dispositivo</p>
                     <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                         Activo ahora
                     </span>
                 </div>
                 <p className="text-sm text-muted-foreground mt-1">
                     Santiago, República Dominicana
                 </p>
             </div>
         </div>
      </section>
    </div>
  );
}