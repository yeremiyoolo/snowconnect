import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // Asegúrate de tener: npm install bcryptjs

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    // 1. Buscar el token válido
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: code },
    });

    // 2. Validaciones estrictas
    if (!resetToken || resetToken.email !== email) {
      return NextResponse.json({ error: "Código inválido" }, { status: 400 });
    }

    if (new Date() > resetToken.expires) {
      return NextResponse.json({ error: "El código ha expirado" }, { status: 400 });
    }

    // 3. Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Actualizar Usuario
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // 5. Eliminar el token usado (Para que no se pueda reusar)
    await prisma.passwordResetToken.delete({ where: { token: code } });

    return NextResponse.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}