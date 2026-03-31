'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCoupon(formData: FormData) {
  const code = formData.get("code") as string
  const value = parseFloat(formData.get("value") as string)
  const type = formData.get("type") as "PERCENTAGE" | "FIXED"
  const maxUses = parseInt(formData.get("maxUses") as string)
  
  // Opcional: Fecha de expiración (si viene vacía, no expira)
  const expiresStr = formData.get("expiresAt") as string
  const expiresAt = expiresStr ? new Date(expiresStr) : null

  if (!code || !value) {
    return { error: "El código y el valor son obligatorios" }
  }

  try {
    // Verificar si ya existe
    const existing = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existing) {
      return { error: "¡Este código ya existe!" }
    }

    // Crear el cupón
    await prisma.discountCode.create({
      data: {
        code: code.toUpperCase().trim(), // Lo guardamos en mayúsculas
        value,
        type,
        maxUses: maxUses || 1000, // Si no pones límite, por defecto 1000
        expiresAt,
        isActive: true
      }
    })

    revalidatePath("/admin/cupones") // Actualizar la lista si la tienes
    return { success: true, message: "Cupón creado exitosamente" }

  } catch (error) {
    console.error(error)
    return { error: "Error al crear el cupón" }
  }
}