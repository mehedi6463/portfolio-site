import { content, sectionNumber } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import SkillCard from '../components/SkillCard';
import Reveal from '../components/Reveal';

const skills = content.skills;

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section-y relative bg-bg-2/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" aria-hidden="true" />
      <div className="container-x">
        <SectionHeading
          index={sectionNumber('skills')}
          eyebrow={skills.eyebrow}
          title={skills.title}
          id="skills-title"
          description={skills.description}
        />

        <div className="divide-y divide-line border-y border-line">
          {skills.groups.map((group, gi) => (
            <Reveal key={gi} delay={gi * 0.05} className="grid gap-6 py-8 md:grid-cols-12 md:gap-10 md:py-10">
              <div className="md:col-span-4">
                <p className="font-mono text-xs text-accent-text">{String(gi + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-xl font-semibold md:text-2xl">{group.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{group.caption}</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 md:col-span-8 xl:grid-cols-3">
                {group.skills.map((s, i) => (
                  <li key={i}>
                    <SkillCard {...s} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
