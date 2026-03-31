'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function registrarVenta(
  productoId: string, 
  userId: string | null, 
  clienteNombre: string, 
  precioVenta: number, 
  metodoPago: string
) {
  if (!productoId || !precioVenta) {
    return { error: "Faltan datos obligatorios del producto o precio." };
  }

  try {
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Verificar el producto
      const producto = await tx.producto.findUnique({ where: { id: productoId } });
      
      if (!producto) throw new Error("Equipo no encontrado.");
      if (producto.estado === "VENDIDO") throw new Error("Este equipo ya fue vendido.");

      // 2. Marcar el equipo como VENDIDO y vaciar stock
      await tx.producto.update({
        where: { id: productoId },
        data: { 
          estado: "VENDIDO",
          stockTotal: 0
        }
      });

      // 3. Registrar la Venta (Guardamos método de pago y cliente en notas si no es usuario web)
      const nuevaVenta = await tx.venta.create({
        data: {
          precioVenta: precioVenta,
          productoId: productoId,
          userId: userId || null,
          notas: `Pago: ${metodoPago} | Cliente: ${clienteNombre || 'Físico'}`
        }
      });

      return nuevaVenta;
    });

    // Refrescar todas las pantallas relacionadas
    revalidatePath("/admin/ventas");
    revalidatePath("/admin/productos");
    revalidatePath("/admin");
    revalidatePath("/catalogo");
    
    return { success: true };

  } catch (error: any) {
    console.error("Error en venta:", error);
    return { error: error.message };
  }
}