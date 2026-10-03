// The Festive Clock logo, drawn larger than the app icon so it reads at small sizes.
export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 512 512">
        <rect width="512" height="512" rx="112" fill="#d27833" />
        <circle cx="250" cy="270" r="176" fill="#fbf5e9" stroke="#304339" strokeWidth="26" />
        <g stroke="#304339" strokeLinecap="round">
          <line x1="250" y1="270" x2="176" y2="210" strokeWidth="34" />
          <line x1="250" y1="270" x2="338" y2="186" strokeWidth="28" />
        </g>
        <circle cx="250" cy="270" r="22" fill="#d27833" />
        <path d="M432 36 L443 66 L473 77 L443 88 L432 118 L421 88 L391 77 L421 66 Z" fill="#fbf5e9" />
      </svg>
    </span>
  );
}
