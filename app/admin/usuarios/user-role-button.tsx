"use client";

import { useState } from "react";
import { toggleUserRole } from "@/actions/admin/user-actions";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UserRoleButton({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleUserRole(userId, currentRole);
    setLoading(false);

    if (res.success) {
      toast.success(`Rol cambiado a ${res.newRole}`);
    } else {
      toast.error("Error al cambiar permisos");
    }
  };

  return (
    <Button 
      variant={currentRole === "ADMIN" ? "default" : "outline"} 
      size="sm"
      disabled={loading}
      onClick={handleToggle}
      className={`rounded-full h-8 px-3 text-[10px] font-black uppercase tracking-widest gap-1.5 transition-all ${
        currentRole === "ADMIN" 
          ? "bg-primary text-white shadow-lg shadow-primary/20" 
          : "text-muted-foreground border-border/50"
      }`}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : currentRole === "ADMIN" ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
      {currentRole}
    </Button>
  );
}