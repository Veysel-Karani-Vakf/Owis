import type { ProgramSection } from '@/data/programs';

type InstitutionalPillarsNewProps = {
  items: string[];
  section: ProgramSection;
};

export default function InstitutionalPillarsNew({
  items,
  section,
}: InstitutionalPillarsNewProps) {
  return (
    <section className="bg-[#faf8f8] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-950 md:text-4xl">
            {section.title}
          </h2>
          {section.paragraphs?.[0] && (
            <p className="mt-4 text-base text-dark-600 leading-relaxed">
              {section.paragraphs[0]}
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item}
              className="rounded-lg border border-primary-200 bg-white p-6 text-start"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 mb-3">
                {index + 1}
              </div>
              <p className="font-semibold text-dark-950">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
