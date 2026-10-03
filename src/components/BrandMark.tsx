// The Festive Clock logo: a white clock with a rainbow ring on a sunset gradient. Same drawing as the app icons in public/.
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 512 512">
        <defs>
          <linearGradient id="fc-logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff3d7f" />
            <stop offset=".55" stopColor="#ff7a3d" />
            <stop offset="1" stopColor="#ffc23d" />
          </linearGradient>
          <linearGradient id="fc-logo-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff3d7f" />
            <stop offset=".5" stopColor="#ffb13d" />
            <stop offset="1" stopColor="#3dffd0" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#fc-logo-bg)" />
        <circle cx="256" cy="256" r="138" fill="none" stroke="url(#fc-logo-ring)" strokeWidth="24" />
        <circle cx="256" cy="256" r="114" fill="#fff" />
        <g stroke="#2b1055" strokeLinecap="round">
          <line x1="256" y1="256" x2="204" y2="214" strokeWidth="22" />
          <line x1="256" y1="256" x2="316" y2="190" strokeWidth="16" />
        </g>
        <circle cx="256" cy="256" r="18" fill="#ff3d7f" />
      </svg>
    </span>
  );
}
