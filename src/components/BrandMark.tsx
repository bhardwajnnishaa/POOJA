// The Festive Clock logo: a clock framed by marigold hour marks, with a lit diya at six o'clock.
// Same drawing as scripts/logo.svg, which the app icons in public/ are rendered from.
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 512 512">
        <defs>
          <radialGradient id="fcl-bg" cx=".5" cy=".38" r=".75">
            <stop offset="0" stopColor="#8a1c5c" />
            <stop offset=".6" stopColor="#4a1260" />
            <stop offset="1" stopColor="#26093f" />
          </radialGradient>
          <linearGradient id="fcl-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe08a" />
            <stop offset="1" stopColor="#f29b1d" />
          </linearGradient>
          <radialGradient id="fcl-flame" cx=".5" cy=".7" r=".6">
            <stop offset="0" stopColor="#fff6c2" />
            <stop offset=".45" stopColor="#ffc23d" />
            <stop offset="1" stopColor="#ff6a1a" />
          </radialGradient>
          <radialGradient id="fcl-glow" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#ffb13d" stopOpacity=".55" />
            <stop offset="1" stopColor="#ffb13d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="512" height="512" rx="116" fill="url(#fcl-bg)" />
        {/* Marigold hour marks */}
        <g fill="url(#fcl-gold)">
          <circle cx="256" cy="58" r="17" />
          <circle cx="454" cy="256" r="17" />
          <circle cx="58" cy="256" r="17" />
          <circle cx="355" cy="84.5" r="12" />
          <circle cx="427.5" cy="157" r="12" />
          <circle cx="427.5" cy="355" r="12" />
          <circle cx="157" cy="84.5" r="12" />
          <circle cx="84.5" cy="157" r="12" />
          <circle cx="84.5" cy="355" r="12" />
        </g>
        <circle cx="256" cy="256" r="160" fill="#fff8ea" />
        <circle cx="256" cy="256" r="160" fill="none" stroke="url(#fcl-gold)" strokeWidth="14" />
        {/* Hands at ten past ten */}
        <g stroke="#5a1236" strokeLinecap="round">
          <line x1="256" y1="256" x2="176" y2="205" strokeWidth="24" />
          <line x1="256" y1="256" x2="345" y2="170" strokeWidth="16" />
        </g>
        <circle cx="256" cy="256" r="22" fill="#ff5a3d" />
        {/* Lit diya at six o'clock */}
        <circle cx="256" cy="420" r="72" fill="url(#fcl-glow)" />
        <path d="M256 358 C 278 386 282 404 256 426 C 230 404 234 386 256 358 Z" fill="url(#fcl-flame)" />
        <path d="M176 428 Q 256 420 336 428 Q 322 478 256 480 Q 190 478 176 428 Z" fill="url(#fcl-gold)" />
        <path d="M186 432 Q 256 426 326 432" fill="none" stroke="#b85c10" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
