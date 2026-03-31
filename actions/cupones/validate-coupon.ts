'use server'

import { prisma } from "@/lib/prisma"

export async function validateCoupon(code: string, userId: string) {
  // 1. Buscar el cupón
  const coupon = await prisma.discountCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) return { error: "Código no existe." };
  if (!coupon.isActive) return { error: "Este cupón está inactivo." };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { error: "El cupón ha caducado." };
  
  // 2. Verificar límite global de usos
  const globalUses = await prisma.userUsedCode.count({
    where: { discountCodeId: coupon.id }
  });
  
  if (globalUses >= coupon.maxUses) {
    return { error: "Este cupón ya agotó su límite de usos." };
  }

  // 3. Verificar si ESTE usuario ya lo usó
  const userUsage = await prisma.userUsedCode.findUnique({
    where: {
      userId_discountCodeId: {
        userId: userId,
        discountCodeId: coupon.id
      }
    }
  });

  if (userUsage) return { error: "Ya has canjeado este cupón anteriormente." };

  // 4. Éxito
  return { 
    success: true, 
    discount: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type, // "PERCENTAGE" o "FIXED"
      value: coupon.value
    }
  };
}