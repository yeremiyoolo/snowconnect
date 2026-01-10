"use client";

import { useCartStore } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CarritoPage() {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
            <Trash2 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-8">¡Añade algunos productos para empezar!</p>
          <Link href="/catalogo">
            <Button className="rounded-full px-8">Ir al Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <h1 className="text-3xl font-black mb-10">MI CARRITO</h1>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-4 bg-card rounded-[2rem] border border-border">
                <div className="relative w-24 h-24 bg-secondary rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={item.imagen} alt={item.modelo} fill className="object-contain p-2" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{item.modelo}</h3>
                  <p className="text-sm text-primary font-bold">${item.precio.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-bold">{item.cantidad}</span>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => addItem(item)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-[2.5rem] p-8 h-fit sticky top-32">
            <h2 className="text-xl font-bold mb-6">Resumen</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-4">
                <span className="font-black">TOTAL</span>
                <span className="font-black text-primary">${total.toLocaleString()}</span>
              </div>
            </div>
            <Button className="w-full h-14 rounded-2xl text-lg font-bold">
              Finalizar Compra
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}