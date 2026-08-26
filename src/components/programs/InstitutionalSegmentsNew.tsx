import { Building2, Users } from 'lucide-react';
import type { ProgramAudience } from '@/data/programs';
import { resolveIcon } from '@/lib/icons';

type InstitutionalSegmentsNewProps = {
  audiences: ProgramAudience[];
  /** Section heading and subtitle, from the programs-page labels. */
  title: string;
  description?: string;
};

// Defaults by position, used when an audience carries no icon of its own.
const defaultIcons = [Building2, Users];

export default function InstitutionalSegmentsNew({
  audiences,
  title,
  description,
}: InstitutionalSegmentsNewProps) {
  if (!audiences.length) return null;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-dark-950 md:text-4xl">{title}</h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-dark-600">{description}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {audiences.map((audience, index) => {
            const Icon = resolveIcon(audience.icon, defaultIcons, index);
            return (
              <div
                key={audience.id || `${audience.title}-${index}`}
                className="rounded-lg border border-primary-200 bg-[#faf8f8] p-8"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-dark-950">{audience.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-600">{audience.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
