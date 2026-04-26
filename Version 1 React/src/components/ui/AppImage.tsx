import { ImgHTMLAttributes, useEffect, useState } from "react";

const fallbackSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F6F8FC" />
        <stop offset="100%" stop-color="#F6F8FC" />
      </linearGradient>
    </defs>
    <rect width="1200" height="720" fill="url(#bg)" />
    <circle cx="280" cy="180" r="120" fill="#D9C47A" fill-opacity="0.32" />
    <circle cx="900" cy="520" r="150" fill="#DDF1E8" fill-opacity="0.24" />
    <circle cx="600" cy="360" r="180" fill="#253B80" fill-opacity="0.08" />
    <text x="50%" y="48%" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#253B80">
      Rare Earth Rescue
    </text>
    <text x="50%" y="56%" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#6D7484">
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
