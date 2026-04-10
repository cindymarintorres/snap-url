import { notFound } from "next/navigation";
import { getLinkById } from "@/lib/actions/links.actions";
import { LinkForm } from "@/components/links/link-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditLinkPage({ params }: Props) {
  const { id } = await params;
  const result = await getLinkById(id);

  if (!result.success) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar link</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Modifica la URL destino, título, contraseña o fecha de expiración.
        </p>
      </div>
      <LinkForm mode="edit" link={result.data} />
    </div>
  );
}
