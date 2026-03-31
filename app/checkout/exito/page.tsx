import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = params?.orderId;

  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-neutral-50 dark:bg-neutral-950">
        <div className="p-10 bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-xl border border-border">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
          <h1 className="text-xl font-black uppercase italic">Orden no encontrada</h1>
          <Link href="/catalogo">
            <Button variant="link" className="mt-4 text-blue-600 font-bold uppercase">Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Buscamos la orden real en la base de datos
  const order = await prisma.order.findUnique({
    where: { id: orderId }, 
    include: { user: true, items: true }
  });

  if (!order) return <div className="min-h-screen flex items-center justify-center font-black italic uppercase">Cargando...</div>;

  const orderNum = order.orderNumber || orderId.slice(-6).toUpperCase();
  
  const message = `*¡Hola SnowConnect!* 👋❄️\n\n` +
    `Acabo de realizar un pedido en su sitio web.\n\n` +
    `🆔 *Orden:* #${orderNum}\n` +
    `👤 *Nombre:* ${order.user?.name || "Cliente"}\n` +
    `💰 *Monto:* RD$ ${order.total.toLocaleString()}\n\n` +
    `*Quedo a la espera de su respuesta para completar el proceso de compra y coordinar el pago/entrega. ¡Muchas gracias!*`;

  // 🔥 RECUERDA: Cambia el '18090000000' por tu número real de WhatsApp de SnowConnect
  const whatsappUrl = `https://wa.me/18090000000?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-neutral-50 dark:bg-neutral-950 animate-in fade-in duration-1000">
      
      <div className="bg-white dark:bg-neutral-900 p-10 rounded-[3rem] shadow-2xl shadow-green-500/10 max-w-md w-full border border-green-500/10 relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
        
        <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30 animate-in zoom-in duration-700">
          <CheckCircle size={48} className="text-white" />
        </div>

        <h1 className="text-4xl font-black mb-3 text-foreground uppercase italic tracking-tighter">
          ¡Pedido <span className="text-green-500">Recibido</span>!
        </h1>
        <p className="text-muted-foreground font-bold text-sm uppercase opacity-70 mb-8 px-4">
          Tu equipo ha sido reservado. Finaliza el proceso por WhatsApp.
        </p>

        <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-[2rem] mb-8 text-center border border-border/50">
          <p className="text-[10px] font-black uppercase opacity-40 mb-2 tracking-[0.2em]">Número de Orden</p>
          <p className="font-black text-2xl text-foreground tracking-widest italic">#{orderNum}</p>
          <Separator className="my-3 opacity-10" />
          <p className="text-2xl font-black text-green-600 italic">RD$ {order.total.toLocaleString()}</p>
        </div>

        <div className="space-y-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full group">
              <Button className="w-full h-20 text-xl font-black rounded-[1.8rem] bg-[#25D366] hover:bg-[#1ebd59] text-white shadow-2xl shadow-green-500/30 gap-3 transition-all hover:scale-[1.03] active:scale-95 uppercase tracking-tighter">
                  <MessageCircle size={28} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                  Finalizar Compra
              </Button>
            </a>

            {/* 🍎 MANZANITA: Quitamos el componente <Button> y dejamos solo el <Link> como texto */}
            <Link 
              href="/catalogo" 
              className="flex items-center justify-center w-full py-4 text-muted-foreground font-black uppercase italic text-xs tracking-widest hover:text-foreground hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 group/link"
            >
              <ArrowRight size={16} className="mr-2 group-hover/link:-translate-x-1 transition-transform" /> 
              Seguir Comprando
            </Link>
        </div>

        <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.3em] mt-8 italic">
            SnowConnect ❄️ Santiago, RD
        </p>
      </div>

    </div>
  );
}

// Pequeño componente separador rápido
function Separator({ className }: { className?: string }) {
    return <div className={`h-[1px] w-full bg-foreground ${className}`} />
}