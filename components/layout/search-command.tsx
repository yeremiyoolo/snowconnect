"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useRouter } from "next/navigation";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Escuchar el atajo de teclado CMD+K o CTRL+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border rounded-full hover:bg-white/10 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline-block">Buscar...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="¿Qué dispositivo buscas?" />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup heading="Marcas Populares">
            <CommandItem onSelect={() => { router.push('/catalogo?marca=Apple'); setOpen(false); }}>iPhone / Apple</CommandItem>
            <CommandItem onSelect={() => { router.push('/catalogo?marca=Samsung'); setOpen(false); }}>Samsung Galaxy</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}