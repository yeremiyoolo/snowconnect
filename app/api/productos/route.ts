import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { createdAt: 'desc' },
      include: { specs: true }
    });
    
    // Formateamos para que el frontend reciba 'bateria' fácil
    const productosFormateados = productos.map((p: any) => ({
      ...p,
      fotos: p.fotosJson ? JSON.parse(p.fotosJson) : [],
      bateria: p.specs?.bateriaScore || 100 
    }));
    
    return NextResponse.json(productosFormateados);
  } catch (error: any) {
    console.error("❌ Error GET productos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Verificar Sesión
    if (!session?.user?.email) {
      console.error("❌ Intento de crear producto sin sesión válida");
      return NextResponse.json({ error: "No estás autenticado o tu sesión expiró" }, { status: 401 });
    }

    // Buscar el ID del usuario en base de datos para asegurar que existe
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Usuario no encontrado en la base de datos" }, { status: 404 });
    }

    const body = await request.json();
    console.log("📦 Datos recibidos:", body); // Ver en terminal qué llega

    // 2. Validación Básica
    if (!body.imei) return NextResponse.json({ error: "Falta el IMEI" }, { status: 400 });
    if (!body.modelo) return NextResponse.json({ error: "Falta el Modelo" }, { status: 400 });

    // 3. Preparar Datos Numéricos
    const precioCompra = parseFloat(body.precioCompra) || 0;
    const precioVenta = parseFloat(body.precioVenta) || 0;
    const precioAnterior = parseFloat(body.precioAnterior) || 0;
    const bateriaScore = parseInt(body.bateria || body.bateriaScore || "100");

    // 4. Crear Producto en Base de Datos
    const nuevoProducto = await prisma.producto.create({
      data: {
        imei: body.imei,
        marca: body.marca || "Genérico",
        modelo: body.modelo,
        color: body.color || "N/A",
        almacenamiento: body.almacenamiento || "N/A",
        ram: body.ram || "N/A",
        estado: body.estado || "DISPONIBLE",
        precioCompra,
        precioVenta,
        precioAnterior,
        enOferta: Boolean(body.enOferta),
        margen: precioVenta - precioCompra,
        descripcion: body.descripcion || "",
        fotosJson: JSON.stringify(body.fotos || []),
        
        // Conectamos con el usuario real de la DB
        user: { 
          connect: { id: dbUser.id } 
        },

        // Creamos las especificaciones (Batería)
        specs: {
          create: {
            bateriaScore: bateriaScore,
            camaraScore: 85,
            gamingScore: 85,
            resistencia: 90
          }
        }
      },
      include: {
        specs: true
      }
    });

    // 5. Log de Auditoría (Opcional, si falla no detiene el proceso)
    try {
      await prisma.auditLog.create({
        data: {
          accion: "CREAR",
          entidad: "PRODUCTO",
          entidadId: nuevoProducto.id,
          detalles: `Creó: ${nuevoProducto.marca} ${nuevoProducto.modelo} (Bat: ${bateriaScore}%)`,
          userId: dbUser.id
        }
      });
    } catch (logError) {
      console.warn("⚠️ No se pudo crear el log, pero el producto se guardó:", logError);
    }

    return NextResponse.json(nuevoProducto, { status: 201 });

  } catch (error: any) {
    console.error("❌ ERROR FATAL AL CREAR PRODUCTO:", error);
    
    // ESTO ES LO IMPORTANTE: Devolvemos el mensaje exacto del error
    return NextResponse.json({ 
      error: `Error Técnico: ${error.message}`,
      details: error.meta || "Sin detalles adicionales"
    }, { status: 500 });
  }
}