import Link from "next/link";
import { Car, Droplets, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-4 py-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Tu coche brillante, con cita previa
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            En Alan Carwash cuidamos tu vehículo con un lavado profesional.
            Agenda tu cita en unos segundos y recoge tu coche impecable.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/reservar">
              <Button size="lg" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                Reservar cita
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-24 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-600">
              <Car className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Servicio profesional</h3>
            <p className="mt-1 text-sm text-gray-600">
              Lavado cuidadoso para que tu coche luzca como nuevo.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-600">
              <Droplets className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Agua y calidad</h3>
            <p className="mt-1 text-sm text-gray-600">
              Productos que cuidan la pintura y el medio ambiente.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Resultado impecable</h3>
            <p className="mt-1 text-sm text-gray-600">
              Acabado con brillo y sin marcas. Siempre a tu hora.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
