import Link from "next/link";
import { ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function LinkExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          <ClockIcon className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Enlace expirado</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Este enlace ya no está disponible porque su fecha de expiración fue alcanzada.
        </p>
        <Link
          id="expired-home-btn"
          href="/"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
