'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createFlashOffer(formData: FormData) {
  try {
    const productoId = formData.get("productoId") as string;
    const porcentaje = parseFloat(formData.get("porcentaje") as string);
    const duracionHoras = parseInt(formData.get("duracion") as string);

    if (!productoId || !porcentaje || !duracionHoras) {
      return { error: "Faltan datos obligatorios." };
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + duracionHoras);

    await prisma.flashOffer.create({
      data: {
        producto: {
          connect: { id: productoId }
        },
        discountPercent: porcentaje,
        expiresAt: expiresAt,
        isActive: true // <--- CORREGIDO: Antes decía 'active'
      }
    });

    revalidatePath("/admin/ofertas-flash");
    revalidatePath("/catalogo");
    revalidatePath("/");

    return { success: true };

  } catch (error: any) {
    console.error("Error creando oferta:", error);
    return { error: "Error al crear la oferta. Revisa la consola." };
  }
}

export async function deleteFlashOffer(offerId: string) {
    try {
        await prisma.flashOffer.delete({ where: { id: offerId } });
        
        revalidatePath("/admin/ofertas-flash");
        revalidatePath("/catalogo");
        revalidatePath("/");
        
        return { success: true };
    } catch (error) {
        return { error: "Error al eliminar" };
    }
}