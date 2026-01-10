import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const user = session.user;
  const initials = user.name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#FBFBFD]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <h1 className="text-lg font-black uppercase tracking-tight text-gray-900">Mi Perfil</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Cabecera Azul */}
          <div className="h-32 bg-gray-900 w-full relative">
             <div className="absolute -bottom-10 left-8 p-1 bg-white rounded-full">
               <Avatar className="h-20 w-20 border-2 border-white">
                 <AvatarImage src={user.image || ""} />
                 <AvatarFallback className="bg-gray-200 text-xl font-bold text-gray-500">{initials}</AvatarFallback>
               </Avatar>
             </div>
          </div>

          <div className="pt-14 pb-8 px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-8">Cliente SnowConnect</p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm"><Mail size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Correo Electrónico</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm"><Shield size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rol de Cuenta</p>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    {user.role === "ADMIN" ? "Administrador 🛡️" : "Usuario Estándar 👤"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
               <Button variant="outline" className="rounded-full" disabled>
                 Editar Perfil (Próximamente)
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}