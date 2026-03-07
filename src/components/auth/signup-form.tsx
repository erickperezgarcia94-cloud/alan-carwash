"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";

const REDIRECT_DEFAULT = "/reservar";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? REDIRECT_DEFAULT;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = signUpSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        fullName: flat.fullName?.[0],
        email: flat.email?.[0],
        password: flat.password?.[0],
        confirmPassword: flat.confirmPassword?.[0],
      });
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.fullName },
        emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md border-gray-200 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 text-[#2563eb]">
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl text-gray-900">Revisa tu correo</CardTitle>
          <CardDescription className="text-gray-600">
            Te hemos enviado un enlace a <strong>{email}</strong> para confirmar tu
            cuenta. Haz clic en el enlace y luego podrás iniciar sesión.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full border-gray-200">
              Ir a iniciar sesión
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-gray-200 shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563eb] text-white">
          <User className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl text-gray-900">Crear cuenta</CardTitle>
        <CardDescription className="text-gray-600">
          Regístrate para reservar tus citas en Alan Carwash
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="flex items-center gap-2 text-gray-700">
              <User className="h-4 w-4 text-[#2563eb]" />
              Nombre completo
            </Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Tu nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className="border-gray-200 bg-white"
              aria-invalid={!!fieldErrors.fullName}
            />
            {fieldErrors.fullName && (
              <p className="text-sm text-red-600">{fieldErrors.fullName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4 text-[#2563eb]" />
              Correo electrónico
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="border-gray-200 bg-white"
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="flex items-center gap-2 text-gray-700">
              <Lock className="h-4 w-4 text-[#2563eb]" />
              Contraseña
            </Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="border-gray-200 bg-white"
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm" className="flex items-center gap-2 text-gray-700">
              <Lock className="h-4 w-4 text-[#2563eb]" />
              Confirmar contraseña
            </Label>
            <Input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="border-gray-200 bg-white"
              aria-invalid={!!fieldErrors.confirmPassword}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              href={redirectTo !== REDIRECT_DEFAULT ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
              className="font-medium text-[#2563eb] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
