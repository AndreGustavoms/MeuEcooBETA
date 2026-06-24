import { useState } from 'react';
import Profiles from './components/Profiles';
import Browse from './components/Browse';
import type { Profile } from './data/profiles';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);

  if (!profile) {
    return <Profiles onSelect={setProfile} />;
  }

  return <Browse profile={profile} onSwitch={() => setProfile(null)} />;
}
