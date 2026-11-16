import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Download, Mail } from 'lucide-react';
import { content, site, visibleSections } from '../data/site';
import Button from '../components/Button';
import SocialLinks from '../components/SocialLinks';
import Icon from '../components/icons/Icon';

const hero = content.hero;
const ease = [0.22, 1, 0.36, 1];
const words = (s = '') => s.split(/\s+/).filter(Boolean);
const has = (id) => visibleSections.some((s) => s.id === id);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
});

function AvailabilityBadge() {
  const { available, label, busyLabel } = site.availability;
  return (
    <motion.p
      {...fadeUp(0)}
      className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/60 py-1.5 pr-4 pl-3 text-xs font-medium text-ink sm:text-sm"
    >
      <span className="relative flex size-2.5" aria-hidden="true">
        {available && (
          <span className="absolute inline-flex size-full rounded-full bg-emerald-400 [animation:ping-soft_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        )}
        <span className={`relative inline-flex size-2.5 rounded-full ${available ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      </span>
      {available ? label : busyLabel}
    </motion.p>
  );
}

function CodeCard() {
  const card = hero.codeCard;
  if (!card?.show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.9, delay: 0.9, ease }}
      className="absolute -bottom-6 -left-4 z-20 w-[min(17rem,78%)] sm:-left-10 lg:-left-16"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-2xl border border-line-strong bg-bg/90 p-4 font-mono text-[0.7rem] leading-relaxed shadow-[var(--shadow)] backdrop-blur-md sm:text-xs"
      >
        <div className="mb-3 flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-muted">{card.filename}</span>
        </div>
        <pre className="overflow-hidden text-muted" aria-label="Code snippet">
          <code>
            <span className="text-accent-2">const</span> <span className="text-ink">{card.variable}</span> = {'{'}
            {card.entries.map((e, i) => (
              <span key={i}>
                {'\n'}  {e.key}: <span className="text-accent-text">{e.value}</span>,
              </span>
            ))}
            {'\n'}
            {'};'}
            <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-accent-text [animation:blink_1.1s_steps(1)_infinite]" />
          </code>
        </pre>
      </motion.div>
    </motion.div>
  );
}

/** Chip slots around the portrait, in the order chips are listed in the admin. */
const CHIP_POSITIONS = [
  'top-[14%] -right-2 sm:-right-8', // right, upper
  'top-[46%] -right-3 sm:-right-12', // right, middle
  'top-[17%] -left-5 sm:-left-10', // left, upper
  '-top-[5%] left-[8%] sm:left-[14%]', // above the arch, left
  '-top-[3%] right-0 sm:right-[1%]', // above the arch, right
];

function TechChip({ icon, label, className, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        className="flex items-center gap-2 rounded-full border border-line-strong bg-bg/85 py-2 pr-4 pl-2 text-xs font-semibold text-ink shadow-[var(--shadow)] backdrop-blur-md sm:text-sm"
      >
        <span className="grid size-7 place-items-center rounded-full bg-accent text-on-accent">
          <Icon name={icon} className="size-3.5" strokeWidth={2} />
        </span>
        {label}
      </motion.div>
    </motion.div>
  );
}

function Portrait() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease }}
      className="relative mx-auto w-full max-w-[22rem] sm:max-w-[25rem] lg:max-w-none"
    >
      <div
        className="pointer-events-none absolute -inset-6 rounded-full border border-dashed border-line-strong [animation:spin-slow_60s_linear_infinite]"
        aria-hidden="true"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-line-strong bg-gradient-to-b from-teal-800 via-teal-950 to-teal-950 light:from-teal-200 light:via-teal-500/70 light:to-teal-800">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="absolute top-[18%] left-1/2 size-[70%] -translate-x-1/2 rounded-full bg-teal-200/25 blur-3xl"
          aria-hidden="true"
        />
        {hero.image && (
          <img
            src={hero.image}
            alt={hero.imageAlt}
            width="800"
            height="840"
            fetchpriority="high"
            className="absolute inset-x-0 bottom-0 mx-auto w-[96%] object-contain object-bottom"
          />
        )}
      </div>
      {hero.chips.slice(0, CHIP_POSITIONS.length).map((chip, i) => (
        <TechChip key={i} {...chip} className={CHIP_POSITIONS[i]} delay={1.1 + i * 0.2} />
      ))}
      <CodeCard />
    </motion.div>
  );
}

function Marquee() {
  if (!hero.showMarquee || !hero.marquee.length) return null;
  const items = [...hero.marquee, ...hero.marquee];
  return (
    <div
      className="relative mt-20 overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] md:mt-28"
      aria-label="Technologies"
    >
      <ul className="flex w-max gap-10 [animation:marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
        {items.map((t, i) => (
          <li
            key={`${t}-${i}`}
            aria-hidden={i >= hero.marquee.length ? 'true' : undefined}
            className="flex items-center gap-10 font-display text-lg font-medium whitespace-nowrap text-muted md:text-xl"
          >
            {t}
            <span className="text-accent-2" aria-hidden="true">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnimatedWords({ list, delay, className = '' }) {
  return list.map((w, i) => (
    <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-1 align-bottom">
      <motion.span
        className={`mr-[0.25em] inline-block ${className}`}
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay: delay + i * 0.08, ease }}
      >
        {w}
      </motion.span>
    </span>
  ));
}

export default function Hero() {
  const headline = words(hero.headline);
  const highlight = words(hero.highlight);
  return (
    <section id="home" aria-label="Introduction" className="relative overflow-hidden pt-32 md:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-40 -right-40 size-[38rem] rounded-full bg-teal-800/50 blur-[120px] [animation:drift_18s_ease-in-out_infinite] light:bg-teal-200/60" />
        <div className="absolute top-1/3 -left-60 size-[30rem] rounded-full bg-teal-500/15 blur-[120px] [animation:drift_22s_ease-in-out_infinite_reverse]" />
        <span className="absolute top-36 left-[46%] hidden font-mono text-sm text-accent-2/40 xl:block">{'</>'}</span>
        <span className="absolute bottom-40 left-[6%] hidden font-mono text-sm text-accent-2/40 xl:block">{'{ }'}</span>
      </div>

      <div className="container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <AvailabilityBadge />

          <h1 className="mt-7">
            <motion.span {...fadeUp(0.1)} className="block font-display text-2xl font-medium text-muted sm:text-3xl">
              {hero.greeting} <span className="text-ink">{site.name}</span>
              {hero.showWave && (
                <motion.span
                  className="ml-2 inline-block origin-[70%_70%]"
                  animate={{ rotate: [0, 16, -8, 16, 0] }}
                  transition={{ duration: 1.6, delay: 1.2, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  👋
                </motion.span>
              )}
            </motion.span>
            <span className="mt-4 block text-[2.6rem] leading-[1.02] font-bold sm:text-6xl xl:text-7xl">
              <AnimatedWords list={headline} delay={0.25} />
              <AnimatedWords list={highlight} delay={0.25 + headline.length * 0.08} className="text-gradient" />
            </span>
          </h1>

          <motion.p {...fadeUp(0.75)} className="mt-7 max-w-xl text-base text-muted sm:text-lg">
            {hero.text}
          </motion.p>

          <motion.div {...fadeUp(0.9)} className="mt-9 flex flex-wrap items-center gap-3">
            {has('projects') && hero.primaryLabel && (
              <Button href="#projects" size="lg" icon={ArrowUpRight}>
                {hero.primaryLabel}
              </Button>
            )}
            {site.cvUrl && hero.resumeLabel && (
              <Button href={site.cvUrl} download variant="secondary" size="lg" iconLeft={Download}>
                {hero.resumeLabel}
              </Button>
            )}
            {has('contact') && hero.contactLabel && (
              <Button href="#contact" variant="ghost" size="lg" iconLeft={Mail}>
                {hero.contactLabel}
              </Button>
            )}
          </motion.div>

          <motion.div {...fadeUp(1.05)} className="mt-12 flex flex-wrap items-center gap-6">
            <SocialLinks />
            {hero.scrollLabel && visibleSections[0] && (
              <>
                <span className="hidden h-px w-12 bg-line-strong sm:block" aria-hidden="true" />
                <a
                  href={`#${visibleSections[0].id}`}
                  className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted uppercase hover:text-accent-text"
                >
                  {hero.scrollLabel}
                  <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                </a>
              </>
            )}
          </motion.div>
        </div>

        <div className="px-6 sm:px-10 lg:col-span-5 lg:px-0 lg:pl-6">
          <Portrait />
        </div>
      </div>

      <Marquee />
    </section>
  );
}
