import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Briefcase,
  Check,
  Code2,
  ExternalLink,
  FileJson,
  FolderKanban,
  Home,
  LayoutList,
  LoaderCircle,
  LogOut,
  Mail,
  Moon,
  PanelBottom,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Sun,
  SwatchBook,
  TriangleAlert,
  Upload,
  User,
  UserCog,
  Workflow,
} from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { buildThemeCss } from '../components/ThemeStyle';
import { loadContent, saveContent } from './api';
import { setIn } from './utils';
import {
  AboutPanel,
  ContactPanel,
  DesignPanel,
  ExperiencePanel,
  FooterPanel,
  GeneralPanel,
  HeroPanel,
  LayoutPanel,
  ProcessPanel,
  ProjectsPanel,
  SeoPanel,
  ServicesPanel,
  SkillsPanel,
} from './panels';

const TABS = [
  { group: 'Settings', id: 'general', label: 'General', icon: UserCog, panel: GeneralPanel, hint: 'Name, contact details, CV and social links.' },
  { group: 'Settings', id: 'layout', label: 'Layout & menu', icon: LayoutList, panel: LayoutPanel, hint: 'Order, show or hide sections.', anchor: '' },
  { group: 'Settings', id: 'design', label: 'Design', icon: SwatchBook, panel: DesignPanel, hint: 'Colours for the dark and light themes.' },
  { group: 'Settings', id: 'seo', label: 'SEO', icon: Search, panel: SeoPanel, hint: 'Title and description for Google and social sharing.' },
  { group: 'Sections', id: 'hero', label: 'Hero', icon: Home, panel: HeroPanel, anchor: 'home' },
  { group: 'Sections', id: 'about', label: 'About', icon: User, panel: AboutPanel, anchor: 'about' },
  { group: 'Sections', id: 'skills', label: 'Skills', icon: Code2, panel: SkillsPanel, anchor: 'skills' },
  { group: 'Sections', id: 'experience', label: 'Experience', icon: Briefcase, panel: ExperiencePanel, anchor: 'experience' },
  { group: 'Sections', id: 'projects', label: 'Projects', icon: FolderKanban, panel: ProjectsPanel, anchor: 'projects' },
  { group: 'Sections', id: 'services', label: 'Services', icon: Sparkles, panel: ServicesPanel, anchor: 'services' },
  { group: 'Sections', id: 'process', label: 'Process', icon: Workflow, panel: ProcessPanel, anchor: 'process' },
  { group: 'Sections', id: 'contact', label: 'Contact', icon: Mail, panel: ContactPanel, anchor: 'contact' },
  { group: 'Sections', id: 'footer', label: 'Footer', icon: PanelBottom, panel: FooterPanel },
];

const REQUIRED_KEYS = ['site', 'seo', 'theme', 'layout', 'hero', 'about', 'skills', 'experience', 'projects', 'services', 'process', 'contact', 'footer'];

const initialTab = () => {
  const t = window.location.hash.slice(1);
  return TABS.some((x) => x.id === t) ? t : 'general';
};

function Toast({ toast }) {
  if (!toast) return null;
  const tone =
    toast.type === 'error'
      ? 'border-red-400/40 bg-red-950/90 text-red-100'
      : 'border-emerald-400/40 bg-emerald-950/90 text-emerald-100';
  return (
    <div role={toast.type === 'error' ? 'alert' : 'status'} className={`fixed right-4 bottom-4 z-50 max-w-sm rounded-xl border p-4 text-sm shadow-2xl backdrop-blur ${tone}`}>
      {toast.message}
    </div>
  );
}

export default function AdminApp({ user, onSignOut }) {
  const { theme, toggle } = useTheme();
  const [saved, setSaved] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState(initialTab);
  const importRef = useRef(null);
  const toastTimer = useRef(0);

  const notify = useCallback((type, message) => {
    setToast({ type, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), type === 'error' ? 7000 : 4000);
  }, []);

  useEffect(() => {
    loadContent()
      .then((data) => {
        setSaved(data);
        setDraft(data);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', `#${tab}`);
    window.scrollTo({ top: 0 });
  }, [tab]);

  const dirty = useMemo(() => draft && saved && JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return undefined;
    const onLeave = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);

  const set = useCallback((path, value) => setDraft((d) => setIn(d, path, value)), []);

  const save = useCallback(async () => {
    if (!draft || saving) return;
    setSaving(true);
    try {
      await saveContent(draft);
      setSaved(draft);
      notify('success', 'Saved. The site updates automatically. Run “npm run build” when you’re ready to publish.');
    } catch (err) {
      notify('error', `Not saved: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [draft, saving, notify]);

  // Ctrl/Cmd + S
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  const discard = () => {
    if (window.confirm('Discard all unsaved changes?')) setDraft(saved);
  };

  const exportJson = () => {
    const blob = new Blob([`${JSON.stringify(draft, null, 2)}\n`], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const missing = REQUIRED_KEYS.filter((k) => !(k in data));
      if (missing.length) throw new Error(`missing sections: ${missing.join(', ')}`);
      setDraft(data);
      notify('success', 'Backup loaded. Review it, then press Save to apply.');
    } catch (err) {
      notify('error', `Could not import that file: ${err.message}`);
    }
  };

  if (loadError) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md rounded-2xl border border-red-400/40 bg-surface p-6">
          <TriangleAlert className="size-6 text-red-400" />
          <h1 className="mt-3 text-xl font-semibold">The admin panel could not load</h1>
          <p className="mt-2 text-sm text-muted">{loadError}</p>
          <p className="mt-2 text-sm text-muted">
            Make sure the site is running with <code className="font-mono text-ink">npm run dev</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="grid min-h-screen place-items-center text-muted">
        <LoaderCircle className="size-6 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  const current = TABS.find((t) => t.id === tab);
  const Panel = current.panel;
  const groups = [...new Set(TABS.map((t) => t.group))];

  return (
    <div className="min-h-screen bg-bg">
      {/* live colour preview of the draft palette */}
      <style>{buildThemeCss(draft.theme)}</style>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <span className="grid size-8 place-items-center rounded-lg bg-accent font-mono text-sm font-bold text-on-accent">
            {draft.site.logoMark || 'M'}
          </span>
          <div className="mr-auto min-w-0">
            <p className="truncate font-display text-base leading-tight font-semibold">Portfolio admin</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              {dirty ? (
                <>
                  <span className="size-1.5 rounded-full bg-amber-400" /> Unsaved changes
                </>
              ) : (
                <>
                  <Check className="size-3 text-emerald-400" /> All changes saved
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={toggle}
            className="grid size-9 place-items-center rounded-full border border-line-strong text-muted hover:text-ink"
            aria-label={`Switch admin to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <a
            href={`/${current.anchor ? `#${current.anchor}` : ''}`}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-muted hover:text-ink sm:inline-flex"
          >
            View site <ExternalLink className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={discard}
            disabled={!dirty}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-muted hover:text-ink disabled:opacity-40 md:inline-flex"
          >
            <RotateCcw className="size-3.5" /> Discard
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            title="Save (Ctrl+S)"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-on-accent transition-opacity disabled:opacity-45"
          >
            {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (dirty && !window.confirm('You have unsaved changes. Sign out anyway?')) return;
              onSignOut();
            }}
            title={user ? `Signed in as ${user}. Sign out` : 'Sign out'}
            aria-label="Sign out"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3 text-sm font-medium text-muted hover:text-ink"
          >
            <LogOut className="size-4" />
            <span className="hidden xl:inline">{user}</span>
          </button>
        </div>

        {/* Mobile tab strip */}
        <nav className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 lg:hidden" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                tab === t.id ? 'bg-accent text-on-accent' : 'text-muted hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-6" aria-label="Admin sections">
            {groups.map((g) => (
              <div key={g}>
                <p className="mb-2 px-3 text-[0.7rem] font-semibold tracking-[0.16em] text-muted uppercase">{g}</p>
                <ul className="space-y-0.5">
                  {TABS.filter((t) => t.group === g).map((t) => {
                    const hidden = draft.layout.find((s) => s.id === t.id)?.visible === false;
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => setTab(t.id)}
                          aria-current={tab === t.id ? 'page' : undefined}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                            tab === t.id ? 'bg-accent font-semibold text-on-accent' : 'text-muted hover:bg-surface hover:text-ink'
                          }`}
                        >
                          <t.icon className="size-4" />
                          <span className="flex-1 text-left">{t.label}</span>
                          {hidden && <span className="text-[0.65rem] opacity-70">hidden</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="space-y-1 border-t border-line pt-4">
              <p className="mb-2 px-3 text-[0.7rem] font-semibold tracking-[0.16em] text-muted uppercase">Backup</p>
              <button type="button" onClick={exportJson} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-ink">
                <FileJson className="size-4" /> Export JSON
              </button>
              <button
                type="button"
                onClick={() => importRef.current?.click()}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-ink"
              >
                <Upload className="size-4" /> Import JSON
              </button>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  importJson(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 pb-24">
          <div className="mb-6">
            <p className="font-mono text-xs tracking-[0.16em] text-accent-text uppercase">{current.group}</p>
            <h1 className="mt-1 text-3xl font-semibold">{current.label}</h1>
            {current.hint && <p className="mt-1 text-sm text-muted">{current.hint}</p>}
            {draft.layout.find((s) => s.id === tab)?.visible === false && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-500">
                <TriangleAlert className="size-3.5" /> This section is hidden on the site. Turn it on under Layout &amp; menu.
              </p>
            )}
          </div>
          <div className="grid gap-6">
            <Panel c={draft} set={set} />
          </div>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
