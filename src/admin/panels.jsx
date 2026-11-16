import { ArrowDown, ArrowUp, Eye, EyeOff } from 'lucide-react';
import {
  ColorInput,
  FileInput,
  Group,
  IconPicker,
  ImageInput,
  ObjectList,
  Row,
  Select,
  StringList,
  Text,
  TextArea,
  Toggle,
} from './fields';
import { getIn, move, uniqueId } from './utils';

/** Small helper: `b(['site','name'])` → { value, onChange } for a field at that path. */
const binder = (c, set) => (path) => ({ value: getIn(c, path), onChange: (v) => set(path, v) });

function SectionHeader({ b, base, withDescription = true }) {
  return (
    <Group title="Section heading" description="The small label, title and intro shown at the top of this section.">
      <Row>
        <Text label="Eyebrow label" {...b([base, 'eyebrow'])} />
        <Text label="Title" {...b([base, 'title'])} />
      </Row>
      {withDescription && <TextArea label="Intro text" {...b([base, 'description'])} />}
    </Group>
  );
}

/* ------------------------------------------------------------------ */

export function GeneralPanel({ c, set }) {
  const b = binder(c, set);
  return (
    <>
      <Group title="Identity" description="Used in the navigation, hero, footer and throughout the site.">
        <Row>
          <Text label="Full name" {...b(['site', 'name'])} />
          <Text label="Professional title" {...b(['site', 'role'])} />
        </Row>
        <Row>
          <Text label="Logo text" hint="Shown in the top-left of the navigation." {...b(['site', 'logo'])} />
          <Text label="Logo mark" hint="1–2 characters inside the square badge." maxLength={2} {...b(['site', 'logoMark'])} />
        </Row>
        <Text label="Experience" hint='e.g. "5–6 years"' {...b(['site', 'experience'])} />
      </Group>

      <Group title="Contact details">
        <Row>
          <Text label="Email address" type="email" {...b(['site', 'email'])} />
          <Text label="Location" {...b(['site', 'location'])} />
        </Row>
      </Group>

      <Group title="Availability badge" description="The status pill above your name in the hero.">
        <Toggle label="Available for work" hint="Green dot when on, amber when off." checked={c.site.availability.available} onChange={(v) => set(['site', 'availability', 'available'], v)} />
        <Row>
          <Text label="Text when available" {...b(['site', 'availability', 'label'])} />
          <Text label="Text when busy" {...b(['site', 'availability', 'busyLabel'])} />
        </Row>
      </Group>

      <Group title="CV / Résumé" description="Used by every Download CV / Resume button.">
        <FileInput label="CV file (PDF)" hint="Upload a PDF or paste a link." {...b(['site', 'cvUrl'])} />
        <Row>
          <Text label="Button label" {...b(['site', 'cvLabel'])} />
          <div className="pt-6">
            <Toggle label="This is still the placeholder CV" checked={c.site.cvIsPlaceholder} onChange={(v) => set(['site', 'cvIsPlaceholder'], v)} />
          </div>
        </Row>
      </Group>

      <Group title="Social links" description="Shown in the hero, contact section, footer and mobile menu.">
        <ObjectList
          items={c.site.socials}
          onChange={(v) => set(['site', 'socials'], v)}
          newItem={{ name: 'New profile', icon: 'github', href: 'https://' }}
          itemTitle={(s) => s.name}
          addLabel="Add social link"
          render={(s, f) => (
            <>
              <Row>
                <Text label="Name" value={s.name} onChange={(v) => f('name', v)} />
                <Text label="Profile URL" type="url" value={s.href} onChange={(v) => f('href', v)} />
              </Row>
              <IconPicker label="Icon" brandsOnly value={s.icon} onChange={(v) => f('icon', v)} />
            </>
          )}
        />
      </Group>
    </>
  );
}

export function SeoPanel({ c, set }) {
  const b = binder(c, set);
  return (
    <Group
      title="Search engines & social sharing"
      description="Written into the page <head> (title, description, Open Graph tags) when the site is built."
    >
      <Text label="Page title" hint={`${(c.seo.title || '').length} characters. Aim for 50–60.`} {...b(['seo', 'title'])} />
      <TextArea label="Meta description" hint={`${(c.seo.description || '').length} characters. Aim for 140–160.`} {...b(['seo', 'description'])} />
      <Text label="Website URL" hint="Your live domain, e.g. https://mehedihasan.dev/" type="url" {...b(['seo', 'siteUrl'])} />
    </Group>
  );
}

const PALETTE_FIELDS = [
  ['bg', 'Page background'],
  ['bg2', 'Alternate section background'],
  ['surface', 'Cards'],
  ['ink', 'Main text'],
  ['muted', 'Secondary text'],
  ['accent', 'Accent (buttons, highlights)'],
  ['accent2', 'Secondary accent'],
];

const DEFAULT_THEME = {
  dark: { bg: '#061a23', bg2: '#092635', surface: '#0b2a38', ink: '#eaf4f1', muted: '#93b2aa', accent: '#9ec8b9', accent2: '#5c8374' },
  light: { bg: '#f3f8f6', bg2: '#e8f1ed', surface: '#ffffff', ink: '#092635', muted: '#476660', accent: '#1b4242', accent2: '#5c8374' },
};

export function DesignPanel({ c, set }) {
  const swatch = (mode) => (
    <div className="flex overflow-hidden rounded-lg border border-line-strong">
      {PALETTE_FIELDS.map(([k]) => (
        <span key={k} className="h-8 flex-1" style={{ background: c.theme[mode][k] }} title={k} />
      ))}
    </div>
  );
  return (
    <>
      <Group title="Default theme" description="What first-time visitors see. Visitors can still switch with the sun/moon button.">
        <Select
          label="Default mode"
          value={c.theme.defaultMode}
          onChange={(v) => set(['theme', 'defaultMode'], v)}
          options={[
            { value: 'dark', label: 'Dark' },
            { value: 'light', label: 'Light' },
            { value: 'system', label: 'Follow the visitor’s device setting' },
          ]}
        />
      </Group>
      {['dark', 'light'].map((mode) => (
        <Group
          key={mode}
          title={mode === 'dark' ? 'Dark theme colours' : 'Light theme colours'}
          description="Borders, glows and hover tints are derived from these automatically."
          actions={
            <button
              type="button"
              onClick={() => set(['theme', mode], { ...DEFAULT_THEME[mode] })}
              className="rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink"
            >
              Reset to original
            </button>
          }
        >
          {swatch(mode)}
          <div className="grid gap-4 sm:grid-cols-2">
            {PALETTE_FIELDS.map(([k, label]) => (
              <ColorInput key={k} label={label} value={c.theme[mode][k]} onChange={(v) => set(['theme', mode, k], v)} />
            ))}
          </div>
        </Group>
      ))}
    </>
  );
}

export function LayoutPanel({ c, set }) {
  const list = c.layout;
  const update = (i, key, val) => set(['layout'], list.map((s, j) => (j === i ? { ...s, [key]: val } : s)));
  return (
    <Group
      title="Sections & navigation"
      description="Reorder sections, hide them, and rename their menu labels. The hero always stays at the top."
    >
      <ol className="space-y-2">
        {list.map((s, i) => (
          <li
            key={s.id}
            className={`flex flex-wrap items-center gap-3 rounded-xl border border-line-strong bg-bg p-3 ${s.visible ? '' : 'opacity-60'}`}
          >
            <span className="w-6 text-center font-mono text-xs text-muted">{i + 1}</span>
            <div className="min-w-40 flex-1">
              <p className="text-xs tracking-wider text-muted uppercase">{s.id}</p>
              <input
                aria-label={`Menu label for ${s.id}`}
                className="mt-0.5 w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold text-ink hover:border-line-strong focus:border-accent-text focus:outline-none"
                value={s.label}
                onChange={(e) => update(i, 'label', e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={!s.hideFromNav} onChange={(e) => update(i, 'hideFromNav', !e.target.checked)} />
              In menu
            </label>
            <button
              type="button"
              onClick={() => update(i, 'visible', !s.visible)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-xs font-semibold"
            >
              {s.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              {s.visible ? 'Visible' : 'Hidden'}
            </button>
            <div className="flex">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-md text-muted hover:bg-bg-2 hover:text-ink disabled:opacity-30"
                disabled={i === 0}
                onClick={() => set(['layout'], move(list, i, i - 1))}
                aria-label={`Move ${s.id} up`}
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-md text-muted hover:bg-bg-2 hover:text-ink disabled:opacity-30"
                disabled={i === list.length - 1}
                onClick={() => set(['layout'], move(list, i, i + 1))}
                aria-label={`Move ${s.id} down`}
              >
                <ArrowDown className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ol>
    </Group>
  );
}

/* ------------------------------------------------------------------ */

export function HeroPanel({ c, set }) {
  const b = binder(c, set);
  const h = c.hero;
  return (
    <>
      <Group title="Headline">
        <Row>
          <Text label="Greeting" hint="Your name is added after it automatically." {...b(['hero', 'greeting'])} />
          <div className="pt-6">
            <Toggle label="Show waving hand 👋" checked={h.showWave} onChange={(v) => set(['hero', 'showWave'], v)} />
          </div>
        </Row>
        <Row>
          <Text label="Headline (white part)" {...b(['hero', 'headline'])} />
          <Text label="Headline (highlighted part)" {...b(['hero', 'highlight'])} />
        </Row>
        <TextArea label="Supporting text" rows={3} {...b(['hero', 'text'])} />
      </Group>

      <Group title="Buttons" description="Leave a label empty to hide that button.">
        <div className="grid gap-5 sm:grid-cols-3">
          <Text label="Work button" {...b(['hero', 'primaryLabel'])} />
          <Text label="Resume button" {...b(['hero', 'resumeLabel'])} />
          <Text label="Contact button" {...b(['hero', 'contactLabel'])} />
        </div>
        <Text label="Scroll hint" {...b(['hero', 'scrollLabel'])} />
      </Group>

      <Group title="Portrait">
        <ImageInput label="Photo" hint="Works best as a cut-out (transparent background) PNG or WebP." preview="contain" maxWidth={1000} {...b(['hero', 'image'])} />
        <Text label="Image description (alt text)" {...b(['hero', 'imageAlt'])} />
      </Group>

      <Group title="Floating tech chips" description="Up to 5 small badges around the portrait. Positions in list order: right-upper, right-middle, left-upper, top-left, top-right.">
        <ObjectList
          items={h.chips}
          onChange={(v) => set(['hero', 'chips'], v)}
          newItem={{ icon: 'javascript', label: 'JavaScript' }}
          itemTitle={(x) => x.label}
          addLabel="Add chip"
          render={(x, f) => (
            <Row>
              <Text label="Label" value={x.label} onChange={(v) => f('label', v)} />
              <IconPicker value={x.icon} onChange={(v) => f('icon', v)} />
            </Row>
          )}
        />
      </Group>

      <Group title="Code card">
        <Toggle label="Show the code card" checked={h.codeCard.show} onChange={(v) => set(['hero', 'codeCard', 'show'], v)} />
        <Row>
          <Text label="File name" {...b(['hero', 'codeCard', 'filename'])} />
          <Text label="Variable name" {...b(['hero', 'codeCard', 'variable'])} />
        </Row>
        <ObjectList
          label="Lines"
          items={h.codeCard.entries}
          onChange={(v) => set(['hero', 'codeCard', 'entries'], v)}
          newItem={{ key: 'key', value: "'value'" }}
          itemTitle={(x) => `${x.key}: ${x.value}`}
          addLabel="Add line"
          render={(x, f) => (
            <Row>
              <Text label="Key" value={x.key} onChange={(v) => f('key', v)} />
              <Text label="Value" hint="Include quotes for text, e.g. 'React'" value={x.value} onChange={(v) => f('value', v)} />
            </Row>
          )}
        />
      </Group>

      <Group title="Scrolling tech strip">
        <Toggle label="Show the scrolling strip" checked={h.showMarquee} onChange={(v) => set(['hero', 'showMarquee'], v)} />
        <StringList value={h.marquee} onChange={(v) => set(['hero', 'marquee'], v)} addLabel="Add word" />
      </Group>
    </>
  );
}

export function AboutPanel({ c, set }) {
  const b = binder(c, set);
  const a = c.about;
  return (
    <>
      <SectionHeader b={b} base="about" withDescription={false} />
      <Group title="Text">
        <StringList
          label="Paragraphs"
          multiline
          value={a.paragraphs}
          onChange={(v) => set(['about', 'paragraphs'], v)}
          addLabel="Add paragraph"
          hint="Wrap words in **double asterisks** to make them bold."
        />
      </Group>
      <Group title="Photo">
        <ImageInput label="Photo" maxWidth={1200} {...b(['about', 'image'])} hint="Remove the photo to make the text full-width." />
        <Row>
          <Text label="Image description (alt text)" {...b(['about', 'imageAlt'])} />
          <Text label="Caption on the photo" hint="Leave empty to hide." {...b(['about', 'caption'])} />
        </Row>
      </Group>
      <Group title="Signature card">
        <Toggle label="Show signature card" checked={a.showSignature} onChange={(v) => set(['about', 'showSignature'], v)} />
        <ImageInput
          label="Signature image"
          hint="A transparent PNG works best. It is re-coloured to match the theme."
          preview="contain"
          maxWidth={600}
          {...b(['about', 'signature'])}
        />
        <Text label="Label above signature" {...b(['about', 'signatureLabel'])} />
      </Group>
      <Group title="Quick facts" description="The 4-column info strip under the text.">
        <ObjectList
          items={a.facts}
          onChange={(v) => set(['about', 'facts'], v)}
          newItem={{ label: 'Label', value: 'Value', placeholder: false }}
          itemTitle={(x) => `${x.label}: ${x.value}`}
          addLabel="Add fact"
          render={(x, f) => (
            <>
              <Row>
                <Text label="Label" value={x.label} onChange={(v) => f('label', v)} />
                <Text label="Value" value={x.value} onChange={(v) => f('value', v)} />
              </Row>
              <Toggle label="Show as placeholder (greyed italic)" checked={x.placeholder} onChange={(v) => f('placeholder', v)} />
            </>
          )}
        />
      </Group>
      <Group title="Highlight cards">
        <ObjectList
          items={a.pillars}
          onChange={(v) => set(['about', 'pillars'], v)}
          newItem={{ icon: 'Sparkles', title: 'New highlight', text: '' }}
          itemTitle={(x) => x.title}
          addLabel="Add card"
          render={(x, f) => (
            <>
              <Row>
                <Text label="Title" value={x.title} onChange={(v) => f('title', v)} />
                <IconPicker value={x.icon} onChange={(v) => f('icon', v)} />
              </Row>
              <TextArea label="Text" value={x.text} onChange={(v) => f('text', v)} />
            </>
          )}
        />
      </Group>
    </>
  );
}

export function SkillsPanel({ c, set }) {
  const b = binder(c, set);
  return (
    <>
      <SectionHeader b={b} base="skills" />
      <Group
        title="Skill groups"
        description="Each group is a row with its own skills. Brand logos (WordPress, Wix, Shopify, Webflow, Elementor…) are in the icon picker."
      >
        <ObjectList
          items={c.skills.groups}
          onChange={(v) => set(['skills', 'groups'], v)}
          newItem={{ title: 'New group', caption: '', skills: [] }}
          itemTitle={(g) => `${g.title} (${g.skills.length})`}
          addLabel="Add group"
          render={(g, f) => (
            <>
              <Row>
                <Text label="Group title" value={g.title} onChange={(v) => f('title', v)} />
                <Text label="Caption" value={g.caption} onChange={(v) => f('caption', v)} />
              </Row>
              <ObjectList
                label="Skills"
                items={g.skills}
                onChange={(v) => f('skills', v)}
                newItem={{ name: 'New skill', icon: 'Sparkles', note: '' }}
                itemTitle={(s) => s.name}
                addLabel="Add skill"
                render={(s, sf) => (
                  <>
                    <Row>
                      <Text label="Name" value={s.name} onChange={(v) => sf('name', v)} />
                      <Text label="Short note" value={s.note} onChange={(v) => sf('note', v)} />
                    </Row>
                    <IconPicker value={s.icon} onChange={(v) => sf('icon', v)} />
                  </>
                )}
              />
            </>
          )}
        />
      </Group>
    </>
  );
}

export function ExperiencePanel({ c, set }) {
  const b = binder(c, set);
  return (
    <>
      <SectionHeader b={b} base="experience" withDescription={false} />
      <Group title="Summary badge" description="The card next to the title. Leave the title empty to hide it.">
        <Row>
          <Text label="Badge title" {...b(['experience', 'badgeTitle'])} />
          <Text label="Badge text" {...b(['experience', 'badgeText'])} />
        </Row>
      </Group>
      <Group title="Timeline" description="Newest role first.">
        <ObjectList
          items={c.experience.items}
          onChange={(v) => set(['experience', 'items'], v)}
          newItem={{
            role: 'Frontend Developer',
            company: 'Company Name',
            period: 'Month Year — Present',
            location: 'City / Remote',
            placeholder: false,
            summary: '',
            responsibilities: [],
            projects: [],
            achievements: [],
            stack: [],
          }}
          itemTitle={(x) => `${x.role} · ${x.company}`}
          addLabel="Add role"
          render={(x, f) => (
            <>
              <Row>
                <Text label="Job title" value={x.role} onChange={(v) => f('role', v)} />
                <Text label="Company" value={x.company} onChange={(v) => f('company', v)} />
              </Row>
              <Row>
                <Text label="Period" value={x.period} onChange={(v) => f('period', v)} />
                <Text label="Location" value={x.location} onChange={(v) => f('location', v)} />
              </Row>
              <TextArea label="Summary" value={x.summary} onChange={(v) => f('summary', v)} />
              <StringList label="Responsibilities" value={x.responsibilities} onChange={(v) => f('responsibilities', v)} />
              <Row>
                <StringList label="Key projects" value={x.projects} onChange={(v) => f('projects', v)} />
                <StringList label="Achievements" value={x.achievements} onChange={(v) => f('achievements', v)} />
              </Row>
              <StringList label="Technologies" value={x.stack} onChange={(v) => f('stack', v)} addLabel="Add technology" />
              <Toggle label="Mark as placeholder" hint="Shows an orange PLACEHOLDER tag on the card." checked={x.placeholder} onChange={(v) => f('placeholder', v)} />
            </>
          )}
        />
      </Group>
    </>
  );
}

const LAYOUTS = ['business', 'corporate', 'portfolio', 'ecommerce', 'dashboard', 'landing'];

export function ProjectsPanel({ c, set }) {
  const b = binder(c, set);
  const cats = c.projects.categories;
  return (
    <>
      <SectionHeader b={b} base="projects" />
      <Group title="Filter categories" description="Only categories that have at least one project appear as filter buttons.">
        <StringList value={cats} onChange={(v) => set(['projects', 'categories'], v)} addLabel="Add category" />
      </Group>
      <Group title="Projects">
        <ObjectList
          items={c.projects.items}
          onChange={(v) => set(['projects', 'items'], v)}
          onAdd={(items) => ({
            id: uniqueId('project', items.map((p) => p.id)),
            title: 'New project',
            category: cats[0] || '',
            layout: 'business',
            description: '',
            tech: [],
            image: '',
            liveUrl: '',
            githubUrl: '',
            placeholder: false,
          })}
          itemTitle={(p) => `${p.title}${p.placeholder ? ' (sample)' : ''}`}
          addLabel="Add project"
          render={(p, f) => (
            <>
              <Row>
                <Text label="Title" value={p.title} onChange={(v) => f('title', v)} />
                <Select label="Category" value={p.category} onChange={(v) => f('category', v)} options={cats.length ? cats : ['']} />
              </Row>
              <TextArea label="Short description" value={p.description} onChange={(v) => f('description', v)} />
              <StringList label="Technologies" value={p.tech} onChange={(v) => f('tech', v)} addLabel="Add technology" />
              <ImageInput label="Screenshot" maxWidth={1400} hint="Optional. Without a screenshot a drawn mock-up is shown." value={p.image} onChange={(v) => f('image', v)} />
              <Select
                label="Mock-up style (used when there is no screenshot)"
                value={p.layout}
                onChange={(v) => f('layout', v)}
                options={LAYOUTS}
              />
              <Row>
                <Text label="Live demo URL" type="url" hint="Leave empty to grey out the button." value={p.liveUrl} onChange={(v) => f('liveUrl', v)} />
                <Text label="GitHub URL" type="url" hint="Leave empty to grey out the button." value={p.githubUrl} onChange={(v) => f('githubUrl', v)} />
              </Row>
              <Toggle label="Mark as sample" hint="Shows a SAMPLE tag on the card." checked={p.placeholder} onChange={(v) => f('placeholder', v)} />
            </>
          )}
        />
      </Group>
    </>
  );
}

function CardsPanel({ c, set, base, listKey, noun }) {
  const b = binder(c, set);
  return (
    <>
      <SectionHeader b={b} base={base} />
      <Group title={`${noun}s`}>
        <ObjectList
          items={c[base][listKey]}
          onChange={(v) => set([base, listKey], v)}
          newItem={{ title: `New ${noun.toLowerCase()}`, icon: 'Sparkles', description: '' }}
          itemTitle={(x) => x.title}
          addLabel={`Add ${noun.toLowerCase()}`}
          render={(x, f) => (
            <>
              <Row>
                <Text label="Title" value={x.title} onChange={(v) => f('title', v)} />
                <IconPicker value={x.icon} onChange={(v) => f('icon', v)} />
              </Row>
              <TextArea label="Description" value={x.description} onChange={(v) => f('description', v)} />
            </>
          )}
        />
      </Group>
    </>
  );
}

export const ServicesPanel = (p) => <CardsPanel {...p} base="services" listKey="items" noun="Service" />;
export const ProcessPanel = (p) => <CardsPanel {...p} base="process" listKey="steps" noun="Step" />;

export function ContactPanel({ c, set }) {
  const b = binder(c, set);
  return (
    <>
      <SectionHeader b={b} base="contact" />
      <Group title="Form & labels" description="Your email and location are edited under General.">
        <Row>
          <Text label="Send button label" {...b(['contact', 'buttonLabel'])} />
          <Text label="Label above social links" {...b(['contact', 'socialsLabel'])} />
        </Row>
        <Row>
          <Text label="Success title" {...b(['contact', 'successTitle'])} />
          <Text label="Success text" {...b(['contact', 'successText'])} />
        </Row>
        <p className="rounded-lg bg-bg-2 p-3 text-xs text-muted">
          To deliver messages, set <code className="font-mono text-ink">VITE_CONTACT_ENDPOINT</code> in a{' '}
          <code className="font-mono text-ink">.env</code> file (for example a Formspree form URL). Until then the form
          tells visitors their message was not sent and offers their email app instead.
        </p>
      </Group>
    </>
  );
}

export function FooterPanel({ c, set }) {
  const b = binder(c, set);
  return (
    <Group title="Footer">
      <Text label="Brand text" {...b(['footer', 'brand'])} />
      <TextArea label="Short description" {...b(['footer', 'description'])} />
      <Text label="Copyright text" hint="Shown after “© year Your Name.”" {...b(['footer', 'copyright'])} />
    </Group>
  );
}
