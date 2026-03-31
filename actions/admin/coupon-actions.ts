'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.discountCode.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    revalidatePath("/admin/cupones");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await prisma.discountCode.delete({ where: { id } });
    revalidatePath("/admin/cupones");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}