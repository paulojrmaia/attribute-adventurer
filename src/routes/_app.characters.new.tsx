import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  CLASSES,
  STAT_LABELS,
  TOTAL_POINTS,
  MIN_STAT,
  MAX_STAT,
  totalSpent,
  type CharacterClass,
  type Stats,
} from "@/lib/game";
import warriorImg from "@/assets/class-warrior.png";
import mageImg from "@/assets/class-mage.png";
import archerImg from "@/assets/class-archer.png";

const CLASS_IMAGES: Record<CharacterClass, string> = {
  warrior: warriorImg,
  mage: mageImg,
  archer: archerImg,
};

export const Route = createFileRoute("/_app/characters/new")({
  head: () => ({ meta: [{ title: "Novo herói — Pixel Quest" }] }),
  component: NewCharacterPage,
});

function NewCharacterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<CharacterClass | null>(null);
  const [name, setName] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const def = useMemo(() => CLASSES.find((c) => c.id === selected) ?? null, [selected]);

  const pickClass = (id: CharacterClass) => {
    const cls = CLASSES.find((c) => c.id === id)!;
    setSelected(id);
    setStats({ ...cls.base });
    setStep(2);
  };

  const spent = stats ? totalSpent(stats) : 0;
  const remaining = TOTAL_POINTS + (def ? totalSpent(def.base) : 0) - spent;

  const adjust = (key: keyof Stats, delta: number) => {
    if (!stats) return;
    const next = stats[key] + delta;
    if (next < MIN_STAT || next > MAX_STAT) return;
    if (delta > 0 && remaining <= 0) return;
    setStats({ ...stats, [key]: next });
  };

  const handleSave = async () => {
    if (!user || !selected || !stats) return;
    setError(null);
    if (name.trim().length < 2) { setError("Nome precisa ter ao menos 2 letras"); return; }
    if (remaining !== 0) { setError(`Distribua todos os pontos (faltam ${remaining})`); return; }
    setBusy(true);
    const { error } = await supabase.from("characters").insert({
      user_id: user.id,
      name: name.trim(),
      class: selected,
      ...stats,
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    router.navigate({ to: "/characters" });
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/characters" className="font-pixel text-[0.6rem] text-muted-foreground hover:text-primary">
          ← VOLTAR
        </Link>
        <h1 className="font-pixel text-xl sm:text-2xl text-primary glow-primary mt-2">
          {step === 1 ? "ESCOLHA UMA CLASSE" : "DISTRIBUA OS PONTOS"}
        </h1>
      </div>

      {step === 1 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CLASSES.map((c) => (
            <button
              key={c.id}
              onClick={() => pickClass(c.id)}
              className="pixel-panel p-4 text-left hover:translate-y-[-4px] transition-transform"
              style={{ borderColor: `var(--color-${c.color})` }}
            >
              <div className="aspect-square overflow-hidden mb-3 bg-background">
                <img
                  src={CLASS_IMAGES[c.id]}
                  alt={c.name}
                  width={512}
                  height={512}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-pixel text-xs mb-2" style={{ color: `var(--color-${c.color})` }}>
                {c.emoji} {c.name.toUpperCase()}
              </h3>
              <p className="text-base text-muted-foreground mb-3 leading-tight">{c.description}</p>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {(Object.keys(c.base) as Array<keyof Stats>).map((k) => {
                  const m = STAT_LABELS[k];
                  return (
                    <div key={k} className="flex justify-between bg-background/60 px-2 py-0.5">
                      <span className="font-pixel text-[0.5rem]" style={{ color: `var(--color-${m.color})` }}>{m.short}</span>
                      <span className="font-pixel text-[0.6rem]">{c.base[k]}</span>
                    </div>
                  );
                })}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && def && stats && (
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Left: portrait */}
          <div className="pixel-panel p-4">
            <div className="aspect-square overflow-hidden mb-4 bg-background">
              <img
                src={CLASS_IMAGES[def.id]}
                alt={def.name}
                width={512}
                height={512}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-pixel text-xs mb-2" style={{ color: `var(--color-${def.color})` }}>
              {def.emoji} {def.name.toUpperCase()}
            </p>
            <p className="text-base text-muted-foreground mb-4">{def.tagline}</p>
            <button
              onClick={() => { setStep(1); setSelected(null); setStats(null); }}
              className="pixel-btn pixel-btn-secondary text-[0.55rem]! w-full"
            >
              ↩ TROCAR CLASSE
            </button>
          </div>

          {/* Right: form + stats */}
          <div className="space-y-6">
            <div className="pixel-panel p-5 space-y-3">
              <label className="font-pixel text-[0.6rem] text-muted-foreground">NOME DO HERÓI</label>
              <input
                className="pixel-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                placeholder="Aragorn, Gandalf..."
              />
            </div>

            <div className="pixel-panel p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-pixel text-sm text-primary">ATRIBUTOS</h3>
                <div className="text-right">
                  <p className="font-pixel text-[0.55rem] text-muted-foreground">PONTOS RESTANTES</p>
                  <p
                    className="font-pixel text-2xl"
                    style={{ color: remaining === 0 ? "var(--color-primary)" : remaining < 0 ? "var(--color-destructive)" : "var(--color-accent)" }}
                  >
                    {remaining}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(Object.keys(STAT_LABELS) as Array<keyof Stats>).map((key) => {
                  const meta = STAT_LABELS[key];
                  const value = stats[key];
                  const pct = (value / MAX_STAT) * 100;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-pixel text-[0.65rem]" style={{ color: `var(--color-${meta.color})` }}>
                          {meta.icon} {meta.label.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => adjust(key, -1)}
                            disabled={value <= MIN_STAT}
                            className="pixel-btn pixel-btn-secondary text-[0.6rem]! py-1! px-3!"
                          >
                            −
                          </button>
                          <span className="font-pixel text-base w-10 text-center">{value}</span>
                          <button
                            type="button"
                            onClick={() => adjust(key, +1)}
                            disabled={value >= MAX_STAT || remaining <= 0}
                            className="pixel-btn text-[0.6rem]! py-1! px-3!"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="h-3 bg-background relative pixel-border">
                        <div
                          className="h-full transition-all"
                          style={{ width: `${pct}%`, background: `var(--color-${meta.color})` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="pixel-border-primary p-3 bg-destructive/20">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={busy || remaining !== 0 || name.trim().length < 2}
              className="pixel-btn w-full"
            >
              {busy ? "SALVANDO..." : "✓ FORJAR HERÓI"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
