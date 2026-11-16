/**
 * All site content lives in src/content/content.json and is edited through the
 * admin panel (http://localhost:5173/admin while `npm run dev` is running).
 * This module exposes it to the UI with a few derived helpers.
 */
import content from '../content/content.json';

export { content };

export const site = {
  ...content.site,
  // Contact form delivery — see README ("Contact form").
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
};

/** Sections in the order and visibility chosen in the admin "Layout" tab. */
export const visibleSections = content.layout.filter((s) => s.visible);

export const navLinks = [
  { id: 'home', label: 'Home' },
  ...visibleSections.filter((s) => !s.hideFromNav).map(({ id, label }) => ({ id, label })),
];

/** Two-digit number shown in each section's eyebrow ("01", "02" …). */
export const sectionNumber = (id) => {
  const i = visibleSections.findIndex((s) => s.id === id);
  return i === -1 ? '' : String(i + 1).padStart(2, '0');
};
