"use client";

import { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DejarReviewPage() {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      nombre: (form.elements.namedItem('nombre') as HTMLInputElement).value,
      mensaje: (form.elements.namedItem('mensaje') as HTMLTextAreaElement).value,
      calificacion: rating
    };

    await fetch("/api/testimonios", {
      method: "POST",
      body: JSON.stringify(data)
    });

    setLoading(false);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD] p-6">
        <div className="text-center space-y-4 animate-in zoom-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">¡Gracias por tu opinión!</h1>
          <p className="text-gray-500 max-w-md mx-auto">Tu reseña ha sido enviada y será publicada en breve. Gracias por ayudarnos a crecer.</p>
          <a href="/" className="inline-block mt-8 text-blue-600 font-bold hover:underline">Volver a la tienda</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] py-12 px-4 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-gray-900 uppercase italic">Evalúa tu experiencia</h1>
          <p className="text-gray-500 mt-2 text-sm">¿Qué tal te pareció tu compra en SnowConnect?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Estrellas */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={40}
                  className={cn(
                    "transition-colors",
                    star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Tu Nombre</label>
              <input 
                name="nombre" 
                required 
                placeholder="Ej: Laura G."
                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">Tu Opinión</label>
              <textarea 
                name="mensaje" 
                required 
                rows={4}
                placeholder="Cuéntanos qué te pareció el equipo y la atención..."
                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? "Enviando..." : <><Send size={18} /> Enviar Reseña</>}
          </button>
        </form>
      </div>
    </div>
  );
}