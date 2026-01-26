import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ==========================================
// 1. MÉTODO GET (Obtener Productos)
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        specs: true,
        imagenes: true,      // Tabla nueva de imágenes
        colores: true,       // Tabla nueva de colores
        almacenamiento: true // Tabla nueva de almacenamiento
      }
    });
    
    // Transformamos los datos para que el Frontend los entienda fácil
    const productosFormateados = productos.map((p: any) => {
      
      // A) Aplanar Imágenes (Juntar las viejas 'fotosJson' con la nueva tabla)
      let imagenesFinales: string[] = [];
      if (p.imagenes && p.imagenes.length > 0) {
        imagenesFinales = p.imagenes.map((img: any) => img.url);
      } else if (p.fotosJson) {
        try { imagenesFinales = JSON.parse(p.fotosJson); } catch(e) {}
      }

      // B) Aplanar Almacenamiento (CORRECCIÓN VITAL PARA QUE SE VEAN LOS GB)
      // Si hay datos en la tabla, tomamos el primero. Si no, ponemos "N/A".
      const almacenamientoTexto = p.almacenamiento?.[0]?.capacidad || "N/A";

      // C) Aplanar Color
      const colorTexto = p.colores?.[0]?.nombre || "Estándar";

      return {
        ...p,
        // Enviamos arrays y textos planos al frontend
        imagenes: imagenesFinales,
        fotos: imagenesFinales, // Compatibilidad
        bateria: p.specs?.bateriaScore || 100,
        
        // Estos dos campos son los que faltaban en tu código anterior:
        almacenamiento: almacenamientoTexto, 
        color: colorTexto
      };
    });
    
    return NextResponse.json(productosFormateados);

  } catch (error: any) {
    console.error("❌ Error GET productos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ==========================================
// 2. MÉTODO POST (Crear Producto)
// ==========================================
export async function POST(request: NextRequest) {
  try {
    // A) Verificación de Seguridad
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const body = await request.json();

    // B) Validaciones Básicas
    if (!body.marca || !body.modelo) {
      return NextResponse.json({ error: "Faltan datos obligatorios (Marca o Modelo)" }, { status: 400 });
    }

    // C) Generación de Datos Automáticos
    // Si no viene nombre, lo creamos: "Apple iPhone 15"
    const nombreGenerado = body.nombre || `${body.marca} ${body.modelo}`;
    const precioCompra = parseFloat(body.precioCompra) || 0;
    const precioVenta = parseFloat(body.precioVenta) || 0;
    const margenCalculado = precioVenta - precioCompra;

    // D) Preparar Relaciones para las Tablas Nuevas
    
    // Imágenes
    let imagenesCreate = [];
    if (body.fotos && Array.isArray(body.fotos)) {
      imagenesCreate = body.fotos.map((url: string) => ({ url }));
    }

    // Colores
    let coloresCreate = [];
    if (body.color) {
      coloresCreate.push({ nombre: body.color, hexCode: "#000000" });
    }

    // Almacenamiento
    let almacenamientoCreate = [];
    if (body.almacenamiento) {
      almacenamientoCreate.push({ capacidad: body.almacenamiento });
    }

    // E) Guardar en Base de Datos (Nested Write)
    const nuevoProducto = await prisma.producto.create({
      data: {
        // Campos Principales
        nombre: nombreGenerado,
        imei: body.imei || null,
        marca: body.marca,
        modelo: body.modelo,
        estado: body.estado || "DISPONIBLE",
        descripcion: body.descripcion || "",
        
        // Precios
        precioCompra,
        precioVenta,
        precioAnterior: parseFloat(body.precioAnterior) || 0,
        margen: margenCalculado,
        enOferta: Boolean(body.enOferta),
        
        // Relaciones Nuevas (Esto llena las tablas extra)
        imagenes: { create: imagenesCreate },
        colores: { create: coloresCreate },
        almacenamiento: { create: almacenamientoCreate },

        // Relación Usuario
        user: { connect: { id: dbUser.id } },
        
        // Especificaciones
        specs: {
          create: {
            bateriaScore: parseInt(body.bateria || body.bateriaScore || "100"),
            camaraScore: 85,
            gamingScore: 85,
            resistencia: 90,
            ram: body.ram || "N/A",
            bateria: body.bateria || "100%"
          }
        },

        // Backup Legacy
        fotosJson: JSON.stringify(body.fotos || []),
      },
      include: {
        specs: true,
        imagenes: true
      }
    });

    return NextResponse.json(nuevoProducto, { status: 201 });

  } catch (error: any) {
    console.error("❌ ERROR AL CREAR PRODUCTO:", error);
    return NextResponse.json({ 
      error: `Error Técnico: ${error.message}`,
      details: error.meta || "Revisa la consola del servidor"
    }, { status: 500 });
  }
}