'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // Ajusta según tu ruta de supabase

export default function AdminPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchAppointments = async () => {
        const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_at', { ascending: false });
    
      if (error) {
        console.error('Error cargando citas:', error);
      } else {
        setAppointments(data || []);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Panel Alan Carwash</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-4 text-left">Vehículo</th>
              <th className="p-4 text-left">Fecha</th>
              <th className="p-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt: any) => (
              <tr key={apt.id} className="border-b">
                <td className="p-4">{apt.brand} {apt.model} ({apt.plate})</td>
                <td className="p-4">{new Date(apt.appointment_at).toLocaleString()}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                    {apt.status || 'Pendiente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}