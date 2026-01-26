import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Plus, 
  Wallet,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function WalletPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { walletTransactions: { orderBy: { createdAt: 'desc' } } }
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
       
       <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Billetera <span className="text-primary">SnowCash™</span>
          </h2>
          <p className="text-muted-foreground">Tu saldo digital para comprar, vender y ahorrar.</p>
       </div>

       {/* SECCIÓN SUPERIOR: TARJETA Y ACCIONES */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. TARJETA PREMIUM (Diseño Estilo Tarjeta de Crédito) */}
          <div className="lg:col-span-2">
             <div className="relative w-full h-full min-h-[220px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 group transition-transform hover:scale-[1.01]">
                
                {/* FONDO: Gradiente Profundo + Decoración */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-800" />
                <div className="absolute top-[-50%] right-[-20%] w-80 h-80 bg-purple-500/30 rounded-full blur-3xl mix-blend-overlay" />
                <div className="absolute bottom-[-50%] left-[-20%] w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl mix-blend-overlay" />
                
                {/* Patrón de Ruido/Textura sutil */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

                {/* CONTENIDO DE LA TARJETA */}
                <div className="relative h-full flex flex-col justify-between p-8 text-white z-10">
                   
                   {/* Header Tarjeta */}
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         {/* Simulación de Chip */}
                         <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-600 border border-yellow-400/50 shadow-sm opacity-90 flex items-center justify-center">
                            <div className="w-8 h-5 border border-yellow-800/20 rounded-[2px]" />
                         </div>
                         <Sparkles className="w-5 h-5 text-yellow-200 opacity-80 animate-pulse" />
                      </div>
                      <div className="text-right">
                         <span className="block font-bold tracking-tight text-lg">SnowConnect</span>
                         <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">Platinum Member</span>
                      </div>
                   </div>

                   {/* Saldo Principal */}
                   <div className="my-2">
                      <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Saldo Disponible</p>
                      <span className="text-4xl md:text-5xl font-black tracking-tighter drop-shadow-lg">
                         RD$ {user.snowCashBalance.toLocaleString()}
                      </span>
                   </div>

                   {/* Footer Tarjeta */}
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Titular</p>
                         <p className="font-bold text-lg tracking-wide uppercase truncate max-w-[200px]">
                            {user.name || "Usuario Snow"}
                         </p>
                      </div>
                      <div className="opacity-80">
                         {/* Logo marca de agua simulado */}
                         <Wallet className="w-8 h-8" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* 2. PANEL DE ACCIONES RÁPIDAS */}
          <Card className="bg-card border-border flex flex-col justify-center p-6 shadow-sm h-full">
              <div className="mb-6 text-center lg:text-left">
                 <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-4 mx-auto lg:mx-0 text-foreground">
                    <Plus size={24} />
                 </div>
                 <h3 className="font-bold text-foreground text-lg">Recargar Saldo</h3>
                 <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Añade fondos mediante transferencia o vendiendo tus equipos antiguos.
                 </p>
              </div>
              
              <div className="space-y-3 mt-auto">
                 <Button className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-11">
                    <CreditCard className="mr-2 h-4 w-4" /> Transferencia Bancaria
                 </Button>
                 <Button variant="outline" className="w-full font-bold border-border hover:bg-secondary h-11">
                    <ArrowUpRight className="mr-2 h-4 w-4" /> Vender un Equipo
                 </Button>
              </div>
          </Card>
       </div>

       {/* 3. HISTORIAL DE TRANSACCIONES */}
       <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
             <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <History size={20} className="text-muted-foreground" /> Movimientos Recientes
             </h3>
             {/* Filtro opcional visual */}
             <span className="text-xs font-bold text-primary cursor-pointer hover:underline">Ver todo</span>
          </div>
          
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
             {user.walletTransactions.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center text-muted-foreground mb-4">
                      <History size={32} />
                   </div>
                   <h3 className="text-foreground font-bold text-lg mb-1">Sin movimientos</h3>
                   <p className="text-sm text-muted-foreground max-w-sm">
                      Tu historial de pagos, recargas y ventas aparecerá aquí.
                   </p>
                </div>
             ) : (
                <div className="divide-y divide-border">
                   {user.walletTransactions.map((tx) => (
                      <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-secondary/40 transition-colors group">
                         <div className="flex items-center gap-4">
                            {/* Icono dinámico */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                               tx.type === 'CREDIT' 
                               ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                               : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                            }`}>
                               {tx.type === 'CREDIT' ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                            </div>
                            
                            <div>
                               <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                                 {tx.description}
                               </p>
                               <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                  {new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </p>
                            </div>
                         </div>
                         
                         <div className="text-right">
                            <span className={`block font-black text-sm md:text-base ${
                               tx.type === 'CREDIT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                            }`}>
                               {tx.type === 'CREDIT' ? '+' : '-'} RD$ {tx.amount.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                               {tx.type === 'CREDIT' ? 'Ingreso' : 'Pago'}
                            </span>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
       </div>
    </div>
  );
}