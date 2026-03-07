"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { enviarConfirmacionCita } from "@/lib/email";

export type CreateAppointmentResult =
  | { success: true }
  | { success: false; error: string };

function getNombreCliente(user: { email?: string | null; user_metadata?: Record<string, unknown> }): string {
  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    (user.email?.split("@")[0] ?? "");
  return name || "Estimado/a cliente";
}

export async function createAppointment(
  appointmentAt: string,
  vehicleBrand: string,
  vehicleModel: string,
  vehiclePlate: string
): Promise<CreateAppointmentResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para agendar." };
  }

  const brand = vehicleBrand.trim();
  const model = vehicleModel.trim();
  const plate = vehiclePlate.trim().toUpperCase();

  const { error } = await supabase.from("appointments").insert({
    user_id: user.id,
    appointment_at: appointmentAt,
    vehicle_brand: brand,
    vehicle_model: model,
    vehicle_plate: plate,
  });

  if (error) {
    return {
      success: false,
      error: error.message ?? "No se pudo guardar la cita. Intenta de nuevo.",
    };
  }

  if (user.email) {
    await enviarConfirmacionCita({
      to: user.email,
      nombreCliente: getNombreCliente(user),
      fechaHoraIso: appointmentAt,
      marca: brand,
      modelo: model,
      placa: plate,
    });
  }

  revalidatePath("/agendar");
  return { success: true };
}
