import { useState } from 'react';
import { site } from '../data/site';

const EMPTY = { name: '', email: '', subject: '', message: '', company: '' /* honeypot */ };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'That email address doesn’t look right.';
  if (values.subject.trim().length < 3) errors.subject = 'Please add a short subject (at least 3 characters).';
  if (values.message.trim().length < 20) errors.message = 'Please write a little more (at least 20 characters).';
  else if (values.message.length > 3000) errors.message = 'Please keep your message under 3000 characters.';
  return errors;
}

/** Builds a mailto: link prefilled with the form contents (used when no endpoint is configured). */
export const buildMailto = (v) =>
  `mailto:${site.email}?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(
    `${v.message}\n\n— ${v.name} (${v.email})`,
  )}`;

/**
 * Contact form state machine.
 * status: 'idle' | 'loading' | 'success' | 'error' | 'unconfigured'
 */
export default function useContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');

  const onChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors(validate(next));
    if (status === 'error' || status === 'unconfigured') setStatus('idle');
  };

  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(found).length) {
      // move focus to the first invalid field
      const first = ['name', 'email', 'subject', 'message'].find((k) => found[k]);
      e.currentTarget.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    if (values.company) return; // bot filled the honeypot — silently ignore

    if (!site.contactEndpoint) {
      setStatus('unconfigured');
      return;
    }

    setStatus('loading');
    try {
      const { company, ...payload } = values;
      const res = await fetch(site.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      setStatus('success');
      setValues(EMPTY);
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const reset = () => setStatus('idle');

  return { values, errors, touched, status, onChange, onBlur, onSubmit, reset };
}
