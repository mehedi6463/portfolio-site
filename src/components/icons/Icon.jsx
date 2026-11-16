import TechIcon, { BRAND_ICONS } from './TechIcon';
import LucideIcon, { LUCIDE_ICONS } from './LucideIcon';

/**
 * Universal icon: resolves a brand logo key (e.g. "react", "wordpress")
 * or a Lucide icon name (e.g. "Rocket"). Unknown names render nothing.
 */
export default function Icon({ name, className = 'size-6', strokeWidth = 1.7 }) {
  if (BRAND_ICONS[name]) return <TechIcon name={name} className={className} />;
  if (LUCIDE_ICONS[name]) return <LucideIcon name={name} className={className} strokeWidth={strokeWidth} />;
  return null;
}

export const isBrandIcon = (name) => Boolean(BRAND_ICONS[name]);
export const brandIconNames = Object.keys(BRAND_ICONS);
export const lucideIconNames = Object.keys(LUCIDE_ICONS);
