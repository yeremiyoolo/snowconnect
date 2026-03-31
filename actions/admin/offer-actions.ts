'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleOfferStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.flashOffer.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    revalidatePath("/admin/ofertas-flash");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteOffer(id: string) {
  try {
    await prisma.flashOffer.delete({ where: { id } });
    revalidatePath("/admin/ofertas-flash");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}