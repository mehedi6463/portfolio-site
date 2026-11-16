import { MotionConfig } from 'motion/react';
import useTheme from './hooks/useTheme';
import { visibleSections } from './data/site';
import ThemeStyle from './components/ThemeStyle';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Process from './sections/Process';
import Contact from './sections/Contact';

/** Section id → component. Order and visibility come from the admin "Layout" tab. */
const SECTIONS = {
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  services: Services,
  process: Process,
  contact: Contact,
};

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    // reducedMotion="user" disables transform/layout animations for users who prefer reduced motion
    <MotionConfig reducedMotion="user">
      <ThemeStyle />
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-accent px-4 py-2 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Navbar theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero />
        {visibleSections.map(({ id }) => {
          const Section = SECTIONS[id];
          return Section ? <Section key={id} /> : null;
        })}
      </main>
      <Footer />
      <BackToTop />
    </MotionConfig>
  );
}
