import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Obtener testimonios
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const soloActivos = searchParams.get("public") === "true";

  try {
    const whereCondition = soloActivos ? { activo: true } : {};
    
    const testimonios = await prisma.testimonio.findMany({
      where: whereCondition,
      orderBy: [
        { destacado: 'desc' }, // Primero los destacados
        { createdAt: 'desc' }  // Luego los nuevos
      ]
    });

    return NextResponse.json(testimonios);
  } catch (error) {
    return NextResponse.json({ error: "Error cargando testimonios" }, { status: 500 });
  }
}

// POST: Crear nuevo testimonio (Público)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validación simple
    if (!body.nombre || !body.mensaje || !body.calificacion) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    const nuevoTestimonio = await prisma.testimonio.create({
      data: {
        nombre: body.nombre,
        mensaje: body.mensaje,
        calificacion: Number(body.calificacion),
        // Por seguridad, nacen desactivados hasta que el admin los apruebe
        activo: false 
      }
    });

    return NextResponse.json(nuevoTestimonio);
  } catch (error) {
    return NextResponse.json({ error: "Error enviando reseña" }, { status: 500 });
  }
}