"use client";

import { ProductCard } from "./product-card";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductShowcaseProps {
  products: any[];
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Cargando inventario exclusivo...</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Recién Llegados</h2>
          <p className="text-gray-500 max-w-md">
            Dispositivos verificados por nuestros expertos, listos para su nuevo dueño.
          </p>
        </div>
        <Link 
          href="/catalogo" 
          className="group flex items-center gap-2 text-sm font-bold border-b border-gray-200 pb-1 hover:border-black transition-colors"
        >
          Ver todo el catálogo 
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}