import { brandColor } from './icons/TechIcon';
import Icon from './icons/Icon';

/**
 * Icon-based skill card. Brand icons stay in the theme accent and reveal
 * their official brand colour on hover.
 */
export default function SkillCard({ name, icon, note }) {
  const brand = brandColor(icon);
  return (
    <div
      className="card group relative flex h-full items-center gap-4 overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong sm:p-5"
      style={brand ? { '--brand': brand } : undefined}
    >
      <span
        className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-500 group-hover:bg-accent/15"
        aria-hidden="true"
      />
      <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-bg-2 text-accent-text transition-colors duration-300 group-hover:text-[var(--brand,var(--accent-text))]">
        <Icon name={icon} className="size-6" strokeWidth={1.6} />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-base font-semibold text-ink sm:text-lg">{name}</span>
        {note && <span className="block text-sm text-muted">{note}</span>}
      </span>
    </div>
  );
}
