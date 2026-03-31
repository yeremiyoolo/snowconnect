import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
// Ajusta la ruta de authOptions si es necesario (ej: "@/app/api/auth/[...nextauth]/route")
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
        imagenes: true,      // Tabla de imágenes
        variantes: true,     // Tabla de colores (StockColor)
        flashOffers: true    // Ofertas flash si las usas
      }
    });
    
    // Transformamos los datos para el Frontend
    const productosFormateados = productos.map((p) => {
      
      // A) Aplanar Imágenes
      const imagenesFinales = p.imagenes.map((img) => img.url);

      // B) Obtener colores disponibles
      const coloresDisponibles = p.variantes.map((v) => v.color);

      return {
        ...p,
        imagenes: imagenesFinales, // Array de strings
        colores: coloresDisponibles, // Array de strings (ej: ["Negro", "Azul"])
        stock: p.stockTotal, // Mapeamos stockTotal a stock para compatibilidad
        
        // El almacenamiento ya viene directo como string, no hay que hacer nada extra
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
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    // }

    // NOTA: Si estás probando sin login, comenta la verificación de arriba.
    // Si la usas, descomenta esto para obtener el usuario real:
    /*
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    */

    // Usuario temporal para pruebas (BORRAR EN PRODUCCIÓN)
    const dbUser = await prisma.user.findFirst(); 
    if (!dbUser) return NextResponse.json({ error: "No hay usuarios en DB" }, { status: 404 });

    const body = await request.json();

    // B) Validaciones Básicas
    if (!body.marca || !body.modelo || !body.precioVenta) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // C) Preparación de Datos
    const nombreGenerado = body.nombre || `${body.marca} ${body.modelo}`;
    const precioCompra = parseFloat(body.precioCompra) || 0;
    const precioVenta = parseFloat(body.precioVenta) || 0;

    // --- MANEJO DE IMÁGENES ---
    // El formulario nuevo envía 'imagenes' como array de strings (URLs)
    let imagenesCreate = [];
    if (body.imagenes && Array.isArray(body.imagenes)) {
      imagenesCreate = body.imagenes.map((url: string) => ({ url }));
    }

    // --- MANEJO DE VARIANTES (COLORES) ---
    // El formulario envía 'variantes' como array: [{color: "Rojo", cantidad: 1}, ...]
    let variantesCreate = [];
    let stockCalculado = 0;

    if (body.variantes && Array.isArray(body.variantes)) {
      variantesCreate = body.variantes.map((v: any) => ({
        color: v.color,
        cantidad: Number(v.cantidad)
      }));
      // Calculamos el stock total sumando las cantidades de los colores
      stockCalculado = variantesCreate.reduce((acc: number, item: any) => acc + item.cantidad, 0);
    } else {
      // Fallback por si no envían variantes
      stockCalculado = Number(body.stockTotal) || 1;
      variantesCreate.push({ color: "Estándar", cantidad: stockCalculado });
    }

    // D) Guardar en Base de Datos
    const nuevoProducto = await prisma.producto.create({
      data: {
        // Campos Simples
        nombre: nombreGenerado,
        marca: body.marca,
        modelo: body.modelo,
        descripcion: body.descripcion || "",
        estado: body.condicion === "USADO" ? "DISPONIBLE" : "DISPONIBLE", // Lógica simple
        condicion: body.condicion || "NUEVO", // Nuevo campo en tu schema
        imei: body.imei || null,
        
        // Precios y Stock
        precioCompra,
        precioVenta,
        stockTotal: stockCalculado, // <--- CAMBIO IMPORTANTE
        
        // Almacenamiento (Ahora es String directo)
        almacenamiento: body.almacenamiento || "128GB",
        bateria: body.bateria || "100",

        // Relaciones
        user: { connect: { id: dbUser.id } },
        
        // Crear Imágenes
        imagenes: {
          create: imagenesCreate
        },

        // Crear Variantes (Colores)
        variantes: {
          create: variantesCreate
        },
        
        // Crear Specs (Opcional, si el formulario lo manda)
        specs: {
          create: {
            bateriaScore: 100,
            camaraScore: 90,
            gamingScore: 85,
            resistencia: 90,
            ram: "N/A",
            bateria: body.bateria || "100%"
          }
        }
      },
      include: {
        imagenes: true,
        variantes: true
      }
    });

    return NextResponse.json(nuevoProducto, { status: 201 });

  } catch (error: any) {
    console.error("❌ ERROR API POST:", error);
    // Para ver el error real de Prisma
    return NextResponse.json({ 
      error: error.message,
      meta: error.meta 
    }, { status: 500 });
  }
}