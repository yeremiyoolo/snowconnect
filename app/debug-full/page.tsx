import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DebugFullPage() {
  const session = await getServerSession(authOptions)
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 DEBUG COMPLETO DE SESIÓN</h1>
      
      <h2>1. Session object completo:</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      
      <h2>2. Propiedades específicas:</h2>
      <p>session existe: {session ? '✅ SI' : '❌ NO'}</p>
      <p>session.user existe: {session?.user ? '✅ SI' : '❌ NO'}</p>
      <p>session.user.email: {session?.user?.email || 'UNDEFINED'}</p>
      <p>session.user.role: {session?.user?.role || 'UNDEFINED'}</p>
      <p>session.user.id: {session?.user?.id || 'UNDEFINED'}</p>
      
      <h2>3. Prueba de redirección:</h2>
      <a href="/admin">Ir a /admin (¿redirige a login?)</a>
    </div>
  )
}
