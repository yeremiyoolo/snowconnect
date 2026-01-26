"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Laptop, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Preferencias</h2>
        <p className="text-muted-foreground text-sm">Personaliza tu experiencia en SnowConnect.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SELECTOR DE TEMA */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />} 
                Apariencia
            </h3>
            <div className="grid grid-cols-3 gap-3">
                <ThemeBtn label="Claro" icon={Sun} active={theme === 'light'} onClick={() => setTheme('light')} />
                <ThemeBtn label="Oscuro" icon={Moon} active={theme === 'dark'} onClick={() => setTheme('dark')} />
                <ThemeBtn label="Sistema" icon={Laptop} active={theme === 'system'} onClick={() => setTheme('system')} />
            </div>
        </div>

        {/* MONEDA (Visual) */}
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                <DollarSign size={18} /> Moneda
            </h3>
            <select className="w-full p-3 bg-secondary text-foreground rounded-xl font-medium outline-none focus:ring-2 focus:ring-ring">
                <option value="DOP">Peso Dominicano (RD$)</option>
                <option value="USD">Dólar Estadounidense (US$)</option>
            </select>
        </div>
      </div>
    </div>
  );
}

function ThemeBtn({ label, icon: Icon, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={`p-3 rounded-xl text-sm font-bold border transition-all flex flex-col items-center gap-2 ${
                active 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground border-transparent'
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    )
}