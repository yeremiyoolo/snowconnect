import { Metadata } from "next";
import Link from "next/link";
import { User, Shield, Bell, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Ajustes | SnowConnect",
  description: "Administra tu cuenta y preferencias.",
};

const sidebarNavItems = [
  {
    title: "Perfil",
    href: "/ajustes", // Ruta base
    icon: <User size={18} />,
  },
  {
    title: "Seguridad",
    href: "/ajustes/seguridad",
    icon: <Shield size={18} />,
  },
  {
    title: "Direcciones",
    href: "/ajustes/direcciones",
    icon: <MapPin size={18} />,
  },
  {
    title: "Notificaciones",
    href: "/ajustes/notificaciones",
    icon: <Bell size={18} />,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FBFBFD] pb-16">
      {/* Header Compacto */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            <h1 className="text-lg font-black uppercase tracking-tight text-gray-900">Configuración</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar de Navegación */}
          <aside className="lg:w-1/4">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all border border-transparent hover:border-gray-100 whitespace-nowrap"
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Contenido Principal */}
          <div className="flex-1 lg:max-w-2xl">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 min-h-[500px]">
               {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}