import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [productos, totalVendidos, totalStock] = await Promise.all([
    prisma.producto.findMany({
      where: { estado: "DISPONIBLE" },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.venta.count(),
    prisma.producto.count({ where: { estado: "DISPONIBLE" } })
  ]);
  
  return NextResponse.json({ productos, totalVendidos, totalStock });
}