"use client";

import { useWishlistStore } from "@/lib/store/wishlist";
import ProductCard from "@/components/landing/product-card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-3 mb-12">
           <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl text-red-500">
              <Heart size={32} className="fill-current" />
           </div>
           <div>
             <h1 className="text-3xl font-black text-foreground">Lista de Deseos</h1>
             <p className="text-muted-foreground">{items.length} productos guardados</p>
           </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
             <h2 className="text-xl font-bold mb-4">Tu lista está vacía</h2>
             <Link href="/catalogo">
               <Button>Explorar Catálogo</Button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}