import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  // 🔥 Eliminados color y variantId porque ya es 100% único
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        // Si el producto ya está en la bolsa, bloqueamos la acción.
        // No suma cantidades porque tus productos son únicos.
        if (existingItem) {
          return; 
        }

        // Lo agrega con cantidad fija de 1.
        set({ items: [...currentItems, { ...data, quantity: 1 }] });
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'snowconnect-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);