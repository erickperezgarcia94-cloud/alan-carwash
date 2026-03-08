'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Función para cargar citas
  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_at', { ascending: false });

    if (data) setAppointments(data);
  };

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email !== 'erickperezgarcia94@gmail.com') {
        router.push('/');
        return;
      }

      setIsAdmin(true);
      await fetchAppointments();
      setLoading(false);
    };

    checkUserAndFetch();
  }, [router, supabase]);

  // FUNCIÓN PARA MARCAR COMO COMPLETADO
  const handleComplete = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', id);

    if (!error) {
      // Actualizamos la lista localmente para que se vea el cambio al instante
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'completed' } : apt
      ));
    }
  };

  // FUNCIÓN PARA CERRAR SESIÓN
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) return <div className="p-10 text-center font-sans">Verificando credenciales de Alan Carwash...</div>;
  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-blue-900 p-6 rounded-2xl text-white shadow-lg gap-4">
          <div>
            <h1 className="text-2xl font-bold">📋 Panel de Citas - Alan Carwash</h1>
            <p className="text-blue-200 text-sm">Administrador: erickperezgarcia94@gmail.com</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="grid gap-4">
          {appointments.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-xl shadow-sm text-gray-500">
              No hay citas registradas aún.
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {apt.vehicle_brand} {apt.vehicle_model}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {apt.status || 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    Placa: <span className="font-mono bg-gray-100 px-2 rounded font-bold">{apt.vehicle_plate}</span>
                  </p>
                  <p className="text-blue-600 font-semibold text-sm">
                    📅 {new Date(apt.appointment_at).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {/* BOTÓN WHATSAPP (RECORDATORIO) */}
                  <a
                    href={`https://wa.me/${apt.client_phone || ''}?text=${encodeURIComponent(
                      `Hola! Soy Alan de Alan Carwash. Te confirmo tu cita para tu ${apt.vehicle_brand} hoy a las ${new Date(apt.appointment_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. Te esperamos!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors text-center"
                  >
                    📱 Recordar
                  </a>

                  {/* BOTÓN COMPLETAR */}
                  {apt.status !== 'completed' ? (
                    <button
                      onClick={() => handleComplete(apt.id)}
                      className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                    >
                      ✅ Terminado
                    </button>
                  ) : (
                    <div className="flex-1 md:flex-none bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-bold text-center border border-gray-200">
                      ✨ Lavado
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}