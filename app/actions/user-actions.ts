'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleUserRole(userId: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    
    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    });

    revalidatePath('/admin/usuarios');
    return { success: true, newRole };
}

export async function deleteUser(userId: string) {
    // Nota: Manejar con cuidado si el usuario tiene ventas asociadas
    try {
        await prisma.user.delete({ where: { id: userId } });
        revalidatePath('/admin/usuarios');
        return { success: true };
    } catch (error) {
        return { success: false, error: "No se puede eliminar usuario con ventas registradas." };
    }
}