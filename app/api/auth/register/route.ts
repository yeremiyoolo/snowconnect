// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, name } = data;

    // 1. Validar que lleguen los datos
    if (!email || !password) {
      return NextResponse.json(
        { message: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // 2. Verificar si el usuario ya existe
    const userFound = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userFound) {
      return NextResponse.json(
        { message: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // 3. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Guardar en Base de Datos
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Por defecto todos son USER
      },
    });

    // Quitamos la contraseña de la respuesta por seguridad
    const { password: _, ...user } = newUser;

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Error en el servidor", error },
      { status: 500 }
    );
  }
}