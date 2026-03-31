"use client";

import { useTheme } from "next-themes";
import { useShop } from "@/context/shop-context";
import { Moon, Sun, Laptop, DollarSign, TrendingUp, Languages } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Asegúrate de tener este componente shadcn
import { Label } from "@/components/ui/label";

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, isResellerMode, toggleResellerMode } = useShop();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Personalización</h2>
        <p className="text-muted-foreground text-sm">Ajusta SnowConnect a tu estilo de compra.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. TEMA */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />} 
                Apariencia
            </h3>
            <div className="grid grid-cols-3 gap-3">
                <ThemeBtn label="Claro" icon={Sun} active={theme === 'light'} onClick={() => setTheme('light')} />
                <ThemeBtn label="Oscuro" icon={Moon} active={theme === 'dark'} onClick={() => setTheme('dark')} />
                <ThemeBtn label="Auto" icon={Laptop} active={theme === 'system'} onClick={() => setTheme('system')} />
            </div>
        </div>

        {/* 2. MONEDA Y REGIÓN */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-between">
            <div>
                <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                    <DollarSign size={18} /> Moneda Visual
                </h3>
                <div className="flex bg-secondary p-1 rounded-xl">
                    <button 
                        onClick={() => setCurrency("DOP")}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${currency === 'DOP' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                    >
                        Peso (DOP)
                    </button>
                    <button 
                        onClick={() => setCurrency("USD")}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${currency === 'USD' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                    >
                        Dólar (USD)
                    </button>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
                 <h3 className="font-bold mb-2 flex items-center gap-2 text-foreground text-sm">
                    <Languages size={16} /> Idioma
                </h3>
                <p className="text-xs text-muted-foreground mb-2">Próximamente disponible en inglés.</p>
                <div className="opacity-50 pointer-events-none">
                    <ThemeBtn label="Español (RD)" icon={Languages} active={true} onClick={()=>{}} />
                </div>
            </div>
        </div>

        {/* 3. MODO INVERSOR (GAMIFICACIÓN) */}
        <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-blue-900/20 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-yellow-400" />
                        <h3 className="text-xl font-black italic tracking-wider">MODO INVERSOR</h3>
                    </div>
                    <p className="text-blue-100 text-sm max-w-md">
                        Activa esta opción para ver el <strong>valor futuro estimado</strong> de los equipos. Ideal si compras para revender o cambiar frecuentemente.
                    </p>
                </div>
                
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <Label htmlFor="reseller-mode" className="font-bold cursor-pointer">
                        {isResellerMode ? "Activado" : "Desactivado"}
                    </Label>
                    <Switch 
                        id="reseller-mode" 
                        checked={isResellerMode} 
                        onCheckedChange={toggleResellerMode}
                        className="data-[state=checked]:bg-yellow-400"
                    />
                </div>
            </div>

            {/* Decoración */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
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