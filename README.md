# Mehedi Hasan — Portfolio

Personal portfolio built with **React 18 + Vite 6 + Tailwind CSS 4**, animated with **Motion** (`motion/react`), with **Lucide** and **simple-icons** for icons. Every piece of content is editable from a built-in admin panel.

## Commands

```bash
npm install
npm run dev       # site at http://localhost:5173, admin at http://localhost:5173/admin
npm run build     # production build → dist/
npm run preview   # serve the production build
npm run images    # re-generate the original optimised images from assets-src/
```

## Admin panel

1. Run `npm run dev`.
2. Open **http://localhost:5173/admin** and sign in.
3. Edit anything, then press **Save** (or Ctrl+S). The site in another tab updates by itself.
4. When you're happy, run `npm run build` and upload the `dist/` folder to your host.

### Login
- Create or change the login with `npm run admin:password` (random strong password), or
  `npm run admin:password -- yourname YourOwnPassword`. The new username and password are printed once.
- Only a salted scrypt hash is stored, in `admin-credentials.json` (git-ignored). The password itself is never saved.
- Sessions use an HttpOnly cookie and last 8 hours of inactivity. Restarting `npm run dev` signs you out.
- After 5 wrong attempts, sign-in is locked for 5 minutes.

| Tab | What you can change |
| --- | --- |
| General | Name, title, logo, email, location, availability badge, CV upload, social links |
| Layout & menu | Section order, show/hide sections, menu labels |
| Design | Dark and light theme colours, default theme |
| SEO | Page title, meta description, site URL (Open Graph tags) |
| Hero → Footer | Every heading, text, button label, image, list and card in that section |

How it works:
- All content lives in **`src/content/content.json`**. The admin edits that file; you can also edit it by hand.
- Every save first backs up the previous version to `src/content/.backups/` (the last 15 are kept).
- Uploaded images are converted to optimised WebP and stored in `public/uploads/`. PDFs (your CV) are stored there as-is.
- **Export JSON / Import JSON** (sidebar) download or restore a full copy of your content.
- The admin exists **only on your computer while `npm run dev` runs**. It is not part of the production build, so visitors to the live site can't reach it and it needs no password.

### Still to supply
- Email, location and social URLs (General)
- Your real CV (General → CV, then switch off "placeholder CV")
- Experience: companies, dates, responsibilities
- Projects: titles, descriptions, links, screenshots (switch off "Mark as sample")
- Your live domain (SEO → Website URL)

### Contact form
The form validates input in the browser. To actually deliver messages, create a `.env` file:

```
VITE_CONTACT_ENDPOINT=https://formspree.io/f/your-form-id
```

Any endpoint that accepts a JSON `POST` of `{ name, email, subject, message }` works. Until one is configured, the form says plainly that the message was **not** sent and offers to open the visitor's email app with the message prefilled.

## Structure

```
admin-server/      Vite plugin: admin API (dev only) + SEO tags in index.html
src/
  admin/           Admin panel UI (dev only)
  content/         content.json, the single source of site content
  components/      Navbar, Footer, Button, SectionHeading, ProjectCard, SkillCard, icons/ …
  sections/        Hero, About, Skills, Experience, Projects, Services, Process, Contact
  data/site.js     Exposes content.json to the UI
  hooks/           useTheme, useActiveSection, useScrolled, useContactForm
  index.css        Design tokens and utilities
public/
  images/          Portrait, About photo, signature
  uploads/         Files uploaded through the admin
  cv/              Placeholder CV
```
