"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 🍎 MANZANITA 1: Función para CANCELAR y LIBERAR el equipo
export async function cancelOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) throw new Error("Orden no encontrada");

    // Usamos una transacción para que todo pase al mismo tiempo
    await prisma.$transaction(async (tx) => {
      // 1. Cancelamos la orden
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      // 2. Liberamos todos los equipos de esa orden (Vuelven al catálogo)
      for (const item of order.items) {
        await tx.producto.update({
          where: { id: item.productId },
          data: { 
            estado: "DISPONIBLE", 
            stockTotal: 1 // Le devolvemos su stock
          }
        });
      }
    });

    revalidatePath("/admin/ordenes");
    revalidatePath("/catalogo"); // Actualiza la tienda web al instante
    return { success: true };
  } catch (error) {
    console.error("Error al cancelar orden:", error);
    return { success: false, error: "No se pudo cancelar el pedido" };
  }
}

// 🍎 MANZANITA 2: Función para APROBAR y REGISTRAR LA VENTA
export async function completeOrderSale(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true }
    });

    if (!order) throw new Error("Orden no encontrada");

    // 1. Marcamos la orden como PAGADA
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    // 2. Aseguramos que el producto quede como VENDIDO definitivo
    for (const item of order.items) {
      await prisma.producto.update({
        where: { id: item.productId },
        data: { estado: "VENDIDO", stockTotal: 0 }
      });
    }

    // 3. REGISTRO AUTOMÁTICO EN LA SECCIÓN DE VENTAS (CORREGIDO)
    try {
      // Registramos una venta por cada item en la orden (ya que Venta pide productoId)
      for (const item of order.items) {
        await prisma.venta.create({
          data: {
            precioVenta: item.price,
            productoId: item.productId,
            userId: order.userId,
            notas: `Venta Web - Orden #${order.orderNumber || order.id.slice(-6)}`,
          }
        });
      }
    } catch (e) {
      console.warn("Aviso: No se pudo registrar en la tabla Venta, pero la orden web fue completada.", e);
    }

    revalidatePath("/admin/ordenes");
    revalidatePath("/admin/ventas");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error) {
    console.error("Error al completar venta:", error);
    return { success: false, error: "No se pudo completar la orden" };
  }
}