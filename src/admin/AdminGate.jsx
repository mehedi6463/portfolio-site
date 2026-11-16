import { useCallback, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { getSession, logout, SESSION_EXPIRED } from './api';
import LoginPage from './LoginPage';
import AdminApp from './AdminApp';

/**
 * Shows the login page until the server confirms a signed-in session.
 * If a session expires mid-edit, the editor stays mounted underneath the login
 * screen so unsaved changes survive signing back in.
 */
export default function AdminGate() {
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [user, setUser] = useState(null);
  const [editorMounted, setEditorMounted] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = 'Admin · Portfolio';
    getSession()
      .then((s) => {
        setConfigured(s.configured);
        if (s.authenticated) {
          setUser(s.username);
          setEditorMounted(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const onExpired = () => {
      setUser(null);
      setNotice('Your session expired. Sign in again to continue. Your unsaved changes are kept.');
    };
    window.addEventListener(SESSION_EXPIRED, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED, onExpired);
  }, []);

  const signOut = useCallback(async () => {
    await logout().catch(() => {});
    setUser(null);
    setEditorMounted(false);
    setNotice('You have been signed out.');
  }, []);

  const signedIn = (name) => {
    setUser(name);
    setConfigured(true);
    setEditorMounted(true);
    setNotice('');
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted">
        <LoaderCircle className="size-6 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <>
      {editorMounted && (
        <div inert={user ? undefined : ''} aria-hidden={user ? undefined : true}>
          <AdminApp user={user} onSignOut={signOut} />
        </div>
      )}
      {!user && (
        <div className={editorMounted ? 'fixed inset-0 z-[60] overflow-y-auto' : ''}>
          <LoginPage configured={configured} notice={notice} onSuccess={signedIn} />
        </div>
      )}
    </>
  );
}
