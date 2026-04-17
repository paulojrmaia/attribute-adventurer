import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Pixel Quest" },
      { name: "description", content: "Entre ou crie sua conta para começar sua aventura no Pixel Quest." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        if (nickname.trim().length < 2) throw new Error("Nickname precisa ter ao menos 2 letras");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/characters`,
            data: { nickname: nickname.trim() },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.navigate({ to: "/characters" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-pixel text-2xl text-primary glow-primary inline-block">
            ⚔ PIXEL QUEST
          </Link>
          <p className="font-pixel text-[0.6rem] text-muted-foreground mt-3">
            {mode === "login" ? "ENTRE NA AVENTURA" : "CRIE SUA LENDA"}
          </p>
        </div>

        <div className="pixel-panel p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="font-pixel text-[0.6rem] text-muted-foreground">NICKNAME</label>
                <input
                  className="pixel-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                  required
                  placeholder="Herói99"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="font-pixel text-[0.6rem] text-muted-foreground">EMAIL</label>
              <input
                type="email"
                className="pixel-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="heroi@quest.com"
              />
            </div>
            <div className="space-y-1">
              <label className="font-pixel text-[0.6rem] text-muted-foreground">SENHA</label>
              <input
                type="password"
                className="pixel-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className="pixel-border-primary p-3 bg-destructive/20">
                <p className="text-destructive text-base">{error}</p>
              </div>
            )}

            <button type="submit" disabled={busy} className="pixel-btn w-full">
              {busy ? "CARREGANDO..." : mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
            </button>
          </form>

          <div className="text-center pt-2 border-t-4 border-border">
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
              className="font-pixel text-[0.6rem] text-accent hover:text-primary transition-colors mt-3"
            >
              {mode === "login" ? "» NÃO TEM CONTA? CRIAR UMA" : "» JÁ TENHO CONTA, ENTRAR"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="font-pixel text-[0.6rem] text-muted-foreground hover:text-primary">
            ← VOLTAR
          </Link>
        </div>
      </div>
    </div>
  );
}
