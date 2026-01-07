"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast" // Usamos tu hook de toast si está disponible, sino puedes quitarlo

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast() // Opcional: para notificaciones más bonitas
  
  // Estado para alternar entre Login y Registro
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Campos del formulario
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Lógica de Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Credenciales incorrectas")
        setLoading(false)
      } else {
        // Verificar el rol del usuario para redirigir correctamente
        const session = await getSession()
        
        if (session?.user?.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/") // <--- AQUÍ ESTÁ LA CORRECCIÓN: Los usuarios normales van al Home
        }
        
        router.refresh()
      }
    } catch (error) {
      setError("Error al iniciar sesión")
      setLoading(false)
    }
  }

  // Lógica de Registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        // Registro exitoso: Cambiamos a la vista de login y limpiamos campos
        setIsRegistering(false)
        setPassword("")
        setError("")
        toast({
          title: "Cuenta creada",
          description: "Ahora puedes iniciar sesión con tus credenciales.",
        })
      } else {
        const data = await res.json()
        setError(data.message || "Error al registrarse")
      }
    } catch (error) {
      setError("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isRegistering ? "📝 Crear Cuenta" : "🔐 Iniciar Sesión"}
          </CardTitle>
          <CardDescription className="text-center">
            {isRegistering 
              ? "Ingresa tus datos para registrarte en SnowConnect" 
              : "Accede a tu cuenta para continuar"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            
            {/* Campo Nombre (Solo visible en registro) */}
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegistering}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded border border-red-100 flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? "Procesando..." 
                : (isRegistering ? "Registrarse" : "Iniciar Sesión")
              }
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 border-t pt-6 bg-gray-50/50">
          <div className="text-center text-sm text-gray-600">
            {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes cuenta?"}
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setIsRegistering(!isRegistering)
              setError("")
            }}
          >
            {isRegistering ? "Ir a Iniciar Sesión" : "Crear Cuenta Nueva"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}