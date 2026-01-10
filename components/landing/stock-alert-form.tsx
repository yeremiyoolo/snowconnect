"use client";

import { useState } from "react";
import { Bell, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StockAlertForm({ searchTerm }: { searchTerm: string }) {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacto, setContacto] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/alertas", {
      method: "POST",
      body: JSON.stringify({ busqueda: searchTerm, email: contacto }) // Simplificado: guarda en email (puede ser tel)
    });
    setLoading(false);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center animate-in zoom-in">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
        <h4 className="font-bold text-green-800">¡Anotado!</h4>
        <p className="text-sm text-green-700">Te avisaremos apenas llegue.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-xl max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bell size={32} />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2">¿No encuentras lo que buscas?</h3>
      <p className="text-gray-500 mb-6 text-sm">
        No tenemos <strong>"{searchTerm}"</strong> ahora, pero nos llega mercancía semanalmente. Déjanos tu contacto y te avisamos.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input 
          placeholder="Tu Email o WhatsApp" 
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          required
          className="text-center bg-gray-50 border-transparent focus:bg-white transition-all rounded-xl py-6 font-medium"
        />
        <Button disabled={loading} type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold rounded-xl py-6">
          {loading ? <Loader2 className="animate-spin" /> : "Avísame cuando llegue"}
        </Button>
      </form>
    </div>
  );
}