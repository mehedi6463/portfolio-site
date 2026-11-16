import { content, sectionNumber } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Icon from '../components/icons/Icon';

const section = content.services;

/** Moves a soft spotlight to follow the cursor inside the card. */
const trackPointer = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
};

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          index={sectionNumber('services')}
          eyebrow={section.eyebrow}
          title={section.title}
          id="services-title"
          description={section.description}
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((s, i) => (
            <Reveal as="li" key={i} delay={(i % 3) * 0.08}>
              <article
                onPointerMove={trackPointer}
                className="card group relative h-full overflow-hidden p-7 transition-all duration-500 hover:-translate-y-1 hover:border-line-strong md:p-8"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(320px circle at var(--x, 50%) var(--y, 0%), var(--glow), transparent 70%)' }}
                  aria-hidden="true"
                />
                <div className="relative flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl border border-line bg-bg-2 text-accent-text transition-all duration-500 group-hover:rotate-[-6deg] group-hover:border-transparent group-hover:bg-accent group-hover:text-on-accent">
                    <Icon name={s.icon} className="size-6" strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-sm text-muted/60">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="relative mt-7 text-xl font-semibold">{s.title}</h3>
                <p className="relative mt-3 text-sm text-muted md:text-[0.95rem]">{s.description}</p>
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent-text transition-all duration-500 group-hover:w-full"
                  aria-hidden="true"
                />
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
