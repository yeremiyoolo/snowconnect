"use client";
import { MessageCircle } from "lucide-react";

export function WhatsAppBubble() {
  const openWA = () => {
    window.open("https://wa.me/TUNUMERO?text=Hola! Quiero asesoría para elegir un equipo en SnowConnect", "_blank");
  };

  return (
    <button 
      onClick={openWA}
      className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 bg-white p-2 pr-6 rounded-full shadow-2xl border border-gray-100 hover:scale-105 transition-transform group"
    >
      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
        <MessageCircle size={24} fill="currentColor" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-black text-gray-400 uppercase leading-none">¿Dudas?</span>
        <span className="text-sm font-bold text-gray-900 leading-none">Habla con un experto</span>
      </div>
    </button>
  );
}