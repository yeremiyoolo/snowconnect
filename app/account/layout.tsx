import { SidebarNav } from "@/components/account/sidebar-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    // CORRECCIÓN: Fondo dinámico (bg-muted/30) que se adapta al tema
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container-premium">
        
        {/* Header del Panel */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Mi Cuenta</h1>
          <p className="text-muted-foreground">
            Gestiona tus compras, ventas y preferencias desde aquí.
          </p>
        </div>

        {/* Grid: Sidebar (Menú) + Contenido */}
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4 xl:w-1/5">
            <SidebarNav />
          </aside>
          
          <main className="flex-1">
             {/* Contenedor del contenido con animación de entrada */}
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
             </div>
          </main>
        </div>

      </div>
    </div>
  );
}