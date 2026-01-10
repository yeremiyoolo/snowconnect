import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OverviewChart } from "@/components/admin/overview-chart";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Sparkles,
  Smartphone,
  CreditCard,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 
// Asegúrate de tener el componente Avatar (si no, usa un div simple como antes)

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  // --- 1. DATOS REALES ---
  const stockCount = await prisma.producto.count({ where: { estado: "DISPONIBLE" } });
  const userCount = await prisma.user.count();
  
  const totalSalesData = await prisma.venta.aggregate({
    _sum: { precioVenta: true },
  });
  const totalRevenue = totalSalesData._sum.precioVenta || 0;

  const recentSales = await prisma.venta.findMany({
    take: 6, // Mostramos hasta 6 para llenar mejor el espacio
    orderBy: { createdAt: 'desc' },
    include: { user: true, producto: true }
  });

  // Datos Dummy para el gráfico
  const chartData = [
    { name: "Ene", total: Math.floor(totalRevenue * 0.1) },
    { name: "Feb", total: Math.floor(totalRevenue * 0.15) },
    { name: "Mar", total: Math.floor(totalRevenue * 0.4) },
    { name: "Abr", total: Math.floor(totalRevenue * 0.2) },
    { name: "May", total: Math.floor(totalRevenue * 0.15) },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* --- WELCOME HERO --- */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white p-10 shadow-2xl shadow-gray-200/50">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-[80px] opacity-40"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-widest mb-3">
            <Sparkles size={14} /> Panel de Control
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Hola, {session.user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 font-medium text-lg max-w-lg">
            Resumen de actividad y rendimiento financiero.
          </p>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BentoCard 
          title="Ingresos Totales" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={24} className="text-white" />}
          gradient="bg-gradient-to-br from-blue-600 to-indigo-600"
          trend="+12%"
          trendColor="text-blue-600 bg-blue-50"
        />
        <BentoCard 
          title="Usuarios" 
          value={userCount.toString()} 
          icon={<Users size={24} className="text-white" />}
          gradient="bg-gradient-to-br from-purple-600 to-pink-600"
          trend="+5 hoy"
          trendColor="text-purple-600 bg-purple-50"
        />
        <BentoCard 
          title="Stock" 
          value={stockCount.toString()} 
          icon={<Smartphone size={24} className="text-white" />}
          gradient="bg-gradient-to-br from-orange-500 to-red-500"
          trend="Disponible"
          trendColor="text-orange-600 bg-orange-50"
        />
        <BentoCard 
          title="Margen" 
          value="24.5%" 
          icon={<TrendingUp size={24} className="text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          trend="Estable"
          trendColor="text-emerald-600 bg-emerald-50"
        />
      </div>

      {/* --- GRID PRINCIPAL (Chart + Ventas) --- */}
      {/* Usamos 'items-stretch' para forzar misma altura visual */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
        
        {/* COLUMNA IZQ: GRÁFICO (Ocupa 2 espacios) */}
        <div className="xl:col-span-2 flex flex-col h-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Rendimiento Financiero</h3>
              <p className="text-sm text-gray-500 font-medium">Comparativa de ingresos mensuales</p>
            </div>
            {/* Botón decorativo de opciones */}
            <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            </div>
          </div>
          {/* Contenedor del gráfico que llena el espacio restante */}
          <div className="flex-1 w-full min-h-[300px]">
            <OverviewChart data={chartData} />
          </div>
        </div>

        {/* COLUMNA DER: ÚLTIMAS VENTAS (Ocupa 1 espacio) */}
        {/* 'h-full' asegura que esta tarjeta mida lo mismo que la del gráfico */}
        <div className="flex flex-col h-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 relative overflow-hidden">
            
            {/* Header Fijo */}
            <div className="flex items-center justify-between mb-6 z-10">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Últimas Ventas</h3>
                <Link href="/admin/ventas" className="group flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">
                  Ver todas <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform"/>
                </Link>
            </div>
            
            {/* Lista con Scroll Oculto pero funcional */}
            <div className="flex-1 overflow-y-auto pr-1 -mr-2 space-y-4 custom-scrollbar z-10">
                {recentSales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-10">
                        <ShoppingBag size={40} className="mb-3 opacity-20" />
                        <p className="text-sm font-medium">No hay ventas recientes</p>
                    </div>
                ) : (
                    recentSales.map((venta) => (
                        <div key={venta.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100/50 group">
                            {/* Icono Producto */}
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 text-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                                {venta.producto.marca === "Apple" ? "🍎" : "📱"}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 truncate">{venta.producto.modelo}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                   <Avatar className="w-4 h-4">
                                      <AvatarFallback className="text-[8px] bg-blue-100 text-blue-700">
                                        {venta.user.name?.[0]}
                                      </AvatarFallback>
                                   </Avatar>
                                   <p className="text-xs text-gray-500 truncate">{venta.user.name?.split(' ')[0]}</p>
                                </div>
                            </div>
                            
                            {/* Precio */}
                            <div className="text-right">
                                <span className="block text-sm font-black text-gray-900">
                                  ${venta.precioVenta.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md inline-block mt-1">
                                  Completa
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Fijo con botón de acción */}
            <div className="mt-6 pt-4 border-t border-gray-50 z-10">
                <Link 
                  href="/admin/ventas/nueva"
                  className="flex items-center justify-center w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-lg hover:bg-black hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <CreditCard size={16} className="mr-2" />
                  Nueva Venta
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}

// --- Componente Bento Card Reutilizable ---
function BentoCard({ title, value, icon, gradient, trend, trendColor }: any) {
  return (
    <div className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex flex-col h-full justify-between gap-4">
            <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border border-transparent ${trendColor}`}>
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
            </div>
        </div>
    </div>
  )
}