/**
 * The Monorite mark: a rounded-square badge in the brand's signature
 * accent-to-mint gradient with a bold "M" monogram. Built as inline SVG
 * (not a raster image) so it stays crisp at every size it's used at —
 * favicon, navbar, footer, and the full-screen preloader — and can pick up
 * currentColor / theme changes without shipping multiple asset files.
 */
export default function Logo({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Monorite"
    >
      <defs>
        <linearGradient id="monorite-mark" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#3FE8B8" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#monorite-mark)" />
      <rect x="1" y="1" width="38" height="38" rx="11" stroke="rgba(255,255,255,0.14)" />
      <text
        x="20"
        y="21.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="#08090A"
      >
        M
      </text>
    </svg>
  );
}
