import { useId, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ImagePlus,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import Icon, { brandIconNames, lucideIconNames } from '../components/icons/Icon';
import { uploadFile } from './api';
import { move } from './utils';

export const inputCls =
  'w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-accent-text focus:ring-2 focus:ring-accent/15';

const iconBtn =
  'grid size-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-bg-2 hover:text-ink disabled:pointer-events-none disabled:opacity-30';

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

export function Group({ title, description, children, actions }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      {(title || actions) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-lg font-semibold">{title}</h3>}
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export const Row = ({ children }) => <div className="grid gap-5 sm:grid-cols-2">{children}</div>;

function FieldShell({ id, label, hint, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Basic inputs                                                       */
/* ------------------------------------------------------------------ */

export function Text({ label, hint, value, onChange, className, ...props }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <input id={id} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...props} />
    </FieldShell>
  );
}

export function TextArea({ label, hint, value, onChange, rows = 3, className, ...props }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <textarea
        id={id}
        rows={rows}
        className={`${inputCls} resize-y leading-relaxed`}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </FieldShell>
  );
}

export function Toggle({ label, hint, checked, onChange }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-line-strong'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );
}

export function Select({ label, hint, value, onChange, options, className }) {
  const id = useId();
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <select id={id} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function ColorInput({ label, value, onChange }) {
  const id = useId();
  const valid = /^#[0-9a-f]{6}$/i.test(value || '');
  return (
    <FieldShell id={id} label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} colour picker`}
          value={valid ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-line-strong bg-bg p-1"
        />
        <input
          id={id}
          className={`${inputCls} font-mono ${valid ? '' : 'border-red-400/70'}`}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value.trim())}
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </FieldShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Uploads                                                            */
/* ------------------------------------------------------------------ */

function useUploader(onDone, opts) {
  const [state, setState] = useState({ busy: false, error: '' });
  const upload = async (file) => {
    if (!file) return;
    setState({ busy: true, error: '' });
    try {
      const { url } = await uploadFile(file, opts);
      onDone(url);
      setState({ busy: false, error: '' });
    } catch (err) {
      setState({ busy: false, error: err.message });
    }
  };
  return [state, upload];
}

export function ImageInput({ label, hint, value, onChange, maxWidth, preview = 'cover' }) {
  const id = useId();
  const fileRef = useRef(null);
  const [{ busy, error }, upload] = useUploader(onChange, { maxWidth });
  const [dragging, setDragging] = useState(false);

  return (
    <FieldShell id={id} label={label} hint={hint ?? 'PNG, JPG, WebP or AVIF. Converted to an optimised WebP on upload.'}>
      <div
        className={`flex flex-col gap-3 rounded-xl border border-dashed p-3 sm:flex-row sm:items-center ${
          dragging ? 'border-accent-text bg-accent/5' : 'border-line-strong'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files?.[0]);
        }}
      >
        <div className="grid h-24 w-full shrink-0 place-items-center overflow-hidden rounded-lg bg-bg-2 sm:w-32">
          {value ? (
            <img
              src={value}
              alt=""
              className={`size-full ${preview === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
            />
          ) : (
            <ImagePlus className="size-6 text-muted" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            className={`${inputCls} font-mono text-xs`}
            value={value ?? ''}
            placeholder="/uploads/image.webp or https://…"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-semibold text-on-accent disabled:opacity-60"
            >
              {busy ? <LoaderCircle className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
              {busy ? 'Uploading…' : 'Upload image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong px-3 text-xs font-semibold text-muted hover:text-ink"
              >
                <X className="size-3.5" /> Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
          className="hidden"
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
    </FieldShell>
  );
}

export function FileInput({ label, hint, value, onChange, accept = 'application/pdf' }) {
  const id = useId();
  const fileRef = useRef(null);
  const [{ busy, error }, upload] = useUploader(onChange);
  return (
    <FieldShell id={id} label={label} hint={hint}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input id={id} className={`${inputCls} font-mono text-xs`} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-on-accent disabled:opacity-60"
        >
          {busy ? <LoaderCircle className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
          {busy ? 'Uploading…' : 'Upload file'}
        </button>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-line-strong px-4 text-xs font-semibold text-muted hover:text-ink"
          >
            Open
          </a>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </FieldShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Icon picker                                                        */
/* ------------------------------------------------------------------ */

export function IconPicker({ label = 'Icon', value, onChange, brandsOnly = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filter = (list) => list.filter((n) => n.toLowerCase().includes(q));
    return [
      { title: 'Brand logos', names: filter(brandIconNames) },
      ...(brandsOnly ? [] : [{ title: 'General icons', names: filter(lucideIconNames) }]),
    ];
  }, [query, brandsOnly]);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${inputCls} flex items-center gap-2.5 text-left`}
      >
        <span className="grid size-6 place-items-center text-accent-text">
          <Icon name={value} className="size-4.5" />
        </span>
        <span className="flex-1 truncate">{value || 'Choose an icon'}</span>
        <ChevronDown className={`size-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-line-strong bg-bg p-3">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              className={`${inputCls} pl-9`}
              placeholder="Search icons (e.g. wordpress, rocket)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {groups.map(
              (g) =>
                g.names.length > 0 && (
                  <div key={g.title}>
                    <p className="mb-1.5 text-[0.7rem] font-semibold tracking-wider text-muted uppercase">{g.title}</p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-1.5">
                      {g.names.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => {
                            onChange(n);
                            setOpen(false);
                          }}
                          title={n}
                          className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-[0.65rem] transition-colors ${
                            n === value
                              ? 'border-accent-text bg-accent/10 text-ink'
                              : 'border-transparent text-muted hover:border-line-strong hover:text-ink'
                          }`}
                        >
                          <Icon name={n} className="size-5" />
                          <span className="w-full truncate text-center">{n}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lists                                                              */
/* ------------------------------------------------------------------ */

/** Editable list of strings (tags, bullet points, paragraphs). */
export function StringList({ label, hint, value = [], onChange, placeholder = 'New item', multiline = false, addLabel = 'Add' }) {
  const update = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <ul className="space-y-2">
        {value.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5">
            {multiline ? (
              <textarea
                aria-label={`${label || 'Item'} ${i + 1}`}
                rows={3}
                className={`${inputCls} resize-y leading-relaxed`}
                value={item}
                onChange={(e) => update(i, e.target.value)}
              />
            ) : (
              <input
                aria-label={`${label || 'Item'} ${i + 1}`}
                className={inputCls}
                placeholder={placeholder}
                value={item}
                onChange={(e) => update(i, e.target.value)}
              />
            )}
            <div className={`flex shrink-0 ${multiline ? 'flex-col' : ''}`}>
              <button type="button" className={iconBtn} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} aria-label="Move up">
                <ChevronUp className="size-4" />
              </button>
              <button
                type="button"
                className={iconBtn}
                disabled={i === value.length - 1}
                onClick={() => onChange(move(value, i, i + 1))}
                aria-label="Move down"
              >
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                className={`${iconBtn} hover:text-red-400`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                aria-label="Remove"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...value, ''])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-3 py-1.5 text-xs font-semibold text-muted hover:border-accent-text hover:text-accent-text"
      >
        <Plus className="size-3.5" /> {addLabel}
      </button>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

/**
 * Editable list of objects with collapsible cards.
 * `render(item, setField, index)` returns the fields for one item.
 */
export function ObjectList({ label, hint, items = [], onChange, newItem, itemTitle, render, addLabel = 'Add item', onAdd }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (i) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const setField = (i) => (key, val) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: val } : it)));

  const add = () => {
    const item = onAdd ? onAdd(items) : typeof newItem === 'function' ? newItem(items) : structuredClone(newItem);
    onChange([...items, item]);
    setOpen((s) => new Set(s).add(items.length));
  };

  const remove = (i) => {
    if (!window.confirm(`Remove “${itemTitle(items[i], i)}”?`)) return;
    onChange(items.filter((_, j) => j !== i));
    setOpen(new Set());
  };

  const duplicate = (i) => {
    const copy = structuredClone(items[i]);
    if ('id' in copy && onAdd) copy.id = onAdd(items).id;
    const next = [...items];
    next.splice(i + 1, 0, copy);
    onChange(next);
    setOpen(new Set());
  };

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-ink">{label}</span>
          <span className="text-xs text-muted">{items.length} item{items.length === 1 ? '' : 's'}</span>
        </div>
      )}
      <ul className="space-y-2">
        {items.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <li key={i} className="rounded-xl border border-line-strong bg-bg">
              <div className="flex items-center gap-1 py-1 pr-1 pl-3">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-sm font-medium"
                >
                  <ChevronDown className={`size-4 shrink-0 text-muted transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                  <span className="truncate">{itemTitle(item, i) || `Item ${i + 1}`}</span>
                </button>
                <button type="button" className={iconBtn} disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))} aria-label="Move up">
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  disabled={i === items.length - 1}
                  onClick={() => onChange(move(items, i, i + 1))}
                  aria-label="Move down"
                >
                  <ChevronDown className="size-4" />
                </button>
                <button type="button" className={iconBtn} onClick={() => duplicate(i)} aria-label="Duplicate">
                  <Copy className="size-4" />
                </button>
                <button type="button" className={`${iconBtn} hover:text-red-400`} onClick={() => remove(i)} aria-label="Remove">
                  <Trash2 className="size-4" />
                </button>
              </div>
              {isOpen && <div className="grid gap-4 border-t border-line p-4">{render(item, setField(i), i)}</div>}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-3 py-1.5 text-xs font-semibold text-muted hover:border-accent-text hover:text-accent-text"
      >
        <Plus className="size-3.5" /> {addLabel}
      </button>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
