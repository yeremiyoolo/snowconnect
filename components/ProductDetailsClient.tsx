'use client';

import { useState } from 'react';
import { ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';
import Image from 'next/image';
import { motion } from "framer-motion";

interface ClientProductProps {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagenes: string[];
  colores: { nombre: string; hex: string }[];
  almacenamiento: string[];
}

export default function ProductDetailsClient({ product }: { product: ClientProductProps }) {
  const defaultColors = [{ nombre: 'Titanio Negro', hex: '#1e1e1e' }];
  const safeColors = product.colores.length > 0 ? product.colores : defaultColors;
  const safeStorage = product.almacenamiento.length > 0 ? product.almacenamiento : ['128GB'];
  const safeImages = product.imagenes.length > 0 ? product.imagenes : ['/placeholder.png'];

  const [selectedColor, setSelectedColor] = useState(safeColors[0]);
  const [selectedStorage, setSelectedStorage] = useState(safeStorage[0]);
  const [mainImage, setMainImage] = useState(0);

  return (
    <div className="text-white min-h-[80vh] flex flex-col justify-center">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* --- COLUMNA IZQUIERDA: Galería Inmersiva --- */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Imagen Principal con efecto de luz sutil */}
          <motion.div 
            key={mainImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="relative w-full aspect-square max-w-xl mx-auto flex items-center justify-center"
          >
            {/* Fondo radial sutil para dar profundidad */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 to-transparent opacity-50 blur-3xl pointer-events-none" />
            
            <Image 
               src={safeImages[mainImage]} 
               alt={product.nombre} 
               fill 
               className="object-contain drop-shadow-2xl z-10"
               priority
            />
          </motion.div>

          {/* Miniaturas Minimalistas */}
          {safeImages.length > 1 && (
            <div className="flex gap-4 mt-8 overflow-x-auto pb-4 no-scrollbar">
              {safeImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(idx)}
                  className={`relative w-16 h-16 rounded-xl border flex-shrink-0 overflow-hidden transition-all duration-300 ${
                    mainImage === idx 
                      ? 'border-white ring-2 ring-white/20 scale-105 opacity-100' 
                      : 'border-white/10 opacity-50 hover:opacity-80'
                  }`}
                >
                   <Image src={img} alt="" fill className="object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- COLUMNA DERECHA: Información Estricta --- */}
        <div className="lg:col-span-5 flex flex-col pt-4 lg:sticky lg:top-32">
          
          {/* Header Limpio */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
              {product.nombre}
            </h1>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-white tracking-tight">
                  ${product.precio.toLocaleString()}
                </span>
                <span className="text-sm text-zinc-400 font-medium">USD</span>
            </div>
          </div>

          <div className="h-px w-full bg-white/10 mb-8" />

          {/* Selector: Acabado (Color) */}
          {safeColors.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-zinc-300">Acabado</span>
                <span className="text-sm font-bold text-white">{selectedColor.nombre}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {safeColors.map((color) => (
                  <button
                    key={color.nombre}
                    onClick={() => setSelectedColor(color)}
                    className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                      selectedColor.nombre === color.nombre 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black' 
                        : 'hover:scale-110'
                    }`}
                  >
                    <span 
                      className="w-full h-full rounded-full border border-white/10 shadow-inner" 
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector: Capacidad (Grid Estricto) */}
          {safeStorage.length > 0 && (
            <div className="mb-10">
               <span className="text-sm font-medium text-zinc-300 mb-3 block">Capacidad</span>
               <div className="grid grid-cols-3 gap-3">
                 {safeStorage.map((size) => (
                   <button
                     key={size}
                     onClick={() => setSelectedStorage(size)}
                     className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                       selectedStorage === size
                         ? 'border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                         : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white bg-white/5'
                     }`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="space-y-4">
              <button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Añadir a la Bolsa
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Truck className="w-3.5 h-3.5" />
                <span>Envío gratuito en 24-48 horas.</span>
              </div>
          </div>
          
          {/* Información Adicional (Diseño Glass) */}
          <div className="mt-8 rounded-2xl bg-white/5 border border-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4 mb-4">
                  <ShieldCheck className="w-6 h-6 text-zinc-400 mt-0.5" />
                  <div>
                      <p className="text-sm font-semibold text-white">Garantía SnowConnect</p>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Cada equipo es inspeccionado meticulosamente. Incluimos 1 año de garantía limitada y soporte técnico prioritario.
                      </p>
                  </div>
              </div>
              <div className="h-px w-full bg-white/5 my-4" />
              <div>
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Descripción</h4>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                    {product.descripcion}
                </p>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}