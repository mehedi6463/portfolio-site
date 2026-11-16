import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import useScrolled from '../hooks/useScrolled';

/** Floating back-to-top button with a ring showing page scroll progress. */
export default function BackToTop() {
  const visible = useScrolled(700);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => scrollYProgress.on('change', setProgress), [scrollYProgress]);

  const R = 22;
  const C = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          className="group fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow)] transition-colors hover:bg-accent hover:text-on-accent sm:right-8 sm:bottom-8"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r={R} fill="none" stroke="var(--line-strong)" strokeWidth="2" />
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="var(--accent-text)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
            />
          </svg>
          <ArrowUp className="relative size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
