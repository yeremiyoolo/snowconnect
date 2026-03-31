"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleUserRole(userId: string, currentRole: string) {
  try {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    revalidatePath("/admin/usuarios");
    return { success: true, newRole };
  } catch (error) {
    return { success: false, error: "No se pudo cambiar el rol" };
  }
}