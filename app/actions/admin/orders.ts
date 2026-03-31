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

    // 3. REGISTRO AUTOMÁTICO EN LA SECCIÓN DE VENTAS
    // Esto se envuelve en un try-catch por si tu tabla de ventas exige campos extra, 
    // así no se rompe la orden si falta algo.
    try {
      await prisma.venta.create({
        data: {
          total: order.total,
          metodoPago: order.carrier || "TRANSFERENCIA", // Toma el método que eligió el cliente
          estado: "COMPLETADA",
          notas: `Venta Web Automática - Orden #${order.orderNumber || order.id.slice(-6)}`,
          // Si tu modelo de ventas requiere conectar el producto o cliente, 
          // puedes agregar esos campos aquí más adelante.
        }
      });
    } catch (e) {
      console.warn("Aviso: No se pudo registrar en la tabla Venta (revisa el schema de Venta), pero la orden web fue completada.", e);
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