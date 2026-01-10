"use client";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Smartphone, History, Star, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchModal({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
  const router = useRouter();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Busca iPhone 13, Samsung S23, 128GB..." />
      <CommandList className="max-h-[450px]">
        <CommandEmpty>No encontramos resultados para esa búsqueda.</CommandEmpty>
        
        <CommandGroup heading="Sugerencias rápidas">
          <CommandItem onSelect={() => { router.push('/catalogo?q=iPhone+13+Pro'); setOpen(false); }}>
            <Smartphone className="mr-2 h-4 w-4" /> iPhone 13 Pro
          </CommandItem>
          <CommandItem onSelect={() => { router.push('/catalogo?marca=Samsung'); setOpen(false); }}>
            <SearchIcon className="mr-2 h-4 w-4" /> Samsung S23 Series
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Filtrar por Atributos">
          <CommandItem onSelect={() => { router.push('/catalogo?almacenamiento=256GB'); setOpen(false); }}>
            <History className="mr-2 h-4 w-4" /> Dispositivos de 256GB+
          </CommandItem>
          <CommandItem onSelect={() => { router.push('/catalogo?estado=Nuevo'); setOpen(false); }}>
            <Star className="mr-2 h-4 w-4 text-amber-500" /> Equipos Nuevos (Sellados)
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}