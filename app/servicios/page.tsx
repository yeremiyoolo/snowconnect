'use client';

import { useState } from 'react';
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Wrench, ArrowRight, RefreshCcw, Battery, Zap, Database, 
  ShieldCheck, MessagesSquare, ChevronRight, X, Loader2, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitRepair } from '@/app/actions/submit-repair';

export default function ServiciosPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedService, setSelectedService] = useState<"SCREEN" | "BATTERY" | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Manejador del Formulario
  async function handleRepairSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return router.push("/auth/login");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("serviceType", selectedService!); 

    const res = await submitRepair(formData);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedService(null);
        // ✅ CORRECCIÓN: Ahora redirige a la sección de reparaciones
        router.push("/account/repairs"); 
      }, 2000);
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-8 selection:bg-primary/20 selection:text-primary">
      
      <div className="max-w-[1440px] mx-auto space-y-24">
        
        {/* 1. HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-primary text-xs font-black uppercase tracking-[0.15em] mb-2 border border-border/50 shadow-sm">
              <Wrench size={12} /> Snow Support
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[1.1]">
             Cuidamos tu tecnología <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">como si fuera nuestra.</span>
           </h1>
           <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
             Desde renovar tu equipo hasta reparaciones certificadas. <br className="hidden md:block"/>
             Todo sucede en un solo lugar con la garantía Snow™.
           </p>
        </div>

        {/* 2. BENTO GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* --- CARD 1: TRADE-IN --- */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card p-10 md:p-12 min-h-[550px] flex flex-col justify-between group cursor-pointer shadow-2xl shadow-black/5 border border-border/60 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
               <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -z-10" />

               <div className="relative z-10">
                 <div className="w-16 h-16 bg-background/80 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-white/10 dark:border-white/5 text-blue-600 group-hover:scale-110 transition-transform">
                    <RefreshCcw size={30} />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-foreground italic tracking-tighter mb-5 leading-[0.95]">
                   Renueva <br/> tu equipo.
                 </h2>
                 <p className="text-muted-foreground max-w-md text-lg font-medium leading-relaxed">
                   Entrega tu iPhone actual como parte de pago y llévate el modelo nuevo por menos. 
                   <span className="text-foreground font-bold"> Valoración garantizada.</span>
                 </p>
               </div>

               <div className="relative z-10 mt-10 space-y-5">
                  <div className="grid gap-3">
                    {[
                      { title: "Cotización Instantánea", desc: "Recibe tu oferta al momento." },
                      { title: "Revisión Express", desc: "Validación rápida en tienda." },
                      { title: "Crédito Inmediato", desc: "Úsalo en tu nuevo iPhone." }
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/30 group-hover:bg-secondary/60 transition-colors">
                         <div className="flex-shrink-0 w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm mt-0.5">
                           {i + 1}
                         </div>
                         <div>
                            <h4 className="text-foreground font-bold text-sm leading-none mb-1">{step.title}</h4>
                            <p className="text-muted-foreground text-sm leading-tight">{step.desc}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link href="/sell" className="block w-full pt-4">
                    <Button className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] flex items-center justify-between px-6 group/btn relative overflow-hidden">
                       <span className="relative z-10">Cotizar ahora</span>
                       <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
               </div>
            </div>

            {/* --- CARDS 2 & 3: SERVICIO TÉCNICO --- */}
            <div className="flex flex-col gap-8 h-full">
               
               {/* Reparación Batería */}
               <div className="flex-1 bg-card rounded-[2.5rem] p-10 border border-border/60 flex flex-col justify-center items-start hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-14 h-14 bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-green-500/20 group-hover:ring-green-500/40 transition-all">
                     <Battery size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">Cambio de Batería</h3>
                  <p className="text-muted-foreground text-sm mb-8 max-w-sm font-medium leading-relaxed">
                    ¿Tu celular se descarga rápido? Reemplazamos tu batería con piezas originales y reprogramación de ciclo oficial.
                  </p>
                  <Button 
                    onClick={() => setSelectedService("BATTERY")}
                    className="h-12 px-6 rounded-full bg-secondary text-secondary-foreground font-bold text-sm hover:bg-foreground hover:text-background transition-colors group/btn border border-border/50"
                  >
                    Agendar Cita <ChevronRight className="ml-2 w-4 h-4 opacity-50 group-hover/btn:translate-x-1 transition-all" />
                  </Button>
               </div>

               {/* Reparación Pantalla */}
               <div className="flex-1 bg-card rounded-[2.5rem] p-10 border border-border/60 flex flex-col justify-center items-start hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] opacity-50 group-hover:opacity-100 transition-opacity" />

                  <div className="w-14 h-14 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
                     <Smartphone size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">Pantalla Rota</h3>
                  <p className="text-muted-foreground text-sm mb-8 max-w-sm font-medium leading-relaxed">
                    Recupera la nitidez y el touch original. Instalación profesional con sello de resistencia al agua y True Tone.
                  </p>
                  <Button 
                    onClick={() => setSelectedService("SCREEN")}
                    className="h-12 px-6 rounded-full bg-secondary text-secondary-foreground font-bold text-sm hover:bg-foreground hover:text-background transition-colors group/btn border border-border/50"
                  >
                    Consultar Precio <ChevronRight className="ml-2 w-4 h-4 opacity-50 group-hover/btn:translate-x-1 transition-all" />
                  </Button>
               </div>

            </div>
        </div>

        {/* 3. SERVICIOS ADICIONALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: "Transferencia de Datos", icon: Database, desc: "Pasamos toda tu info (fotos, chats, contactos) de tu celular viejo al nuevo gratis." },
             { title: "Diagnóstico Gratis", icon: Zap, desc: "Revisamos tu equipo para decirte exactamente qué tiene antes de reparar." },
             { title: "Soporte Post-Venta", icon: ShieldCheck, desc: "¿Dudas con tu nuevo iPhone? Te enseñamos a configurarlo y usarlo al 100%." }
           ].map((item, i) => (
             <div key={i} className="bg-card p-8 rounded-[2rem] border border-border/50 hover:border-border hover:bg-secondary/20 transition-all group">
                <item.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-lg text-foreground mb-2 tracking-tight">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* 4. CTA FOOTER */}
        <div className="bg-primary rounded-[3rem] p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
           <div className="relative z-10 max-w-2xl mx-auto">
             <MessagesSquare size={48} className="mx-auto mb-6 text-primary-foreground/80" />
             <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">¿Tienes alguna duda específica?</h2>
             <p className="text-primary-foreground/90 text-lg mb-8 font-medium">
              Expertos están listos para responderte. No bots, personas reales.
             </p>
             <Link href="https://wa.me/18090000000" target="_blank">
                <Button size="lg" className="h-14 px-10 rounded-full bg-background text-foreground font-bold hover:bg-secondary hover:scale-105 transition-all shadow-xl">
                  Hablar con un experto
                </Button>
             </Link>
           </div>
        </div>

        {/* --- MODAL FLOTANTE (Formulario de Servicio) --- */}
        <AnimatePresence>
          {selectedService && (
            <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedService(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden"
              >
                {/* Botón Cerrar */}
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors z-10">
                  <X size={20} />
                </button>

                {success ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300 shadow-lg shadow-green-500/30">
                      <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground">¡Solicitud Creada!</h3>
                    <p className="text-muted-foreground mt-2 font-medium">Un técnico revisará tu caso y te contactará en breve.</p>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className="mb-6 flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${selectedService === 'SCREEN' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                            {selectedService === 'SCREEN' ? <Smartphone size={28} /> : <Battery size={28} />}
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nueva Solicitud</span>
                            <h2 className="text-xl font-black text-foreground leading-tight">
                                {selectedService === 'SCREEN' ? "Reparación de Pantalla" : "Cambio de Batería"}
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={handleRepairSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Tu Dispositivo</label>
                        <Input 
                          name="device" 
                          placeholder="Ej: iPhone 13 Pro Max" 
                          required 
                          className="h-12 rounded-xl bg-secondary/50 border-border focus:bg-background transition-all font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Detalles del Problema</label>
                        <textarea 
                          name="details" 
                          placeholder={selectedService === 'SCREEN' ? "¿El touch funciona? ¿Se ve la imagen?..." : "¿Qué porcentaje de salud tiene? ¿Se calienta?..."}
                          className="w-full h-32 rounded-xl border border-border bg-secondary/50 focus:bg-background p-4 text-sm font-semibold resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                        ></textarea>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full h-12 rounded-xl font-bold text-base bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg mt-2"
                      >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Crear Ticket de Soporte"}
                      </Button>
                      
                      {!session && (
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-bold text-center border border-red-100 dark:border-red-900/50">
                          ⚠️ Debes iniciar sesión para agendar.
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}