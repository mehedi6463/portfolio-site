import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import ProjectThumb from './ProjectThumb';
import TechIcon from './icons/TechIcon';

function CardLink({ href, label, title, children, primary }) {
  const base =
    'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-300';
  const style = primary
    ? 'bg-accent text-on-accent hover:-translate-y-0.5'
    : 'border border-line-strong text-ink hover:border-accent-text hover:text-accent-text';

  if (!href) {
    return (
      <span
        className={`${base} ${style} cursor-not-allowed opacity-45`}
        aria-disabled="true"
        title="Link coming soon"
      >
        {children}
        <span className="sr-only">for {title} (link coming soon)</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} for ${title} (opens in a new tab)`}
      className={`${base} ${style}`}
    >
      {children}
    </a>
  );
}

const ProjectCard = forwardRef(function ProjectCard({ project }, ref) {
  const { title, category, description, tech, layout, image, liveUrl, githubUrl, placeholder } = project;
  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="card group flex flex-col overflow-hidden transition-[border-color,box-shadow] duration-500 hover:border-line-strong hover:shadow-[var(--shadow)]"
    >
      <div className="relative">
        <ProjectThumb layout={layout} image={image} title={title} />
        <span className="absolute top-3 left-3 rounded-full bg-teal-950/80 px-3 py-1 font-mono text-[0.68rem] text-teal-200 backdrop-blur">
          {category}
        </span>
        {placeholder && (
          <span className="absolute top-3 right-3 rounded-full border border-dashed border-amber-300/60 bg-teal-950/80 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-amber-300 uppercase">
            Sample
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="flex items-start justify-between gap-3 text-xl font-semibold">
          {title}
          <ArrowUpRight
            className="mt-1 size-5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-text"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {tech.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.7rem] text-muted">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <CardLink href={liveUrl} label="Live demo" title={title} primary>
            Live Demo <ArrowUpRight className="size-4" aria-hidden="true" />
          </CardLink>
          <CardLink href={githubUrl} label="Source code on GitHub" title={title}>
            <TechIcon name="github" className="size-4" /> GitHub
          </CardLink>
        </div>
      </div>
    </motion.article>
  );
});

export default ProjectCard;
