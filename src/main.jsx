import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

// The admin panel only exists while `npm run dev` is running. In production builds
// `import.meta.env.DEV` is false, so the admin code is dropped from the bundle entirely.
if (import.meta.env.DEV && isAdminRoute) {
  import('./admin/AdminGate').then(({ default: AdminGate }) => {
    root.render(
      <StrictMode>
        <AdminGate />
      </StrictMode>,
    );
  });
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
