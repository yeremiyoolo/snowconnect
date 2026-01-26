import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MessageCircleQuestion } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSoportePage() {
  // FILTRO: Solo mostramos GENERAL
  const tickets = await prisma.repairTicket.findMany({
    where: { serviceType: "GENERAL" },
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mesa de Ayuda</h1>
          <p className="text-gray-500 font-medium">Consultas técnicas, software y diagnósticos.</p>
        </div>
        <Badge variant="outline" className="bg-white px-4 py-2 border-gray-200">
            Tickets Abiertos: {tickets.length}
        </Badge>
      </div>

      <Card className="border-none shadow-xl shadow-gray-100 ring-1 ring-gray-100 rounded-[1.5rem] overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-gray-400 text-xs uppercase">ID</TableHead>
              <TableHead className="font-bold text-gray-400 text-xs uppercase">Usuario</TableHead>
              <TableHead className="font-bold text-gray-400 text-xs uppercase">Consulta</TableHead>
              <TableHead className="font-bold text-gray-400 text-xs uppercase">Estado</TableHead>
              <TableHead className="text-right font-bold text-gray-400 text-xs uppercase">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-gray-400 font-medium">
                  Bandeja de entrada vacía.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id} className="group hover:bg-purple-50/50 transition-colors cursor-pointer">
                  <TableCell className="font-mono text-xs font-bold text-gray-500">#{ticket.ticketNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{ticket.user?.name}</span>
                      <span className="text-xs text-gray-400">{ticket.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex items-start gap-2">
                        <MessageCircleQuestion size={16} className="text-purple-500 mt-0.5 shrink-0" />
                        <div>
                            <span className="text-xs font-bold text-gray-500 block mb-0.5">{ticket.deviceModel}</span>
                            <p className="text-sm text-gray-700 line-clamp-1">{ticket.issue}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200 shadow-none">
                        {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-gray-400">
                    {format(ticket.createdAt, "d MMM", { locale: es })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}