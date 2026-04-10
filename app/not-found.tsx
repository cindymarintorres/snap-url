import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchXIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <SearchXIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl font-semibold mb-1">Página no encontrada</p>
        <p className="text-muted-foreground text-sm mb-6">
          El enlace que buscas no existe o ha sido eliminado.
        </p>
        <Link id="not-found-home-btn" href="/" className={cn(buttonVariants({ variant: "default" }))}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
