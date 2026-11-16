import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { content, sectionNumber } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import Reveal from '../components/Reveal';

const section = content.projects;
const projects = section.items;
// only show filter buttons for categories that actually have projects
const projectCategories = ['All', ...section.categories.filter((c) => projects.some((p) => p.category === c))];

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );
  const countFor = (cat) => (cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-y bg-bg-2/60">
      <div className="container-x">
        <SectionHeading
          index={sectionNumber('projects')}
          eyebrow={section.eyebrow}
          title={section.title}
          id="projects-title"
          description={section.description}
        />

        <Reveal className={projectCategories.length > 2 ? '' : 'hidden'}>
          <div
            className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter projects by category"
          >
            {projectCategories.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={active}
                  className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active ? 'border-transparent text-on-accent' : 'border-line-strong text-muted hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative">
                    {cat}
                    <span className={`ml-1.5 font-mono text-xs ${active ? 'opacity-70' : 'opacity-60'}`}>
                      {countFor(cat)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          {filter !== 'All' ? ` in ${filter}` : ''}.
        </p>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
