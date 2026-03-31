import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Verificar si el usuario existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Por seguridad, no decimos si el correo no existe, pero retornamos éxito simulado
      return NextResponse.json({ message: "Si el correo existe, se envió el código." });
    }

    // 2. Generar Código OTP (6 dígitos)
    const token = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutos

    // 3. Guardar en Base de Datos (Borrar tokens viejos primero)
    await prisma.passwordResetToken.deleteMany({ where: { email } });
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // 4. Enviar Correo
    await sendOTPEmail(email, token);

    return NextResponse.json({ message: "Código enviado correctamente" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}