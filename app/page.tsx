import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, Users, Shield, ArrowRight, Smartphone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: <Package className="h-10 w-10" />,
      title: "Gestión de Inventario",
      description: "Control total de stock con IMEI, estados y precios en tiempo real.",
      color: "text-blue-600"
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      title: "Ventas Profesionales",
      description: "Sistema completo de ventas con facturación y múltiples métodos de pago.",
      color: "text-green-600"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Clientes y Proveedores",
      description: "Gestiona relaciones comerciales, contactos y historial completo.",
      color: "text-purple-600"
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Seguridad Total",
      description: "Datos protegidos con autenticación y roles de usuario.",
      color: "text-orange-600"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="flex items-center mb-4">
                <Smartphone className="h-12 w-12 mr-3" />
                <h1 className="text-4xl md:text-5xl font-bold">Tienda de Móviles</h1>
              </div>
              <p className="text-xl mb-8 text-blue-100">
                Sistema profesional para compra y venta de teléfonos móviles.
                Control total de inventario, ventas y proveedores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/auth/login">
                    Iniciar Sesión
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/admin">
                    Panel Administrativo
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-bold mb-2">Gestión Inteligente</h3>
                <p className="text-blue-100">Todo lo que necesitas para tu negocio de móviles en una sola plataforma.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a negocios que ya están gestionando sus ventas de móviles de manera profesional.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/auth/login">
              Comenzar Gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Usuario demo: admin@tienda.com / admin123
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Tienda de Móviles © {new Date().getFullYear()}</p>
          <p className="text-gray-400">Sistema de gestión profesional para tu negocio</p>
          <div className="mt-6 text-sm text-gray-400">
            <p>Desarrollado con Next.js 14, Prisma, y Tailwind CSS</p>
            <p className="mt-2">Base de datos: SQLite (Desarrollo) / PostgreSQL (Producción)</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
