"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
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
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

const REDIRECT_DEFAULT = "/reservar";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? REDIRECT_DEFAULT;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const errors: Partial<Record<keyof LoginInput, string>> = {};
      if (flat.email?.[0]) errors.email = flat.email[0];
      if (flat.password?.[0]) errors.password = flat.password[0];
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : signInError.message
      );
      return;
    }
    if (email === 'erickperezgarcia94@gmail.com') {
      router.push('/admin');
    } else {
      router.push(redirectTo);
    }
    
    router.refresh();
  };
  

  return (
    <Card className="w-full max-w-md border-gray-200 shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563eb] text-white">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl text-gray-900">Iniciar sesión</CardTitle>
        <CardDescription className="text-gray-600">
          Entra con tu cuenta para reservar tu cita en Alan Carwash
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
            <Label htmlFor="login-email" className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4 text-[#2563eb]" />
              Correo electrónico
            </Label>
            <Input
              id="login-email"
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
            <Label htmlFor="login-password" className="flex items-center gap-2 text-gray-700">
              <Lock className="h-4 w-4 text-[#2563eb]" />
              Contraseña
            </Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="border-gray-200 bg-white"
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              href={redirectTo !== REDIRECT_DEFAULT ? `/registro?redirect=${encodeURIComponent(redirectTo)}` : "/registro"}
              className="font-medium text-[#2563eb] hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
