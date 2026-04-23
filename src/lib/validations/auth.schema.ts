import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(50),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(100),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(100)
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un símbolo"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(50),
  email: z.string().email("Email inválido"),
  bio: z.string().max(200, "Máximo 200 caracteres").optional(),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Requerido"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres").max(100),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
