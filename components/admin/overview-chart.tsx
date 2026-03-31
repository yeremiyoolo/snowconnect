"use client"

import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";

interface DataPoint {
  name: string;
  total: number;
}

interface OverviewChartProps {
  weekly: DataPoint[];
  monthly: DataPoint[];
  annual: DataPoint[];
}

export function OverviewChart({ weekly, monthly, annual }: OverviewChartProps) {
  const [view, setView] = useState<"weekly" | "monthly" | "annual">("annual");

  const data = view === "weekly" ? weekly : view === "monthly" ? monthly : annual;

  return (
    <div className="space-y-6">
      
      {/* Botones de control de flujo */}
      <div className="flex items-center justify-end gap-2 bg-secondary/30 w-fit ml-auto p-1.5 rounded-full border border-border/50">
        <Button
          variant={view === "weekly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("weekly")}
          className={`text-[10px] uppercase font-black tracking-widest rounded-full px-4 h-7 ${view === "weekly" ? "shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
        >
          Últimos 7 Días
        </Button>
        <Button
          variant={view === "monthly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("monthly")}
          className={`text-[10px] uppercase font-black tracking-widest rounded-full px-4 h-7 ${view === "monthly" ? "shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
        >
          Últimas 4 Semanas
        </Button>
        <Button
          variant={view === "annual" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("annual")}
          className={`text-[10px] uppercase font-black tracking-widest rounded-full px-4 h-7 ${view === "annual" ? "shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
        >
          Año Actual
        </Button>
      </div>

      {/* Gráfico Recharts */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.15} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={10}
            fontWeight={900}
            tickLine={false}
            axisLine={false}
            tick={{ textTransform: 'uppercase' }}
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            fontWeight={700}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-zinc-900 border border-border/50 p-4 rounded-2xl shadow-2xl animate-in zoom-in duration-200">
                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] mb-1">
                      {payload[0].payload.name}
                    </p>
                    <p className="text-xl font-black text-primary italic tracking-tighter">
                      RD$ {payload[0].value?.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="total"
            fill="currentColor"
            radius={[6, 6, 0, 0]}
            className="fill-primary"
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}