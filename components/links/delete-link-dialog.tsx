"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteLink } from "@/lib/actions/links.actions";
import { useRouter } from "next/navigation";

type Props = {
  linkId: string | null;
  onClose: () => void;
};

export function DeleteLinkDialog({ linkId, onClose }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!linkId) return;
    setDeleting(true);
    try {
      const result = await deleteLink(linkId);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Link eliminado");
        router.refresh();
        onClose();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={!!linkId} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este link?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible. Se eliminarán el link y todos sus clicks registrados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel id="delete-dialog-cancel" onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            id="delete-dialog-confirm"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
