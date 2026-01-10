import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  modelo: string;
  marca: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => {
        const existing = state.items.find((i) => i.id === product.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...product, cantidad: 1 }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) => 
          i.id === id ? { ...i, cantidad: Math.max(1, quantity) } : i
        )
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'snowconnect-cart' }
  )
);