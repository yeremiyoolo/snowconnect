import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Definimos el tipo para Next.js 15
type RouteProps = {
  params: Promise<{ id: string }>
}

// PUT: ACTUALIZAR UNA VENTA
export async function PUT(
  request: Request,
  props: RouteProps
) {
  try {
    // ⚠️ AWAIT IMPORTANTE PARA NEXT.JS 15
    const params = await props.params;

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();
    const { cliente, notas, precioVenta } = body;

    // 1. Buscar la venta original para obtener el COSTO (que no cambia)
    const ventaOriginal = await prisma.venta.findUnique({
      where: { id },
    });

    if (!ventaOriginal) {
      return NextResponse.json({ message: "Venta no encontrada" }, { status: 404 });
    }

    // 2. Recalcular el margen si cambió el precio
    // Margen = Nuevo Precio - Costo Original
    const nuevoMargen = parseFloat(precioVenta) - ventaOriginal.costo;

    // 3. Actualizar en la Base de Datos
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
  request: Request,
  props: RouteProps
) {
  try {
    // ⚠️ AWAIT IMPORTANTE
    const params = await props.params;

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") return NextResponse.json({}, { status: 401 });

    await prisma.venta.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Venta eliminada" });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}