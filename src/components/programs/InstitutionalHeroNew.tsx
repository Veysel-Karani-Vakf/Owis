import type { Program } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type InstitutionalHeroNewProps = {
  program: Program;
};

export default function InstitutionalHeroNew({ program }: InstitutionalHeroNewProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
            Institutional Development
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-dark-950 md:text-5xl">
            {program.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-dark-600 md:text-xl">
            {program.summary}
          </p>
        </div>
      </div>
    </section>
  );
}
