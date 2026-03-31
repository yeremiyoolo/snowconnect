"use client";

import { ShoppingBag, CheckCircle2, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  variant?: "full" | "icon"; 
}

export function AddToCartButton({ product, variant = "full" }: AddToCartButtonProps) {
  const { items, addItem, removeItem } = useCart();

  const isInCart = items.some((item) => item.id === product.id);

  const handleToggleCart = () => {
    if (isInCart) {
      removeItem(product.id);
      
      toast("Removido de la bolsa", {
        description: product.name,
        icon: <Trash2 className="text-red-500" size={20} />,
        style: { background: "#fff", borderColor: "#fee2e2", borderRadius: "1.5rem", fontWeight: "bold" },
      });
    } else {
      // 🍎 MANZANITA: Agregamos el producto limpio, sin colores ni variantes
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1, 
      });

      toast.success("¡Agregado con éxito! ❄️", {
        description: product.name,
        icon: <CheckCircle2 className="text-green-500" size={20} />,
        style: { background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0", borderRadius: "1.5rem", fontWeight: "bold" },
      });
    }
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleCart(); }}
        size="icon"
        className={`rounded-xl transition-all hover:scale-110 active:scale-95 shadow-lg ${
          isInCart ? "bg-red-500 hover:bg-red-600 text-white" : "bg-primary hover:bg-primary/90 text-white"
        }`}
      >
        {isInCart ? <Trash2 size={18} /> : <ShoppingCart size={18} />}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleToggleCart}
      className={`w-full h-20 text-xl font-black rounded-[2rem] gap-3 transition-all uppercase tracking-tighter shadow-2xl ${
        isInCart ? "bg-red-50 text-red-600 border-2 border-red-200" : "bg-primary text-white"
      }`}
    >
      {isInCart ? <><Trash2 size={24} /> Quitar de la bolsa</> : <><ShoppingBag size={24} /> Agregar a la bolsa</>}
    </Button>
  );
}