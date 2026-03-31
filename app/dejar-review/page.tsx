"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DejarReviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0); 
  const [loading, setLoading] = useState(false);

  const getRatingText = (val: number) => {
    switch (val) {
      case 1: return "Muy mala experiencia";
      case 2: return "Mala experiencia";
      case 3: return "Regular";
      case 4: return "Buena experiencia";
      case 5: return "Excelente servicio";
      default: return "Selecciona una calificación";
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Por favor selecciona una calificación antes de continuar.");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Obtenemos el texto que escribió el usuario
      const formData = new FormData(e.currentTarget);
      const mensaje = formData.get("message") as string;
      
      // 2. Tomamos su nombre de la sesión (o "Usuario Anónimo" si falla)
      const nombre = session?.user?.name || "Usuario Anónimo";

      // 3. Enviamos los datos reales a tu API
      const res = await fetch("/api/testimonios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          mensaje: mensaje,
          calificacion: rating
        }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar en la base de datos");
      }
      
      toast.success("¡Gracias! Tu reseña está siendo verificada.");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema al enviar tu reseña. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 pt-20">
        
        <div className="text-center space-y-2">
           <h1 className="text-3xl md:text-4xl font-black tracking-tighter">Tu opinión importa</h1>
           <p className="text-muted-foreground font-medium">
             Ayuda a otros en Santiago a elegir SnowConnect.
           </p>
        </div>

        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-2xl">
           <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Selector de Estrellas */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      size={44} 
                      className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20 hover:text-muted-foreground/40"} 
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-bold text-muted-foreground h-5 transition-all">
                {getRatingText(rating)}
              </p>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="space-y-3">
                    <label className="text-sm font-bold ml-1 text-foreground">
                       Cuéntanos tu experiencia
                    </label>
                    <Textarea 
                        name="message" 
                        placeholder="¿Qué te pareció el servicio? ¿El equipo llegó en buenas condiciones?" 
                        required 
                        className="bg-secondary/50 min-h-[140px] resize-none rounded-xl mt-2 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 border-border/50 focus:border-blue-500 transition-colors"
                    />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || rating === 0} 
                className="w-full h-14 font-bold text-base rounded-xl shadow-lg transition-all"
              >
                {loading ? "Enviando..." : (
                    <>Enviar Reseña <Send size={18} className="ml-2" /></>
                )}
              </Button>
           </form>
        </div>

        <p className="text-center text-xs text-muted-foreground px-4">
           Al enviar, aceptas que publiquemos tu comentario en nuestra plataforma bajo el nombre de <span className="font-bold text-foreground">{session?.user?.name || "tu cuenta"}</span>.
        </p>

      </div>
    </div>
  );
}