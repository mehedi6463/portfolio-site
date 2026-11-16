import { content, sectionNumber } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Icon from '../components/icons/Icon';

const section = content.process;

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y relative overflow-hidden bg-bg-2/60">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading
          index={sectionNumber('process')}
          eyebrow={section.eyebrow}
          title={section.title}
          id="process-title"
          description={section.description}
        />

        <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {section.steps.map((step, i) => (
            <Reveal as="li" key={i} delay={(i % 3) * 0.1} className="group relative pt-8">
              <span className="absolute top-0 left-0 h-px w-full bg-line-strong" aria-hidden="true" />
              <span
                className="absolute top-0 left-0 h-0.5 w-12 bg-accent-text transition-all duration-700 ease-out group-hover:w-full"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute top-3 right-0 font-display text-7xl leading-none font-bold text-transparent transition-colors duration-500 select-none [-webkit-text-stroke:1px_var(--line-strong)] group-hover:[-webkit-text-stroke:1px_var(--accent-2)]"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="grid size-12 place-items-center rounded-full border border-line-strong bg-bg text-accent-text transition-colors duration-500 group-hover:bg-accent group-hover:text-on-accent">
                <Icon name={step.icon} className="size-5" />
              </span>
              <h3 className="mt-6 text-xl font-semibold">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted md:text-[0.95rem]">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
