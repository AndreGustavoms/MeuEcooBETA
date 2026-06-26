export default function JourneyBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(145deg, #07100c 0%, #08130f 42%, #060b10 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          background:
            'radial-gradient(70% 52% at 50% 18%, rgba(52,211,153,0.12), transparent 58%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 70%, transparent 100%)',
        }}
      />

      <div
        className="absolute left-[16%] top-[22%] h-1 w-1 rounded-full bg-ecoo-400/45 shadow-[0_0_16px_rgba(52,211,153,0.45)]"
      />
      <div
        className="absolute right-[18%] top-[34%] h-1 w-1 rounded-full bg-white/30 shadow-[0_0_14px_rgba(255,255,255,0.3)]"
      />
      <div
        className="absolute bottom-[18%] left-[58%] h-1.5 w-1.5 rounded-full bg-ecoo-200/35 shadow-[0_0_18px_rgba(167,243,208,0.32)]"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, transparent 48%, rgba(2,6,10,0.72) 100%)',
        }}
      />
    </div>
  );
}
