import { useState } from 'react';
import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, TriangleAlert } from 'lucide-react';
import { login } from './api';
import { inputCls } from './fields';
import content from '../content/content.json';

export default function LoginPage({ configured, onSuccess, notice }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await login(username.trim(), password);
      onSuccess(res.username);
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-bg px-4 py-10">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-teal-800/50 blur-[120px] light:bg-teal-200/60"
        aria-hidden="true"
      />

      <main className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-accent font-mono text-lg font-bold text-on-accent">
            {content.site.logoMark || 'M'}
          </span>
          <h1 className="mt-5 text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">{content.site.name} · Portfolio admin</p>
        </div>

        <form onSubmit={submit} noValidate className="card space-y-5 p-6 shadow-[var(--shadow)] sm:p-8">
          {notice && (
            <p className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-500" role="status">
              {notice}
            </p>
          )}

          {!configured && (
            <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-500" role="alert">
              <p className="flex items-center gap-1.5 font-semibold">
                <TriangleAlert className="size-3.5" /> No admin login exists yet
              </p>
              <p className="mt-1">
                Run <code className="font-mono">npm run admin:password</code> in the project folder to create one.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              className={`${inputCls} h-11`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={Boolean(error)}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                className={`${inputCls} h-11 pr-11`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-ink"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p id="login-error" role="alert" className="flex items-start gap-1.5 text-sm text-red-400 light:text-red-600">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !configured}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent font-semibold text-on-accent transition-opacity disabled:opacity-50"
          >
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
          <LockKeyhole className="size-3.5" /> Forgot it? Run <code className="font-mono text-ink">npm run admin:password</code> to set a new one.
        </p>
      </main>
    </div>
  );
}
