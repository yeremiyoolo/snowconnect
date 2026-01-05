import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. GET: TRAER LISTA DE VENTAS
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    const ventas = await prisma.venta.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        producto: true,
        user: { select: { name: true, email: true } }
      },
    });

    return NextResponse.json(ventas);
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener ventas" }, { status: 500 });
  }
}

// 2. POST: REGISTRAR VENTA (Corregido: Costo y Margen)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    const body = await request.json();
    
    if (!body.productoId) {
      return NextResponse.json({ message: "Falta el ID del producto" }, { status: 400 });
    }

    const ventaExitosa = await prisma.$transaction(async (tx) => {
      // A. Buscar el producto
      const producto = await tx.producto.findUnique({
        where: { id: body.productoId },
      });

      if (!producto) throw new Error("El producto no existe");
      if (producto.estado === "VENDIDO") throw new Error("Producto ya vendido");

      // B. Calcular valores
      const precioVenta = producto.precioVenta;
      const costo = producto.precioCompra;
      const margen = precioVenta - costo; // <--- CÁLCULO DE GANANCIA

      // C. Crear la Venta
      const nuevaVenta = await tx.venta.create({
        data: {
          productoId: body.productoId,
          cliente: body.cliente || "Cliente Final",
          notas: body.notas || "",
          userId: session.user.id,
          
          // Valores financieros obligatorios
          precioVenta: precioVenta,
          costo: costo,
          margen: margen, // <--- ¡AQUÍ ESTABA EL ERROR QUE FALTABA!
        },
      });

      // D. Marcar producto como VENDIDO
      await tx.producto.update({
        where: { id: body.productoId },
        data: {
          estado: "VENDIDO",
          fechaVenta: new Date(),
        },
      });

      return nuevaVenta;
    });

    return NextResponse.json(ventaExitosa);

  } catch (error: any) {
    console.error("❌ Error venta:", error);
    return NextResponse.json(
      { message: error.message || "Error interno" },
      { status: 500 }
    );
  }
}