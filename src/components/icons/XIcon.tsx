import type { SVGProps } from 'react';

/**
 * The X (formerly Twitter) mark. Lucide only ships the retired bird, so the
 * logo is drawn here. The viewBox keeps the same breathing room Lucide icons
 * have, so it sits at the same visual weight next to them.
 */
export default function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-2 -2 28 28" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}
