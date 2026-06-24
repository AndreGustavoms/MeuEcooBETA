import Logo from './Logo';
import EmailCTA from './EmailCTA';

/** Topo da página: navbar + chamada principal sobre um fundo escuro com brilho esmeralda. */
export default function Hero() {
  return (
    <header className="relative overflow-hidden border-b-8 border-black/60">
      {/* Brilho de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-ecoo-700)_0%,_transparent_55%)] opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/70 to-ink-900"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <nav className="flex items-center justify-between py-6">
          <Logo />
          <div className="flex items-center gap-3">
            <select
              aria-label="Idioma"
              className="hidden rounded border border-white/30 bg-black/40 px-2 py-1 text-sm sm:block"
            >
              <option>Português</option>
              <option>English</option>
            </select>
            <button className="rounded-md bg-ecoo-500 px-4 py-2 text-sm font-semibold text-ink-900 transition hover:bg-ecoo-400">
              Entrar
            </button>
          </div>
        </nav>

        <div className="mx-auto max-w-2xl py-24 text-center sm:py-32">
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
            Histórias que <span className="text-ecoo-400">ecoam</span> em você.
          </h1>
          <p className="mt-5 text-lg text-white/85 sm:text-2xl">
            Filmes, séries e originais sem limites. Em qualquer tela. Cancele quando quiser.
          </p>
          <div className="mx-auto max-w-xl text-left">
            <EmailCTA />
          </div>
        </div>
      </div>
    </header>
  );
}
