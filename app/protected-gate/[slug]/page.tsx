"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function PasswordGatePage({ params: paramsPromise }: Props) {
  const searchParams = useSearchParams();
  const isAuth = searchParams.get("auth") === "true";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuth) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const pathParts = window.location.pathname.split("/protected-gate/");
      const slug = pathParts[1] ?? "";
      const res = await fetch(`/api/r/${slug}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      toast.error("Error al verificar la contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <LockIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Link protegido</CardTitle>
          <CardDescription>
            Este enlace requiere una contraseña para acceder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gate-password">Contraseña</Label>
              <Input
                id="gate-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                autoFocus
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button
              id="gate-submit-btn"
              type="submit"
              className="w-full"
              disabled={loading || !password}
            >
              {loading ? "Verificando..." : "Acceder"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
