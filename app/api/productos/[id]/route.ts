import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Obtener un solo producto (para editar)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const producto = await prisma.producto.findUnique({ where: { id: params.id } });
    if (!producto) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    
    let fotos = [];
    try {
      fotos = producto.fotosJson ? JSON.parse(producto.fotosJson) : [];
    } catch (e) {}

    return NextResponse.json({ ...producto, fotos });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 });
  }
}

// PUT: Editar producto existente
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    
    const pCompra = parseFloat(body.precioCompra) || 0;
    const pVenta = parseFloat(body.precioVenta) || 0;
    const margen = pVenta - pCompra;

    const producto = await prisma.producto.update({
      where: { id: params.id },
      data: {
        marca: body.marca,
        modelo: body.modelo,
        color: body.color,
        imei: body.imei,
        estado: body.estado,
        almacenamiento: body.almacenamiento,
        ram: body.ram,
        precioCompra: pCompra,
        precioVenta: pVenta,
        margen: margen,
        descripcion: body.descripcion,
        fotosJson: JSON.stringify(body.fotos || [])
      }
    });

    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error actualizando:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE: Borrar producto
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    await prisma.producto.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error borrando:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}