import Preloader from '@/components/ui/Preloader';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Programs from '@/components/sections/Programs';
import YemenPioneers from '@/components/sections/YemenPioneers';
import Statistics from '@/components/sections/Statistics';
import News from '@/components/sections/News';
import Partners from '@/components/sections/Partners';
import ParticipationCTA from '@/components/sections/ParticipationCTA';

function App() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Header />

      <main>
        <Hero />
        <About />
        <Projects />
        <Programs />
        <YemenPioneers />
        <Statistics />
        <News />
        <ParticipationCTA />
        <Partners />
      </main>

      <Footer />
    </>
  );
}

export default App;
