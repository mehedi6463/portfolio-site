import { site } from '../data/site';
import TechIcon from './icons/TechIcon';

/** Row of social profile links (GitHub, LinkedIn, Facebook) from site config. */
export default function SocialLinks({ className = '', size = 'md' }) {
  const box = size === 'sm' ? 'size-9' : 'size-11';
  return (
    <ul className={`flex items-center gap-2.5 ${className}`}>
      {site.socials.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.name} profile (opens in a new tab)`}
            className={`${box} grid place-items-center rounded-full border border-line-strong text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-text hover:bg-accent hover:text-on-accent`}
          >
            <TechIcon name={s.icon} className="size-[1.05rem]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
