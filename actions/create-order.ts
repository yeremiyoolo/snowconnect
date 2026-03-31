'use server'

import { prisma } from "@/lib/prisma"
import { validateCoupon } from "@/actions/cupones/validate-coupon" 

interface CreateOrderData {
  userId: string;
  items: { 
    id: string;        
    quantity: number; 
  }[];
  shippingDetails: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  couponCode?: string;
  paymentMethod: "WHATSAPP" | "TRANSFERENCIA";
}

export async function createOrder(data: CreateOrderData) {
  const { userId, items, shippingDetails, couponCode, paymentMethod } = data;

  if (!userId) return { error: "Debes iniciar sesión." };

  try {
    const result = await prisma.$transaction(async (tx) => {
      
      let subtotal = 0;
      const orderItemsData = [];

      // --- VERIFICACIÓN DE ESTADO Y PRECIOS ---
      for (const item of items) {
        const product = await tx.producto.findUnique({ 
          where: { id: item.id }
        });
        
        if (!product) throw new Error(`Producto no encontrado.`);
        
        // 🍎 Validamos que el equipo sea 100% DISPONIBLE
        if (product.estado === "VENDIDO" || product.estado === "RESERVADO") {
           throw new Error(`El equipo ${product.modelo} ya no está disponible.`);
        }

        subtotal += product.precioVenta * item.quantity;

        orderItemsData.push({
          productId: product.id,
          productName: `${product.marca} ${product.modelo}`, // Nombre limpio
          quantity: item.quantity,
          price: product.precioVenta,
        });
      }

      // --- LÓGICA DE CUPONES ---
      let discountAmount = 0;
      if (couponCode) {
        const couponResult = await validateCoupon(couponCode, userId);
        if (couponResult.success && couponResult.discount) {
          discountAmount = couponResult.discount.type === "PERCENTAGE" 
            ? (subtotal * couponResult.discount.value) / 100 
            : couponResult.discount.value;
        }
      }

      const finalTotal = subtotal - discountAmount;
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      // --- CREACIÓN DE LA ORDEN ---
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: "PENDING",
          total: finalTotal > 0 ? finalTotal : 0,
          phone: shippingDetails.phone, 
          shippingAddress: `${shippingDetails.address}, ${shippingDetails.city}`,
          carrier: paymentMethod,
          items: {
            create: orderItemsData
          }
        }
      });

      // --- 🍎 MARCAR COMO RESERVADO ---
      for (const item of items) {
        await tx.producto.update({
          where: { id: item.id },
          data: { 
            estado: "RESERVADO", // 🔥 El producto queda reservado para el cliente
            stockTotal: 0      
          }
        });
      }

      return newOrder;
    });

    return { success: true, orderId: result.id, orderNumber: result.orderNumber };
  } catch (error: any) {
    return { error: error.message };
  }
}