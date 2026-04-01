'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function validateCoupon(code: string) {
  // Obtenemos la sesión usando el método correcto para tu proyecto
  const session = await getServerSession(authOptions);
  
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