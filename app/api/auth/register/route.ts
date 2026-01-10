import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validar datos básicos
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contraseña requeridos" }, 
        { status: 400 }
      );
    }

    // --- NORMALIZACIÓN CRUCIAL ---
    // Pasamos a minúsculas y quitamos espacios invisibles
    const cleanEmail = email.toLowerCase().trim();

    // 2. Verificar si el usuario ya existe usando el email limpio
    const exists = await prisma.user.findUnique({ 
      where: { email: cleanEmail } 
    });
    
    if (exists) {
      return NextResponse.json(
        { message: "Este correo electrónico ya está registrado" }, 
        { status: 400 }
      );
    }

    // 3. CIFRAR LA CONTRASEÑA
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear usuario con datos normalizados
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || "Usuario",
        email: cleanEmail, // <--- Guardado siempre en minúsculas
        password: hashedPassword,
        role: "USER" // Cambia a "ADMIN" manualmente en Prisma Studio si es necesario
      }
    });

    return NextResponse.json(
      { message: "Usuario creado exitosamente" }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error interno en el servidor" }, 
      { status: 500 }
    );
  }
}