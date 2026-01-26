import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareStore {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        // Máximo 3 productos para comparar
        if (currentItems.length >= 3) return; 
        
        const exists = currentItems.find((i) => i.id === item.id);
        if (!exists) {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      isInCompare: (id) => {
        return get().items.some((i) => i.id === id);
      },
      clearCompare: () => set({ items: [] }),
    }),
    {
      name: 'snow-compare-storage',
    }
  )
);