import { z } from "zod";

export const CreateLinkSchema = z.object({
  originalUrl: z
    .string()
    .url("URL inválida")
    .refine(
      (url) => !url.startsWith("javascript:") && !url.startsWith("data:"),
      { message: "URL no permitida" },
    ),
  title: z.string().max(100, "Máximo 100 caracteres").optional(),
  password: z
    .string()
    .min(4, "Mínimo 4 caracteres")
    .max(50)
    .optional()
    .or(z.literal("")),
  expiresAt: z.coerce
    .date()
    .min(new Date(), "La fecha debe ser futura")
    .optional()
    .nullable(),
});

export const UpdateLinkSchema = CreateLinkSchema.extend({
  isActive: z.boolean().optional(),
});

export type CreateLinkInput = z.infer<typeof CreateLinkSchema>;
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;
