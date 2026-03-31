import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MapPin, Plus, Trash2, Home, Building2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAddress, deleteAddress } from "@/app/actions/address"; 

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login");

  const addresses = await prisma.address.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { isDefault: 'desc' }
  });

  return (
    <div className="space-y-8">
       
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Mis Direcciones</h2>
            <p className="text-muted-foreground">Gestiona tus lugares de entrega.</p>
          </div>
          
          {/* MODAL DE NUEVA DIRECCIÓN */}
          <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-full font-bold bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25 transition-all">
                    <Plus size={18} className="mr-2" /> Nueva Dirección
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle>Agregar Dirección</DialogTitle>
                    <DialogDescription>
                        Esta información se usará para tus envíos en Santiago y RD.
                    </DialogDescription>
                </DialogHeader>
                <form action={addAddress} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nombre de la Ubicación</Label>
                            <Input name="label" placeholder="Ej: Casa, Oficina" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Persona que Recibe</Label>
                            <Input name="recipient" placeholder="Tu nombre" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Teléfono de Contacto</Label>
                        <Input name="phone" placeholder="809-000-0000" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Calle / Número / Sector</Label>
                        <Input name="street" placeholder="Av. Juan Pablo Duarte..." required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ciudad</Label>
                            <Input name="city" defaultValue="Santiago" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Provincia</Label>
                            <Input name="province" defaultValue="Santiago" required />
                        </div>
                    </div>
                    <Button type="submit" className="w-full font-bold mt-4">Guardar Dirección</Button>
                </form>
            </DialogContent>
          </Dialog>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
             <div 
               key={addr.id} 
               className={`relative p-6 rounded-3xl border transition-all group ${
                 addr.isDefault 
                   ? "bg-card border-blue-500/50 shadow-md shadow-blue-500/5" 
                   : "bg-card border-border hover:border-blue-500/30"
               }`}
             >
                <div className="flex items-start gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      addr.isDefault ? "bg-blue-500/10 text-blue-600" : "bg-secondary text-muted-foreground"
                   }`}>
                      {addr.label.toLowerCase().includes('casa') ? <Home size={22} /> : 
                       addr.label.toLowerCase().includes('oficina') ? <Building2 size={22} /> : 
                       <MapPin size={22} />}
                   </div>

                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <h4 className="font-bold text-foreground text-lg">{addr.label}</h4>
                         {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
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
                
                {/* Botón Eliminar con Server Action (Formulario invisible) */}
                <form action={async () => {
                    "use server";
                    await deleteAddress(addr.id);
                }} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="submit" className="p-2 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 size={18} />
                    </button>
                </form>
             </div>
          ))}

          {/* Estado Vacío */}
          {addresses.length === 0 && (
             <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-3xl text-center">
                 <MapPin className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                 <h3 className="text-lg font-bold text-foreground">No tienes direcciones guardadas</h3>
                 <p className="text-sm text-muted-foreground">Agrega una para agilizar tus compras.</p>
             </div>
          )}
       </div>
    </div>
  );
}