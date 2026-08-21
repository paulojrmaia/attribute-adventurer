import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova Senha — Pixel Quest" },
      { name: "description", content: "Defina uma nova senha para sua conta do Pixel Quest." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [validHash, setValidHash] = useState<boolean | null>(null);

  useEffect(() => {
    // Recovery links come with #type=recovery in the URL hash.
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    if (params.get("type") === "recovery") {
      setValidHash(true);
    } else {
      setValidHash(false);
      setError("Link de recuperação inválido ou expirado. Solicite um novo.");
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess("Senha atualizada! Você já pode entrar.");
      setTimeout(() => {
        router.navigate({ to: "/auth" });
      }, 2000);
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
            DEFINIR NOVA SENHA
          </p>
        </div>

        <div className="pixel-panel p-6 space-y-4">
          {validHash !== false && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-pixel text-[0.6rem] text-muted-foreground">NOVA SENHA</label>
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
              <div className="space-y-1">
                <label className="font-pixel text-[0.6rem] text-muted-foreground">CONFIRMAR SENHA</label>
                <input
                  type="password"
                  className="pixel-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {success && (
                <div className="pixel-border-primary p-3 bg-primary/20">
                  <p className="text-primary text-base">{success}</p>
                </div>
              )}

              <button type="submit" disabled={busy || validHash !== true} className="pixel-btn w-full">
                {busy ? "SALVANDO..." : "SALVAR NOVA SENHA"}
              </button>
            </form>
          )}
          {validHash === false && (
            <div className="text-center space-y-4">
              <div className="pixel-border-primary p-3 bg-destructive/20">
                <p className="text-destructive text-base">{error}</p>
              </div>
              <Link to="/auth" className="pixel-btn inline-block">
                VOLTAR PARA O LOGIN
              </Link>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/auth" className="font-pixel text-[0.6rem] text-muted-foreground hover:text-primary">
            ← VOLTAR
          </Link>
        </div>
      </div>
    </div>
  );
}
