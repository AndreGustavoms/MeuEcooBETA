import Logo from './Logo';

const columns = [
  ['Perguntas frequentes', 'Central de ajuda', 'Conta', 'Imprensa'],
  ['Relações com investidores', 'Carreiras', 'Resgatar cartões', 'Comprar cartões'],
  ['Formas de assistir', 'Termos de uso', 'Privacidade', 'Preferências de cookies'],
  ['Informações corporativas', 'Fale conosco', 'Teste de velocidade', 'Avisos legais'],
];

/** Rodapé com links institucionais (placeholders) e a marca. */
export default function Footer() {
  return (
    <footer className="bg-ink-900 py-14 text-white/60">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-8">Dúvidas? Ligue 0800-000-ECOO</p>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          {columns.flat().map((link) => (
            <a key={link} href="#" className="transition hover:text-white hover:underline">
              {link}
            </a>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start gap-2">
          <Logo className="text-xl" />
          <p className="text-xs">
            © {new Date().getFullYear()} Ecoo · Projeto autoral de demonstração. Não afiliado a
            nenhum serviço de streaming real.
          </p>
        </div>
      </div>
    </footer>
  );
}
