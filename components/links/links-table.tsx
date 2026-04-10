"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LockIcon, ExternalLinkIcon, PlusIcon } from "lucide-react";
import { LinkRowActions } from "@/components/links/link-row-actions";
import { DeleteLinkDialog } from "@/components/links/delete-link-dialog";
import { type LinkDTO } from "@/types";
import { formatDate } from "@/lib/utils/date";

type Props = {
  links: LinkDTO[];
};

export function LinksTable({ links }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20">
        <p className="text-muted-foreground text-sm mb-4">No tienes links aún.</p>
        <LinkButton id="create-first-link-btn" href="/dashboard/links/new">
          <PlusIcon className="w-4 h-4 mr-2" />
          Crear mi primer link
        </LinkButton>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título / URL</TableHead>
              <TableHead>URL corta</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id} id={`link-row-${link.id}`}>
                {/* Título / URL */}
                <TableCell className="max-w-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm truncate">
                      {link.title ?? "Sin título"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      {link.originalUrl}
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <ExternalLinkIcon className="w-3 h-3" />
                      </a>
                    </span>
                  </div>
                </TableCell>

                {/* URL corta */}
                <TableCell>
                  <span className="text-sm font-mono text-primary">
                    /r/{link.slug}
                    {link.hasPassword && (
                      <LockIcon className="inline w-3 h-3 ml-1 text-muted-foreground" />
                    )}
                  </span>
                </TableCell>

                {/* Clicks */}
                <TableCell className="text-center">
                  <span className="font-semibold tabular-nums">{link.clickCount}</span>
                </TableCell>

                {/* Estado */}
                <TableCell className="text-center">
                  <Badge
                    variant={link.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {link.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>

                {/* Fecha */}
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(link.createdAt)}
                </TableCell>

                {/* Acciones */}
                <TableCell>
                  <LinkRowActions
                    link={link}
                    onDeleteClick={(id) => setDeletingId(id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteLinkDialog
        linkId={deletingId}
        onClose={() => setDeletingId(null)}
      />
    </>
  );
}
