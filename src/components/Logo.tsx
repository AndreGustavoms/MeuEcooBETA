import type { ImgHTMLAttributes } from 'react';

/** Logo MeuEcoo oficial. */
export default function Logo({ className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/Svg_MeuEcoo_dourado.svg"
      alt="MeuEcoo"
      className={`w-auto select-none object-contain pointer-events-none ${className}`}
      draggable={false}
      {...props}
    />
  );
}
