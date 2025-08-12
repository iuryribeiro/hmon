// src/app/(auth)/layout.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // consulta a função SQL criada no Supabase
    const { data: isActive, error } = await supabase.rpc(
      "is_subscription_active",
      { uid: user.id }
    );

    // Se estiver tudo ok, decide o destino; em caso de erro, manda pra billing
    if (!error) {
      redirect(isActive ? "/dashboard" : "/billing");
    } else {
      redirect("/billing");
    }
  }

  // sem sessão → renderiza a UI de login/check-email normalmente
  return <>{children}</>;
}
