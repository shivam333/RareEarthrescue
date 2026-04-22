import { ImgHTMLAttributes, useEffect, useState } from "react";

const fallbackSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f7f1e6" />
        <stop offset="100%" stop-color="#ece1cf" />
      </linearGradient>
    </defs>
    <rect width="1200" height="720" fill="url(#bg)" />
    <circle cx="280" cy="180" r="120" fill="#d0b07a" fill-opacity="0.32" />
    <circle cx="900" cy="520" r="150" fill="#7ba18b" fill-opacity="0.24" />
    <circle cx="600" cy="360" r="180" fill="#173550" fill-opacity="0.08" />
    <text x="50%" y="48%" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#173550">
      Rare Earth Rescue
    </text>
    <text x="50%" y="56%" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#6b756f">
      Industrial marketplace preview
    </text>
  </svg>
`);

const FALLBACK_SRC = `data:image/svg+xml;charset=utf-8,${fallbackSvg}`;

type AppImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function AppImage({
  src,
  alt,
  fallbackSrc = FALLBACK_SRC,
  ...props
}: AppImageProps) {
  const [activeSrc, setActiveSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setActiveSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <img
      {...props}
      src={activeSrc}
      alt={alt}
      onError={() => {
        if (activeSrc !== fallbackSrc) {
          setActiveSrc(fallbackSrc);
        }
      }}
    />
  );
}
