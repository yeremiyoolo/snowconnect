"use client";

import { useState } from "react";
import { registrarVenta } from "@/actions/ventas/registrar-venta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, User, Smartphone, CreditCard, 
  CheckCircle2, ChevronsUpDown, Check, Search, Banknote, Building2 
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

export default function PointOfSale({ productos, usuarios }: { productos: any[], usuarios: any[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Estados de venta
  const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(null);
  const [userId, setUserId] = useState("");
  const [clienteFisico, setClienteFisico] = useState("");
  const [precio, setPrecio] = useState("");
  const [metodoPago, setMetodoPago] = useState("Transferencia");

  // Popovers
  const [openProduct, setOpenProduct] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  // Filtros
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");

  const productosFiltrados = productos.filter((prod) => {
    if (!busquedaProducto) return true;
    const texto = `${prod.marca} ${prod.modelo} ${prod.imei || ""} ${prod.nombre}`.toLowerCase();
    return texto.includes(busquedaProducto.toLowerCase());
  });

  const usuariosFiltrados = usuarios.filter((user) => {
    if (!busquedaUsuario) return true;
    const texto = `${user.name} ${user.email}`.toLowerCase();
    return texto.includes(busquedaUsuario.toLowerCase());
  });

  const handleProductSelect = (prod: any) => {
    setProductoSeleccionado(prod);
    setPrecio(prod.precioVenta.toString());
    setOpenProduct(false);
    setBusquedaProducto("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productoSeleccionado || !precio) return;

    setLoading(true);
    
    // Llamamos a la acción limpia
    const resultado = await registrarVenta(
      productoSeleccionado.id, 
      userId !== "fisico" ? userId : null, 
      clienteFisico, 
      parseFloat(precio),
      metodoPago
    );
    
    setLoading(false);

    if (resultado.error) {
      toast.error(resultado.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setProductoSeleccionado(null);
        setUserId("");
        setClienteFisico("");
        setPrecio("");
      }, 2500);
    }
  }

  if (success) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-10 bg-green-50 border-green-200 animate-in zoom-in-95 rounded-[3rem]">
        <CheckCircle2 className="h-20 w-20 text-green-600 mb-6 animate-bounce" />
        <h2 className="text-3xl font-black text-green-800 uppercase italic tracking-tighter">¡Venta Registrada!</h2>
        <p className="text-green-600 font-bold mt-2">El equipo ya figura como vendido en el sistema.</p>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-2xl overflow-hidden flex flex-col h-full bg-card rounded-[3rem]">
      <CardHeader className="bg-secondary/20 border-b border-border/50 pb-6 px-8 pt-8">
        <CardTitle className="flex items-center gap-3 text-3xl font-black uppercase italic tracking-tighter">
          <CreditCard className="text-primary w-8 h-8" /> Terminal POS
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8 flex-1 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. BUSCADOR DE PRODUCTOS */}
          <div className="space-y-3">
            <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
              <Smartphone size={14} /> 1. Escanear o Buscar Equipo
            </Label>
            
            <Popover open={openProduct} onOpenChange={setOpenProduct}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className={cn("w-full justify-between h-16 rounded-2xl text-lg font-medium", productoSeleccionado && "border-primary ring-1 ring-primary bg-primary/5")}>
                  {productoSeleccionado ? (
                    <span className="font-black text-foreground uppercase italic tracking-tighter">
                       {productoSeleccionado.modelo} <span className="font-medium text-muted-foreground ml-2 not-italic tracking-normal">(${productoSeleccionado.precioVenta})</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-2">
                        <Search size={18} /> IMEI, Modelo o Marca...
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-5 w-5 opacity-50" />
                </Button>
              </PopoverTrigger>
              
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl" align="start">
                <Command shouldFilter={false}>
                  <CommandInput placeholder="Escribe para buscar..." value={busquedaProducto} onValueChange={setBusquedaProducto} className="h-12" />
                  <CommandList className="max-h-[300px]">
                    {productosFiltrados.length === 0 ? (
                      <CommandEmpty>No se encontró el equipo.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {productosFiltrados.map((prod) => (
                          <CommandItem key={prod.id} value={prod.id} onSelect={() => handleProductSelect(prod)} className="cursor-pointer py-4 px-4 border-b last:border-0">
                            <div className="flex items-center gap-4 w-full">
                              <div className="w-10 h-10 rounded-xl bg-secondary overflow-hidden relative shrink-0">
                                {prod.imagenes?.[0] && <Image src={prod.imagenes[0].url} alt="" fill className="object-cover"/>}
                              </div>
                              <div className="flex flex-col flex-1">
                                <span className="font-black uppercase tracking-tight">{prod.modelo}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{prod.marca} {prod.imei ? `• IMEI: ${prod.imei}` : ''}</span>
                              </div>
                              <span className="font-black text-primary">${prod.precioVenta}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Separator className="opacity-50" />

          {/* 2. CLIENTE Y MÉTODO DE PAGO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
                <User size={14} /> 2. Datos del Cliente
              </Label>
              
              <Popover open={openUser} onOpenChange={setOpenUser}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between h-14 rounded-xl">
                    {userId ? (userId === "fisico" ? "Cliente Físico / Walk-in" : usuarios.find((u) => u.id === userId)?.name) : "Seleccionar cliente web..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput placeholder="Nombre..." value={busquedaUsuario} onValueChange={setBusquedaUsuario} />
                    <CommandList>
                      <CommandItem onSelect={() => { setUserId("fisico"); setOpenUser(false); }} className="py-3 cursor-pointer text-primary font-bold">
                        + Cliente sin cuenta (Físico)
                      </CommandItem>
                      {usuariosFiltrados.map((user) => (
                        <CommandItem key={user.id} value={user.id} onSelect={() => { setUserId(user.id); setOpenUser(false); }} className="py-3 cursor-pointer">
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name || "Sin nombre"}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {userId === "fisico" && (
                <Input 
                  placeholder="Nombre del cliente..." 
                  value={clienteFisico} 
                  onChange={(e) => setClienteFisico(e.target.value)} 
                  className="h-14 rounded-xl"
                  required
                />
              )}
            </div>

            <div className="space-y-4">
              <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
                <Banknote size={14} /> 3. Método de Pago
              </Label>
              <div className="grid grid-cols-3 gap-2 h-14">
                {["Transferencia", "Efectivo", "Tarjeta"].map((metodo) => (
                  <div 
                    key={metodo}
                    onClick={() => setMetodoPago(metodo)}
                    className={cn("flex items-center justify-center rounded-xl border text-xs font-bold cursor-pointer transition-all uppercase tracking-widest", metodoPago === metodo ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-card hover:bg-secondary border-border")}
                  >
                    {metodo === "Transferencia" ? <Building2 size={14} className="mr-1.5"/> : metodo === "Efectivo" ? <Banknote size={14} className="mr-1.5"/> : <CreditCard size={14} className="mr-1.5"/>}
                    {metodo}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* 4. TOTAL Y COBRO */}
          <div className="bg-secondary/10 p-6 rounded-[2rem] border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-1/2 space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Monto Final a Cobrar</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xl">$</span>
                <Input 
                  type="number" 
                  value={precio} 
                  onChange={(e) => setPrecio(e.target.value)} 
                  className="pl-10 font-black italic text-3xl h-16 rounded-2xl border-primary/30 focus:border-primary bg-background" 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full md:w-1/2 h-16 rounded-2xl text-lg font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 shadow-2xl shadow-green-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100" 
              disabled={loading || !productoSeleccionado || !precio || (userId === "fisico" && !clienteFisico)}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Procesar Venta"}
            </Button>
          </div>
          
        </form>
      </CardContent>
    </Card>
  );
}