"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  // Aseguramos que siempre haya al menos una imagen (placeholder si está vacío)
  const displayImages = images.length > 0 ? images : ["/placeholder-phone.png"];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 h-fit sticky top-24">
      {/* Miniaturas (Selector) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar py-2 lg:py-0 lg:max-h-[600px]">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={cn(
              "relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300",
              selectedImage === idx 
                ? "border-primary ring-2 ring-primary/20 scale-95" 
                : "border-transparent bg-gray-50 hover:bg-gray-100"
            )}
          >
            <Image
              src={img}
              alt={`Vista ${idx + 1}`}
              fill
              className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
            />
          </button>
        ))}
      </div>

      {/* Imagen Principal (Con animación) */}
      <div className="relative flex-1 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 aspect-[4/5] lg:aspect-auto lg:h-[600px] flex items-center justify-center p-8 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={displayImages[selectedImage]}
              alt="Producto Principal"
              fill
              className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Zoom Hint */}
        <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Vista detallada
        </div>
      </div>
    </div>
  );
}