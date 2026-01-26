"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        toast({
          title: "¡Cuenta creada!",
          description: "Ahora puedes iniciar sesión con tus credenciales.",
        });
        router.push("/auth/login");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Error al registrarse");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* 1. LADO IZQUIERDO: BRANDING (Igual que el Login para consistencia) */}
      <div className="hidden md:flex flex-col justify-between bg-zinc-950 p-10 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556656793-02715d8dd660?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 flex items-center gap-2">
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={24} height={24} />
           </div>
           <span className="font-bold text-lg tracking-tight">SnowConnect</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight leading-tight">
            Únete a la comunidad tecnológica <br/> más segura de RD.
          </h2>
          <p className="text-zinc-400">
            Crea tu cuenta para comprar, vender y gestionar tus pedidos en un solo lugar.
          </p>
        </div>
      </div>

      {/* 2. LADO DERECHO: FORMULARIO DE REGISTRO */}
      <div className="flex flex-col justify-center items-center p-8 bg-background text-foreground relative">
        
        <Link href="/" className="absolute top-8 right-8 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
           Volver al inicio
        </Link>

        <div className="w-full max-w-[350px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-black tracking-tight">Crear una cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus datos para comenzar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Nombre */}
            <div className="space-y-2">
               <div className="relative">
                 <User className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                 <Input 
                    name="name" 
                    placeholder="Nombre Completo" 
                    type="text" 
                    required 
                    className="pl-10 bg-secondary/50 border-border focus:bg-background transition-colors h-10"
                 />
               </div>
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
               <div className="relative">
                 <Mail className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                 <Input 
                    name="email" 
                    placeholder="correo@ejemplo.com" 
                    type="email" 
                    required 
                    className="pl-10 bg-secondary/50 border-border focus:bg-background transition-colors h-10"
                 />
               </div>
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
               <div className="relative">
                 <Lock className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                 <Input 
                    name="password" 
                    placeholder="Contraseña segura" 
                    type="password" 
                    required 
                    minLength={6}
                    className="pl-10 bg-secondary/50 border-border focus:bg-background transition-colors h-10"
                 />
               </div>
            </div>

            <Button type="submit" className="w-full font-bold h-10 bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Registrarme"}
            </Button>
          </form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary font-bold">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}