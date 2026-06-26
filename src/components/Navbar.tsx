import { useState } from 'react';
import Logo from './Logo';
import type { Profile } from '../data/profiles';
import type { Category } from '../data/catalog';

function ClickableLogo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="cursor-pointer bg-transparent border-0 p-0" aria-label="MeuEcoo">
      <Logo className="h-8 sm:h-9 block" />
    </button>
  );
}

function ProfileButton({ onSwitch }: { onSwitch: () => void }) {
  return (
    <button onClick={onSwitch} aria-label="Login" className="text-white/70 hover:text-white transition-colors duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
        <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
      </svg>
    </button>
  );
}

function SearchInput() {
  const [focused, setFocused] = useState(false);
  const expanded = focused ? 'w-[200px] border-white/40' : 'w-[42px] border-white/20 hover:w-[200px] hover:border-white/40';
  const iconColor = focused ? 'fill-white' : 'fill-white/70 group-hover:fill-white';

  return (
    <div className={`p-3 overflow-hidden h-[42px] bg-white/10 border backdrop-blur-sm rounded-full flex group items-center duration-300 ${expanded}`}>
      <div className={`flex items-center justify-center transition-colors duration-300 ${iconColor}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16}>
          <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Buscar..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="outline-none text-[14px] bg-transparent w-full text-white placeholder-white/50 font-normal px-3"
      />
    </div>
  );
}

export default function Navbar({
  category,
  onCategory,
  onSwitch,
  onHome,
}: {
  profile: Profile;
  category: Category;
  onCategory: (c: Category) => void;
  onSwitch: () => void;
  onHome: () => void;
}) {

  return (
    <div className="flex h-[100px] items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-8">
        <ClickableLogo onClick={onHome} />
        <button
          onClick={() => onCategory('cursos')}
          className={`cursor-pointer text-sm font-medium transition-colors duration-200 pb-0.5 ${category === 'cursos' ? 'text-white border-b border-[#d9b94a]' : 'text-white/50 hover:text-white'}`}
        >
          Cursos
        </button>
        <button
          onClick={() => onCategory('miniapps')}
          className={`cursor-pointer text-sm font-medium transition-colors duration-200 pb-0.5 ${category === 'miniapps' ? 'text-white border-b border-[#d9b94a]' : 'text-white/50 hover:text-white'}`}
        >
          Mini Apps
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex">
          <SearchInput />
        </div>

        <ProfileButton onSwitch={onSwitch} />
      </div>
    </div>
  );
}
