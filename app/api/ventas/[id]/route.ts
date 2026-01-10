import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 1. Definimos el tipo correcto: params es ahora una Promesa
type RouteContext = {
  params: Promise<{ id: string }>;
};

// PUT: ACTUALIZAR UNA VENTA
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 2. AWAIT OBLIGATORIO: Esperamos a que la promesa se resuelva
    const params = await context.params;
    const id = params.id;

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { cliente, notas, precioVenta } = body;

    // Buscar la venta original
    const ventaOriginal = await prisma.venta.findUnique({
      where: { id },
    });

    if (!ventaOriginal) {
      return NextResponse.json({ message: "Venta no encontrada" }, { status: 404 });
    }

    // Recalcular margen
    const nuevoMargen = parseFloat(precioVenta) - ventaOriginal.costo;

    // Actualizar
    const ventaActualizada = await prisma.venta.update({
      where: { id },
      data: {
        cliente,
        notas,
        precioVenta: parseFloat(precioVenta),
        margen: nuevoMargen,
      },
    });

    return NextResponse.json(ventaActualizada);
  } catch (error) {
    console.error("Error actualizando venta:", error);
    return NextResponse.json(
      { message: "Error al actualizar la venta" },
      { status: 500 }
    );
  }
}

// DELETE: BORRAR VENTA
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 2. AWAIT OBLIGATORIO TAMBIÉN AQUÍ
    const params = await context.params;
    const id = params.id;

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({}, { status: 401 });
    }

    await prisma.venta.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Venta eliminada" });
  } catch (error) {
    console.error("Error eliminando venta:", error);
    return NextResponse.json(
      { message: "Error al eliminar la venta" },
      { status: 500 }
    );
  }
}