import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.navigate({ to: "/auth" });
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("nickname")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setNickname(data?.nickname ?? null));
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-primary blink">CARREGANDO...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b-4 border-border bg-card/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/characters" className="font-pixel text-sm text-primary glow-primary">
            ⚔ PIXEL QUEST
          </Link>
          <div className="flex items-center gap-3">
            {nickname && (
              <span className="font-pixel text-xs text-muted-foreground hidden sm:inline">
                👤 {nickname}
              </span>
            )}
            <button onClick={handleLogout} className="pixel-btn pixel-btn-secondary text-[0.6rem]!">
              SAIR
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
