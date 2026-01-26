'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. CREAR DIRECCIÓN
export async function createAddress(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "No autorizado" };

  const label = formData.get("label") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const province = formData.get("province") as string;
  const phone = formData.get("phone") as string;

  try {
    await prisma.address.create({
      data: {
        user: { connect: { email: session.user.email } },
        label,      // "Casa", "Trabajo"
        street: address,
        city,
        province,
        phone,
        recipient: session.user.name || "Yo", // Por defecto quien recibe es el usuario
      }
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al guardar la dirección" };
  }
}

// 2. BORRAR DIRECCIÓN
export async function deleteAddress(addressId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "No autorizado" };

  try {
    // Verificamos que la dirección pertenezca al usuario antes de borrarla
    const address = await prisma.address.findUnique({
        where: { id: addressId }
    });

    // Seguridad: Si la dirección no es de este usuario, no hacemos nada
    // (Necesitamos buscar el usuario primero para comparar ID, o confiar en que Prisma 
    // fallaría si usamos una query compuesta, pero findUnique es por ID directo.
    // Para simplificar y proteger, hacemos esto:)
    
    // Un deleteMany con filtro de usuario es más seguro que findUnique + delete
    await prisma.address.deleteMany({
        where: {
            id: addressId,
            user: { email: session.user.email }
        }
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar" };
  }
}