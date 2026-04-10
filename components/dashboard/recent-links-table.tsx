import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLinkIcon, ArrowRightIcon } from "lucide-react";
import { type LinkDTO } from "@/types";
import { formatDate } from "@/lib/utils/date";

type Props = {
  links: LinkDTO[];
};

export function RecentLinksTable({ links }: Props) {
  if (!links.length) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Aún no has creado ningún link.{" "}
        <Link href="/dashboard/links/new" className="text-primary underline underline-offset-2">
          Crear el primero
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>URL corta</TableHead>
            <TableHead className="text-center">Clicks</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead>Creado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="max-w-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm truncate">
                    {link.title ?? "Sin título"}
                  </span>
                  <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="w-3 h-3 text-muted-foreground shrink-0" />
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-mono text-primary">/r/{link.slug}</span>
              </TableCell>
              <TableCell className="text-center font-semibold tabular-nums">
                {link.clickCount}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={link.isActive ? "default" : "secondary"} className="text-xs">
                  {link.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(link.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-3 flex justify-end">
        <LinkButton variant="ghost" size="sm" href="/dashboard/links" id="view-all-links-btn">
          Ver todos <ArrowRightIcon className="w-4 h-4 ml-1" />
        </LinkButton>
      </div>
    </div>
  );
}
