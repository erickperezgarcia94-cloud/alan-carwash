"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getInitialUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser ?? null);
      setLoading(false);
    };
    getInitialUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Car className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">Alan Carwash</span>
        </Link>

        <nav className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-gray-500">Cargando...</span>
          ) : user ? (
            <>
              <span className="hidden text-sm text-gray-600 sm:inline">
                {user.email}
              </span>
              <Link href="/reservar">
                <Button variant="outline" size="sm">
                  Reservar
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-600"
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
