import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, UploadCloud } from "lucide-react";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/profile-form"; // Importamos el componente nuevo

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) redirect("/auth/login");

  // Obtener datos REALES
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { identity: true }
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tu Perfil</h2>
        <p className="text-gray-500 text-sm">Gestiona tu información personal e identidad.</p>
      </div>

      {/* AQUÍ USAMOS EL NUEVO COMPONENTE INTERACTIVO */}
      <ProfileForm user={user} />

      {/* SECCIÓN 2: ESTADO KYC (Se mantiene igual) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                Verificación de Identidad
            </h3>
            {user.identity?.status === "APPROVED" ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Verificado</span>
            ) : user.identity?.status === "PENDING" ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">En Revisión</span>
            ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase">Sin Verificar</span>
            )}
        </div>

        <div className="p-8">
            {!user.identity || user.identity.status === "REJECTED" ? (
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        <UploadCloud size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Necesitamos verificar tu identidad</h4>
                    <p className="text-gray-500 max-w-lg">
                        Para vender equipos en SnowConnect (Trade-In), requerimos una foto de tu Cédula o Pasaporte.
                    </p>
                    <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        Subir Documento
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-4 text-green-700 bg-green-50 p-4 rounded-xl">
                    <ShieldCheck size={24} />
                    <div>
                        <p className="font-bold">Tu identidad está verificada</p>
                        <p className="text-sm">Ya puedes realizar solicitudes de Trade-In.</p>
                    </div>
                </div>
            )}
        </div>
      </div>

    </div>
  );
}