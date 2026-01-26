"use client";

import { useCompareStore } from "@/lib/store/compare";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Check, Minus } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const { items, removeItem, clearCompare } = useCompareStore();

  if (items.length === 0) {
    return (
        <div className="min-h-screen pt-40 text-center px-4">
            <h1 className="text-2xl font-bold mb-4">No hay productos para comparar</h1>
            <Link href="/catalogo"><Button>Ir al Catálogo</Button></Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
           <h1 className="text-3xl font-black">Comparador</h1>
           <Button variant="outline" onClick={clearCompare}>Limpiar Todo</Button>
        </div>

        <div className="overflow-x-auto pb-10">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left w-1/4"></th>
                {items.map((item) => (
                  <th key={item.id} className="p-4 w-1/4 align-top relative">
                    <button 
                       onClick={() => removeItem(item.id)}
                       className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                    <div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden bg-secondary/20">
                       <Image src={item.imagen || "/placeholder.png"} alt={item.modelo} fill className="object-contain" />
                    </div>
                    <h3 className="text-xl font-bold">{item.modelo}</h3>
                    <p className="text-blue-600 font-black text-lg">
                        RD$ {item.precio?.toLocaleString() || "N/A"}
                    </p>
                  </th>
                ))}
                {/* Rellenar columnas vacías si hay menos de 3 */}
                {[...Array(3 - items.length)].map((_, i) => (
                   <th key={i} className="p-4 w-1/4 bg-secondary/5 rounded-xl border-2 border-dashed border-border">
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                         <p>Espacio Vacío</p>
                      </div>
                   </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {/* Filas de especificaciones (Adaptar según tus datos reales) */}
                <Row label="Condición" items={items} field="condicion" />
                <Row label="Almacenamiento" items={items} field="specs.almacenamiento" />
                <Row label="Memoria RAM" items={items} field="specs.ram" />
                <Row label="Cámara" items={items} field="specs.camara" />
                <Row label="Batería" items={items} field="specs.bateria" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ label, items, field }: { label: string, items: any[], field: string }) {
    return (
        <tr>
            <td className="p-4 font-bold text-muted-foreground">{label}</td>
            {items.map((item) => {
                // Lógica simple para acceder a propiedades anidadas como specs.ram
                const value = field.split('.').reduce((obj, key) => obj?.[key], item);
                return (
                    <td key={item.id} className="p-4 font-medium text-center border-l border-border">
                        {value || <Minus className="mx-auto text-muted-foreground/30" />}
                    </td>
                )
            })}
             {[...Array(3 - items.length)].map((_, i) => <td key={i} className="p-4 border-l border-border"></td>)}
        </tr>
    )
}