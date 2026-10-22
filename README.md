# Madiaba CBO Website (React + Admin CMS)

A dynamic React version of the Madiaba CBO website with a built-in admin dashboard.
The admin can edit every text, heading, button, color and photo on the site — no code needed.

## Tech
- **Vite + React 18** — single-page app
- **React Router** (`HashRouter`, works on plain static hosting like cPanel — no server rewrites needed)
- **Content storage** — browser `localStorage` (all texts, colors, links) + `IndexedDB` (uploaded photos)
- No backend required; edits apply instantly and persist in the browser

## Run locally
```bash
npm install
npm run dev      # dev server (edit code)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Admin dashboard
- Open the site and add `#/admin` to the address bar, or go to `/#/admin`.
- **Default password: `madiaba2024`** — change it under *Security* after signing in.
- The homepage is built as a donor journey: **Hero → Ticker → The Need → Impact Numbers → What We Do →
  Training College → Beneficiary Quotes → Call-to-Action → Donate (tiers + transparency bars) → FAQ →
  About → Contact**, so every section leads the visitor toward giving.
- Premium experience: editorial serif typography, scroll-reveal animations, animated stat counters,
  parallax hero, auto-rotating testimonial carousel, FAQ accordion, shrinking sticky header,
  scroll progress bar and a floating Donate button.
- Sections you can edit: Theme Colors, Top Bar & Brand, Navigation, Hero, The Need (Story),
  Impact Numbers, Impact Values, Services, Training College (incl. courses list), Gallery (photos +
  captions + lightbox), Beneficiary Quotes,
  Call-to-Action Band, Donate Section (tiers, badges, transparency bars, payment methods, WhatsApp link),
  FAQ, About, Footer & Contact.
- **Placeholder content to replace with real data:** impact statistics, the beneficiary quote,
  and the M-Pesa/bank details in the Donate section.
- **Photos:** upload new images from any *Image* field, or reuse existing ones from the *Image Library* tab.
- **Backup & Restore:** export everything (content + photos) as one JSON file and import it on another computer.
- **Reset to defaults** restores the original content.

### How content is stored
Everything lives in the visitor's/admin's browser:
- texts & colors → `localStorage`
- uploaded photos → `IndexedDB`
To publish edits for all visitors, either export the backup on the admin computer and import it where the site is managed, or keep one designated admin browser. A future upgrade can sync this to a cloud database for multi-device editing.

### Deploy to cPanel (static hosting)
1. Run `npm run build`.
2. Upload the contents of `dist/` into `public_html` (or your domain folder).
3. The admin is at `yourdomain.com/#/admin`.

## Project layout
- `src/content/defaults.js` — original site content (the starting point / fallback)
- `src/context/ContentContext.jsx` — CMS state, persistence, image store, export/import
- `src/components/site/` — the public site sections (all read from the CMS)
- `src/pages/admin/` — admin dashboard (login, editors, image library, backup, security)
- `public/assets/` — original supplied images (logo, workshop photo, flyers)
- `legacy/` — the previous static HTML/CSS/JS version, kept for reference

## Security note
The admin password gate is client-side only (hashed in the browser). It deters casual access but is not a substitute for server-side authentication. Do not reuse an important password.
