"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateRepairTicket(formData: FormData) {
  const id = formData.get("id") as string;
  const notes = formData.get("notes") as string;
  const cost = parseFloat(formData.get("cost") as string) || 0;
  const status = formData.get("status") as string;

  try {
    await prisma.repairTicket.update({
      where: { id },
      data: {
        notes,
        cost,
        status,
        updatedAt: new Date(),
      },
    });

    // Refrescamos las pantallas para que el cliente y el admin vean el cambio al instante
    revalidatePath("/admin/reparaciones");
    revalidatePath("/account/repairs"); 
    
    return { success: true };
  } catch (error) {
    console.error("Error actualizando ticket:", error);
    return { success: false, error: "No se pudo actualizar el ticket" };
  }
}