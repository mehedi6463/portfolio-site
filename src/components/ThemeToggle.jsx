import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line-strong text-ink transition-colors hover:border-accent-text hover:text-accent-text"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? <Sun className="size-[1.1rem]" aria-hidden="true" /> : <Moon className="size-[1.1rem]" aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
