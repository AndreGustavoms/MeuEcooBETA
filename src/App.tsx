import PerfilJornada from './components/Profiles';
import Browse from './components/Browse';
import { profiles, type Profile } from './data/profiles';

const PERFIL_JORNADA_RESERVADO = false;
const defaultProfile = profiles[0] as Profile;

export default function App() {
  if (PERFIL_JORNADA_RESERVADO) {
    return <PerfilJornada onSelect={() => undefined} />;
  }

  return <Browse profile={defaultProfile} onSwitch={() => undefined} />;
}
