-- Tabla de citas para Alan Carwash
-- Ejecutar en el SQL Editor de Supabase Dashboard o con Supabase CLI

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  appointment_at timestamptz not null,
  vehicle_brand text not null,
  vehicle_model text not null,
  vehicle_plate text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices para consultas habituales
create index if not exists idx_appointments_user_id on public.appointments (user_id);
create index if not exists idx_appointments_appointment_at on public.appointments (appointment_at);

-- RLS: cada usuario solo ve y crea sus propias citas
alter table public.appointments enable row level security;

create policy "Users can view own appointments"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "Users can insert own appointments"
  on public.appointments for insert
  with check (auth.uid() = user_id);

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- Comentarios
comment on table public.appointments is 'Citas de autolavado en Alan Carwash';
