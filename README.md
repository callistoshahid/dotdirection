# Dot Direction Website (Node.js + Express + EJS)

A dynamic conversion of the static Dot Direction photography website into a Node.js application.

## Tech Stack

- **Node.js** + **Express** — server & routing
- **EJS** — server-side templating
- **Multer** — file uploads (photographer's Government ID)
- **Tailwind CSS (CDN)** — styling
- **Slick Carousel** + **Lucide Icons** — UI

## Project Structure

```
dot-direction-website/
├── server.js              # Express app, routes, API endpoints
├── package.json           # Dependencies & scripts
├── data/
│   └── siteData.js        # Centralized dynamic content (edit here to update site)
├── views/
│   ├── index.ejs          # Homepage template
│   ├── join-as-photographer.ejs  # Talent application form
│   ├── 404.ejs
│   ├── error.ejs
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
| POST | `/api/book` | Submit a booking request |
| POST | `/api/apply` | Submit photographer application (multipart, file upload) |

## Form Handling

- **Booking form** (homepage) → `POST /api/book` — stores booking + opens WhatsApp redirect.
- **Photographer application** → `POST /api/apply` — multipart form with Gov ID upload via Multer.

Both currently store data in an **in-memory store** (`db` object in `server.js`). To persist data, replace with MongoDB/PostgreSQL/MySQL later — the endpoints are already structured for it.

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
