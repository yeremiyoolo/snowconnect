"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const FrostParticles = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generamos las partículas solo en el cliente para evitar errores de hidratación
    const particleCount = 40; // Cantidad justa para no saturar
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // Posición X aleatoria (0-100%)
      y: Math.random() * 100, // Posición Y aleatoria (0-100%)
      size: Math.random() * 3 + 1, // Tamaño entre 1px y 4px
      duration: Math.random() * 20 + 10, // Duración entre 10s y 30s (muy lento)
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            // Animación de "flotar" y "respirar"
            y: [0, -20, -40], // Flota hacia arriba lentamente
            x: [0, Math.random() * 10 - 5, 0], // Oscilación lateral sutil
            opacity: [0, Math.random() * 0.5 + 0.1, 0], // Aparece y desaparece
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Capa de Vignette (Sombra en bordes) para dar profundidad de cine */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,_rgba(0,0,0,0.2)_100%)] z-10" />
    </div>
  );
};