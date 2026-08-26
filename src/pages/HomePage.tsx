import About from '@/components/sections/About';
import Hero from '@/components/sections/Hero';
import News from '@/components/sections/News';
import Partners from '@/components/sections/Partners';
import ParticipationCTA from '@/components/sections/ParticipationCTA';
import Programs from '@/components/sections/Programs';
import Projects from '@/components/sections/Projects';
import Statistics from '@/components/sections/Statistics';
import YemenPioneers from '@/components/sections/YemenPioneers';
import PageSeo from '@/components/internal/PageSeo';
import { useI18n } from '@/i18n/useI18n';

export default function HomePage() {
  const { content } = useI18n();

  return (
    <>
      <PageSeo
        title={content.meta.title}
        description={content.meta.description}
        image={content.meta.ogImage || content.siteConfig.logo}
      />
      <main>
        <Hero />
        <Projects />
        <About />
        <Programs />
        <YemenPioneers />
        <Statistics />
        <News />
        <ParticipationCTA />
        <Partners />
      </main>
    </>
  );
}
