// The Festive Clock logo: a clock bursting like fireworks. Same drawing as the app icons in public/.
const RAY_COLOURS = ["#ff3d7f", "#ffd23d", "#3dffd0"];
const RAYS = Array.from({ length: 16 }, (_, index) => index);

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 512 512">
        <defs>
          <linearGradient id="fc-logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b1055" />
            <stop offset="1" stopColor="#7b2ff7" />
          </linearGradient>
          <linearGradient id="fc-logo-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff3d7f" />
            <stop offset=".5" stopColor="#ffb13d" />
            <stop offset="1" stopColor="#3dffd0" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#fc-logo-bg)" />
        {RAYS.map((index) => (
          <line
            key={`ray-${index}`}
            x1="256" y1="100" x2="256" y2="58"
            stroke={RAY_COLOURS[index % 3]} strokeWidth="16" strokeLinecap="round"
            transform={`rotate(${index * 22.5} 256 256)`}
          />
        ))}
        {RAYS.map((index) => (
          <circle key={`dot-${index}`} cx="256" cy="40" r="7" fill={RAY_COLOURS[(index + 1) % 3]} transform={`rotate(${index * 22.5 + 11.25} 256 256)`} />
        ))}
        <circle cx="256" cy="256" r="128" fill="none" stroke="url(#fc-logo-ring)" strokeWidth="24" />
        <circle cx="256" cy="256" r="106" fill="#fff" />
        <g stroke="#2b1055" strokeLinecap="round">
          <line x1="256" y1="256" x2="208" y2="216" strokeWidth="22" />
          <line x1="256" y1="256" x2="312" y2="194" strokeWidth="16" />
        </g>
        <circle cx="256" cy="256" r="17" fill="#ff3d7f" />
      </svg>
    </span>
  );
}
