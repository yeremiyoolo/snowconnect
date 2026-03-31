"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateFaqItem(formData: FormData) {
  const id = formData.get("id") as string;
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const category = formData.get("category") as string;
  const isVisible = formData.get("isVisible") === "true";

  try {
    await prisma.faqItem.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        isVisible,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/soporte");
    revalidatePath("/contacto"); // Refresca la página pública de ayuda
    return { success: true };
  } catch (error) {
    console.error("Error actualizando FAQ:", error);
    return { success: false, error: "No se pudo actualizar la pregunta" };
  }
}

export async function toggleFaqVisibility(id: string, currentStatus: boolean) {
  try {
    await prisma.faqItem.update({
      where: { id },
      data: { isVisible: !currentStatus }
    });
    revalidatePath("/admin/soporte");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}