'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // REVISA SI ESTA RUTA ES CORRECTA EN TU PROYECTO
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUserAndFetch = async () => {
      // 1. Verificamos quién está logueado
      const { data: { user } } = await supabase.auth.getUser();

      // 2. Seguridad: Si no eres tú, te sacamos de aquí
      if (!user || user.email !== 'erickperezgarcia94@gmail.com') {
        router.push('/'); // Te manda al inicio si no eres el admin
        return;
      }

      setIsAdmin(true);

      // 3. Si eres tú, traemos todas las citas
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_at', { ascending: false });

      if (data) setAppointments(data);
      setLoading(false);
    };

    checkUserAndFetch();
  }, [router, supabase]);

  if (loading) return <div className="p-10 text-center">Verificando credenciales de Alan Carwash...</div>;
  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-blue-900 p-6 rounded-2xl text-white shadow-lg">
          <h1 className="text-2xl font-bold">📋 Panel de Citas - Alan Carwash</h1>
          {/* ¡AQUÍ ESTABA EL ERROR! El correo debe ir entre comillas o ser una variable */}
          <span className="bg-blue-700 px-4 py-2 rounded-full text-sm">
            Admin: {'erickperezgarcia94@gmail.com'}
          </span>
        </header>

        <div className="grid gap-4">
          {appointments.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-xl shadow-sm text-gray-500">
              No hay citas registradas aún.
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {apt.vehicle_brand} {apt.vehicle_model}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Placa: <span className="font-mono bg-gray-100 px-2 rounded">{apt.vehicle_plate}</span>
                  </p>
                  <p className="text-blue-600 font-medium mt-1">
                    📅 {new Date(apt.appointment_at).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex gap-2 text-gray-700">
                   <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase border border-blue-200">
                    {apt.status || 'Pendiente'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}