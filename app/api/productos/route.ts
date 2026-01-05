import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Obtener lista de productos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const productos = await prisma.producto.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Parseamos las fotos para que el frontend las lea bien
    const productosFormateados = productos.map((p: any) => ({
      ...p,
      fotos: p.fotosJson ? JSON.parse(p.fotosJson) : []
    }));

    return NextResponse.json(productosFormateados);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST: Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.imei) {
      return NextResponse.json({ error: "IMEI es requerido" }, { status: 400 });
    }

    const precioCompra = parseFloat(body.precioCompra) || 0;
    const precioVenta = parseFloat(body.precioVenta) || 0;
    const margen = precioVenta - precioCompra;
    
    const producto = await prisma.producto.create({
      data: {
        imei: body.imei,
        marca: body.marca || "Generico",
        modelo: body.modelo || "Modelo",
        color: body.color || "Sin color",
        almacenamiento: body.almacenamiento || "N/A",
        ram: body.ram || "N/A",
        estado: body.estado || "NUEVO",
        precioCompra,
        precioVenta,
        margen,
        descripcion: body.descripcion || "",
        fotosJson: JSON.stringify(body.fotos || []), // Guardamos fotos
        userId: session.user.id
      }
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "El IMEI ya existe" }, { status: 409 });
    }
    console.error("Error creando producto:", error);
    return NextResponse.json({ error: "Error: " + error.message }, { status: 500 });
  }
}