'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob"; // Necesario para guardar la foto

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "No autorizado" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const imageFile = formData.get("image") as File; // Capturamos el archivo

  let imageUrl = undefined;

  // Si el usuario subió una foto nueva, la guardamos en la nube
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(`avatars/${session.user.id}-${Date.now()}`, imageFile, {
        access: 'public',
      });
      imageUrl = blob.url;
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      return { error: "Error al subir la imagen" };
    }
  }

  try {
    // Actualizamos la base de datos
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        telefono: phone,
        // Solo actualizamos la imagen si imageUrl tiene un valor (si subió algo nuevo)
        ...(imageUrl && { image: imageUrl }), 
      },
    });

    revalidatePath("/account");
    revalidatePath("/account/profile");
    return { success: true };
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return { error: "Error al actualizar la base de datos." };
  }
}