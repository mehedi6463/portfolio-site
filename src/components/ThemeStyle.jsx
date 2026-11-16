import { content } from '../data/site';

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FALLBACK = {
  dark: { bg: '#061a23', bg2: '#092635', surface: '#0b2a38', ink: '#eaf4f1', muted: '#93b2aa', accent: '#9ec8b9', accent2: '#5c8374' },
  light: { bg: '#f3f8f6', bg2: '#e8f1ed', surface: '#ffffff', ink: '#092635', muted: '#476660', accent: '#1b4242', accent2: '#5c8374' },
};

/** Only accept real hex colours so nothing else can be injected into the stylesheet. */
const clean = (palette = {}, mode) =>
  Object.fromEntries(Object.entries(FALLBACK[mode]).map(([k, v]) => [k, HEX.test(palette[k]) ? palette[k] : v]));

export function buildThemeCss(theme = {}) {
  const d = clean(theme.dark, 'dark');
  const l = clean(theme.light, 'light');
  return `
:root{--p-950:${d.bg2};--p-800:color-mix(in srgb,${d.accent2} 35%,${d.bg2});--p-500:${d.accent2};--p-200:${d.accent};}
:root,[data-theme='dark']{--bg:${d.bg};--bg-2:${d.bg2};--surface:${d.surface};--surface-2:color-mix(in srgb,${d.surface} 88%,${d.accent});--line:color-mix(in srgb,${d.accent} 11%,transparent);--line-strong:color-mix(in srgb,${d.accent} 22%,transparent);--ink:${d.ink};--muted:${d.muted};--accent:${d.accent};--accent-text:${d.accent};--accent-2:${d.accent2};--deep:var(--p-800);--on-accent:${d.bg2};--glow:color-mix(in srgb,${d.accent} 16%,transparent);}
[data-theme='light']{--bg:${l.bg};--bg-2:${l.bg2};--surface:${l.surface};--surface-2:color-mix(in srgb,${l.surface} 94%,${l.accent2});--line:color-mix(in srgb,${l.ink} 9%,transparent);--line-strong:color-mix(in srgb,${l.ink} 18%,transparent);--ink:${l.ink};--muted:${l.muted};--accent:${l.accent};--accent-text:color-mix(in srgb,${l.accent2} 55%,${l.ink});--accent-2:${l.accent2};--deep:${l.accent};--on-accent:${l.bg};--glow:color-mix(in srgb,${l.accent2} 18%,transparent);}
`;
}

/** Injects the palette chosen in the admin panel. */
export default function ThemeStyle() {
  return <style>{buildThemeCss(content.theme)}</style>;
}
