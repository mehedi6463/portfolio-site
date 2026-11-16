import { ArrowUp } from 'lucide-react';
import { content, navLinks, site } from '../data/site';
import SocialLinks from './SocialLinks';

export default function Footer() {
  const year = new Date().getFullYear();
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-line bg-bg-2/60">
      <div className="container-x py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-bold tracking-[0.12em]">
              {content.footer.brand}
              <span className="text-accent-text">.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-muted">{content.footer.description}</p>
            <SocialLinks className="mt-6" size="sm" />
          </div>

          <nav className="md:col-span-4" aria-label="Footer">
            <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">Quick links</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-sm text-ink/80 transition-colors hover:text-accent-text">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">Get in touch</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 block text-sm break-all text-ink/80 transition-colors hover:text-accent-text"
            >
              {site.email}
            </a>
            <p className="mt-1 text-sm text-muted">{site.location}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">
            © {year} {site.name}. {content.footer.copyright}
          </p>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex items-center gap-3 text-sm font-medium text-ink"
          >
            Back to top
            <span className="grid size-10 place-items-center rounded-full border border-line-strong transition-all group-hover:-translate-y-1 group-hover:border-accent-text group-hover:bg-accent group-hover:text-on-accent">
              <ArrowUp className="size-4" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
