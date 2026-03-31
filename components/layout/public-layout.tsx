"use client";

import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si la ruta actual empieza con "/admin", no mostramos el contenido (Navbar/Footer)
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  // Si NO es admin, mostramos el contenido normal
  return <>{children}</>;
}