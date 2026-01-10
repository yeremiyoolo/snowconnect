"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      bio: formData.get("bio"),
      telefono: formData.get("telefono"),
    };

    try {
      // AQUÍ LLAMARÍAS A TU API DE ACTUALIZACIÓN (Te daré el código de la API en el siguiente paso)
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Error al actualizar");

      toast({ title: "✅ Perfil actualizado correctamente" });
      router.refresh();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "No se pudieron guardar los cambios.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20 border-2 border-gray-100">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="bg-gray-900 text-white font-bold text-xl">
             {user.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button type="button" variant="outline" size="sm" className="rounded-full">
          <Upload size={14} className="mr-2" /> Cambiar foto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre Completo</Label>
          <Input id="name" name="name" defaultValue={user.name || ""} placeholder="Tu nombre" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" value={user.email} disabled className="bg-gray-50 text-gray-500" />
          <p className="text-[10px] text-gray-400">El correo no se puede cambiar por seguridad.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" defaultValue={user.telefono || ""} placeholder="+1 (809) ..." />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Biografía / Notas</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            defaultValue={user.bio || ""} 
            placeholder="Cuéntanos un poco sobre ti..." 
            className="resize-none min-h-[100px]" 
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} className="bg-gray-900 hover:bg-black text-white rounded-full px-8">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}