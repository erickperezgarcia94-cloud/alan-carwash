"use client";

import { useState } from "react";
import { Calendar, Car, Droplets, Sparkles } from "lucide-react";
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
import { createAppointment } from "./actions";

const HORARIO_INICIO = 8;
const HORARIO_FIN = 20;

function getMinDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function FormularioReserva() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult("idle");
    setErrorMessage("");
    setLoading(true);

    const [hours, minutes] = time.split(":").map(Number);
    const appointmentAt = new Date(date);
    appointmentAt.setHours(hours, minutes, 0, 0);

    const res = await createAppointment(
      appointmentAt.toISOString(),
      vehicleBrand,
      vehicleModel,
      vehiclePlate
    );

    setLoading(false);
    if (res.success) {
      setResult("success");
      setDate("");
      setTime("09:00");
      setVehicleBrand("");
      setVehicleModel("");
      setVehiclePlate("");
    } else {
      setResult("error");
      setErrorMessage(res.error);
    }
  };

  if (result === "success") {
    return (
      <Card className="border-green-200 bg-green-50/50 shadow-sm">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Reserva confirmada
          </CardTitle>
          <CardDescription>
            Tu cita en Alan Carwash ha quedado registrada. Te esperamos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <strong>El pago se realiza en efectivo o tarjeta</strong> al recoger
            tu vehículo en Alan Carwash.
          </p>
          <Button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => setResult("idle")}
          >
            Agendar otra cita
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Calendar className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">Nueva cita</CardTitle>
        </div>
        <CardDescription>
          Elige fecha, hora y datos de tu vehículo
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {result === "error" && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-cyan-600" />
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                min={getMinDate()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-cyan-600" />
                Hora
              </Label>
              <Input
                id="time"
                type="time"
                min={`${String(HORARIO_INICIO).padStart(2, "0")}:00`}
                max={`${String(HORARIO_FIN).padStart(2, "0")}:00`}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand" className="flex items-center gap-2 text-gray-700">
              <Car className="h-4 w-4 text-cyan-600" />
              Marca del vehículo
            </Label>
            <Input
              id="brand"
              type="text"
              placeholder="Ej. Toyota, Volkswagen..."
              value={vehicleBrand}
              onChange={(e) => setVehicleBrand(e.target.value)}
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model" className="flex items-center gap-2 text-gray-700">
              <Car className="h-4 w-4 text-cyan-600" />
              Modelo
            </Label>
            <Input
              id="model"
              type="text"
              placeholder="Ej. Corolla, Golf..."
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plate" className="flex items-center gap-2 text-gray-700">
              <Droplets className="h-4 w-4 text-cyan-600" />
              Placa
            </Label>
            <Input
              id="plate"
              type="text"
              placeholder="Ej. ABC-123"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              required
              maxLength={12}
              className="bg-white"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Confirmar cita"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
