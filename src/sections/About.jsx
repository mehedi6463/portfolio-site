import { content, sectionNumber } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import RichText from '../components/RichText';
import Icon from '../components/icons/Icon';

const about = content.about;

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Image column */}
        {about.image && (
          <Reveal className="relative mx-auto w-full max-w-md self-start lg:col-span-5 lg:mx-0 lg:max-w-none">
            <div className="absolute -top-4 -left-4 h-full w-full rounded-[2rem] border border-line-strong" aria-hidden="true" />
            <figure className="relative overflow-hidden rounded-[2rem] border border-line bg-surface">
              <img
                src={about.image}
                alt={about.imageAlt}
                width="900"
                height="1125"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]"
              />
              {about.caption && (
                <>
                  <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-teal-950/70 to-transparent" aria-hidden="true" />
                  <figcaption className="absolute top-5 left-5 font-mono text-xs tracking-[0.18em] text-teal-200 uppercase">
                    {about.caption}
                  </figcaption>
                </>
              )}
            </figure>

            {about.showSignature && about.signature && (
              <div className="card absolute -right-3 -bottom-8 w-48 px-5 py-4 shadow-[var(--shadow)] sm:-right-8 sm:w-56">
                <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-muted uppercase">{about.signatureLabel}</p>
                <div
                  className="signature mt-2 h-12 w-full"
                  style={{ '--sig': `url("${about.signature}")` }}
                  role="img"
                  aria-label="Signature"
                />
              </div>
            )}
          </Reveal>
        )}

        {/* Text column */}
        <div className={`lg:pt-4 ${about.image ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <SectionHeading index={sectionNumber('about')} eyebrow={about.eyebrow} title={about.title} id="about-title" />

          <Reveal delay={0.05} className="space-y-5 text-base text-muted md:text-lg">
            {about.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </Reveal>

          {about.facts.length > 0 && (
            <Reveal delay={0.1}>
              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
                {about.facts.map((f, i) => (
                  <div key={i} className="bg-bg p-4">
                    <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase">{f.label}</dt>
                    <dd className={`mt-1 text-sm font-semibold ${f.placeholder ? 'text-muted italic' : 'text-ink'}`}>
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {about.pillars.length > 0 && (
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {about.pillars.map((p, i) => (
                <Reveal as="li" key={i} delay={0.1 + i * 0.08} className="card group p-5 transition-colors hover:border-line-strong">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent-text transition-colors group-hover:bg-accent group-hover:text-on-accent">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{p.text}</p>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
