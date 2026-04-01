"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { useCart } from "@/hooks/use-cart"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, ShieldCheck, Loader2, ArrowRight, ShoppingBag } from "lucide-react";
import { createOrder } from "@/actions/create-order"; 
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, clearCart } = useCart(); 
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user?.name) {
      setFormData(prev => ({ ...prev, name: session.user.name || "" }));
    }
  }, [session]);

  if (!mounted) return null;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal;

  async function handlePlaceOrder() {
    if (!session?.user) return toast.error("Inicia sesión para comprar.");
    
    if (!formData.phone || !formData.address || !formData.city) {
      return toast.error("Por favor, completa todos los datos de envío.");
    }

    setLoading(true);

    try {
      const result = await createOrder({
        userId: (session.user as any).id,
        items: items.map(i => ({
          id: i.id, 
          quantity: i.quantity
        })),
        shippingDetails: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        paymentMethod: "WHATSAPP"
      });

      if (result.error) {
        toast.error(result.error);
        setLoading(false);
      } else {
        toast.success("¡Pedido realizado con éxito! ❄️");
        clearCart(); 
        router.push(`/checkout/exito?orderId=${result.orderId}`);
      }
    } catch (error) {
      toast.error("Error al procesar el pedido.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <ShoppingBag size={64} className="opacity-20 text-foreground" />
        <p className="text-xl font-bold italic opacity-50 uppercase tracking-tighter text-foreground">Tu bolsa está vacía</p>
        <Button onClick={() => router.push('/catalogo')} className="rounded-xl font-bold">Ir al Catálogo</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8 pt-32 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-2 bg-blue-600 rounded-full" />
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground">
                Finalizar <span className="text-blue-600">Compra</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8">
            {/* 🌙 Cambio a bg-card y border-border para modo oscuro */}
            <Card className="p-8 border border-border shadow-lg bg-card rounded-[2rem] md:rounded-[3rem]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <MapPin size={20} />
                </div>
                <h2 className="font-black text-xl uppercase italic text-foreground">Dirección de Entrega</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1 opacity-50 text-foreground">Nombre Completo</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Juan Pérez" 
                    className="rounded-2xl h-14 bg-secondary border-none ring-1 ring-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1 opacity-50 text-foreground">WhatsApp de Contacto</Label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="8090000000" 
                    className="rounded-2xl h-14 bg-secondary border-none ring-1 ring-border text-foreground"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase ml-1 opacity-50 text-foreground">Dirección Exacta</Label>
                  <Input 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Calle, número de casa, sector..." 
                    className="rounded-2xl h-14 bg-secondary border-none ring-1 ring-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase ml-1 opacity-50 text-foreground">Ciudad / Provincia</Label>
                  <Input 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Ej: Santiago" 
                    className="rounded-2xl h-14 bg-secondary border-none ring-1 ring-border text-foreground"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 border border-border shadow-lg bg-card rounded-[2rem] md:rounded-[3rem]">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                    <ShieldCheck size={20} />
                  </div>
                  <h2 className="font-black text-xl uppercase italic text-foreground">Método de Pago</h2>
               </div>
               <div className="p-6 bg-green-500/5 border-2 border-green-500/20 rounded-[2rem] flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <Phone size={24} />
                 </div>
                 <div>
                    <p className="font-black text-green-600 dark:text-green-400 uppercase italic">Acordar por WhatsApp</p>
                    <p className="text-xs font-medium text-foreground opacity-60">Te enviaremos los detalles de pago al finalizar.</p>
                 </div>
               </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="p-6 md:p-8 border border-border shadow-xl bg-card rounded-[2rem] md:rounded-[3rem] sticky top-24 md:top-32">
                <h3 className="font-black text-2xl mb-8 uppercase italic tracking-tighter text-foreground">Tu <span className="text-blue-600 dark:text-blue-400">Bolsa</span></h3>
                
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 items-center group">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border bg-white dark:bg-zinc-800 p-1 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[11px] uppercase line-clamp-1 text-foreground">{item.name}</p>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400">RD$ {item.price.toLocaleString()} <span className="text-muted-foreground ml-1">x {item.quantity}</span></p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary p-6 rounded-[2rem] space-y-4 mb-8 border border-border/50">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-foreground opacity-60">
                        <span>Envío</span>
                        <span className="text-green-600 dark:text-green-400 font-black">Gratis</span>
                    </div>
                    <Separator className="opacity-20" />
                    <div className="flex justify-between items-end">
                        <span className="font-black text-sm uppercase italic text-foreground">Total</span>
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter italic">RD$ {total.toLocaleString()}</span>
                    </div>
                </div>

                <Button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full h-16 md:h-20 text-lg md:text-xl font-black rounded-[1.5rem] md:rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <span className="flex items-center gap-3">
                        CONFIRMAR <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </span>
                  )}
                </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}