"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: any[];
  filename?: string;
  label?: string;
}

export function ExportButton({ data, filename = "reporte", label = "Exportar CSV" }: ExportButtonProps) {
  
  const handleDownload = () => {
    if (!data || !data.length) {
      alert("No hay datos para exportar");
      return;
    }

    // Obtener cabeceras
    const headers = Object.keys(data[0]);
    
    // Convertir JSON a CSV
    const csvContent = [
      headers.join(","), // Cabecera
      ...data.map(row => headers.map(fieldName => {
        let value = row[fieldName];
        // Manejar strings con comas para que no rompan el CSV
        if (typeof value === "string" && value.includes(",")) {
            value = `"${value}"`;
        }
        return value;
      }).join(","))
    ].join("\n");

    // Descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}