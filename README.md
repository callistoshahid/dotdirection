# Dot Direction Website (Node.js + Express + EJS)

A dynamic conversion of the static Dot Direction photography website into a Node.js application.

## Tech Stack

- **Node.js** + **Express** — server & routing
- **EJS** — server-side templating
- **Hostinger MySQL** — persistent storage for leads, bookings, applications and blogs
- **express-session** — admin authentication session
- **Multer** — file uploads (photographer's Government ID)
- **Tailwind CSS (CDN)** — styling
- **Slick Carousel** + **Lucide Icons** — UI

## Project Structure

```
dot-direction-website/
├── server.js              # Express app, routes, API endpoints
├── package.json           # Dependencies & scripts
├── data/
│   ├── siteData.js        # Centralized dynamic content (edit here to update site)
├── views/
│   ├── index.ejs          # Homepage template
│   ├── join-as-photographer.ejs  # Talent application form
│   ├── 404.ejs
│   ├── error.ejs
│   ├── admin/             # Login-protected admin dashboard, leads and blogs
│   ├── blogs/             # Public blog listing/detail pages
│   └── partials/          # Reusable partials (head, navbar, footer, social icons)
├── public/                # Static assets (images, uploads)
│   └── uploads/           # Uploaded Gov IDs (auto-created)
└── .gitignore
```

## Getting Started (Locally)

```bash
npm install
npm start        # or: npm run dev (with nodemon)
```

Open http://localhost:3000

## Admin Dashboard

Admin is protected by an ID/password login:

```text
URL: http://localhost:3000/admin/login
Default ID: admin
Default Password: admin123
```

For production, set environment variables instead of using defaults:

```bash
ADMIN_ID=your_admin_id ADMIN_PASSWORD=your_strong_password SESSION_SECRET=your_long_random_secret npm start
```

Admin features:

- Dashboard overview: leads, bookings, applications and blogs
- View/manage popup leads (mark contacted/new, delete)
- View booking requests
- View photographer applications and uploaded Gov ID files
- Create/edit/delete blogs
- Save blogs as Draft or Published
- Upload blog content images through CKEditor (stored in `public/uploads/blogs/`)

## Making the Site Dynamic

All content has been extracted from the static HTML into **`data/siteData.js`**. To update any part of the site, edit that single file:

- `site` — logo, phone, promo code, URLs
- `services` — service category cards (Personal & Business tabs)
- `heroSlides` / `fullscreenSlides` — image sliders
- `testimonials` — reviews
- `pricingPlans` — B2C & B2B pricing tiers
- `processSteps` — "How it works" phases
- `footerLinks` — all footer/SEO links
- `availabilityServices` — booking dropdown options

### JSON API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | All service categories |
| GET | `/api/services/:tab` | Filter by `personal` or `business` |
| GET | `/api/testimonials` | All reviews |
| GET | `/api/pricing` | Pricing plans |
| GET | `/api/gallery` | Gallery image URLs |
| GET | `/api/bookings` | Submitted bookings (admin) |
| GET | `/api/applications` | Submitted photographer applications (admin) |
| GET | `/api/leads` | Popup lead submissions |
| POST | `/api/book` | Submit a booking request |
| POST | `/api/lead` | Submit quick popup lead (name + phone) |
| POST | `/api/apply` | Submit photographer application (multipart, file upload) |

## Form Handling

- **Popup lead form** (homepage) → `POST /api/lead` — stores name + phone in SQLite.
- **Booking form** (homepage) → `POST /api/book` — stores booking + opens WhatsApp redirect.
- **Photographer application** → `POST /api/apply` — multipart form with Gov ID upload via Multer.

All submissions are stored in **Hostinger MySQL**. Tables are auto-created on first app startup.

Set these environment variables in Hostinger before starting the app:

```bash
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=u430066163_dotdirection
MYSQL_USER=u430066163_dotdirection
MYSQL_PASSWORD=your_database_password
```

## Blogs

- Public blog list: `/blogs`
- Public blog detail: `/blogs/:slug`
- Admin blog manager: `/admin/blogs`

Only blogs marked **Published** appear publicly. Drafts remain visible only in admin.

## SEO Location Pages

The footer location links point to SEO-focused city landing pages:

- `/locations/photographers-in-mumbai`
- `/locations/photographers-in-delhi-ncr`
- `/locations/photographers-in-bangalore`
- `/locations/photographers-in-pune`
- `/locations/photographers-in-chennai`
- `/locations/videographers-in-hyderabad`

Location content is managed in `data/siteData.js` under the `locations` array. Each page includes local service copy, covered areas, FAQs and LocalBusiness schema markup.

## SEO Files

The app serves:

- `/robots.txt`
- `/sitemap.xml`

The sitemap includes the homepage, join page, blogs listing, all location pages and published blog posts. Set the production domain with:

```bash
SITE_URL=https://dotdirections.com npm start
```

### Blog Images

The admin blog editor uses CKEditor and supports direct image uploads inside blog content. Uploaded images are saved to:

```text
public/uploads/blogs/
```

This folder is gitignored because uploaded files are runtime content. On Hostinger, make sure `public/uploads/` is writable and included in backups.

## Deploying to Hostinger (Node.js VPS/Cloud Plan)

EJS is fully supported on Hostinger Node.js hosting — it's a standard npm package.

1. Upload all files (excluding `node_modules` and `public/uploads`) to your VPS.
2. On the server:
   ```bash
   npm install --production
   npm start
   ```
3. Ensure your Node.js app's entry point is `server.js` and start command is `npm start`.
4. (Recommended) Use a process manager so the app stays alive:
   ```bash
   npm install -g pm2
   pm2 start server.js --name dot-direction
   pm2 save
   pm2 startup
   ```
5. Reverse-proxy port 3000 through Apache/Nginx (Hostinger hPanel → VPS) or configure the app port to match.

### Environment Variable

The app reads `PORT` from the environment; defaults to `3000`:

```bash
PORT=8080 npm start
```
