'use server'

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitRepair(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return { success: false, error: "Usuario no encontrado" };

  // Generar número de ticket simple (REP-TIMESTAMP)
  const ticketNumber = `REP-${Date.now().toString().slice(-6)}`;

  try {
    await prisma.repairTicket.create({
      data: {
        userId: user.id,
        ticketNumber: ticketNumber,
        deviceModel: formData.get("device") as string,
        serviceType: formData.get("serviceType") as string, // SCREEN, BATTERY, GENERAL
        issue: formData.get("details") as string || "Sin detalles adicionales",
        status: "PENDING"
      }
    });

    revalidatePath('/account');
    revalidatePath('/admin/reparaciones');
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al crear la solicitud" };
  }
}