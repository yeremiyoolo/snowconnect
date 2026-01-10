"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReceiptDocument } from "@/components/pdf/receipt-document";
import { Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function DownloadReceiptBtn({ venta }: { venta: any }) {
  const [isClient, setIsClient] = useState(false);

  // Evitar errores de hidratación asegurando que solo renderice en cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <PDFDownloadLink
      document={<ReceiptDocument venta={venta} />}
      fileName={`Recibo-${venta.producto.modelo}-${venta.id.slice(-4)}.pdf`}
    >
      {/* @ts-ignore - La librería a veces se queja de los tipos de children */}
      {({ blob, url, loading, error }: any) => (
        <Button 
          variant="outline" 
          size="sm" 
          disabled={loading}
          className="gap-2 h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Printer className="h-3 w-3" />
          )}
          {loading ? "Generando..." : "Recibo"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}