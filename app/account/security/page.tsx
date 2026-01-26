"use client";

import { Lock, Laptop, LogOut, KeyRound, ShieldAlert, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SecurityPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Seguridad de la Cuenta</h2>
        <p className="text-muted-foreground">Gestiona tu contraseña y controla dónde has iniciado sesión.</p>
      </div>

      {/* 1. CAMBIO DE CONTRASEÑA */}
      <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-secondary/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <KeyRound size={20} />
            </div>
            <div>
                <h3 className="font-bold text-foreground text-lg">Contraseña</h3>
                <p className="text-xs text-muted-foreground">Se recomienda usar una contraseña fuerte y única.</p>
            </div>
        </div>

        <div className="p-8">
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Contraseña Actual</label>
                        <Input 
                            type="password" 
                            placeholder="••••••••••••" 
                            className="bg-secondary/50 border-border focus:bg-background h-11"
                        />
                    </div>
                </div>
                
                <Separator className="bg-border" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Nueva Contraseña</label>
                        <Input 
                            type="password" 
                            placeholder="Mínimo 8 caracteres" 
                            className="bg-secondary/50 border-border focus:bg-background h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Confirmar Nueva</label>
                        <Input 
                            type="password" 
                            placeholder="Repite la contraseña" 
                            className="bg-secondary/50 border-border focus:bg-background h-11"
                        />
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <Button className="font-bold px-8 h-11 bg-primary text-primary-foreground">
                        Actualizar Contraseña
                    </Button>
                </div>
            </form>
        </div>
      </section>

      {/* 2. DISPOSITIVOS Y SESIONES */}
      <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-foreground text-lg">Dispositivos Activos</h3>
                    <p className="text-xs text-muted-foreground">Estás conectado actualmente en este dispositivo.</p>
                </div>
            </div>
            
            <Button variant="destructive" size="sm" className="font-bold rounded-xl h-9">
                Cerrar todas las sesiones
            </Button>
        </div>
        
        <div className="divide-y divide-border">
            {/* Sesión Actual (Realista y Genérica) */}
            <div className="p-6 flex items-center gap-5 bg-primary/5">
                <div className="relative">
                    <div className="w-14 h-14 bg-background border-2 border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        {/* Icono genérico que sirve para PC o Móvil */}
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
                        Navegador Web • Santiago, República Dominicana (Aproximado)
                    </p>
                </div>
                
                <div className="hidden sm:block text-right">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground" disabled>
                        Sesión Actual
                    </Button>
                </div>
            </div>

            {/* NOTA DE SEGURIDAD */}
            <div className="p-4 bg-secondary/30 text-center">
                <p className="text-xs text-muted-foreground">
                    ¿No reconoces un inicio de sesión? Cambia tu contraseña inmediatamente.
                </p>
            </div>
        </div>
      </section>

    </div>
  );
}