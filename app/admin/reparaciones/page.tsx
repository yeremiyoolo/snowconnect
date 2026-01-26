import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Smartphone, Battery, Wrench, Clock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReparacionesPage() {
  // FILTRO: Solo mostramos SCREEN y BATTERY
  const tickets = await prisma.repairTicket.findMany({
    where: {
      serviceType: { in: ["SCREEN", "BATTERY"] }
    },
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "SCREEN": return <Smartphone size={18} className="text-blue-600" />;
      case "BATTERY": return <Battery size={18} className="text-green-600" />;
      default: return <Wrench size={18} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Taller de Hardware</h1>
          <p className="text-gray-500 font-medium">Gestión de reparaciones físicas y repuestos.</p>
        </div>
        <Badge variant="outline" className="bg-white px-4 py-2 border-gray-200">
            En Taller: {tickets.length}
        </Badge>
      </div>

      <Card className="border-none shadow-xl shadow-gray-100 ring-1 ring-gray-100 rounded-[1.5rem] overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-gray-400 text-xs uppercase">Ticket</TableHead>
              <TableHead className="font-bold text-gray-400 text-xs uppercase">Cliente</TableHead>
              <TableHead className="font-bold text-gray-400 text-xs uppercase">Servicio</TableHead>
              <TableHead className="font-bold text-gray-400 text-xs uppercase">Estado</TableHead>
              <TableHead className="text-right font-bold text-gray-400 text-xs uppercase">Ingreso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-gray-400 font-medium">
                  No hay equipos en el taller.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id} className="group hover:bg-blue-50/50 transition-colors cursor-pointer">
                  <TableCell className="font-mono text-xs font-bold text-gray-500">#{ticket.ticketNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{ticket.user?.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{ticket.deviceModel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {getServiceIcon(ticket.serviceType)}
                        <span className="text-sm font-bold text-gray-700">
                            {ticket.serviceType === 'SCREEN' ? 'Pantalla' : 'Batería'}
                        </span>
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