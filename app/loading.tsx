import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-sm text-muted-foreground font-medium animate-pulse">
        Cargando SnowConnect...
      </p>
    </div>
  );
}