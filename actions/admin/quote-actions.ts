"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateQuoteStatus(id: string, newStatus: "COMPLETED" | "REJECTED" | "PENDING") {
  try {
    await prisma.quoteRequest.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath("/admin/quotes");
    return { success: true };
  } catch (error) {
    console.error("Error actualizando cotización:", error);
    return { success: false, error: "No se pudo actualizar la cotización" };
  }
}