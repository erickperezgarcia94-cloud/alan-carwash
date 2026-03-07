# Autenticación Supabase - Alan Carwash

## Datos del usuario en `auth.users`

Supabase guarda los usuarios en la tabla **`auth.users`** (esquema interno). Esa tabla:

- Está **encriptada y protegida** por Supabase.
- Incluye: `id`, `email`, `encrypted_password`, `email_confirmed_at`, `raw_user_meta_data`, etc.
- El **nombre completo** del registro se guarda en `raw_user_meta_data` como `full_name` (configurado en el Sign Up).

No hace falta crear tablas extra para email/contraseña; todo lo maneja Auth.

---

## Confirmación por correo vs Autoconfirmar

### Opción 1: **Autoconfirmar** (recomendado para pruebas)

El usuario puede iniciar sesión **de inmediato** después de registrarse, sin abrir el correo.

**Cómo activarlo:**

1. [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto.
2. **Authentication** → **Providers** → **Email**.
3. Desactiva **"Confirm email"** (o activa **"Enable email confirmations"** = OFF).
4. Guarda.

Ventaja: desarrollo y pruebas rápidas. Desventaja: no verificas que el email sea real.

---

### Opción 2: **Confirmación por correo** (recomendado en producción)

El usuario debe hacer clic en el enlace que llega al correo para activar la cuenta.

**Cómo activarlo:**

1. **Authentication** → **Providers** → **Email**.
2. Activa **"Confirm email"** (Enable email confirmations = ON).
3. En **Authentication** → **URL Configuration**:
   - **Site URL**: tu dominio (ej. `https://tudominio.com`).
   - **Redirect URLs**: añade `https://tudominio.com/auth/callback` (y en local `http://localhost:3000/auth/callback`).
4. Guarda.

Flujo:

1. El usuario se registra → Supabase envía un correo con un enlace.
2. El enlace apunta a Supabase y luego redirige a tu **Site URL** con un `?code=...`.
3. La ruta `/auth/callback` de esta app intercambia ese `code` por sesión (`exchangeCodeForSession`) y redirige a `/reservar` (o al `redirect` que venga en la URL).

Para que el correo llegue bien en producción, configura en Supabase **SMTP** (Authentication → Email Templates / SMTP) con tu propio servidor de correo; si no, Supabase usa su propio envío y puede haber límites.

---

## Resumen

| Modo            | Uso       | Confirm email |
|-----------------|-----------|----------------|
| Autoconfirmar   | Pruebas   | OFF            |
| Confirmar email | Producción| ON + Redirect URLs |

Los datos del usuario (email, contraseña hasheada, nombre en metadata) se almacenan siempre en **`auth.users`** de Supabase.
