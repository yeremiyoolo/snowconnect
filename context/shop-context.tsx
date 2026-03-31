"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "DOP" | "USD";

interface ShopContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number; // Tasa del dólar (Ej: 59.50)
  formatPrice: (priceInDop: number) => string;
  isResellerMode: boolean;
  toggleResellerMode: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("DOP");
  const [isResellerMode, setIsResellerMode] = useState(false);
  const [exchangeRate] = useState(60.0); // Puedes hacerlo dinámico luego

  // Persistencia básica (guardar en navegador)
  useEffect(() => {
    const savedCurrency = localStorage.getItem("snow_currency") as Currency;
    const savedMode = localStorage.getItem("snow_reseller_mode");
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedMode) setIsResellerMode(savedMode === "true");
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem("snow_currency", c);
  };

  const toggleResellerMode = () => {
    const newVal = !isResellerMode;
    setIsResellerMode(newVal);
    localStorage.setItem("snow_reseller_mode", String(newVal));
  };

  // Función maestra para formatear precios en toda la app
  const formatPrice = (priceInDop: number) => {
    if (currency === "DOP") {
      return new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "DOP",
        minimumFractionDigits: 0,
      }).format(priceInDop);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(priceInDop / exchangeRate);
    }
  };

  return (
    <ShopContext.Provider value={{ 
      currency, 
      setCurrency: handleSetCurrency, 
      exchangeRate, 
      formatPrice,
      isResellerMode,
      toggleResellerMode
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop debe usarse dentro de ShopProvider");
  return context;
};