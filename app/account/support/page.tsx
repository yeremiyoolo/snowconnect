"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  Send, 
  LifeBuoy,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { submitRepair } from "@/app/actions/submit-repair"; 
import { useToast } from "@/hooks/use-toast"; 

export default function SupportPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast(); 

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return router.push("/auth/login");

    setLoading(true);
    
    const form = new FormData(e.currentTarget);
    const motivo = form.get("motivo") as string;
    const mensaje = form.get("mensaje") as string;

    const dataToSend = new FormData();
    dataToSend.append("serviceType", "GENERAL"); 
    dataToSend.append("device", "Soporte Web: " + motivo); 
    dataToSend.append("details", mensaje); 

    const res = await submitRepair(dataToSend);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else {
      alert("Error al enviar: " + res.error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Centro de Ayuda</h2>
        <p className="text-muted-foreground">¿Tienes algún problema? Estamos aquí para resolverlo.</p>
      </div>

      {/* BANNER DE CONTACTO DIRECTO */}
      <div className="relative overflow-hidden rounded-3xl bg-blue-50 dark:bg-blue-900/20 p-8 border border-blue-100 dark:border-blue-800">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-[10px] font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-700">
                        Soporte Prioritario
                    </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-blue-950 dark:text-blue-50">
                    ¿Necesitas ayuda urgente?
                </h3>
                <p className="text-blue-800 dark:text-blue-200 font-medium max-w-md">
                    Nuestro equipo está disponible en tiempo real de Lunes a Sábado, 9:00 AM - 6:00 PM.
                </p>
            </div>
            
            <Link href="https://wa.me/18290000000" target="_blank" className="shrink-0">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-600/20 transition-transform hover:scale-105">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Chat por WhatsApp
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA 1: FAQ y Recursos */}
        <div className="space-y-6">
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-secondary/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg">Temas Frecuentes</h3>
                        <p className="text-xs text-muted-foreground">Respuestas rápidas a dudas comunes.</p>
                    </div>
                </div>
                
                <div className="divide-y divide-border">
                    <SupportItem title="¿Cómo funciona la garantía de 1 año?" />
                    <SupportItem title="Política de devoluciones y reembolsos" />
                    <SupportItem title="Tiempos de envío al interior del país" />
                    <SupportItem title="¿Cómo funciona el Trade-In (Canje)?" />
                    <SupportItem title="Quiero borrar mis datos personales" />
                </div>
            </div>
        </div>

        {/* COLUMNA 2: TICKET DE SOPORTE */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-border bg-secondary/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <LifeBuoy size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-foreground text-lg">Abrir un Ticket</h3>
                    <p className="text-xs text-muted-foreground">Si no es urgente, escríbenos por aquí.</p>
                </div>
            </div>

            <div className="p-6 flex-1">
                {success ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">¡Mensaje Enviado!</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs">
                            Hemos recibido tu ticket. Te responderemos a tu correo en breve.
                        </p>
                        <Button variant="outline" onClick={() => setSuccess(false)} className="mt-6">
                            Enviar otro mensaje
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground uppercase ml-1">Motivo</label>
                            {/* CORRECCIÓN AQUI: defaultValue en select, no selected en option */}
                            <select 
                                name="motivo"
                                required
                                defaultValue="" 
                                className="w-full h-11 px-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none"
                            >
                                <option value="" disabled>Selecciona el motivo...</option>
                                <option value="Pedido">Problema con un Pedido</option>
                                <option value="Trade-In">Problema con Trade-In</option>
                                <option value="Web">Error en la web</option>
                                <option value="Garantia">Solicitud de Garantía</option>
                                <option value="Otro">Otro asunto</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground uppercase ml-1">Mensaje</label>
                            <Textarea 
                                name="mensaje"
                                required
                                className="bg-secondary/50 border-border focus:bg-background min-h-[140px] resize-none rounded-xl"
                                placeholder="Describe tu problema detalladamente. Incluye número de pedido si aplica..."
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full font-bold h-12 bg-primary text-primary-foreground rounded-xl mt-2 shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                            ) : (
                                <><Send className="mr-2 h-4 w-4" /> Enviar Solicitud</>
                            )}
                        </Button>
                    </form>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}

function SupportItem({ title }: { title: string }) {
    return (
        <button className="w-full p-4 text-left flex justify-between items-center hover:bg-secondary/50 transition-colors group">
            <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">{title}</span>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
    )
}