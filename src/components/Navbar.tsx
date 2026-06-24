import { useState } from 'react';
import Logo from './Logo';
import type { Profile } from '../data/profiles';
import type { Category } from '../data/catalog';

export default function Navbar({
  profile,
  category,
  onCategory,
  onSwitch,
}: {
  profile: Profile;
  category: Category;
  onCategory: (c: Category) => void;
  onSwitch: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');

  return (
    <div className="flex h-[100px] items-center justify-between px-6 sm:px-14">
      <div className="flex items-center gap-8">
        <Logo className="h-8 sm:h-9" />
        <button
          onClick={() => onCategory('cursos')}
          className={`cursor-pointer text-white hover:font-bold ${category === 'cursos' ? 'font-bold' : ''}`}
        >
          Cursos
        </button>
        <button
          onClick={() => onCategory('miniapps')}
          className={`cursor-pointer text-white hover:font-bold ${category === 'miniapps' ? 'font-bold' : ''}`}
        >
          Mini Apps
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center sm:flex">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Buscar"
            className="text-white"
          >
            🔍
          </button>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Títulos, gêneros"
            className={`ml-2 h-[30px] rounded border border-white bg-black/50 text-sm text-white transition-all ${searchOpen ? 'w-[200px] px-2 opacity-100' : 'w-0 border-0 px-0 opacity-0'}`}
          />
        </div>

        <div className="group relative flex items-center">
          <span className="flex h-9 w-9 cursor-pointer items-center justify-center rounded bg-ink-700 text-xl">
            {profile.emoji}
          </span>
          <div className="absolute top-9 right-0 hidden w-[140px] flex-col gap-2 bg-black p-3 group-hover:flex">
            <div className="flex items-center gap-2">
              <span className="text-lg">{profile.emoji}</span>
              <span className="text-xs text-white">{profile.name}</span>
            </div>
            <button
              onClick={onSwitch}
              className="cursor-pointer text-left text-xs text-white hover:underline"
            >
              Trocar de perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
