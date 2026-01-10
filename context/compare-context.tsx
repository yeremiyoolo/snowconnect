"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CompareContextType {
  selectedIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const clearCompare = () => setSelectedIds([]);

  return (
    <CompareContext.Provider value={{ selectedIds, toggleCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare debe usarse dentro de CompareProvider");
  return context;
};