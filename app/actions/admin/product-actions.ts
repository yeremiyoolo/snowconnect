"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProductStatus(id: string, currentStatus: string) {
  try {
    // Si está disponible lo ocultamos, si está oculto/vendido lo ponemos disponible
    const newStatus = currentStatus === "DISPONIBLE" ? "OCULTO" : "DISPONIBLE";
    
    await prisma.producto.update({
      where: { id },
      data: { estado: newStatus }
    });

    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    
    return { success: true, newStatus };
  } catch (error) {
    console.error("Error cambiando estado:", error);
    return { success: false };
  }
}