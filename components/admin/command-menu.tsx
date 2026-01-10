"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command" // Asegúrate de instalar el componente command de shadcn si no lo tienes: npx shadcn@latest add command
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Plus, 
  Settings 
} from "lucide-react"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  // Efecto para escuchar el atajo de teclado (Ctrl+K o Cmd+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Función para navegar y cerrar el menú
  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      {/* Botón visual en el header (opcional, para quienes no usan atajos) */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <span className="hidden lg:inline-flex">Buscar...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Escribe un comando o busca..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          
          <CommandGroup heading="Accesos Rápidos">
            <CommandItem onSelect={() => runCommand(() => router.push("/admin"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/ventas/nueva"))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Nueva Venta
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/productos/nuevo"))}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Gestión">
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/productos"))}>
              <Package className="mr-2 h-4 w-4" />
              Inventario de Productos
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/usuarios"))}>
              <Users className="mr-2 h-4 w-4" />
              Usuarios y Permisos
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/admin/ventas"))}>
              <Settings className="mr-2 h-4 w-4" />
              Historial de Ventas
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}