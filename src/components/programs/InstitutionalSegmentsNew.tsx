import { Building2, Users } from 'lucide-react';
import type { ProgramAudience } from '@/data/programs';

type InstitutionalSegmentsNewProps = {
  audiences: ProgramAudience[];
};

const icons = [Building2, Users];

export default function InstitutionalSegmentsNew({
  audiences,
}: InstitutionalSegmentsNewProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-950 md:text-4xl">
            Who We Serve
          </h2>
          <p className="mt-4 text-base text-dark-600 leading-relaxed">
            Supporting governmental and civil institutions to strengthen their capabilities
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {audiences.map((audience, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={audience.id}
                className="rounded-lg border border-primary-200 bg-[#faf8f8] p-8"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-dark-950">
                  {audience.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-600">
                  {audience.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
