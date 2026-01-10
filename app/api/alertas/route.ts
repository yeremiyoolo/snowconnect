import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Ruta de alertas pendiente" });
}