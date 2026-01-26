import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validar datos
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // 2. Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Este correo ya está registrado" },
        { status: 409 }
      );
    }

    // 3. Encriptar contraseña
    const hashedPassword = await hash(password, 10);

    // 4. Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        snowCashBalance: 0, // Inicia en 0
        role: "USER"
      },
    });

    // 5. Retornar éxito (sin devolver la contraseña)
    const { password: newUserPassword, ...rest } = user;

    return NextResponse.json(
      { user: rest, message: "Usuario creado correctamente" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Ocurrió un error al registrar el usuario" },
      { status: 500 }
    );
  }
}