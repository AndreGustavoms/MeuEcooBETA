import { useState, type FormEvent } from 'react';

/**
 * Formulário de captação de e-mail. Apenas front-end (landing autoral, sem backend):
 * valida o formato e mostra confirmação local.
 */
export default function EmailCTA() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setError('Digite um e-mail válido para continuar.');
      return;
    }
    setError('');
    setSent(true);
  }

  if (sent) {
    return (
      <p className="mt-6 rounded-md bg-ecoo-600/20 px-5 py-4 text-ecoo-200">
        Tudo certo! Enviamos as instruções de cadastro para{' '}
        <strong className="text-white">{email}</strong>.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full">
      <p className="mb-4 text-base text-white/80 sm:text-lg">
        Pronto para assistir? Informe seu e-mail para criar ou retomar sua assinatura.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
          aria-label="Endereço de e-mail"
          className="h-14 flex-1 rounded-md border border-white/30 bg-black/50 px-4 text-white placeholder:text-white/50 focus:border-ecoo-400 focus:outline-none"
        />
        <button
          type="submit"
          className="h-14 rounded-md bg-ecoo-500 px-8 text-lg font-semibold text-ink-900 transition hover:bg-ecoo-400"
        >
          Começar →
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
