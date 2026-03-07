import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FormularioReserva } from "./formulario-reserva";

export default async function AgendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/agendar");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agendar cita</h1>
            <p className="text-gray-600">
              Elige fecha, hora y datos de tu vehículo
            </p>
          </div>
        </div>
        <FormularioReserva />
      </div>
    </div>
  );
}
