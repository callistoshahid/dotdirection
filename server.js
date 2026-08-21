const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Dynamic Data Layer
// ============================================================
const siteData = require('./data/siteData');
const { services, heroSlides, galleryImages, testimonials, pricingPlans, processSteps, brandLogos, footerLinks } = siteData;

// ============================================================
// View Engine (EJS)
// ============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================
// Middleware
// ============================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets (images, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Simple file-backed data store (persists across restarts)
// ============================================================
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultDb = {
  bookings: [],
  applications: [],
  leads: []
};

let db = defaultDb;

// Load existing data if present
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    db = { ...defaultDb, ...parsed };
    console.log(`[DB] Loaded existing data (leads: ${db.leads.length}, bookings: ${db.bookings.length}, applications: ${db.applications.length})`);
  }
} catch (err) {
  console.error('[DB] Failed to load data file, starting fresh:', err.message);
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('[DB] Failed to save data:', err.message);
  }
};

// ============================================================
// Multer setup for photographer application uploads (Gov ID)
// ============================================================
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed.'));
    }
  }
});

// ============================================================
// Global locals (available in all templates)
// ============================================================
app.use((req, res, next) => {
  // Expose the entire data layer to every template
  Object.keys(siteData).forEach(key => {
    res.locals[key] = siteData[key];
  });
  res.locals.currentYear = new Date().getFullYear();
  res.locals.path = req.path;
  next();
});

// ============================================================
// Routes
// ============================================================

// Homepage
app.get('/', (req, res) => {
  res.render('index', {
    title: siteData.site.homeTitle
  });
});

// Join as Photographer (talent application) page
app.get('/join-as-photographer', (req, res) => {
  res.render('join-as-photographer', {
    title: 'Apply as Talent | Dot Directions',
    experienceOptions: siteData.experienceOptions,
    categoryOptions: siteData.categoryOptions
  });
});

// Admin dashboard: view all leads, bookings & applications
app.get('/admin/leads', (req, res) => {
  res.render('admin/leads', {
    title: 'Admin | Leads & Inquiries',
    leads: db.leads,
    bookings: db.bookings,
    applications: db.applications
  });
});

// ============================================================
// API endpoints (dynamic data)
// ============================================================

// Get all services (JSON API)
app.get('/api/services', (req, res) => {
  res.json({ success: true, data: services });
});

// Get filtered services by tab (personal/business)
app.get('/api/services/:tab', (req, res) => {
  const tab = req.params.tab;
  if (tab !== 'personal' && tab !== 'business') {
    return res.status(400).json({ success: false, message: 'Invalid tab. Use "personal" or "business".' });
  }
  const filtered = services.filter(s => s.tab === tab);
  res.json({ success: true, data: filtered });
});

// Get all testimonials
app.get('/api/testimonials', (req, res) => {
  res.json({ success: true, data: testimonials });
});

// Get all pricing plans
app.get('/api/pricing', (req, res) => {
  res.json({ success: true, data: pricingPlans });
});

// Get gallery images
app.get('/api/gallery', (req, res) => {
  res.json({ success: true, data: galleryImages });
});

// Get all bookings (admin view)
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, count: db.bookings.length, data: db.bookings });
});

// Get all applications (admin view)
app.get('/api/applications', (req, res) => {
  res.json({ success: true, count: db.applications.length, data: db.applications });
});

// Get all quick leads (admin view)
app.get('/api/leads', (req, res) => {
  res.json({ success: true, count: db.leads.length, data: db.leads });
});

// ============================================================
// Form Submissions
// ============================================================

// Booking form submission (from homepage)
app.post('/api/book', (req, res) => {
  const { service, location, date } = req.body;

  // Basic validation
  if (!service || service === 'Not Selected' || !location || !date) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (service, location, and date).'
    });
  }

  const booking = {
    id: 'BK' + Date.now(),
    service,
    location,
    date,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  db.bookings.push(booking);
  console.log('[BOOKING] New booking received:', booking);
  saveDb();

  res.status(201).json({
    success: true,
    message: 'Booking request received! Our team will contact you shortly.',
    booking
  });
});

// Quick lead form submission (popup: name + phone)
app.post('/api/lead', (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both your name and phone number.'
    });
  }

  const lead = {
    id: 'LD' + Date.now(),
    name,
    phone,
    source: 'popup',
    status: 'new',
    createdAt: new Date().toISOString()
  };

  db.leads.push(lead);
  console.log('[LEAD] New popup lead:', lead);
  saveDb();

  res.status(201).json({
    success: true,
    message: 'Thank you! Our team will call you shortly.',
    lead
  });
});

// Photographer application submission
app.post('/api/apply', upload.single('govId'), (req, res) => {
  const body = req.body;
  const file = req.file;

  const application = {
    id: 'AP' + Date.now(),
    legalName: body.legalName,
    studioName: body.studioName || '',
    email: body.email,
    phone: body.phone,
    city: body.city,
    experience: body.experience,
    categories: Array.isArray(body.categories) ? body.categories : [body.categories].filter(Boolean),
    cameraBodies: body.cameraBodies,
    lenses: body.lenses,
    videoDrone: body.videoDrone,
    portfolioUrl: body.portfolioUrl || '',
    socialUrl: body.socialUrl,
    driveUrl: body.driveUrl,
    styleDesc: body.styleDesc,
    baseRate: body.baseRate,
    travelTerms: body.travelTerms,
    editingTerms: body.editingTerms,
    commission: body.commission,
    ackTraining: body.ackTraining === 'true',
    ackCalendar: body.ackCalendar === 'true',
    ackPayment: body.ackPayment === 'true',
    ackPerformance: body.ackPerformance === 'true',
    govIdFile: file ? `/uploads/${file.filename}` : null,
    status: 'pending_review',
    createdAt: new Date().toISOString()
  };

  db.applications.push(application);
  console.log('[APPLICATION] New talent application:', application);
  saveDb();

  res.status(201).json({
    success: true,
    message: 'Application received! Our QA team will review your portfolio within 3-5 business days.',
    application
  });
});

// ============================================================
// Error handling
// ============================================================
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found | Dot Directions' });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  if (req.path.startsWith('/api/')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).render('error', { title: 'Server Error | Dot Directions', message: err.message });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🚀 Dot Direction server running at http://localhost:${PORT}`);
  console.log(`   Homepage: http://localhost:${PORT}/`);
  console.log(`   Join as Photographer: http://localhost:${PORT}/join-as-photographer\n`);
});

module.exports = app;