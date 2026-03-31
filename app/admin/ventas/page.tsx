import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Activity, Calendar, Package, ArrowUpRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const dynamic = 'force-dynamic';

export default async function VentasPage() {
  
  // 1. Obtener TODO el historial de ventas
  const ventas = await prisma.venta.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      producto: true, 
      user: true 
    }
  });

  // 2. Cálculos de Métricas
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const ventasHoy = ventas.filter(v => v.createdAt >= hoy);
  const ventasMes = ventas.filter(v => v.createdAt >= inicioMes);

  const totalHoy = ventasHoy.reduce((acc, v) => acc + v.precioVenta, 0);
  const totalMes = ventasMes.reduce((acc, v) => acc + v.precioVenta, 0);

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic text-foreground mb-1">
            Registro de <span className="text-primary">Ventas</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-80">
            Historial automatizado desde la central de pedidos
          </p>
        </div>
      </div>

      {/* MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2rem] border-green-500/20 bg-green-50/50 dark:bg-green-950/20 shadow-xl overflow-hidden relative">
          <div className="absolute -right-6 -top-6 text-green-500/10">
            <DollarSign size={120} />
          </div>
          <CardContent className="p-8 relative z-10">
            <p className="text-[10px] uppercase font-black text-green-800/60 dark:text-green-400/60 tracking-widest mb-1">Facturado Hoy</p>
            <p className="text-4xl font-black text-green-600 italic tracking-tighter">
              ${totalHoy.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-green-700/60 mt-2 uppercase">{ventasHoy.length} equipos vendidos hoy</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 shadow-xl overflow-hidden relative">
          <div className="absolute -right-6 -top-6 text-blue-500/10">
            <Calendar size={120} />
          </div>
          <CardContent className="p-8 relative z-10">
            <p className="text-[10px] uppercase font-black text-blue-800/60 dark:text-blue-400/60 tracking-widest mb-1">Facturado este Mes</p>
            <p className="text-4xl font-black text-blue-600 italic tracking-tighter">
              ${totalMes.toLocaleString()}
            </p>
            <p className="text-xs font-bold text-blue-700/60 mt-2 uppercase">{ventasMes.length} equipos en total</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20 shadow-xl overflow-hidden relative">
          <div className="absolute -right-6 -top-6 text-purple-500/10">
            <Activity size={120} />
          </div>
          <CardContent className="p-8 relative z-10">
            <p className="text-[10px] uppercase font-black text-purple-800/60 dark:text-purple-400/60 tracking-widest mb-1">Total Histórico</p>
            <p className="text-4xl font-black text-purple-600 italic tracking-tighter">
              ${ventas.reduce((acc, v) => acc + v.precioVenta, 0).toLocaleString()}
            </p>
            <p className="text-xs font-bold text-purple-700/60 mt-2 uppercase">Registro completo</p>
          </CardContent>
        </Card>
      </div>

      {/* TABLA DE HISTORIAL */}
      <Card className="border-border/50 shadow-2xl rounded-[3rem] overflow-hidden bg-card">
        <CardHeader className="bg-secondary/20 border-b border-border/50 px-8 py-6">
          <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Package className="text-primary" /> Historial de Transacciones
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-5 px-8 font-black uppercase text-[10px] tracking-widest">Fecha</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Equipo Vendido</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Comprador</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-8">Monto Cobrado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center text-muted-foreground">
                    <p className="font-black uppercase tracking-widest text-xs opacity-50">No hay ventas registradas.</p>
                  </TableCell>
                </TableRow>
              ) : (
                ventas.map((venta) => {
                  
                  // Analizamos las notas por si tiene detalles extra de la automatización
                  let detalles = venta.notas || "";
                  let clienteName = venta.user?.name || "Cliente General";
                  let metodo = venta.metodoPago || "Automático";

                  if (detalles.includes("Cliente:")) {
                    const partes = detalles.split("|");
                    metodo = partes[0].replace("Pago: ", "").trim();
                    clienteName = partes[1].replace("Cliente: ", "").trim();
                  }

                  return (
                    <TableRow key={venta.id} className="group hover:bg-secondary/20 transition-colors cursor-default">
                      <TableCell className="px-8 py-5">
                        <p className="font-bold text-sm text-foreground">
                          {new Date(venta.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                          {new Date(venta.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </TableCell>
                      
                      <TableCell>
                        <span className="font-black text-foreground uppercase italic tracking-tight text-base">
                          {venta.producto?.modelo || "Equipo Eliminado"}
                        </span>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                          {venta.producto?.marca} {venta.producto?.imei ? `• IMEI: ${venta.producto.imei}` : ''}
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="font-bold text-sm text-foreground">{clienteName}</p>
                        <Badge variant="secondary" className="mt-1 text-[9px] uppercase tracking-widest font-black bg-primary/10 text-primary">
                          {metodo}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right px-8">
                        <span className="text-xl font-black text-green-600 italic tracking-tighter">
                          +${venta.precioVenta.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}