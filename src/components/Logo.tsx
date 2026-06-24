/** Wordmark do Ecoo: o "o" duplo evoca as ondas de um eco. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-display text-2xl font-extrabold tracking-tight select-none ${className}`}
    >
      Ec
      <span className="text-ecoo-400">oo</span>
    </span>
  );
}
