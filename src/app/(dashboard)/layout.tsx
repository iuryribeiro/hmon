// src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashBoardShell";

export default async function DashboardGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // sem sessão → login
  if (!user) redirect("/");

  // checa assinatura
  const { data: isActive, error } = await supabase.rpc("is_subscription_active", {
    uid: user.id,
  });

  if (error || !isActive) {
    // qualquer erro tratado como sem assinatura
    redirect("/billing");
  }

  // ok → renderiza o shell do dashboard (client) com o conteúdo
  return <DashboardShell>{children}</DashboardShell>;
}
