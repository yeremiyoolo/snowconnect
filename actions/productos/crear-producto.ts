'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function crearProducto(formData: FormData) {
  try {
    // 1. Datos Básicos
    const marca = formData.get("marca") as string;
    const modelo = formData.get("modelo") as string;
    const nombre = formData.get("nombre") as string;
    const condicion = formData.get("condicion") as string;
    const descripcion = formData.get("descripcion") as string;
    
    // --- NUEVO: IMEI (Opcional) ---
    const imei = formData.get("imei") as string;

    // 2. Datos Financieros y Técnicos
    const precioCompra = parseFloat(formData.get("precioCompra") as string) || 0;
    const precioVenta = parseFloat(formData.get("precioVenta") as string) || 0;
    const almacenamiento = formData.get("almacenamiento") as string;
    const bateria = formData.get("bateria") as string;

    // 3. Variantes (Colores)
    const variantesRaw = formData.get("variantes") as string;
    const variantes = JSON.parse(variantesRaw || "[]");
    
    // 4. --- NUEVO: Imágenes ---
    // Recibimos un JSON con las URLs de las fotos
    const imagenesRaw = formData.get("imagenes") as string;
    const imagenes = JSON.parse(imagenesRaw || "[]"); // Array de strings (URLs)

    const stockTotal = parseInt(formData.get("stockTotal") as string) || 0;

    // Validaciones
    if (!marca || !modelo || !nombre || precioVenta <= 0) {
      return { error: "Faltan datos obligatorios." };
    }

    // 5. Guardar en Base de Datos
    await prisma.producto.create({
      data: {
        marca,
        modelo,
        nombre,
        descripcion,
        condicion,
        imei: imei || null, // Guardamos el IMEI si existe
        
        precioCompra,
        precioVenta,
        almacenamiento,
        bateria,
        
        stockTotal,
        estado: "DISPONIBLE",
        
        // Guardamos las variantes de color
        variantes: {
          create: variantes.map((v: any) => ({
            color: v.color,
            cantidad: Number(v.cantidad)
          }))
        },

        // --- NUEVO: Guardamos las Imágenes ---
        imagenes: {
          create: imagenes.map((url: string) => ({
            url: url
          }))
        }
      }
    });

    revalidatePath("/admin/productos");
    return { success: true };

  } catch (error: any) {
    console.error("Error creando producto:", error);
    // Manejo de error de IMEI duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('imei')) {
      return { error: "El IMEI ingresado ya existe en el sistema." };
    }
    return { error: error.message };
  }
}