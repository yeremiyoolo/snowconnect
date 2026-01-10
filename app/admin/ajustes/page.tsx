import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; // npx shadcn@latest add separator

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuración de Cuenta</h3>
        <p className="text-sm text-muted-foreground">
          Actualiza tu información personal y seguridad.
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tarjeta de Info Personal (Solo lectura por ahora) */}
        <Card>
            <CardHeader>
                <CardTitle>Información Pública</CardTitle>
                <CardDescription>Estos datos son visibles en tus ventas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="name">Nombre Display</Label>
                    <Input id="name" defaultValue={session.user.name || ""} disabled />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={session.user.email || ""} disabled />
                </div>
            </CardContent>
        </Card>

        {/* Tarjeta de Seguridad (Placeholder visual) */}
        <Card>
            <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Cambiar contraseña (Próximamente).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="current">Contraseña Actual</Label>
                    <Input id="current" type="password" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="new">Nueva Contraseña</Label>
                    <Input id="new" type="password" />
                </div>
                <Button disabled>Actualizar Contraseña</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}