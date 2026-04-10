"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

type Props = {
  text: string;
  id?: string;
};

export function CopyButton({ text, id }: Props) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <Button
      id={id ?? "copy-button"}
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={() => copy(text)}
      title="Copiar"
    >
      {copied ? (
        <CheckIcon className="w-4 h-4 text-green-500" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </Button>
  );
}
