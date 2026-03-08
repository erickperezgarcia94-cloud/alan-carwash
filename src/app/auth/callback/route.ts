import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // 1. Dejamos el default como "/reservar"
  let redirectTo = searchParams.get("redirect") ?? "/reservar";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // 2. LA MAGIA: Si el que entra eres tú, cambiamos el destino a /admin
      if (data.user.email === 'erickperezgarcia94@gmail.com') {
        redirectTo = "/admin";
      }
      return NextResponse.redirect(`${origin}${redirectTo}`);
  } else {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }
}
}
