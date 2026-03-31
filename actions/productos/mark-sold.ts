'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function markAsSold(productoId: string) {
  try {
    // Usamos transaction para asegurar que se limpien los colores Y el total
    await prisma.$transaction(async (tx) => {
      
      // 1. Poner en 0 todas las variantes de color de este producto
      // (Para que no queden "fantasmas" de stock en los colores)
      await tx.stockColor.updateMany({
        where: { productoId: productoId },
        data: { cantidad: 0 }
      });

      // 2. Actualizar el producto principal
      await tx.producto.update({
        where: { id: productoId },
        data: { 
          stockTotal: 0,      // <--- CORREGIDO: Antes era 'stock'
          estado: "VENDIDO",  // Cambiamos estado visual
          fechaVenta: new Date() 
        }
      });
    });

    // 3. Recargar las páginas para ver el cambio al instante
    revalidatePath("/admin");
    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/"); // Por si sale en el home

    return { success: true };
  } catch (error) {
    console.error("Error marcando como vendido:", error);
    return { error: "Error al marcar como vendido" };
  }
}