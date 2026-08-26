import type { ProgramStatistic } from '@/data/programs';

type InstitutionalImpactSectionProps = {
  statistics: ProgramStatistic[];
  /** Section heading, from the programs-page labels. */
  title: string;
  /** Optional small line above the heading. */
  eyebrow?: string;
};

export default function InstitutionalImpactSection({
  statistics,
  title,
  eyebrow,
}: InstitutionalImpactSectionProps) {
  if (!statistics.length) return null;

  return (
    <section className="bg-[#faf8f8] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="mb-12 text-center">
          {eyebrow && <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>}
          <h2 className={`text-3xl font-bold text-dark-950 md:text-4xl ${eyebrow ? 'mt-3' : ''}`}>{title}</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {statistics.map((stat) => (
            <div
              key={`${stat.value}-${stat.label}`}
              className="rounded-lg border border-primary-200 bg-white p-6 text-center"
            >
              <p className="text-3xl font-bold text-primary-700">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-dark-600">{stat.label}</p>
              {stat.description && (
                <p className="mt-2 text-xs leading-relaxed text-dark-500">{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
