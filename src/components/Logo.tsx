import type { ImgHTMLAttributes } from 'react';
import { publicAsset } from '../lib/publicAsset';

/** Logo MeuEcoo oficial. */
export default function Logo({ className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={publicAsset('/Svg_MeuEcoo_dourado.svg')}
      alt="MeuEcoo"
      className={`w-auto select-none object-contain pointer-events-none ${className}`}
      draggable={false}
      {...props}
    />
  );
}
