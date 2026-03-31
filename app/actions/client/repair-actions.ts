"use server";

import { prisma } from "@/lib/prisma";

export async function getMisTickets(email: string) {
  try {
    // 1. Buscamos quién es el usuario usando su email
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) return [];

    // 2. Buscamos todos los tickets que le pertenecen a ese usuario
    const tickets = await prisma.repairTicket.findMany({
      where: { userId: user.id }, // ⚠️ NOTA: Si en tu base de datos esto se llama "usuarioId" o "clienteId", cámbialo aquí.
      orderBy: { createdAt: "desc" }
    });

    return tickets;
  } catch (error) {
    console.error("Error buscando mis tickets:", error);
    return [];
  }
}