import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Definimos el tipo correcto para Next.js 15/16
type RouteContext = {
  params: Promise<{ id: string }>;
};

// PUT: Aprobar/Editar (Solo Admin)
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // ⚠️ AWAIT OBLIGATORIO: Extraer ID de la promesa
    const params = await context.params;
    const id = params.id;

    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    const actualizado = await prisma.testimonio.update({
      where: { id },
      data: body
    });
    
    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE: Borrar (Solo Admin)
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // ⚠️ AWAIT OBLIGATORIO: Extraer ID de la promesa
    const params = await context.params;
    const id = params.id;

    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.testimonio.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}