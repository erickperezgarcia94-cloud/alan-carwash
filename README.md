# Alan Carwash

Web oficial para agendar citas de autolavado.

## Stack

- **Frontend & Backend:** Next.js 14 (App Router) + TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui
- **Iconos:** lucide-react
- **Base de datos y auth:** Supabase
- **Email:** Resend (Paso 5)

## Paleta Alan Carwash

- **Primario:** Azul brillante (`blue-600`) — agua y confianza
- **Acento:** Cian/Celeste (`cyan-400`) — detalles de brillo
- **Fondo:** Blanco y gris muy suave (`gray-50`)

Las variables CSS están en `src/app/globals.css` y se usan en los componentes.

## Desarrollo

```bash
npm install --legacy-peer-deps
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Configuración Supabase (Paso 2)

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard).
2. Copia `.env.example` a `.env.local` y rellena:
   - `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — clave anónima (API Keys)
3. En el **SQL Editor** de Supabase, ejecuta el contenido de:
   - `supabase/migrations/20250306000000_create_appointments.sql`
   Así se crea la tabla `appointments` y las políticas RLS.

## Estructura

- `src/app/` — App Router (layout, page, rutas)
- `src/components/ui/` — Componentes shadcn (Button, Card, Input, Label)
- `src/lib/supabase/` — Cliente browser (`client.ts`), servidor (`server.ts`), sesión en middleware
- `src/lib/utils.ts` — Utilidad `cn()` para clases
- `src/types/database.ts` — Tipos de la tabla `appointments`
- `supabase/migrations/` — SQL para crear la tabla y RLS
- `tailwind.config.ts` — Tema y colores Alan Carwash
- `components.json` — Configuración shadcn/ui

## Próximos pasos

- **Paso 3:** UI Home + Login/Registro
- **Paso 4:** Formulario de reserva con calendario
- **Paso 5:** Server Action + email Resend
