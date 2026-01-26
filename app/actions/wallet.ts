'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. AGREGAR CUENTA BANCARIA
export async function addBankAccount(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "No autorizado" };

  const bankName = formData.get("bankName") as string;
  const accountNumber = formData.get("accountNumber") as string;
  const holderName = formData.get("holderName") as string;
  const accountType = formData.get("accountType") as string;

  try {
    await prisma.bankAccount.create({
      data: {
        user: { connect: { email: session.user.email } },
        bankName,
        accountNumber,
        holderName,
        accountType
      }
    });

    revalidatePath("/account/wallet");
    return { success: true };
  } catch (error) {
    return { error: "Error al guardar la cuenta" };
  }
}

// 2. BORRAR CUENTA BANCARIA
export async function deleteBankAccount(accountId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "No autorizado" };

  try {
    await prisma.bankAccount.deleteMany({
      where: {
        id: accountId,
        user: { email: session.user.email } // Seguridad: solo borra si es suya
      }
    });

    revalidatePath("/account/wallet");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar" };
  }
}