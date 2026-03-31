'use server'

import { prisma } from "@/lib/prisma" // Ajusta la ruta a tu cliente de prisma
import { auth } from "@/auth" // O tu método de obtener la sesión del usuario

export async function validateCoupon(code: string) {
  const session = await auth(); // Asumiendo que usas NextAuth/Auth.js
  
  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión para usar un cupón." }
  }

  const coupon = await prisma.discountCode.findUnique({
    where: { code: code },
  });

  if (!coupon || !coupon.isActive) {
    return { error: "Código inválido o expirado." }
  }

  // Verificar si ya lo usó
  const alreadyUsed = await prisma.userUsedCode.findUnique({
    where: {
      userId_discountCodeId: {
        userId: session.user.id,
        discountCodeId: coupon.id
      }
    }
  });

  if (alreadyUsed) {
    return { error: "Ya has utilizado este código anteriormente." }
  }

  return { 
    success: true, 
    discount: {
      type: coupon.type,
      value: coupon.value,
      code: coupon.code
    }
  };
}