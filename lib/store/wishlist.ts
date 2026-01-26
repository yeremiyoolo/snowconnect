import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const exists = currentItems.find((i) => i.id === item.id);
        if (!exists) {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
    }),
    {
      name: 'snow-wishlist-storage', // Nombre para guardar en localStorage
    }
  )
);