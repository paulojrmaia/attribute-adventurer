import { createFileRoute, Link } from "@tanstack/react-router";
import heroBg from "@/assets/hero-bg.png";
import warriorImg from "@/assets/class-warrior.png";
import mageImg from "@/assets/class-mage.png";
import archerImg from "@/assets/class-archer.png";
import rogueImg from "@/assets/class-rogue.png";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixel Quest — Crie seu herói de RPG" },
      { name: "description", content: "Escolha sua classe, distribua atributos e forje sua lenda neste RPG pixel art retrô." },
      { property: "og:title", content: "Pixel Quest — Crie seu herói de RPG" },
      { property: "og:description", content: "Escolha sua classe, distribua atributos e forje sua lenda." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            imageRendering: "pixelated",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="font-pixel text-[0.6rem] text-accent mb-4 blink">★ AVENTURA AGUARDA ★</p>
          <h1 className="font-pixel text-3xl sm:text-5xl text-primary glow-primary leading-tight mb-6">
            PIXEL<br />QUEST
          </h1>
          <p className="text-2xl text-foreground/90 max-w-xl mx-auto mb-8">
            Forje seu herói. Escolha sua classe. Distribua seus atributos.
            <br />Que comece a aventura.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={user ? "/characters" : "/auth"} className="pixel-btn">
              ▶ {user ? "MEUS HERÓIS" : "COMEÇAR"}
            </Link>
            {!user && (
              <Link to="/auth" className="pixel-btn pixel-btn-secondary">
                ENTRAR
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Classes preview */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-pixel text-lg sm:text-xl text-center text-primary mb-2">
          ESCOLHA SUA CLASSE
        </h2>
        <p className="text-center text-muted-foreground text-xl mb-10">
          Quatro caminhos. Um destino seu.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { img: warriorImg, name: "Guerreiro", color: "warrior", emoji: "⚔️" },
            { img: mageImg, name: "Mago", color: "mage", emoji: "🔮" },
            { img: archerImg, name: "Arqueiro", color: "archer", emoji: "🏹" },
            { img: rogueImg, name: "Ladino", color: "rogue", emoji: "🗡️" },
          ].map((c) => (
            <div key={c.name} className="pixel-panel p-3 text-center">
              <div className="aspect-square overflow-hidden mb-3 bg-background">
                <img
                  src={c.img}
                  alt={c.name}
                  width={512}
                  height={512}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <p className="font-pixel text-[0.65rem]" style={{ color: `var(--color-${c.color})` }}>
                {c.emoji} {c.name.toUpperCase()}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={user ? "/characters" : "/auth"} className="pixel-btn">
            ▶ CRIAR HERÓI
          </Link>
        </div>
      </section>

      <footer className="border-t-4 border-border py-6 text-center">
        <p className="font-pixel text-[0.55rem] text-muted-foreground">
          © PIXEL QUEST · INSERT COIN <span className="blink">▮</span>
        </p>
      </footer>
    </div>
  );
}
