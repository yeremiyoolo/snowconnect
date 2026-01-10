import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT: Aprobar/Editar (Solo Admin)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const actualizado = await prisma.testimonio.update({
    where: { id: params.id },
    data: body
  });
  return NextResponse.json(actualizado);
}

// DELETE: Borrar (Solo Admin)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.testimonio.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}