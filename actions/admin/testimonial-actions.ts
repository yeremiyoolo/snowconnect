"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTestimonialStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.testimonio.update({
      where: { id },
      data: { activo: !currentStatus } // 🍎 Usamos 'activo' del schema
    });
    revalidatePath("/admin/marketing/testimonios");
    revalidatePath("/"); 
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonio.delete({ where: { id } });
    revalidatePath("/admin/marketing/testimonios");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}