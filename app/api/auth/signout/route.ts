import { NextResponse } from "next/server"

export async function POST() {
  // Redirigir a la página de login después de cerrar sesión
  const response = NextResponse.redirect(new URL("/auth/login", process.env.NEXTAUTH_URL || "http://localhost:3000"))
  
  // Eliminar la cookie de sesión
  response.cookies.delete("next-auth.session-token")
  response.cookies.delete("__Secure-next-auth.session-token")
  
  return response
}
