import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Bell, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Package, 
  Zap, 
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login");

  // 1. Obtener configuración real o usar valores por defecto
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { notifications: true }
  });

  // Valores por defecto si el usuario es nuevo
  const settings = user?.notifications || {
    emailOrders: true,
    whatsappPromos: false,
    securityAlerts: true
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-foreground">Preferencias de Notificación</h2>
        <p className="text-muted-foreground">Controla cómo y cuándo nos comunicamos contigo.</p>
      </div>

      <form className="space-y-8">
        
        {/* GRUPO 1: PEDIDOS Y LOGÍSTICA (Estilo Azul) */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-all hover:border-blue-500/20">
            <div className="p-6 border-b border-border bg-secondary/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Package size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg">Mis Pedidos</h3>
                        <p className="text-xs text-muted-foreground">Actualizaciones sobre tus compras y envíos.</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                <SwitchItem 
                    name="emailOrders"
                    label="Estado del Pedido por Email" 
                    desc="Recibe un correo cuando tu pedido sea enviado o entregado."
                    defaultChecked={settings.emailOrders}
                />
                <Separator className="bg-border" />
                <SwitchItem 
                    name="smsUpdates"
                    label="Actualizaciones por SMS" 
                    desc="Recibe mensajes de texto urgentes sobre tu entrega (Solo RD)."
                    defaultChecked={true}
                />
            </div>
        </section>

        {/* GRUPO 2: MARKETING (Estilo Púrpura) */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-all hover:border-purple-500/20">
            <div className="p-6 border-b border-border bg-secondary/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg">Ofertas y Novedades</h3>
                        <p className="text-xs text-muted-foreground">Sé el primero en enterarte de descuentos.</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                <SwitchItem 
                    name="newsletter"
                    label="Boletín Semanal" 
                    desc="Resumen de nuevos ingresos y bajadas de precio."
                    defaultChecked={false}
                />
                <Separator className="bg-border" />
                <SwitchItem 
                    name="whatsappPromos"
                    label="WhatsApp Promocional" 
                    desc="Permitir que SnowConnect me envíe ofertas flash por WhatsApp."
                    defaultChecked={settings.whatsappPromos}
                    badge="Recomendado"
                />
            </div>
        </section>

        {/* GRUPO 3: SEGURIDAD (Estilo Naranja/Ámbar - Crítico) */}
        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-all hover:border-orange-500/20">
            <div className="p-6 border-b border-border bg-secondary/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg">Seguridad</h3>
                        <p className="text-xs text-muted-foreground">Protección de tu cuenta y datos.</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                <SwitchItem 
                    name="securityAlerts"
                    label="Alertas de Inicio de Sesión" 
                    desc="Te avisaremos si alguien entra desde un dispositivo desconocido."
                    defaultChecked={settings.securityAlerts}
                    disabled={true} // Obligatorio por seguridad
                />
            </div>
        </section>

        {/* BOTÓN GUARDAR FLOTANTE O FIJO */}
        <div className="flex justify-end pt-4">
            <Button size="lg" className="rounded-xl font-bold px-8 bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all">
                <Save className="mr-2 h-4 w-4" /> Guardar Preferencias
            </Button>
        </div>

      </form>
    </div>
  );
}

// Componente Switch Moderno y Semántico
function SwitchItem({ name, label, desc, defaultChecked, disabled = false, badge }: any) {
    return (
        <div className={`flex items-start justify-between gap-4 ${disabled ? 'opacity-70' : ''}`}>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-foreground text-sm">{label}</p>
                    {badge && (
                        <span className="px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-md">{desc}</p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                    type="checkbox" 
                    name={name}
                    className="sr-only peer" 
                    defaultChecked={defaultChecked} 
                    disabled={disabled} 
                />
                {/* Track */}
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border"></div>
            </label>
        </div>
    );
}