import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Briefcase, Calendar, MapPin, PencilLine } from 'lucide-react';
import { content, sectionNumber } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

function Detail({ title, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="font-mono text-[0.7rem] tracking-[0.16em] text-accent-text uppercase">{title}</h4>
      <ul className="mt-2 space-y-1.5 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineItem({ item }) {
  return (
    <li className="relative grid gap-4 pb-12 pl-10 last:pb-0 md:grid-cols-[11rem_1fr] md:gap-16 md:pl-0">
      {/* dot */}
      <span
        className="absolute top-1.5 left-[3px] z-10 grid size-[1.15rem] place-items-center rounded-full border border-accent-text bg-bg md:left-[calc(11rem+2rem-0.575rem)]"
        aria-hidden="true"
      >
        <span className="size-1.5 rounded-full bg-accent-text" />
      </span>

      <div className="md:pt-1 md:text-right">
        <p className="flex items-start gap-1.5 font-mono text-xs leading-relaxed text-accent-text md:justify-end">
          <Calendar className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{item.period}</span>
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted md:justify-end">
          <MapPin className="size-3.5" aria-hidden="true" />
          {item.location}
        </p>
      </div>

      <Reveal className="card relative p-6 transition-colors hover:border-line-strong md:p-8">
        {item.placeholder && (
          <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full border border-dashed border-amber-400/50 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-amber-500 uppercase light:text-amber-700">
            <PencilLine className="size-3" aria-hidden="true" /> Placeholder
          </span>
        )}
        <h3 className="pr-24 text-xl font-semibold md:text-2xl">{item.role}</h3>
        <p className="mt-1 font-medium text-accent-text">{item.company}</p>
        {item.summary && <p className="mt-4 text-sm text-muted md:text-base">{item.summary}</p>}

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Detail title="Responsibilities" items={item.responsibilities} />
          <div className="space-y-6">
            <Detail title="Key projects" items={item.projects} />
            <Detail title="Achievements" items={item.achievements} />
          </div>
        </div>

        {item.stack?.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5" aria-label="Technologies used">
            {item.stack.map((t) => (
              <li key={t} className="rounded-full bg-bg-2 px-3 py-1 font-mono text-xs text-muted">
                {t}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </li>
  );
}

const exp = content.experience;

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="section-y">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading index={sectionNumber('experience')} eyebrow={exp.eyebrow} title={exp.title} id="experience-title" />
          {exp.badgeTitle && (
            <Reveal className="card mb-12 flex items-center gap-4 self-start p-4 pr-6 md:mb-16 md:self-auto">
              <span className="grid size-12 place-items-center rounded-xl bg-accent text-on-accent">
                <Briefcase className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{exp.badgeTitle}</p>
                <p className="text-sm text-muted">{exp.badgeText}</p>
              </div>
            </Reveal>
          )}
        </div>

        <div ref={ref} className="relative">
          {/* track + animated progress line */}
          <div className="absolute top-2 bottom-2 left-[11px] w-px bg-line-strong md:left-[calc(11rem+2rem)]" aria-hidden="true">
            <motion.div style={{ scaleY }} className="h-full w-full origin-top bg-accent-text" />
          </div>
          <ol>
            {exp.items.map((item, i) => (
              <TimelineItem key={i} item={item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
