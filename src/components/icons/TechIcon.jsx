import {
  siBehance,
  siBootstrap,
  siDribbble,
  siDrupal,
  siElementor,
  siFacebook,
  siFigma,
  siFiverr,
  siGit,
  siGithub,
  siHtml5,
  siInstagram,
  siJavascript,
  siJoomla,
  siJquery,
  siNetlify,
  siNextdotjs,
  siNpm,
  siReact,
  siSass,
  siShopify,
  siSquarespace,
  siTailwindcss,
  siTypescript,
  siUpwork,
  siVercel,
  siVite,
  siWebflow,
  siWhatsapp,
  siWix,
  siWoocommerce,
  siWordpress,
  siX,
  siYoutube,
} from 'simple-icons';

/* simple-icons no longer ships CSS3 or LinkedIn marks, so their paths are defined here. */
const css3 = {
  title: 'CSS3',
  hex: '1572B6',
  path: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z',
};
const linkedin = {
  title: 'LinkedIn',
  hex: '0A66C2',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.889 1.637-1.788 3.368-1.788 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

/** Brand icons by key. Keys are what content.json and the admin icon picker use. */
export const BRAND_ICONS = {
  html5: siHtml5,
  css3,
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  nextjs: siNextdotjs,
  tailwind: siTailwindcss,
  bootstrap: siBootstrap,
  sass: siSass,
  jquery: siJquery,
  vite: siVite,
  npm: siNpm,
  git: siGit,
  github: siGithub,
  figma: siFigma,
  wordpress: siWordpress,
  woocommerce: siWoocommerce,
  elementor: siElementor,
  wix: siWix,
  webflow: siWebflow,
  shopify: siShopify,
  squarespace: siSquarespace,
  joomla: siJoomla,
  drupal: siDrupal,
  netlify: siNetlify,
  vercel: siVercel,
  linkedin,
  facebook: siFacebook,
  instagram: siInstagram,
  x: siX,
  youtube: siYoutube,
  dribbble: siDribbble,
  behance: siBehance,
  whatsapp: siWhatsapp,
  upwork: siUpwork,
  fiverr: siFiverr,
};

/** Brand colours that are too dark to read on the dark theme get no hover tint. */
const DARK_BRANDS = new Set(['github', 'nextjs', 'squarespace', 'vercel', 'x']);

/** Brand colour for a tech icon (used for hover tints). */
export const brandColor = (name) =>
  BRAND_ICONS[name] && !DARK_BRANDS.has(name) ? `#${BRAND_ICONS[name].hex}` : undefined;

/** Renders an official brand mark as an inline SVG that inherits `currentColor`. */
export default function TechIcon({ name, className = 'size-6', title }) {
  const icon = BRAND_ICONS[name];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={icon.path} />
    </svg>
  );
}
