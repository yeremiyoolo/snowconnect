import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductoForm from "@/components/admin/productos/producto-form";

export const dynamic = 'force-dynamic';

export default function NuevoProductoPage() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center gap-4 bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
        <Link href="/admin/productos">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full hover:bg-secondary">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">
            Alta de <span className="text-primary">Equipo</span>
          </h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1">
            Registra un dispositivo único con fotos e IMEI real.
          </p>
        </div>
      </div>

      <ProductoForm />
    </div>
  );
}