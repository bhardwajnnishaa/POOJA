// The Festive Clock logo: a clock inside marigold petals. Same drawing as the app icons in public/.
const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 512 512">
        <rect width="512" height="512" rx="112" fill="#fbf5e9" />
        <g transform="translate(256 256)">
          <g fill="#d27833">
            {PETAL_ANGLES.map((angle) => (
              <ellipse key={angle} rx="36" ry="96" transform={`rotate(${angle}) translate(0 -118)`} />
            ))}
          </g>
          <circle r="106" fill="#304339" />
          <circle r="84" fill="#fbf5e9" />
          <g stroke="#304339" strokeLinecap="round">
            <line x1="0" y1="0" x2="-36" y2="-32" strokeWidth="18" />
            <line x1="0" y1="0" x2="42" y2="-46" strokeWidth="14" />
          </g>
          <circle r="13" fill="#d27833" />
        </g>
      </svg>
    </span>
  );
}
