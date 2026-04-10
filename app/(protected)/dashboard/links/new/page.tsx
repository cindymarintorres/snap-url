import { LinkForm } from "@/components/links/link-form";

export default function NewLinkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nuevo link</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Crea un enlace corto con opciones de seguridad y expiración.
        </p>
      </div>
      <LinkForm mode="create" />
    </div>
  );
}
