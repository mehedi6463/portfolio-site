import { useCallback, useEffect, useState } from 'react';

const getInitial = () => {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') || 'dark';
};

/** Dark/light theme stored on <html data-theme> and persisted to localStorage. */
export default function useTheme() {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#061A23' : '#F3F8F6');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable — theme still works for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}
