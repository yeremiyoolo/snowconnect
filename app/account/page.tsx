import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Package, 
  CreditCard, 
  Settings, 
  ArrowUpRight, 
  Smartphone,
  ShieldAlert,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  
  // Si no hay usuario, no mostramos nada (el layout ya protege esta ruta)
  if (!session?.user?.email) return null;

  // Obtener datos reales de la base de datos
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      _count: {
        select: { orders: true, bankAccounts: true }
      },
      orders: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      
      {/* 1. TARJETA DE BIENVENIDA */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-sm">
         {/* Fondo decorativo sutil */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {user.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <h2 className="text-2xl font-bold text-foreground">
                Hola, {user.name?.split(" ")[0]} 👋
              </h2>
              <p className="text-muted-foreground font-medium">
                {user.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {user.role === 'ADMIN' ? 'Administrador' : 'Miembro Snow'}
                 </span>
              </div>
            </div>

            <Link href="/account/profile">
               <Button variant="outline" className="rounded-full border-border bg-background hover:bg-secondary">
                 <Settings className="mr-2 h-4 w-4" /> Editar Perfil
               </Button>
            </Link>
         </div>
      </div>

      {/* 2. GRID DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD: PEDIDOS */}
        <Card className="hover:border-primary/50 transition-colors bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pedidos
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{user._count.orders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Compras realizadas
            </p>
          </CardContent>
        </Card>

        {/* CARD: SNOWCASH (BILLETERA) */}
        <Card className="hover:border-primary/50 transition-colors bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SnowCash
            </CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
               RD$ {user.snowCashBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Saldo disponible
            </p>
          </CardContent>
        </Card>

        {/* CARD: ACCIÓN RÁPIDA (VENDER) */}
        <Link href="/sell">
          <Card className="h-full bg-primary text-primary-foreground border-primary hover:opacity-90 transition-opacity cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-primary-foreground/80">
                Trade-In
              </CardTitle>
              <Smartphone className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold flex items-center gap-2">
                 Vender equipo <ArrowUpRight size={20} />
              </div>
              <p className="text-xs text-primary-foreground/70 mt-1">
                Recibe una oferta hoy
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 3. ÚLTIMO PEDIDO (O ESTADO VACÍO) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Actividad Reciente</h3>
        
        {user.orders.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
             <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                   <Clock size={20} />
                </div>
                <div>
                   <p className="font-bold text-foreground">Último Pedido #{user.orders[0].id.slice(-6).toUpperCase()}</p>
                   <p className="text-sm text-muted-foreground">
                     {new Date(user.orders[0].createdAt).toLocaleDateString()} • RD$ {user.orders[0].total.toLocaleString()}
                   </p>
                </div>
             </div>
             <Link href="/account/orders" className="w-full sm:w-auto">
               <Button size="sm" variant="outline" className="w-full sm:w-auto border-border bg-background">Ver detalles</Button>
             </Link>
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center flex flex-col items-center">
             <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-3">
                <ShieldAlert size={20} />
             </div>
             <p className="text-foreground font-medium">Aún no tienes actividad</p>
             <p className="text-sm text-muted-foreground mb-4">Explora nuestro catálogo para hacer tu primera compra.</p>
             <Link href="/catalogo">
               <Button variant="default">Ir al Catálogo</Button>
             </Link>
          </div>
        )}
      </div>

    </div>
  );
}