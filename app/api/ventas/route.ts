import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Obtener todas las ventas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const ventas = await prisma.venta.findMany({
      include: {
        producto: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      success: true, 
      data: ventas,
      count: ventas.length
    });
    
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Registrar nueva venta
export async function POST(request: NextRequest) {
  console.log("🛒 POST /api/ventas - Registrando nueva venta...");
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log("❌ No autorizado - sin sesión");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📦 Datos recibidos:", body);
    
    // Validaciones
    if (!body.productoId) {
      return NextResponse.json(
        { error: "Selecciona un producto" },
        { status: 400 }
      );
    }

    // Verificar que el producto existe y está disponible
    const producto = await prisma.producto.findUnique({
      where: { id: body.productoId }
    });

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    if (producto.estado === "VENDIDO") {
      return NextResponse.json(
        { error: "Este producto ya fue vendido" },
        { status: 400 }
      );
    }

    // TRANSACCIÓN: Crear venta + actualizar producto
    // CORRECCIÓN AQUÍ: Agregamos ": any" para evitar el error de TypeScript en Vercel
    const venta = await prisma.$transaction(async (tx: any) => {
      
      // 1. Crear registro de venta
      const nuevaVenta = await tx.venta.create({
        data: {
          productoId: body.productoId,
          precioVenta: producto.precioVenta,
          cliente: body.cliente || null,
          notas: body.notas || null,
          userId: session.user.id // Importante: Vincular la venta al usuario que la hizo
        },
        include: { producto: true }
      });

      // 2. Actualizar estado del producto a VENDIDO
      await tx.producto.update({
        where: { id: body.productoId },
        data: { 
          estado: "VENDIDO",
          // fechaVenta: new Date() <--- Solo descomenta esto si tienes el campo en tu schema.prisma
        }
      });

      console.log("✅ Venta registrada:", nuevaVenta.id);
      return nuevaVenta;
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: "✅ Venta registrada exitosamente",
        data: venta
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("❌ Error al crear venta:", error);
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}