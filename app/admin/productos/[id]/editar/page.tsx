import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/product-gallery";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, ShieldCheck, Truck, CreditCard, 
  Cpu, Smartphone, Database, CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Asegúrate de tener este componente o usa un div estilizado

// Función auxiliar para parsear fotos (igual que en el home)
const getImages = (jsonString: string | null): string[] => {
  if (!jsonString) return [];
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

interface PageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: PageProps) {
  // 1. Fetch de datos optimizado
  const producto = await prisma.producto.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true } } } // Opcional: ver quién lo publicó
  });

  if (!producto) {
    return notFound();
  }

  const images = getImages(producto.fotosJson);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-foreground pb-20">
      {/* Header Minimalista para navegación rápida */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al catálogo
          </Link>
          <div className="font-bold text-sm hidden md:block opacity-50">
            {producto.marca} / {producto.modelo}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          
          {/* COLUMNA IZQUIERDA: Galería Visual */}
          <ProductGallery images={images} />

          {/* COLUMNA DERECHA: Información y Compra */}
          <div className="flex flex-col gap-8">
            
            {/* Encabezado del Producto */}
            <div className="space-y-4 border-b border-gray-100 dark:border-white/10 pb-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                  {producto.estado}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Stock Verificado
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-balance leading-[1.1]">
                {producto.marca} {producto.modelo}
              </h1>
              
              <div className="flex items-end gap-4 pt-2">
                <span className="text-4xl font-bold text-primary">
                  ${producto.precioVenta.toLocaleString()}
                </span>
                {/* Si tuvieras precio original, iría aquí tachado */}
              </div>
            </div>

            {/* Grid de Especificaciones (Estilo Bento) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Database className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Almacenamiento</span>
                </div>
                <p className="text-lg font-bold">{producto.almacenamiento}</p>
              </div>
              
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Memoria RAM</span>
                </div>
                <p className="text-lg font-bold">{producto.ram}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Color</span>
                </div>
                <p className="text-lg font-bold">{producto.color}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Garantía</span>
                </div>
                <p className="text-lg font-bold text-green-600">30 Días</p>
              </div>
            </div>

            {/* Descripción (Si existe) */}
            {producto.descripcion && (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h3 className="text-lg font-bold mb-2">Detalles del equipo</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>
            )}

            {/* Acciones de Compra (Sticky en móvil si se desea, aquí estático) */}
            <div className="flex flex-col gap-4 pt-4">
              <Button size="lg" className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                Añadir al Carrito
              </Button>
              <Button variant="outline" size="lg" className="w-full h-14 text-lg rounded-full">
                Comprar Ahora
              </Button>
            </div>

            {/* Sellos de Confianza */}
            <div className="flex flex-col gap-3 pt-6 border-t border-gray-100 dark:border-white/10 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Equipo verificado por técnicos certificados.</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-500" />
                <span>Envío asegurado a todo el país.</span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <span>Pago seguro al recibir o transferencia.</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}