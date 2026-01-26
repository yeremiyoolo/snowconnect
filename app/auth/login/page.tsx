"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Package, Wrench, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  // 1. Lógica para Email/Password
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Intentamos loguear con "credentials" (Tu base de datos)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast({
        variant: "destructive",
        title: "Error de acceso",
        description: "Correo o contraseña incorrectos.",
      });
      setLoading(false);
    } else {
      toast({
        title: "¡Bienvenido!",
        className: "bg-green-600 text-white",
      });
      // Redirigir al inicio y refrescar para actualizar la sesión
      router.push("/");
      router.refresh();
    }
  }

  // 2. Lógica para Google
  const handleGoogleLogin = () => {
    setIsSocialLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  // 3. Lógica para Apple
  const handleAppleLogin = () => {
    setIsSocialLoading(true);
    signIn("apple", { callbackUrl: "/" });
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* --- LADO IZQUIERDO: FOTO IPHONE & BRANDING --- */}
      <div className="hidden md:flex flex-col justify-between bg-zinc-950 p-10 relative overflow-hidden text-white">
        
        {/* FOTO DEL IPHONE NEGRO (RECUPERADA) */}
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop')" }}
        />
        
        {/* Logo Superior */}
        <div className="relative z-10 flex items-center gap-2">
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
           </div>
           <span className="font-bold text-lg tracking-tight">SnowConnect</span>
        </div>

        {/* Texto Informativo */}
        <div className="relative z-10 space-y-8 max-w-md">
          <h2 className="text-3xl font-bold tracking-tight leading-tight">
            Todo tu mundo Apple <br/> en un solo lugar.
          </h2>
          
          <div className="space-y-5">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                   <Package size={20} />
                </div>
                <div>
                    <p className="font-bold text-sm">Rastreo de Pedidos</p>
                    <p className="text-xs text-zinc-400">Mira dónde va tu envío en tiempo real.</p>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                   <ShieldCheck size={20} />
                </div>
                <div>
                    <p className="font-bold text-sm">Garantía Segura</p>
                    <p className="text-xs text-zinc-400">Accede a tus facturas y certificados.</p>
                </div>
             </div>
          </div>
        </div>
        
        <div className="relative z-10 text-xs text-zinc-500">
          © 2024 SnowConnect Inc.
        </div>
      </div>

      {/* --- LADO DERECHO: FORMULARIO --- */}
      <div className="flex flex-col justify-center items-center p-8 bg-background text-foreground relative">
        
        <Link href="/" className="absolute top-8 right-8 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
           Volver al inicio
        </Link>

        <div className="w-full max-w-[350px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-black tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus datos para acceder.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
               <div className="relative">
                 <Mail className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                 <Input 
                    name="email" 
                    placeholder="correo@ejemplo.com" 
                    type="email" 
                    required 
                    className="pl-10 bg-secondary/50 border-border h-10"
                 />
               </div>
            </div>
            <div className="space-y-2">
               <div className="relative">
                 <Lock className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                 <Input 
                    name="password" 
                    placeholder="••••••••" 
                    type="password" 
                    required 
                    className="pl-10 bg-secondary/50 border-border h-10"
                 />
               </div>
            </div>

            <Button type="submit" className="w-full font-bold h-10 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || isSocialLoading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continúa con
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" type="button" onClick={handleGoogleLogin} disabled={isSocialLoading}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Google
             </Button>
             <Button variant="outline" type="button" onClick={handleAppleLogin} disabled={isSocialLoading}>
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.24.83-.62 1.66-1.14 2.38-.63.87-1.3 1.74-1.41 1.7zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                Apple
             </Button>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary font-bold">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}