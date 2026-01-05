import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TestPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>¿Tengo sesión?</h1>
      <p>{session ? "✅ SÍ tengo sesión" : "❌ NO tengo sesión"}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <a href="/admin">Ir a admin</a>
    </div>
  );
}
