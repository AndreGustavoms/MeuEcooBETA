import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { featured, catalog, type Title, type Category } from '../data/catalog';
import type { Profile } from '../data/profiles';

/** Tela cheia de carregamento, exibida ao entrar num perfil. */
function Loading({ profile }: { profile: Profile }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink-900">
      <span className="flex h-24 w-24 items-center justify-center rounded-xl bg-ink-700 text-5xl">
        {profile.emoji}
      </span>
      <span className="h-10 w-10 rounded-full border-4 border-white/20 border-t-ecoo-400 animate-spin-slow" />
    </div>
  );
}

/** Modal de detalhe do título. */
function DetailModal({ title, onClose }: { title: Title; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-lg bg-ink-800 shadow-2xl animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={title.image.replace('small.jpg', 'large.jpg')}
            alt={title.name}
            className="h-72 w-full object-cover"
          />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold">{title.name}</h3>
          <p className="mt-3 text-white/70">
            Um título disponível no catálogo Ecoo. Aperte assistir e mergulhe na história.
          </p>
          <button className="mt-5 rounded-md bg-ecoo-500 px-6 py-2.5 font-semibold text-ink-900 transition hover:bg-ecoo-400">
            ▶ Assistir
          </button>
        </div>
      </div>
    </div>
  );
}

function CardItem({ title, onOpen }: { title: Title; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group/item relative mr-[5px] flex shrink-0 cursor-pointer flex-col transition-transform duration-200 first:ml-6 last:mr-6 hover:z-[99] hover:scale-[1.3] sm:first:ml-14 sm:last:mr-14"
    >
      <img
        src={title.image}
        alt={title.name}
        loading="lazy"
        className="w-[180px] rounded-sm object-cover sm:w-[260px]"
      />
      <div className="absolute bottom-0 hidden w-full bg-black/70 p-2 text-left group-hover/item:block">
        <p className="text-xs font-bold text-white">{title.name}</p>
      </div>
    </button>
  );
}

/** Tela de browse — banner com callout + fileiras horizontais de cards. */
export default function Browse({
  profile,
  onSwitch,
}: {
  profile: Profile;
  onSwitch: () => void;
}) {
  const [category, setCategory] = useState<Category>('cursos');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Title | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading profile={profile} />;

  return (
    <div className="min-h-screen bg-ink-900 pb-12 animate-fade-in">
      {/* Banner em destaque, com header por cima */}
      <div className="relative flex flex-col">
        {/* Imagem com filtro — não afeta o texto */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url(${featured.background})`,
          }}
        />
        {/* Gradiente escurecedor */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(4,12,6,0.38), rgba(4,12,6,0.08), rgba(4,12,6,0.96))' }}
        />
        {/* Conteúdo sobre a imagem */}
        <div className="relative z-10">
          <Navbar
            profile={profile}
            category={category}
            onCategory={setCategory}
            onSwitch={onSwitch}
          />

          <div className="w-full translate-y-[220px] px-6 pt-[360px] pb-[320px] sm:w-1/2 sm:px-14 animate-rise">
            <h2 className="m-0 text-4xl font-bold text-white drop-shadow-lg sm:text-5xl">
              {featured.name}
            </h2>
            <p className="mt-3 text-lg text-white drop-shadow-lg sm:text-[22px]">
              {featured.tagline}
            </p>
            <button
              onClick={() =>
                setSelected({
                  id: 24033,
                  name: 'La La Land',
                  image: '/images/films/romance/la-la-land/small.jpg',
                })
              }
              className="mt-4 max-w-[150px] cursor-pointer rounded-md bg-[#e6e6e6] px-5 py-2.5 text-xl font-bold text-black shadow-lg transition hover:bg-ecoo-500 hover:text-white"
            >
              ▶ Assistir
            </button>
          </div>
        </div>
      </div>

      {/* Fileiras de títulos, sobrepondo levemente o banner */}
      <div className="-mt-[100px] flex flex-col">
        {catalog[category].map((row) => (
          <div key={row.category} className="mb-12 flex flex-col">
            <p className="mx-6 mt-0 mb-2 text-2xl font-bold text-[#e5e5e5] sm:mx-14">
              {row.category}
            </p>
            <div className="flex flex-row overflow-x-auto overflow-y-visible py-8">
              {row.titles.map((title) => (
                <CardItem key={title.id} title={title} onOpen={() => setSelected(title)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && <DetailModal title={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
