"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Pencil, ImageIcon, Eye, EyeOff, Box, Smartphone } from "lucide-react";
import { toggleProductStatus } from "@/app/actions/admin/product-actions";
import { toast } from "sonner";

export function ProductosTable({ productos }: { productos: any[] }) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Filtro en tiempo real
  const filtered = productos.filter(p => {
    const term = search.toLowerCase();
    return p.modelo.toLowerCase().includes(term) ||
           p.marca.toLowerCase().includes(term) ||
           (p.imei && p.imei.toLowerCase().includes(term)) ||
           p.estado.toLowerCase().includes(term);
  });

  const handleToggle = async (id: string, status: string) => {
    setLoadingId(id);
    const res = await toggleProductStatus(id, status);
    if (res.success) {
       toast.success(`Estado cambiado a ${res.newStatus}`);
    } else {
       toast.error("Error al cambiar estado");
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Buscador Visual Real */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-[1.5rem] border border-border/50 shadow-lg shadow-black/5">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por Modelo, IMEI, Marca o Estado..."
            className="pl-12 h-14 bg-secondary/30 border-transparent focus:bg-background transition-all rounded-xl text-lg font-medium"
          />
        </div>
      </div>

      {/* Tabla Premium */}
      <div className="bg-card rounded-[2rem] border border-border/50 shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow className="hover:bg-transparent border-b-border/50">
              <TableHead className="w-[80px] text-center font-black uppercase text-[10px] tracking-widest">Foto</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Equipo & IMEI</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Condición</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Precio</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Estado</TableHead>
              <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                       <Box size={32} className="opacity-40" />
                    </div>
                    <p className="font-black uppercase tracking-widest text-xs">No hay coincidencias</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((prod) => (
                <TableRow key={prod.id} className="group hover:bg-secondary/20 transition-colors border-b-border/30">
                  
                  {/* FOTO */}
                  <TableCell className="py-5">
                    <div className="w-14 h-14 rounded-2xl border border-border/50 bg-white flex items-center justify-center overflow-hidden relative shadow-sm">
                      {prod.imagenes[0] ? (
                        <Image src={prod.imagenes[0].url} alt={prod.modelo} fill className="object-cover" />
                      ) : (
                        <ImageIcon className="text-muted-foreground opacity-30" size={24} />
                      )}
                    </div>
                  </TableCell>
                  
                  {/* EQUIPO & IMEI */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-foreground text-base uppercase italic tracking-tight">{prod.modelo}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{prod.marca}</span>
                        {prod.imei && (
                           <Badge variant="outline" className="text-[9px] font-mono bg-secondary/50">
                             IMEI: {prod.imei}
                           </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* CONDICIÓN */}
                  <TableCell>
                     <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest bg-secondary/30">
                       {prod.condicion.replace("_", " ")}
                     </Badge>
                  </TableCell>

                  {/* PRECIO */}
                  <TableCell>
                    <span className="font-black text-primary text-lg italic tracking-tighter">
                       ${prod.precioVenta.toLocaleString()}
                    </span>
                  </TableCell>

                  {/* ESTADO CON TOGGLE */}
                  <TableCell className="text-center">
                    <Button 
                      onClick={() => handleToggle(prod.id, prod.estado)}
                      disabled={loadingId === prod.id}
                      variant={prod.estado === "DISPONIBLE" ? "default" : "outline"}
                      size="sm"
                      className={`h-8 rounded-full px-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                        prod.estado === "DISPONIBLE" 
                          ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20" 
                          : "border-red-200 text-red-500 hover:bg-red-50"
                      }`}
                    >
                      {loadingId === prod.id ? "..." : prod.estado === "DISPONIBLE" ? <><Eye size={12} className="mr-1.5"/> Activo</> : <><EyeOff size={12} className="mr-1.5"/> Oculto</>}
                    </Button>
                  </TableCell>

                  {/* ACCIONES */}
                  <TableCell className="text-right">
                    <Link href={`/admin/productos/${prod.id}/editar`}>
                      <Button size="icon" className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Pencil size={18} />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}