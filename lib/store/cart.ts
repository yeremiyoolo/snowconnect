import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  cantidad: number;
  maxStock?: number; // Opcional, para limitar cantidad
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === newItem.id);

        if (existingItem) {
          // Si ya existe, sumamos 1 a la cantidad
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            ),
          });
        } else {
          // Si es nuevo, lo agregamos
          set({ items: [...currentItems, { ...newItem, cantidad: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, cantidad) => {
        if (cantidad < 1) return; // No permitir negativos
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, cantidad } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "snowconnect-cart", // Nombre en LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);