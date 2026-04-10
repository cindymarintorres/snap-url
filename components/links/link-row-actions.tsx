"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { MoreHorizontalIcon, CopyIcon, PencilIcon, TrashIcon, ToggleLeftIcon, ToggleRightIcon, BarChart2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleLinkActive } from "@/lib/actions/links.actions";
import { type LinkDTO } from "@/types";

type Props = {
  link: LinkDTO;
  onDeleteClick: (id: string) => void;
};

export function LinkRowActions({ link, onDeleteClick }: Props) {
  const router = useRouter();
  const [toggling, setToggling] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link.shortUrl);
    toast.success("URL copiada al portapapeles");
  }

  async function handleToggle() {
    setToggling(true);
    try {
      const result = await toggleLinkActive(link.id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(result.data.isActive ? "Link activado" : "Link desactivado");
        router.refresh();
      }
    } finally {
      setToggling(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        id={`link-actions-${link.id}`} 
        className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8" })}
      >
        <MoreHorizontalIcon className="w-4 h-4" />
        <span className="sr-only">Acciones</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopy} id={`copy-link-${link.id}`}>
          <CopyIcon className="w-4 h-4 mr-2" />
          Copiar URL corta
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/links/${link.id}/edit`)}
          id={`edit-link-${link.id}`}
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/analytics/${link.id}`)}
          id={`analytics-link-${link.id}`}
        >
          <BarChart2Icon className="w-4 h-4 mr-2" />
          Ver analytics
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggle} disabled={toggling} id={`toggle-link-${link.id}`}>
          {link.isActive ? (
            <><ToggleRightIcon className="w-4 h-4 mr-2" />Desactivar</>
          ) : (
            <><ToggleLeftIcon className="w-4 h-4 mr-2" />Activar</>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteClick(link.id)}
          id={`delete-link-${link.id}`}
          className="text-destructive focus:text-destructive"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
