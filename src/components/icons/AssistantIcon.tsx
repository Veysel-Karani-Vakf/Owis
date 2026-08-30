type Props = { className?: string };

/**
 * The site assistant's mark: a friendly bot head with an antenna, drawn to
 * read clearly at 24px inside a solid circle (white on brand red).
 */
export default function AssistantIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      {/* antenna */}
      <circle cx="16" cy="4.5" r="2" fill="currentColor" />
      <path d="M16 6.5v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* head */}
      <rect x="5" y="9.5" width="22" height="17" rx="6.5" stroke="currentColor" strokeWidth="2.2" />
      {/* ears */}
      <path d="M3 16v4M29 16v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="11.75" cy="17" r="2.1" fill="currentColor" />
      <circle cx="20.25" cy="17" r="2.1" fill="currentColor" />
      {/* smile */}
      <path d="M11.5 22c1.2 1.3 2.7 1.9 4.5 1.9s3.3-.6 4.5-1.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
