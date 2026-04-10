import { LinkButton } from "@/components/shared/link-button";
import { LinksTable } from "@/components/links/links-table";
import { getUserLinks } from "@/lib/actions/links.actions";
import { PlusIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const result = await getUserLinks();
  const links = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mis Links</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {links.length} {links.length === 1 ? "link" : "links"} en total
          </p>
        </div>
        <LinkButton id="create-link-btn" href="/dashboard/links/new">
          <PlusIcon className="w-4 h-4 mr-2" />
          Nuevo link
        </LinkButton>
      </div>

      {!result.success && (
        <p className="text-sm text-destructive">Error al cargar links: {result.error}</p>
      )}

      <LinksTable links={links} />
    </div>
  );
}
