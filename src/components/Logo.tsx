/** Logo MeuEcoo — wordmark oficial (fundo removido, recortado do arquivo original). */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/meuecoo-logo.png"
      alt="MeuEcoo"
      className={`w-auto select-none object-contain ${className}`}
    />
  );
}
