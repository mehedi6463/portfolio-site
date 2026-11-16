import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CircleAlert, CircleCheck, Copy, Info, LoaderCircle, Mail, MapPin, Send } from 'lucide-react';
import { content, sectionNumber, site } from '../data/site';
import useContactForm, { buildMailto } from '../hooks/useContactForm';
import SectionHeading from '../components/SectionHeading';
import SocialLinks from '../components/SocialLinks';
import Reveal from '../components/Reveal';
import Button from '../components/Button';

function Field({ id, label, error, touched, as = 'input', className = '', ...props }) {
  const Comp = as;
  const invalid = Boolean(touched && error);
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label} <span className="text-accent-text" aria-hidden="true">*</span>
      </label>
      <Comp
        id={id}
        name={id}
        required
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-bg px-4 py-3 text-[0.95rem] text-ink transition-colors outline-none placeholder:text-muted/60 focus:border-accent-text focus:ring-4 focus:ring-accent/10 ${
          invalid ? 'border-red-400/70' : 'border-line-strong'
        } ${as === 'textarea' ? 'min-h-36 resize-y' : 'h-12'}`}
        {...props}
      />
      <AnimatePresence initial={false}>
        {invalid && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400 light:text-red-600"
          >
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusMessage({ status, values, onReset }) {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; the address is visible on the page anyway */
    }
  };

  const panels = {
    success: {
      icon: CircleCheck,
      tone: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 light:text-emerald-800',
      title: content.contact.successTitle,
      body: content.contact.successText,
    },
    error: {
      icon: CircleAlert,
      tone: 'border-red-400/40 bg-red-400/10 text-red-300 light:text-red-700',
      title: 'Your message could not be sent.',
      body: `Something went wrong on the way. Please try again, or email me directly at ${site.email}.`,
    },
    unconfigured: {
      icon: Info,
      tone: 'border-amber-400/40 bg-amber-400/10 text-amber-200 light:text-amber-800',
      title: 'Your message has not been sent.',
      body: "Online sending isn't set up on this site yet. You can send the same message from your own email app instead. It's already filled in for you.",
    },
  };
  const p = panels[status];
  if (!p) return null;
  const Icon = p.icon;

  return (
    <motion.div
      role={status === 'success' ? 'status' : 'alert'}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className={`mt-5 rounded-xl border p-4 text-sm ${p.tone}`}
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">{p.title}</p>
          <p className="mt-1 opacity-90">{p.body}</p>
          {status === 'unconfigured' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={buildMailto(values)}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold text-on-accent"
              >
                <Mail className="size-3.5" aria-hidden="true" /> Open in email app
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-current/30 px-4 text-xs font-semibold"
              >
                <Copy className="size-3.5" aria-hidden="true" /> {copied ? 'Copied!' : 'Copy email address'}
              </button>
            </div>
          )}
          {status === 'success' && (
            <button type="button" onClick={onReset} className="mt-2 text-xs font-semibold underline underline-offset-4">
              Send another message
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const { values, errors, touched, status, onChange, onBlur, onSubmit, reset } = useContactForm();
  const loading = status === 'loading';

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative overflow-hidden">
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-teal-800/40 blur-[140px] light:bg-teal-200/50"
        aria-hidden="true"
      />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            index={sectionNumber('contact')}
            eyebrow={content.contact.eyebrow}
            title={content.contact.title}
            id="contact-title"
            description={content.contact.description}
          />

          <Reveal delay={0.05} className="-mt-4 space-y-3">
            <a
              href={`mailto:${site.email}`}
              className="card group flex items-center gap-4 p-4 transition-colors hover:border-line-strong"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-on-accent">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs tracking-[0.14em] text-muted uppercase">Email</span>
                <span className="block truncate font-semibold text-ink transition-colors group-hover:text-accent-text">
                  {site.email}
                </span>
              </span>
            </a>
            <div className="card flex items-center gap-4 p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line-strong text-accent-text">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs tracking-[0.14em] text-muted uppercase">Location</span>
                <span className="block font-semibold text-ink">{site.location}</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <p className="mb-3 font-mono text-xs tracking-[0.16em] text-muted uppercase">{content.contact.socialsLabel}</p>
            <SocialLinks />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form
            noValidate
            onSubmit={onSubmit}
            className="card p-6 shadow-[var(--shadow)] sm:p-8 md:p-10"
            aria-describedby="form-note"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="name"
                label="Your name"
                autoComplete="name"
                placeholder="Jane Doe"
                value={values.name}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.name}
                touched={touched.name}
              />
              <Field
                id="email"
                type="email"
                label="Email address"
                autoComplete="email"
                inputMode="email"
                placeholder="jane@company.com"
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.email}
                touched={touched.email}
              />
              <Field
                id="subject"
                label="Subject"
                placeholder="Project enquiry"
                className="sm:col-span-2"
                value={values.subject}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.subject}
                touched={touched.subject}
              />
              <Field
                id="message"
                as="textarea"
                label="Message"
                placeholder="Tell me a little about your project, timeline and goals…"
                className="sm:col-span-2"
                rows={6}
                maxLength={3000}
                value={values.message}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.message}
                touched={touched.message}
              />
              {/* Honeypot: hidden from people, catches simple bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={onChange} />
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p id="form-note" className="text-xs text-muted">
                Fields marked <span className="text-accent-text">*</span> are required.
              </p>
              <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto" aria-busy={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {content.contact.buttonLabel} <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                )}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <StatusMessage key={status} status={status} values={values} onReset={reset} />
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
