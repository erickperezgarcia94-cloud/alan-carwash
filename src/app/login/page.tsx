"use client";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

function LoginFormWrapper() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <LoginForm />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      }
    >
      <LoginFormWrapper />
    </Suspense>
  );
}
