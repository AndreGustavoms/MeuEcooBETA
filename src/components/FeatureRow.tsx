import type { FeatureBlock } from '../data/content';

/** Faixa de destaque alternando texto e arte, como nas seções de uma landing de streaming. */
export default function FeatureRow({ feature }: { feature: FeatureBlock }) {
  return (
    <section className="border-b-8 border-black/60 bg-ink-800 py-16">
      <div
        className={`mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 md:gap-16 ${
          feature.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        }`}
      >
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">{feature.title}</h2>
          <p className="mt-4 text-lg text-white/80 sm:text-2xl">{feature.subtitle}</p>
        </div>
        <div className="flex flex-1 justify-center">
          <div className="flex h-48 w-full max-w-sm items-center justify-center rounded-2xl bg-gradient-to-br from-ink-700 to-black ring-1 ring-ecoo-600/30">
            <span className="text-7xl sm:text-8xl" role="img" aria-hidden>
              {feature.art}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
