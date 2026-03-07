import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Introduce un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "El nombre completo es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z
      .string()
      .min(1, "El correo es obligatorio")
      .email("Introduce un correo electrónico válido"),
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
