import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/settings/profile-form"; // Crearemos este componente cliente abajo
import { Separator } from "@/components/ui/separator";

export default async function SettingsProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  // Obtenemos los datos frescos de la DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">Perfil Público</h3>
        <p className="text-sm text-gray-500">
          Así es como te verán otros usuarios en la plataforma.
        </p>
      </div>
      <Separator />
      
      {/* Pasamos los datos iniciales al formulario cliente */}
      <ProfileForm user={user} />
    </div>
  );
}