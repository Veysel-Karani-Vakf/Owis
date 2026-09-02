import { useEffect, useRef, useState } from 'react';

/**
 * Chapter 07's working model: the waqf's olive tree artwork (the calligraphic mark grown
 * into the trunk, olives on the branches, the slogan beside it) revealed from the roots up
 * as the card enters view, so the tree appears to grow in front of the reader.
 *
 * The artwork is a single still; the growth is a soft-edged mask sweeping up the photo,
 * followed by a light survey overlay (dotted orbits, crosshair marks, coordinate readouts)
 * drawn in SVG over the artwork's own 1254×1254 pixel space. Timing is CSS-driven from the
 * `data-grown` flag and collapses to the final frame under `prefers-reduced-motion`
 * (see the `.blessed-tree` rules in index.css).
 */

const PHOTO = '/library/profile/blessed-tree-olive.jpg';
const VIEW = 1254;

/** Dotted orbits around the canopy; `tilt` seeds the slow CSS rotation. */
const ORBITS: ReadonlyArray<{ cx: number; cy: number; rx: number; ry: number; tilt: number; speed: number }> = [
  { cx: 620, cy: 450, rx: 560, ry: 380, tilt: -10, speed: 140 },
  { cx: 640, cy: 470, rx: 420, ry: 470, tilt: 22, speed: 200 },
];

/** Crosshair marks at the canopy's extremities. */
const MARKS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 715, y: 100 },
  { x: 1125, y: 655 },
  { x: 135, y: 560 },
  { x: 985, y: 235 },
  { x: 240, y: 740 },
];

/** Readouts placed on open background, each tethered to a mark. */
const LABELS: ReadonlyArray<{ x: number; y: number; to: { x: number; y: number }; text: string; end?: boolean }> = [
  { x: 748, y: 84, to: { x: 715, y: 100 }, text: 'x 715 · y 100' },
  { x: 1032, y: 728, to: { x: 1125, y: 655 }, text: 'x 1125 · y 655' },
  { x: 92, y: 836, to: { x: 240, y: 740 }, text: 'n 0.42 · Ø 14' },
];

export function BlessedTreeScene({ inView, alt }: { inView: boolean; alt: string }) {
  // Growth only starts once the artwork is actually painted, so the reveal never sweeps over a blank frame.
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, []);
  const grown = inView && loaded;

  return (
    <div className="blessed-tree mx-auto w-full max-w-[360px]" data-grown={grown ? 'true' : 'false'}>
      <div className="relative aspect-square overflow-hidden rounded-[22px] bg-[#f1ede6] shadow-[0_18px_40px_rgba(60,40,30,0.14)]">
        <img
          ref={imageRef}
          src={PHOTO}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className="blessed-tree__photo absolute inset-0 h-full w-full object-cover"
        />
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          style={{ direction: 'ltr' }}
        >
          {ORBITS.map((orbit) => (
            <ellipse
              key={`${orbit.cx}-${orbit.rx}`}
              className="blessed-tree__orbit"
              cx={orbit.cx}
              cy={orbit.cy}
              rx={orbit.rx}
              ry={orbit.ry}
              fill="none"
              stroke="rgba(156,16,6,0.34)"
              strokeWidth="1.8"
              strokeDasharray="2.5 10"
              strokeLinecap="round"
              style={{ '--tilt': `${orbit.tilt}deg`, animationDuration: `${orbit.speed}s` } as React.CSSProperties}
            />
          ))}

          {MARKS.map((mark, index) => (
            <g
              key={`${mark.x}-${mark.y}`}
              className="blessed-tree__mark"
              stroke="rgba(156,16,6,0.7)"
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{ transitionDelay: `${2.5 + index * 0.14}s` }}
            >
              <line x1={mark.x - 12} y1={mark.y} x2={mark.x - 5} y2={mark.y} />
              <line x1={mark.x + 5} y1={mark.y} x2={mark.x + 12} y2={mark.y} />
              <line x1={mark.x} y1={mark.y - 12} x2={mark.x} y2={mark.y - 5} />
              <line x1={mark.x} y1={mark.y + 5} x2={mark.x} y2={mark.y + 12} />
            </g>
          ))}

          {LABELS.map((label, index) => (
            <g key={label.text} className="blessed-tree__label" style={{ transitionDelay: `${2.9 + index * 0.2}s` }}>
              <line
                x1={label.to.x}
                y1={label.to.y}
                x2={label.end ? label.x + 4 : label.x - 4}
                y2={label.y - 6}
                stroke="rgba(156,16,6,0.45)"
                strokeWidth="1.2"
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor={label.end ? 'end' : 'start'}
                fontSize="26"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
                letterSpacing="0.8"
                fill="#5b5651"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="4"
                paintOrder="stroke"
              >
                {label.text}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
