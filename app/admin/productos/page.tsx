import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExportButton } from "@/components/admin/export-button";
import { ProductosTable } from "@/components/admin/productos/productos-table";

export const dynamic = 'force-dynamic';

export default async function ProductosPage() {
  // 1. OBTENER TODO EL INVENTARIO
  // Traemos todo para poder ver los vendidos/ocultos y reactivarlos si queremos
  const productos = await prisma.producto.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      imagenes: true,
      variantes: true 
    }
  });

  // Datos para exportar a Excel
  const exportData = productos.map(p => ({
    Modelo: p.modelo,
    Marca: p.marca,
    IMEI: p.imei || "N/A",
    Condicion: p.condicion,
    Precio: p.precioVenta,
    Estado: p.estado
  }));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic text-foreground flex items-center gap-4 mb-1">
            Inventario <span className="text-primary">Equipos</span>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-lg px-3 py-1">
              {productos.length}
            </Badge>
          </h1>
          <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em] opacity-80">
            Control de stock único, IMEIs y visibilidad
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <ExportButton data={exportData} filename="inventario_snowconnect" label="Exportar Data" />
          <Button asChild className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs px-6 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 w-full md:w-auto">
            <Link href="/admin/productos/nuevo">
              <Plus size={18} className="mr-2" /> Agregar Equipo
            </Link>
          </Button>
        </div>
      </div>

      {/* Renderiza la nueva tabla interactiva */}
      <ProductosTable productos={productos} />
      
    </div>
  );
}