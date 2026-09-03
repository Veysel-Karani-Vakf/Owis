import { profileChapterIds, useActiveChapter } from './profileShared';

type ProfileRailProps = {
  /** Chapter titles, in reel order (same length as profileChapterIds). */
  titles: string[];
  chapterLabel: string;
};

/**
 * The reel's projector apparatus: a fixed dot rail with the current chapter
 * numeral at xl+, and a floating ٠٣/١٣ counter chip below xl. It is the only
 * fixed chrome this page keeps once the header scrolls away (the site-wide
 * top progress bar covers position feedback). One IntersectionObserver owns
 * the active-chapter state.
 */
export default function ProfileRail({ titles, chapterLabel }: ProfileRailProps) {
  const active = useActiveChapter();

  const total = profileChapterIds.length;
  const pad = (value: number) => String(value).padStart(2, '0');

  return (
    <>
      {/* Floating slide counter chip (below xl). */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-5 start-4 z-40 flex items-baseline gap-1 rounded-full border border-primary-100 bg-white/90 px-3.5 py-1.5 font-brand text-sm font-bold text-dark-900 shadow-[0_10px_28px_rgba(40,12,18,0.16)] backdrop-blur-md xl:hidden"
      >
        <span key={active} className="profile-roll profile-count text-primary-600">
          {pad(active + 1)}
        </span>
        <span className="text-dark-300">/</span>
        <span className="profile-count text-dark-500">{pad(total)}</span>
      </div>

      {/* Chapter rail (xl+): numeral + dots, anchored to the inline-start gutter. */}
      <nav
        aria-label={chapterLabel}
        className="fixed start-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex"
      >
        <div aria-hidden="true" className="flex flex-col items-center font-brand font-bold leading-none">
          <span key={active} className="profile-roll profile-count text-2xl text-primary-600">
            {pad(active + 1)}
          </span>
          <span className="my-1 h-px w-5 bg-dark-300" />
          <span className="profile-count text-xs text-dark-400">{pad(total)}</span>
        </div>
        <ul className="flex flex-col items-center gap-2.5">
          {profileChapterIds.map((id, index) => {
            const isActive = index === active;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-label={`${chapterLabel} ${pad(index + 1)} — ${titles[index] ?? ''}`}
                  aria-current={isActive ? 'true' : undefined}
                  title={titles[index]}
                  className="group flex h-5 w-5 items-center justify-center"
                >
                  <span
                    className={`profile-rail-dot block h-2 w-2 rounded-full ${
                      isActive
                        ? 'profile-rail-dot--active bg-primary-600'
                        : 'bg-dark-300 group-hover:bg-primary-400'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
