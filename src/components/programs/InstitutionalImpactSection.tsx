import type { ProgramStatistic } from '@/data/programs';

type InstitutionalImpactSectionProps = {
  statistics: ProgramStatistic[];
};

export default function InstitutionalImpactSection({
  statistics,
}: InstitutionalImpactSectionProps) {
  if (!statistics.length) return null;

  return (
    <section className="bg-[#faf8f8] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-950 md:text-4xl">
            Program Impact
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {statistics.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className="rounded-lg border border-primary-200 bg-white p-6 text-center">
              <p className="text-3xl font-bold text-primary-700">{stat.value}</p>
              <p className="mt-2 text-sm text-dark-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
