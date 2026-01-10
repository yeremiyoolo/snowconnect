"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { 
  User, 
  Menu, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Heart, 
  Settings 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string; 
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const firstName = user.name?.split(" ")[0] || "Usuario";
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  // Verificamos si es ADMIN
  const isAdmin = user.role === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group outline-none focus:ring-2 focus:ring-gray-200">
          <Avatar className="h-8 w-8 border border-gray-100">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-gray-900 text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 hidden sm:inline-block">
              Hola, {firstName}
            </span>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600 transition-colors">
               <Menu size={14} strokeWidth={2.5} />
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-gray-100 bg-white/95 backdrop-blur-sm">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-gray-500 font-medium">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-100 my-2" />
        
        {/* SOLO MOSTRAR SI ES ADMIN */}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer flex items-center gap-2 text-blue-600 font-bold bg-blue-50/50 focus:bg-blue-100 rounded-lg px-2 py-2 mb-1">
              <LayoutDashboard size={16} />
              <span>Panel de Control</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/perfil/pedidos" className="cursor-pointer flex items-center gap-2 text-gray-700 font-medium focus:bg-gray-50 rounded-lg px-2 py-2">
            <Package size={16} />
            <span>Mis Pedidos</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/wishlist" className="cursor-pointer flex items-center gap-2 text-gray-700 font-medium focus:bg-gray-50 rounded-lg px-2 py-2">
            <Heart size={16} />
            <span>Lista de Deseos</span>
          </Link>
        </DropdownMenuItem>
        
        {/* --- AQUÍ ESTÁ EL CAMBIO APLICADO --- */}
        <DropdownMenuItem asChild>
          <Link href="/ajustes" className="cursor-pointer flex items-center gap-2 text-gray-700 font-medium focus:bg-gray-50 rounded-lg px-2 py-2">
            <Settings size={16} />
            <span>Ajustes</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-100 my-2" />

        <DropdownMenuItem 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="cursor-pointer flex items-center gap-2 text-red-600 font-bold focus:bg-red-50 focus:text-red-700 rounded-lg px-2 py-2"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}