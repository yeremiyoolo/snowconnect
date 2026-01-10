"use client";

import { Button } from "@/components/ui/button";
import { toggleUserRole } from "@/app/actions/user-actions";
import { useTransition } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Asegúrate de tener este hook o usa alert

export function UserRoleButton({ userId, currentRole, isCurrentUser }: { userId: string, currentRole: string, isCurrentUser: boolean }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    if (isCurrentUser) return <span className="text-xs text-gray-400">Tú</span>;

    const handleToggle = () => {
        startTransition(async () => {
           await toggleUserRole(userId, currentRole);
           toast({
             title: "Rol actualizado",
             description: `El usuario ahora es ${currentRole === 'ADMIN' ? 'USER' : 'ADMIN'}`
           });
        });
    };

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggle}
            disabled={isPending}
            className={currentRole === "ADMIN" ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"}
        >
            {currentRole === "ADMIN" ? (
                <><ShieldAlert className="w-4 h-4 mr-2"/> Revocar Admin</>
            ) : (
                <><ShieldCheck className="w-4 h-4 mr-2"/> Hacer Admin</>
            )}
        </Button>
    );
}