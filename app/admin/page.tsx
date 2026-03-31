import { prisma } from "@/lib/prisma";
import { OverviewChart } from "@/components/admin/overview-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Smartphone, DollarSign, Activity, Wrench, Package, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // 1. EXTRAER TODOS LOS DATOS REALES DE LA BASE DE DATOS
  const totalProductos = await prisma.producto.count();
  
  const reparacionesActivas = await prisma.repairTicket.count({
    where: { status: { notIn: ["COMPLETADA", "CANCELADA", "COMPLETED", "CANCELLED"] } }
  });

  // 🍎 MANZANITA: Unificamos las ventas (Web + Tienda Física)
  const ordenesPagadas = await prisma.order.findMany({
    where: { status: "PAID" },
    select: { id: true, total: true, createdAt: true, carrier: true }
  });

  const ventasFisicas = await prisma.venta.findMany({
    select: { id: true, precioVenta: true, createdAt: true }
  });

  // Juntamos todo en un solo arreglo ordenado por fecha
  const ventas = [
    ...ordenesPagadas.map(o => ({ 
      id: o.id, 
      total: o.total, 
      createdAt: o.createdAt, 
      metodo: o.carrier || "Web / Transferencia" 
    })),
    ...ventasFisicas.map(v => ({ 
      id: v.id, 
      total: v.precioVenta, 
      createdAt: v.createdAt, 
      metodo: "Tienda Física" 
    }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const totalVentas = ventas.length;
  const ingresosTotales = ventas.reduce((acc, v) => acc + v.total, 0);

  // Ventas recientes (las 5 más nuevas)
  const ventasRecientes = ventas.slice(0, 5);

  // --- 2. EL MOTOR DE CÁLCULO DE FLUJO (REAL) ---
  const hoy = new Date();
  
  // Arreglos de sumatoria
  const annualMap = new Array(12).fill(0);
  const monthlyWeeks = [0, 0, 0, 0];
  const weeklyMap = new Map();

  // Límites de tiempo
  const last30Days = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last7Days = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Inicializar mapa de 7 días (Ordenados de hoy hacia atrás)
  for(let i=6; i>=0; i--) {
    const d = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStr = d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
    const cleanDay = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
    weeklyMap.set(cleanDay, 0);
  }

  // Recorremos todas las ventas (Web + Físicas) y las sumamos a su tiempo
  ventas.forEach(v => {
    const date = new Date(v.createdAt);
    
    // Anual (Mismo año)
    if (date.getFullYear() === hoy.getFullYear()) {
       annualMap[date.getMonth()] += v.total;
    }
    
    // Semanal (Últimos 7 días)
    if (date >= last7Days) {
       const dayStr = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
       const cleanDay = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
       if(weeklyMap.has(cleanDay)) {
         weeklyMap.set(cleanDay, weeklyMap.get(cleanDay) + v.total);
       }
    }
    
    // Mensual (Últimos 30 días divididos en 4 semanas)
    if (date >= last30Days) {
       const diffTime = Math.abs(hoy.getTime() - date.getTime());
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       if (diffDays <= 7) monthlyWeeks[3] += v.total;        // Semana actual
       else if (diffDays <= 14) monthlyWeeks[2] += v.total;  // Semana anterior
       else if (diffDays <= 21) monthlyWeeks[1] += v.total;  // Hace 2 semanas
       else if (diffDays <= 30) monthlyWeeks[0] += v.total;  // Hace 3 semanas
    }
  });

  // Formatear los datos para el componente del gráfico
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const annualData = meses.map((name, i) => ({ name, total: annualMap[i] }));
  const weeklyData = Array.from(weeklyMap, ([name, total]) => ({ name, total }));
  const monthlyData = [
    { name: "Hace 3 Sem", total: monthlyWeeks[0] },
    { name: "Hace 2 Sem", total: monthlyWeeks[1] },
    { name: "Sem Pasada", total: monthlyWeeks[2] },
    { name: "Esta Sem", total: monthlyWeeks[3] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-[1600px] mx-auto">
      
      {/* Cabecera Premium */}
      <div>
        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic text-foreground mb-1">
          Panel <span className="text-primary">General</span>
        </h1>
        <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-80">
          Resumen en tiempo real de métricas y flujo de caja
        </p>
      </div>

      {/* 4 Tarjetas de Métricas Generales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        <Card className="rounded-[2.5rem] border-border/50 shadow-2xl bg-gradient-to-br from-card to-secondary/20 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Ingresos Reales
            </CardTitle>
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic tracking-tighter text-foreground">
              ${ingresosTotales >= 1000000 ? (ingresosTotales/1000000).toFixed(1) + 'M' : ingresosTotales.toLocaleString()}
            </div>
            <p className="text-[10px] text-green-600 font-black mt-2 uppercase tracking-widest bg-green-500/10 w-fit px-3 py-1 rounded-full">
              RD$ Cobrados
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/50 shadow-2xl bg-gradient-to-br from-card to-secondary/20 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Equipos Vendidos
            </CardTitle>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Activity size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic tracking-tighter text-foreground">{totalVentas}</div>
            <p className="text-[10px] text-muted-foreground font-black mt-2 uppercase tracking-widest opacity-60">
              Transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/50 shadow-2xl bg-gradient-to-br from-card to-secondary/20 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Stock Total
            </CardTitle>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Smartphone size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic tracking-tighter text-foreground">{totalProductos}</div>
            <p className="text-[10px] text-muted-foreground font-black mt-2 uppercase tracking-widest opacity-60">
              Dispositivos
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/50 shadow-2xl bg-gradient-to-br from-card to-secondary/20 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Reparaciones
            </CardTitle>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Wrench size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic tracking-tighter text-foreground">{reparacionesActivas}</div>
            <p className="text-[10px] text-muted-foreground font-black mt-2 uppercase tracking-widest opacity-60">
              Equipos en Taller
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico de Flujo de Ingresos */}
        <Card className="col-span-4 rounded-[3rem] border-border/50 shadow-2xl bg-card">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Flujo de Caja</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
              Dinero real facturado a lo largo del tiempo
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-8">
            <OverviewChart weekly={weeklyData} monthly={monthlyData} annual={annualData} />
          </CardContent>
        </Card>

        {/* Tarjeta Lateral de Últimas Ventas */}
        <Card className="col-span-3 rounded-[3rem] border-border/50 shadow-2xl flex flex-col bg-card overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-4 bg-secondary/20">
            <CardTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center justify-between">
              Ventas Recientes
              <Link href="/admin/ventas" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center bg-primary/10 px-3 py-1.5 rounded-full">
                Ver Todo <ArrowUpRight size={14} className="ml-1" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3 p-6 bg-secondary/5">
            {ventasRecientes.length > 0 ? (
              ventasRecientes.map((venta) => (
                <div key={venta.id} className="flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-zinc-900 shadow-sm border border-border/40 hover:border-primary/50 hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/50 text-foreground flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight italic">
                        {venta.metodo}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                        {new Date(venta.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-green-600 italic tracking-tighter">
                      +RD$ {venta.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col opacity-30 mt-10">
                <Package size={64} className="mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-center max-w-[200px]">Aún no hay ventas registradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}