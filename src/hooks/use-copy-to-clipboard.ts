"use client";

import { useState, useCallback } from "react";

type CopyState = "idle" | "copied" | "error";

export function useCopyToClipboard(timeout = 2000) {
  const [state, setState] = useState<CopyState>("idle");

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setState("copied");
        setTimeout(() => setState("idle"), timeout);
      } catch {
        setState("error");
        setTimeout(() => setState("idle"), timeout);
      }
    },
    [timeout]
  );

  return { copy, state, copied: state === "copied" };
}
