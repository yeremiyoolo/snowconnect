"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  imagenes: { id: string; url: string }[];
  nombre: string;
  enOferta: boolean;
}

export function ProductGallery({ imagenes, nombre, enOferta }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imagenes || imagenes.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imagenes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-6">
      {/* 🍎 Foto Principal con Botones */}
      <div className="relative aspect-square rounded-[3.5rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border/50 shadow-2xl group">
        <Image 
          src={imagenes[currentIndex]?.url || "/placeholder.png"} 
          alt={nombre} 
          fill 
          className="object-contain p-12 transition-transform duration-700"
          priority
        />
        
        {enOferta && (
          <div className="absolute top-10 left-10 z-10 bg-red-600 text-white px-6 py-2 rounded-2xl font-black italic uppercase text-sm shadow-xl animate-pulse">
            Oferta Flash
          </div>
        )}

        {/* Flechas (Solo se muestran si hay más de 1 foto) */}
        {imagenes.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 p-3 rounded-2xl shadow-xl hover:scale-110 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} className="text-primary" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 p-3 rounded-2xl shadow-xl hover:scale-110 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} className="text-primary" />
            </button>
          </>
        )}
      </div>
      
      {/* 🍎 Miniaturas interactivas */}
      {imagenes.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {imagenes.map((img, idx) => (
            <div 
              key={img.id} 
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-square rounded-[1.5rem] overflow-hidden border-2 cursor-pointer transition-all ${
                currentIndex === idx 
                  ? 'border-primary ring-4 ring-primary/20 scale-105' 
                  : 'border-transparent bg-zinc-50 dark:bg-zinc-900 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt={nombre} fill className="object-contain p-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}