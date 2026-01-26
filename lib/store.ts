import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definimos cómo se ve un producto en el carrito
export interface CartItem {
  id: string;
  modelo: string;
  precio: number;
  imagen: string;
  cantidad: number;
  capacidad?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          // Si ya existe, solo sumamos 1 a la cantidad
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, cantidad: 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, cantidad: Math.max(1, quantity) } : i
        ),
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'snowconnect-cart', // Nombre para guardar en localStorage
    }
  )
);