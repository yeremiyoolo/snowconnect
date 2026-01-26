import { prisma } from '@/lib/prisma'; 
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ProductDetailsClient from '@/components/ProductDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>; // 👈 CORRECCIÓN: Definir como Promesa
}

export default async function ProductPage({ params }: PageProps) {
  // 1. CORRECCIÓN IMPORTANTE: Esperar a que los parámetros estén listos
  const { id } = await params;
  const productId = id;

  // 2. Buscamos en la base de datos con las nuevas relaciones
  const producto = await prisma.producto.findUnique({
    where: { id: productId },
    include: {
      imagenes: true,
      colores: true,
      almacenamiento: true,
      specs: true
    }
  });

  if (!producto) {
    notFound();
  }

  // 3. Mapeamos los datos de la DB al formato que espera el Cliente (aplanar arrays)
  const productForClient = {
    id: producto.id,
    nombre: producto.nombre, 
    precio: producto.precioVenta, 
    descripcion: producto.descripcion || "Sin descripción disponible.",
    
    // Mapeo seguro de imágenes (Prioridad: Tabla nueva -> JSON antiguo -> Placeholder)
    imagenes: producto.imagenes.length > 0 
      ? producto.imagenes.map(img => img.url) 
      : (producto.fotosJson ? JSON.parse(producto.fotosJson) : ['/placeholder.png']),

    // Mapeo de colores
    colores: producto.colores.map(c => ({ 
      nombre: c.nombre, 
      hex: c.hexCode 
    })),
    
    // Mapeo de almacenamiento (Extraemos solo el texto, ej: "256GB")
    almacenamiento: producto.almacenamiento.map(s => s.capacidad),
    
    specs: producto.specs
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navegación */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/catalogo" className="hover:text-foreground transition-colors flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Catálogo
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{producto.nombre}</span>
        </nav>

        {/* Componente Cliente con la interactividad */}
        <ProductDetailsClient product={productForClient} />
      </div>
    </div>
  );
}