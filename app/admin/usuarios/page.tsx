import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserRoleButton } from "./user-role-button"; // <--- Verifica que este archivo exista en la misma carpeta

// ¡ESTA ES LA LÍNEA IMPORTANTE! Debe decir "export default"
export default async function UsuariosPage() {
  const session = await getServerSession(authOptions);
  
  // Protección de ruta
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Consulta a la base de datos
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { ventas: true, productos: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administra los accesos y roles del personal.</p>
        </div>
        {/* Botón decorativo por ahora */}
        <Button variant="outline">Descargar Reporte</Button>
      </div>

      <Card className="border-none shadow-md ring-1 ring-gray-100">
        <CardHeader>
           <CardTitle>Directorio ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol Actual</TableHead>
                <TableHead>Estadísticas</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{user.name || "Sin nombre"}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} 
                           className={user.role === "ADMIN" ? "bg-purple-600 hover:bg-purple-700" : ""}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      <span className="font-bold">{user._count.ventas}</span> Ventas <br/>
                      <span className="text-xs text-gray-400">{user._count.productos} Productos reg.</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(user.createdAt), "d MMMM, yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="text-right">
                     {/* Importante: Pasar el ID y rol al componente cliente */}
                     <UserRoleButton 
                        userId={user.id} 
                        currentRole={user.role} 
                        isCurrentUser={session.user.email === user.email} 
                     />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}