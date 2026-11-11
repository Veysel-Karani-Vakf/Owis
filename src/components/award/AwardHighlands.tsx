import { useId } from 'react';

type AwardHighlandsProps = {
  className?: string;
};

// Ridge lines the terraces follow (one per hill band).
const MID_RIDGE =
  'M0 300 C110 272 200 258 300 270 C400 282 470 262 560 250 C640 240 680 232 740 234 C820 236 870 262 960 268 C1060 274 1130 238 1230 236 C1320 234 1390 258 1440 262 L1440 480 L0 480 Z';
const NEAR_RIDGE =
  'M0 372 C120 344 236 350 350 368 C470 386 560 344 676 340 C788 336 852 316 960 312 C1072 308 1150 348 1264 352 C1352 355 1408 340 1440 334 L1440 480 L0 480 Z';

// Terraced fields: gently waving contour lines, clipped to each hill.
const terraces = (from: number, to: number, step: number, sway: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, index) => {
    const y = from + index * step;
    return `M0 ${y} C240 ${y - sway} 480 ${y + sway * 0.8} 720 ${y - sway * 0.4} S1200 ${y + sway * 0.8} 1440 ${y - sway * 0.6}`;
  });

// Tower houses of a hilltop village, centred so every crop keeps it in view (x, top, width, height).
const HOUSES: [number, number, number, number][] = [
  [620, 246, 22, 42],
  [644, 232, 26, 56],
  [672, 220, 20, 68],
  [694, 236, 28, 52],
  [724, 224, 22, 64],
  [748, 240, 26, 48],
  [776, 230, 20, 58],
  [798, 246, 24, 44],
  [824, 256, 20, 34],
];

// Small round trees on the slopes (x, base y, crown radius).
const TREES: [number, number, number][] = [
  [584, 296, 7],
  [600, 300, 5],
  [872, 296, 8],
  [892, 302, 6],
];

/**
 * An original, illustrated Yemeni highland at dusk: ranges against a deep-red
 * glow, terraced slopes and a hilltop village of tower houses with lit windows.
 * Purely decorative backdrop for the dark conditions band; its top and bottom
 * fade into the section colour (dark-950, #000).
 */
export default function AwardHighlands({ className = '' }: AwardHighlandsProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const sky = `award-hl-sky-${uid}`;
  const sun = `award-hl-sun-${uid}`;
  const fog = `award-hl-fog-${uid}`;
  const midClip = `award-hl-mid-${uid}`;
  const nearClip = `award-hl-near-${uid}`;

  return (
    <svg
      viewBox="0 0 1440 480"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.42" stopColor="#1a0708" />
          <stop offset="0.62" stopColor="#3a0a0e" />
          <stop offset="0.82" stopColor="#140405" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <radialGradient id={sun} cx="0.5" cy="0.38" r="0.3">
          <stop offset="0" stopColor="#da0812" stopOpacity="0.42" />
          <stop offset="1" stopColor="#da0812" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={fog} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.84" stopColor="#000000" stopOpacity="0.7" />
          <stop offset="1" stopColor="#000000" stopOpacity="1" />
        </linearGradient>
        <clipPath id={midClip}>
          <path d={MID_RIDGE} />
        </clipPath>
        <clipPath id={nearClip}>
          <path d={NEAR_RIDGE} />
        </clipPath>
      </defs>

      <rect width="1440" height="480" fill={`url(#${sky})`} />
      <rect width="1440" height="480" fill={`url(#${sun})`} />

      {/* Birds */}
      <g fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.28">
        <path d="M282 150 q6 -5 12 0 q6 -5 12 0" />
        <path d="M316 132 q5 -4 10 0 q5 -4 10 0" />
        <path d="M1150 118 q5 -4 10 0 q5 -4 10 0" />
      </g>

      {/* Far range */}
      <path
        d="M0 250 C90 214 170 196 255 214 C330 230 372 182 452 170 C540 157 598 214 690 196 C770 180 822 150 910 142 C1004 134 1052 196 1140 192 C1222 188 1268 146 1350 150 C1396 152 1424 162 1440 168 L1440 480 L0 480 Z"
        fill="#2a1214"
        opacity="0.9"
      />

      {/* Middle range with terraces */}
      <path d={MID_RIDGE} fill="#1b0d0f" />
      <g clipPath={`url(#${midClip})`} fill="none" stroke="#ffffff" strokeWidth="1.1" opacity="0.06">
        {terraces(266, 470, 13, 9).map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Hilltop village of tower houses */}
      <g>
        {HOUSES.map(([x, top, width, height]) => (
          <g key={`${x}-${top}`}>
            <rect x={x} y={top} width={width} height={height} fill="#2e2022" />
            <rect x={x + width * 0.62} y={top} width={width * 0.38} height={height} fill="#241819" />
            <rect x={x - 1} y={top - 3} width={width + 2} height={4} fill="#3a2a2c" />
            {Array.from({ length: Math.max(1, Math.floor((height - 12) / 14)) }, (_, row) => (
              <g key={row} fill="#ffc8ce" fillOpacity="0.85">
                <rect x={x + width * 0.2} y={top + 8 + row * 14} width={3} height={5} />
                <rect x={x + width * 0.48} y={top + 8 + row * 14} width={3} height={5} />
                <path d={`M${x + width * 0.2 - 0.6} ${top + 7 + row * 14} a2.1 2.1 0 0 1 4.2 0`} fill="#ff9ba5" />
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* Trees */}
      <g>
        {TREES.map(([x, base, radius]) => (
          <g key={`${x}-${base}`}>
            <path d={`M${x} ${base} L${x} ${base - radius - 4}`} stroke="#241617" strokeWidth="1.6" />
            <circle cx={x} cy={base - radius - 5} r={radius} fill="#1e1213" />
          </g>
        ))}
      </g>

      {/* Near hills with terraces */}
      <path d={NEAR_RIDGE} fill="#110809" />
      <g clipPath={`url(#${nearClip})`} fill="none" stroke="#ffffff" strokeWidth="1.1" opacity="0.045">
        {terraces(310, 476, 11, 7).map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Foreground slope */}
      <path
        d="M0 430 C160 410 300 418 440 436 C580 452 700 424 840 428 C980 432 1080 456 1220 448 C1330 442 1400 430 1440 428 L1440 480 L0 480 Z"
        fill="#090505"
      />

      {/* Valley haze */}
      <rect width="1440" height="480" fill={`url(#${fog})`} />
    </svg>
  );
}
