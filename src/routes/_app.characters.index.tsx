import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CLASSES, getClass, STAT_LABELS, type CharacterClass } from "@/lib/game";
import warriorImg from "@/assets/class-warrior.png";
import mageImg from "@/assets/class-mage.png";
import archerImg from "@/assets/class-archer.png";

const CLASS_IMAGES: Record<CharacterClass, string> = {
  warrior: warriorImg,
  mage: mageImg,
  archer: archerImg,
};

interface CharacterRow {
  id: string;
  name: string;
  class: string;
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  created_at: string;
}

export const Route = createFileRoute("/_app/characters/")({
  head: () => ({ meta: [{ title: "Meus heróis — Pixel Quest" }] }),
  component: CharactersPage,
});

function CharactersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [chars, setChars] = useState<CharacterRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setChars(data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar este herói para sempre?")) return;
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (error) { setError(error.message); return; }
    load();
  };

  const slotCount = 3;
  const filled = chars?.length ?? 0;
  const slots = Array.from({ length: slotCount }, (_, i) => chars?.[i] ?? null);

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="font-pixel text-xl sm:text-2xl text-primary glow-primary">MEUS HERÓIS</h1>
          <p className="text-muted-foreground text-lg mt-1">
            {filled}/{slotCount} slots usados
          </p>
        </div>
        {filled < slotCount && (
          <button
            className="pixel-btn"
            onClick={() => router.navigate({ to: "/characters/new" })}
          >
            + NOVO HERÓI
          </button>
        )}
      </div>

      {error && <div className="pixel-border-primary p-3 mb-4 bg-destructive/20"><p className="text-destructive">{error}</p></div>}

      {chars === null ? (
        <p className="font-pixel text-primary blink">CARREGANDO...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((c, i) => (c ? <HeroCard key={c.id} c={c} onDelete={() => handleDelete(c.id)} /> : <EmptySlot key={i} />))}
        </div>
      )}
    </div>
  );
}

function HeroCard({ c, onDelete }: { c: CharacterRow; onDelete: () => void }) {
  const def = getClass(c.class);
  const classImage = def ? CLASS_IMAGES[def.id] : null;
  return (
    <div className="pixel-panel p-4 flex flex-col">
      <div className="aspect-square overflow-hidden mb-3 bg-background">
        {classImage && def ? (
          <img
            src={classImage}
            alt={def.name}
            width={512}
            height={512}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <span className="font-pixel text-[0.6rem] text-muted-foreground">CLASSE LEGADA</span>
          </div>
        )}
      </div>
      <h3 className="font-pixel text-sm text-foreground mb-1">{c.name}</h3>
      {def ? (
        <p className="font-pixel text-[0.6rem] mb-4" style={{ color: `var(--color-${def.color})` }}>
          {def.emoji} {def.name.toUpperCase()}
        </p>
      ) : (
        <p className="font-pixel text-[0.6rem] text-muted-foreground mb-4">CLASSE NÃO RECONHECIDA</p>
      )}
      <div className="grid grid-cols-2 gap-2 text-base mb-4">
        {(Object.keys(STAT_LABELS) as Array<keyof typeof STAT_LABELS>).map((k) => {
          const meta = STAT_LABELS[k];
          return (
            <div key={k} className="flex items-center justify-between bg-background/60 px-2 py-1">
              <span className="font-pixel text-[0.55rem]" style={{ color: `var(--color-${meta.color})` }}>{meta.short}</span>
              <span className="font-pixel text-xs">{c[k]}</span>
            </div>
          );
        })}
      </div>
      <button onClick={onDelete} className="pixel-btn pixel-btn-danger text-[0.55rem]! mt-auto">
        ✕ APAGAR
      </button>
    </div>
  );
}

function EmptySlot() {
  return (
    <Link to="/characters/new" className="pixel-panel p-4 flex items-center justify-center min-h-[300px] hover:bg-secondary/30 transition-colors">
      <div className="text-center">
        <p className="font-pixel text-3xl text-muted-foreground mb-2">+</p>
        <p className="font-pixel text-[0.6rem] text-muted-foreground">SLOT VAZIO</p>
      </div>
    </Link>
  );
}
