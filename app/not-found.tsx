import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="relative">
        <h1 className="text-9xl font-black text-foreground/5 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
             <Search size={64} className="text-muted-foreground animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Página no encontrada</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Parece que te has perdido en la nieve. La página que buscas no existe o ha sido movida.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/">
          <Button variant="default" className="gap-2 font-bold">
            <Home size={18} /> Ir al Inicio
          </Button>
        </Link>
        <Link href="/catalogo">
          <Button variant="outline" className="gap-2 font-bold">
            Ver Catálogo
          </Button>
        </Link>
      </div>
    </div>
  );
}