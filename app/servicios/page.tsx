import Link from "next/link";
import { 
  Smartphone, 
  Wrench, 
  ArrowRight, 
  RefreshCcw, 
  Battery, 
  Zap, 
  Database,
  ShieldCheck,
  MessagesSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-32 pb-20 px-4 md:px-8">
      
      <div className="max-w-[1440px] mx-auto space-y-24">
        
        {/* 1. HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-2">
              <Wrench size={12} /> Snow Support
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
             Cuidamos tu tecnología <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">como si fuera nuestra.</span>
           </h1>
           <p className="text-lg text-gray-500 font-medium">
             Desde renovar tu equipo hasta reparaciones certificadas. <br className="hidden md:block"/>
             Todo sucede en un solo lugar con la garantía Snow™.
           </p>
        </div>

        {/* 2. BENTO GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARD 1: VENDE TU EQUIPO (Trade-In) */}
            <div className="relative overflow-hidden rounded-[3rem] bg-black p-8 md:p-12 min-h-[500px] flex flex-col justify-between group cursor-pointer shadow-2xl shadow-blue-900/10">
               {/* Fondo abstracto */}
               <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-950 opacity-100" />
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/30 transition-all duration-700" />
               
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/10">
                    <RefreshCcw size={28} />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-4">
                   Renueva <br/> tu equipo
                 </h2>
                 <p className="text-gray-400 max-w-sm text-lg leading-relaxed">
                   Entrega tu iPhone actual como parte de pago y llévate el modelo nuevo por menos. Valoramos tu equipo al mejor precio del mercado.
                 </p>
               </div>

               <div className="relative z-10 mt-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                       <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">1</span>
                       <span className="text-gray-300 font-medium text-sm">Cotizamos tu equipo vía WhatsApp al instante.</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                       <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">2</span>
                       <span className="text-gray-300 font-medium text-sm">Lo revisamos en tienda física.</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                       <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">3</span>
                       <span className="text-gray-300 font-medium text-sm">Usas el crédito para tu nuevo Snow.</span>
                    </div>
                  </div>
                  
                  <Link href="https://wa.me/18090000000?text=Hola,%20quiero%20vender%20mi%20equipo" target="_blank" className="mt-8 inline-block w-full">
                    <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all">
                       Cotizar ahora <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
               </div>
            </div>

            {/* CARD 2: SERVICIO TÉCNICO */}
            <div className="flex flex-col gap-6">
               
               {/* Reparación Batería */}
               <div className="flex-1 bg-white dark:bg-gray-900 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-start hover:shadow-xl transition-shadow relative overflow-hidden group">
                  <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-green-50 dark:bg-green-900/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                     <Battery size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Cambio de Batería</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    ¿Tu celular se descarga rápido? Reemplazamos tu batería en menos de 1 hora con piezas calidad original.
                  </p>
                  <Button variant="outline" className="rounded-full border-gray-200 dark:border-gray-700">Agendar Cita</Button>
               </div>

               {/* Reparación Pantalla */}
               <div className="flex-1 bg-white dark:bg-gray-900 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-start hover:shadow-xl transition-shadow relative overflow-hidden group">
                  <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                     <Smartphone size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Pantalla Rota</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    Recupera la nitidez y el touch de tu equipo. Instalación profesional y garantía en pantalla.
                  </p>
                  <Button variant="outline" className="rounded-full border-gray-200 dark:border-gray-700">Consultar Precio</Button>
               </div>

            </div>
        </div>

        {/* 3. SERVICIOS ADICIONALES (Horizontal) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: "Transferencia de Datos", icon: Database, desc: "Pasamos toda tu info (fotos, chats, contactos) de tu celular viejo al nuevo gratis." },
             { title: "Diagnóstico Gratis", icon: Zap, desc: "Revisamos tu equipo sin costo para decirte exactamente qué tiene antes de reparar." },
             { title: "Soporte Post-Venta", icon: ShieldCheck, desc: "¿Dudas con tu nuevo iPhone? Te enseñamos a configurarlo y usarlo al 100%." }
           ].map((item, i) => (
             <div key={i} className="bg-gray-100 dark:bg-gray-900/50 p-8 rounded-3xl border border-transparent dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 transition-colors">
                <item.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* 4. CTA FOOTER */}
        <div className="bg-blue-600 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10 max-w-2xl mx-auto">
             <MessagesSquare size={48} className="mx-auto mb-6 text-blue-200" />
             <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">¿Tienes alguna duda específica?</h2>
             <p className="text-blue-100 text-lg mb-8">
               Nuestros expertos están listos en WhatsApp para responderte. No bots, personas reales.
             </p>
             <Link href="https://wa.me/18090000000" target="_blank">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-blue-600 font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-xl">
                  Hablar con un experto
                </Button>
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}