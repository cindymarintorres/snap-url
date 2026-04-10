"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarIcon, EyeIcon, EyeOffIcon, LinkIcon, LockIcon, TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreateLinkSchema, type CreateLinkInput } from "@/lib/validations/link.schema";
import { createLink, updateLink } from "@/lib/actions/links.actions";
import { type LinkDTO } from "@/types";

type Props = {
  mode: "create" | "edit";
  link?: LinkDTO;
};

export function LinkForm({ mode, link }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLinkInput>({
    resolver: zodResolver(CreateLinkSchema) as any,
    defaultValues: {
      originalUrl: link?.originalUrl ?? "",
      title: link?.title ?? "",
      password: "",
      expiresAt: link?.expiresAt ? link.expiresAt : undefined,
    },
  });

  async function onSubmit(data: CreateLinkInput) {
    setIsPending(true);
    try {
      if (mode === "create") {
        const result = await createLink(data);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success("¡Link creado exitosamente!");
        router.push("/dashboard/links");
      } else if (link) {
        const result = await updateLink(link.id, data);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success("¡Link actualizado!");
        router.push("/dashboard/links");
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Crear nuevo link" : "Editar link"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Pega la URL larga y configura las opciones."
            : "Modifica los datos del link."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="link-url">
              <LinkIcon className="inline w-4 h-4 mr-1" />
              URL destino *
            </Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://ejemplo.com/url-muy-larga..."
              {...register("originalUrl")}
            />
            {errors.originalUrl && (
              <p className="text-sm text-destructive">{errors.originalUrl.message}</p>
            )}
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="link-title">
              <TagIcon className="inline w-4 h-4 mr-1" />
              Título (opcional)
            </Label>
            <Input
              id="link-title"
              type="text"
              placeholder="Mi campaña de marketing"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="link-password">
              <LockIcon className="inline w-4 h-4 mr-1" />
              Contraseña (opcional)
            </Label>
            <div className="relative">
              <Input
                id="link-password"
                type={showPassword ? "text" : "password"}
                placeholder={mode === "edit" && link?.hasPassword ? "Dejar vacío para no cambiar" : "Proteger con contraseña"}
                {...register("password")}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Expira */}
          <div className="space-y-2">
            <Label htmlFor="link-expires">
              <CalendarIcon className="inline w-4 h-4 mr-1" />
              Fecha de expiración (opcional)
            </Label>
            <Input
              id="link-expires"
              type="datetime-local"
              {...register("expiresAt")}
            />
            {errors.expiresAt && (
              <p className="text-sm text-destructive">{errors.expiresAt.message as string}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button id="link-form-submit" type="submit" disabled={isPending}>
              {isPending
                ? mode === "create"
                  ? "Creando..."
                  : "Guardando..."
                : mode === "create"
                  ? "Crear link"
                  : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/links")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
