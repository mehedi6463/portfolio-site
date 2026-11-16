import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Download, Menu, X } from 'lucide-react';
import { navLinks, site } from '../data/site';
import useActiveSection from '../hooks/useActiveSection';
import useScrolled from '../hooks/useScrolled';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import SocialLinks from './SocialLinks';

const SECTION_IDS = navLinks.map((l) => l.id);

export function Logo({ onClick }) {
  return (
    <a
      href="#home"
      onClick={onClick}
      className="group flex items-center gap-2 font-display text-xl font-bold tracking-[0.14em] text-ink"
      aria-label={`${site.name} — back to top`}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-accent font-mono text-sm tracking-normal text-on-accent transition-transform duration-500 group-hover:rotate-[-8deg]">
        {site.logoMark}
      </span>
      <span>
        {site.logo}
        <span className="text-accent-text">.</span>
      </span>
    </a>
  );
}

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(24);
  const active = useActiveSection(SECTION_IDS);

  // lock scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // close the menu if the viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-500 ${
          scrolled || open
            ? 'border-b border-line bg-bg/80 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5'
        }`}
      >
        <nav className="container-x flex items-center justify-between gap-4" aria-label="Main">
          <Logo onClick={close} />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 rounded-full border border-line bg-surface/50 p-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      aria-hidden="true"
                    />
                  )}
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative z-10 block rounded-full px-3.5 py-2 text-sm font-medium transition-colors xl:px-4 ${
                      isActive ? 'text-on-accent' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <span className="hidden sm:contents">
              <Button
                href={site.cvUrl}
                download
                size="sm"
                iconLeft={Download}
                title={site.cvIsPlaceholder ? 'Placeholder CV — real CV coming soon' : 'Download CV'}
              >
                {site.cvLabel}
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-full border border-line-strong text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[65px] bottom-0 overflow-y-auto bg-bg lg:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-x flex min-h-full flex-col pt-8 pb-10">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.045, duration: 0.4 }}
                    className="border-b border-line"
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={close}
                      aria-current={active === link.id ? 'true' : undefined}
                      className={`flex items-baseline gap-4 py-4 font-display text-3xl font-semibold transition-colors ${
                        active === link.id ? 'text-accent-text' : 'text-ink'
                      }`}
                    >
                      <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-6 pt-10">
                <Button href={site.cvUrl} download iconLeft={Download} onClick={close} className="w-full">
                  {site.cvLabel}
                </Button>
                <SocialLinks className="justify-center" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
