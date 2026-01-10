import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Seguridad: Solo el ADMIN puede ver los logs
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true } // Ver quién hizo el cambio
        }
      },
      take: 100 // Traer los últimos 100 movimientos para no saturar
    });

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Error obteniendo logs" }, { status: 500 });
  }
}