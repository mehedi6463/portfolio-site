import Reveal from './Reveal';

/**
 * Consistent section heading: numbered eyebrow, display title and optional intro.
 */
export default function SectionHeading({ index, eyebrow, title, description, align = 'left', id }) {
  const centered = align === 'center';
  return (
    <Reveal className={`mb-12 md:mb-16 ${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}`}>
      <p className={`eyebrow flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
        {index && <span className="text-muted">{index}</span>}
        <span className="h-px w-8 bg-accent-2" aria-hidden="true" />
        <span>{eyebrow}</span>
      </p>
      <h2 id={id} className="mt-4 text-[2rem] font-semibold sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-muted md:text-lg">{description}</p>}
    </Reveal>
  );
}
