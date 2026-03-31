import { Mail, MapPin, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ContactoPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 md:px-12 space-y-16">
       
       {/* HEADER */}
       <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Centro de Ayuda</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             ¿Tienes dudas? Estamos aquí para resolverlas rápido.
          </p>
       </div>

       {/* GRID DE CONTACTO */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard 
             icon={MessageCircle} 
             title="WhatsApp Ventas" 
             desc="Respuesta inmediata" 
             action="Chatear Ahora" 
             href="https://wa.me/18290000000" // Pon tu número real aquí
          />
          <ContactCard 
             icon={Mail} 
             title="Soporte Email" 
             desc="Para garantías y reclamos" 
             action="Enviar Correo" 
             href="mailto:soporte@snowconnect.com"
          />
          <ContactCard 
             icon={MapPin} 
             title="Oficina (Citas)" 
             desc="Santiago de los Caballeros" 
             action="Ver Ubicación" 
             href="#"
          />
       </div>

       {/* FAQ SECTION */}
       <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Preguntas Frecuentes</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-bold text-lg">¿Hacen envíos a todo el país?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sí. En Santiago entregamos el mismo día (si pides antes de las 4 PM). Para Santo Domingo y el resto del país, usamos Metro Pac o Vimenpaq (24-48 horas).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-bold text-lg">¿Los equipos tienen garantía?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutamente. Todos nuestros equipos seminuevos incluyen 30 días de garantía full (piezas y servicios) certificada por SnowConnect. Los nuevos tienen 1 año con Apple/Samsung.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-bold text-lg">¿Aceptan equipos como parte de pago?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sí, aceptamos iPhones (desde el 11 en adelante) como parte de pago. Deben estar desbloqueados y sin cuentas iCloud. Usa nuestra herramienta "Smart Trade-In" en el inicio para cotizar.
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-bold text-lg">¿Cuáles son los métodos de pago?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Transferencia bancaria (Popular, BHD, Banreservas), Efectivo contra entrega (Solo Santiago), y próximamente Tarjetas de Crédito vía web.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
       </div>

    </div>
  );
}

function ContactCard({ icon: Icon, title, desc, action, href }: any) {
    return (
        <div className="bg-card border border-border p-8 rounded-3xl flex flex-col items-center text-center hover:border-blue-500/50 transition-colors group">
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={24} className="text-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm mb-6">{desc}</p>
            <Button variant="outline" asChild className="rounded-full w-full">
                <a href={href} target="_blank">{action}</a>
            </Button>
        </div>
    )
}