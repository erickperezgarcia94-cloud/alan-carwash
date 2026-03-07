"use client";

import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/signup-form";

function SignUpFormWrapper() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <SignUpForm />
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      }
    >
      <SignUpFormWrapper />
    </Suspense>
  );
}
