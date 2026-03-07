import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FormularioReserva } from "@/app/agendar/formulario-reserva";

export default async function ReservarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/reservar");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563eb] text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reservar cita</h1>
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
