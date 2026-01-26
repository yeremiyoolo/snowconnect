import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MapPin, Plus, Trash2, Home, Building2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login");

  const addresses = await prisma.address.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { isDefault: 'desc' } // Predeterminada primero
  });

  return (
    <div className="space-y-8">
       
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Mis Direcciones</h2>
            <p className="text-muted-foreground">Gestiona tus lugares de entrega.</p>
          </div>
          <Button className="rounded-full font-bold bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all">
             <Plus size={18} className="mr-2" /> Nueva Dirección
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TARJETAS DE DIRECCIONES */}
          {addresses.map((addr) => (
             <div 
               key={addr.id} 
               className={`relative p-6 rounded-3xl border transition-all group ${
                 addr.isDefault 
                   ? "bg-card border-primary/50 shadow-md shadow-primary/5" 
                   : "bg-card border-border hover:border-primary/30"
               }`}
             >
                <div className="flex items-start gap-4">
                   {/* Icono según etiqueta */}
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      addr.isDefault ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                   }`}>
                      {addr.label.toLowerCase().includes('casa') ? <Home size={22} /> : 
                       addr.label.toLowerCase().includes('oficina') ? <Building2 size={22} /> : 
                       <MapPin size={22} />}
                   </div>

                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <h4 className="font-bold text-foreground text-lg">{addr.label}</h4>
                         {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                               <Star size={10} fill="currentColor" /> Principal
                            </span>
                         )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                         <p className="text-foreground font-medium">{addr.recipient}</p>
                         <p>{addr.street}</p>
                         <p>{addr.city}, {addr.province}</p>
                         <p className="pt-2 flex items-center gap-2 text-xs font-bold opacity-80">
                            📞 {addr.phone}
                         </p>
                      </div>
                   </div>
                </div>
                
                {/* Botón Eliminar (Visible en Hover) */}
                <button className="absolute top-6 right-6 p-2 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                   <Trash2 size={18} />
                </button>
             </div>
          ))}

          {/* TARJETA "AGREGAR NUEVA" (Estado Vacío o Final de lista) */}
          <button className="border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:bg-secondary/30 transition-all min-h-[200px] group">
             <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
             </div>
             <span className="font-bold text-foreground">Añadir otra dirección</span>
             <span className="text-xs mt-1">Casa, Trabajo, etc.</span>
          </button>

       </div>
    </div>
  );
}