"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addAddress(data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "No autorizado" };

  const label = data.get("label") as string;
  const recipient = data.get("recipient") as string;
  const phone = data.get("phone") as string;
  const street = data.get("street") as string;
  const city = data.get("city") as string;
  const province = data.get("province") as string;

  try {
    // Si es la primera, la hacemos default
    const count = await prisma.address.count({ where: { user: { email: session.user.email } } });
    
    await prisma.address.create({
      data: {
        user: { connect: { email: session.user.email } },
        label,
        recipient,
        phone,
        street,
        city,
        province,
        isDefault: count === 0
      }
    });

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error) {
    return { error: "Error al guardar dirección" };
  }
}

export async function deleteAddress(addressId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "No autorizado" };

    try {
        await prisma.address.delete({
            where: { id: addressId }
        });
        revalidatePath("/account/addresses");
        return { success: true };
    } catch (error) {
        return { error: "Error al eliminar" };
    }
}