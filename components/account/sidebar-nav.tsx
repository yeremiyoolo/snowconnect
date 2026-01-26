"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Wrench, CreditCard, MapPin, Settings, Shield, Bell, LifeBuoy, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Vista General", href: "/account", icon: User },
  { title: "Mis Pedidos", href: "/account/orders", icon: Package },
  { title: "Trade-In (Ventas)", href: "/account/trade-in", icon: CreditCard }, // Icono cambiado temp
  { title: "Reparaciones", href: "/account/repairs", icon: Wrench },
  { title: "Billetera & SnowCash", href: "/account/wallet", icon: CreditCard },
  { title: "Direcciones", href: "/account/addresses", icon: MapPin },
  { title: "Notificaciones", href: "/account/notifications", icon: Bell },
  { title: "Seguridad", href: "/account/security", icon: Shield },
  { title: "Preferencias", href: "/account/preferences", icon: Settings },
  { title: "Ayuda y Soporte", href: "/account/support", icon: LifeBuoy },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    // CORRECCIÓN: Fondo bg-card y borde border-border
    <nav className="flex flex-col space-y-1 bg-card rounded-2xl p-4 border border-border shadow-sm h-fit sticky top-24">
      
      <div className="px-4 py-3 mb-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Menú Principal</span>
      </div>

      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" // Activo: Usa color primario
                : "text-muted-foreground hover:bg-secondary hover:text-foreground" // Inactivo: Hover suave
            )}
          >
            <item.icon size={18} className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
            {item.title}
          </Link>
        );
      })}

      <div className="my-2 border-t border-border" />

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
      >
        <LogOut size={18} />
        Cerrar Sesión
      </button>
    </nav>
  );
}