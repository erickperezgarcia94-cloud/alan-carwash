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

  const fetchAppointments = async () => {
    const { data } = await supabase
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

  const handleComplete = async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', id);

    if (!error) {
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'completed' } : apt
      ));
    }
  };

  if (loading) return <div className="p-10 text-center font-sans">Cargando panel de Alan Carwash...</div>;
  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* HEADER LIMPIO SIN BOTÓN DE CERRAR SESIÓN (USARÁS EL DE LA NAVBAR) */}
        <header className="mb-8 bg-blue-900 p-8 rounded-2xl text-white shadow-lg border-b-4 border-blue-500 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">📋 Panel de Citas</h1>
          <p className="text-blue-200 mt-2 font-medium">Bienvenido de nuevo, Erick</p>
        </header>

        <div className="grid gap-6">
          {appointments.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl shadow-sm text-gray-400 border-2 border-dashed border-gray-200">
              No hay citas registradas en este momento.
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-md">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl text-gray-800">
                      {apt.vehicle_brand} {apt.vehicle_model}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {apt.status || 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded font-mono font-bold text-gray-700">{apt.vehicle_plate}</span>
                    • {apt.client_email}
                  </p>
                  <p className="text-blue-600 font-bold mt-3 text-lg">
                    {new Date(apt.appointment_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <a
                    href={`https://wa.me/${apt.client_phone || ''}?text=${encodeURIComponent(`Hola! Soy Alan de Alan Carwash. Te confirmo tu cita para tu ${apt.vehicle_brand} hoy a las ${new Date(apt.appointment_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. Te esperamos!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm text-center"
                  >
                    WhatsApp
                  </a>

                  {apt.status !== 'completed' ? (
                    <button
                      onClick={() => handleComplete(apt.id)}
                      className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm"
                    >
                      Completar
                    </button>
                  ) : (
                    <div className="flex-1 md:flex-none bg-gray-50 text-gray-400 px-6 py-3 rounded-xl text-sm font-bold text-center border border-gray-100 italic">
                      Lustrado
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