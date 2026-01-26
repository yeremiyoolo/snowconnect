'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function submitQuote(formData: FormData) {
  // 1. Verificar si hay usuario logueado
  const session = await getServerSession(authOptions);
  
  // Buscar el usuario en la DB para obtener su ID real si hay sesión
  let userId = undefined;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });
    userId = user?.id;
  }

  // 2. Obtener datos del formulario
  const customerName = formData.get("name") as string;
  const customerPhone = formData.get("phone") as string;
  const customerEmail = formData.get("email") as string; // Asegúrate de agregar este input en tu formulario /sell si no está
  
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const storage = formData.get("storage") as string;
  const condition = formData.get("condition") as string;
  const details = formData.get("details") as string;
  
  // 3. Subir Imágenes a Vercel Blob
  const images = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  for (const image of images) {
    if (image.size > 0) {
      const blob = await put(`quotes/${Date.now()}-${image.name}`, image, {
        access: 'public',
      });
      imageUrls.push(blob.url);
    }
  }

  // 4. Guardar en Base de Datos
  try {
    await prisma.quoteRequest.create({
      data: {
        userId, // <--- AQUÍ VINCULAMOS LA VENTA AL USUARIO
        customerName,
        customerPhone,
        customerEmail: customerEmail || session?.user?.email || "No email",
        brand,
        model,
        storage,
        condition,
        details,
        images: imageUrls,
        status: "PENDING"
      },
    });

    revalidatePath("/admin/quotes");
    revalidatePath("/account/trade-in"); // Actualizamos la vista del usuario
    return { success: true };
    
  } catch (error) {
    console.error(error);
    return { error: "Error al guardar la solicitud." };
  }
}