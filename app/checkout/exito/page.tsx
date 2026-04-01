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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
        <div className="p-10 bg-card rounded-[2.5rem] shadow-xl border border-border">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-20 text-foreground" />
          <h1 className="text-xl font-black uppercase italic text-foreground">Orden no encontrada</h1>
          <Link href="/catalogo">
            <Button variant="link" className="mt-4 text-blue-600 font-bold uppercase">Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId }, 
    include: { user: true, items: true }
  });

  if (!order) return <div className="min-h-screen flex items-center justify-center font-black italic uppercase text-foreground bg-background">Cargando...</div>;

  const orderNum = order.orderNumber || orderId.slice(-6).toUpperCase();
  
  const message = `*¡Hola SnowConnect!* 👋❄️\n\n` +
    `Acabo de realizar un pedido en su sitio web.\n\n` +
    `🆔 *Orden:* #${orderNum}\n` +
    `👤 *Nombre:* ${order.user?.name || "Cliente"}\n` +
    `💰 *Monto:* RD$ ${order.total.toLocaleString()}\n\n` +
    `*Quedo a la espera de su respuesta para completar el proceso de compra y coordinar el pago/entrega. ¡Muchas gracias!*`;

  // 🔥 RECUERDA: Cambia el '18090000000' por tu número real
  const whatsappUrl = `https://wa.me/18090000000?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background animate-in fade-in duration-1000">
      
      {/* 🌙 Cambio a bg-card y border-border para modo oscuro */}
      <div className="bg-card p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-green-500/5 max-w-md w-full border border-border relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 dark:bg-green-600 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl shadow-green-500/20 animate-in zoom-in duration-700">
          <CheckCircle size={40} className="text-white md:w-12 md:h-12" />
        </div>

        <h1 className="text-3xl md:text-4xl font-black mb-3 text-foreground uppercase italic tracking-tighter">
          ¡Pedido <span className="text-green-500 dark:text-green-400">Recibido</span>!
        </h1>
        <p className="text-muted-foreground font-bold text-xs md:text-sm uppercase opacity-80 mb-6 md:mb-8 px-2 md:px-4">
          Tu equipo ha sido reservado. Finaliza el proceso por WhatsApp.
        </p>

        <div className="bg-secondary p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] mb-6 md:mb-8 text-center border border-border/50">
          <p className="text-[9px] md:text-[10px] font-black uppercase opacity-60 mb-2 tracking-[0.2em] text-foreground">Número de Orden</p>
          <p className="font-black text-xl md:text-2xl text-foreground tracking-widest italic">#{orderNum}</p>
          <Separator className="my-3 opacity-20" />
          <p className="text-xl md:text-2xl font-black text-green-600 dark:text-green-400 italic">RD$ {order.total.toLocaleString()}</p>
        </div>

        <div className="space-y-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full group">
              <Button className="w-full h-16 md:h-20 text-lg md:text-xl font-black rounded-[1.5rem] md:rounded-[1.8rem] bg-[#25D366] hover:bg-[#1ebd59] text-white shadow-xl shadow-green-500/20 gap-3 transition-all hover:scale-[1.03] active:scale-95 uppercase tracking-tighter">
                  <MessageCircle size={24} fill="currentColor" className="group-hover:rotate-12 transition-transform md:w-7 md:h-7" />
                  Finalizar Compra
              </Button>
            </a>

            <Link 
              href="/catalogo" 
              className="flex items-center justify-center w-full py-3 md:py-4 text-muted-foreground font-black uppercase italic text-[10px] md:text-xs tracking-widest hover:text-foreground transition-all duration-300 group/link"
            >
              <ArrowRight size={14} className="mr-2 group-hover/link:-translate-x-1 transition-transform md:w-4 md:h-4" /> 
              Seguir Comprando
            </Link>
        </div>

        <p className="text-[9px] md:text-[10px] font-black opacity-30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-6 md:mt-8 italic text-foreground">
            SnowConnect ❄️ Santiago, RD
        </p>
      </div>

    </div>
  );
}

function Separator({ className }: { className?: string }) {
    return <div className={`h-[1px] w-full bg-border ${className}`} />
}