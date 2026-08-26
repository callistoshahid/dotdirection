const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_ID = process.env.ADMIN_ID || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dot-direction-change-this-secret';

// ============================================================
// Dynamic Data Layer
// ============================================================
const siteData = require('./data/siteData');
const { services, galleryImages, testimonials, pricingPlans } = siteData;

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
app.use(session({
  name: 'dot_admin_sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 8
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// SQLite database
// ============================================================
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'dotdirection.sqlite');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('[DB] SQLite connection failed:', err.message);
  } else {
    console.log(`[DB] SQLite connected: ${DB_FILE}`);
  }
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function onRun(err) {
    if (err) reject(err);
    else resolve({ id: this.lastID, changes: this.changes });
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    source TEXT DEFAULT 'popup',
    status TEXT DEFAULT 'new',
    createdAt TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    createdAt TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    legalName TEXT NOT NULL,
    studioName TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    experience TEXT,
    categories TEXT,
    cameraBodies TEXT,
    lenses TEXT,
    videoDrone TEXT,
    portfolioUrl TEXT,
    socialUrl TEXT,
    driveUrl TEXT,
    styleDesc TEXT,
    baseRate TEXT,
    travelTerms TEXT,
    editingTerms TEXT,
    commission TEXT,
    ackTraining INTEGER DEFAULT 0,
    ackCalendar INTEGER DEFAULT 0,
    ackPayment INTEGER DEFAULT 0,
    ackPerformance INTEGER DEFAULT 0,
    govIdFile TEXT,
    status TEXT DEFAULT 'pending_review',
    createdAt TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    coverImage TEXT,
    status TEXT DEFAULT 'draft',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`);
});

// ============================================================
// Multer setup for photographer application uploads (Gov ID)
// ============================================================
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const blogUploadDir = path.join(uploadDir, 'blogs');
if (!fs.existsSync(blogUploadDir)) fs.mkdirSync(blogUploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed.'));
  }
});

const blogImageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, blogUploadDir),
    filename: (req, file, cb) => {
      const safeBase = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${safeBase || 'blog-image'}-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only JPG, JPEG, PNG, WEBP and GIF images are allowed.'));
  }
});

// ============================================================
// Helpers
// ============================================================
const makeSlug = (title) => title
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const ensureUniqueSlug = async (title, existingId = null) => {
  const base = makeSlug(title) || `blog-${Date.now()}`;
  let slug = base;
  let counter = 2;
  while (true) {
    const row = existingId
      ? await get('SELECT id FROM blogs WHERE slug = ? AND id != ?', [slug, existingId])
      : await get('SELECT id FROM blogs WHERE slug = ?', [slug]);
    if (!row) return slug;
    slug = `${base}-${counter++}`;
  }
};

const requireAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect('/admin/login');
};

const countRows = async (table) => {
  const row = await get(`SELECT COUNT(*) as count FROM ${table}`);
  return row ? row.count : 0;
};

// ============================================================
// Global locals (available in all templates)
// ============================================================
app.use((req, res, next) => {
  Object.keys(siteData).forEach(key => {
    res.locals[key] = siteData[key];
  });
  res.locals.currentYear = new Date().getFullYear();
  res.locals.path = req.path;
  res.locals.isAdmin = Boolean(req.session && req.session.isAdmin);
  next();
});

// ============================================================
// Public routes
// ============================================================
app.get('/', (req, res) => {
  res.render('index', { title: siteData.site.homeTitle });
});

app.get('/join-as-photographer', (req, res) => {
  res.render('join-as-photographer', {
    title: 'Apply as Talent | Dot Directions',
    experienceOptions: siteData.experienceOptions,
    categoryOptions: siteData.categoryOptions
  });
});

app.get('/blogs', async (req, res, next) => {
  try {
    const blogs = await all('SELECT * FROM blogs WHERE status = ? ORDER BY createdAt DESC', ['published']);
    res.render('blogs/index', { title: 'Blogs | Dot Directions', blogs });
  } catch (err) {
    next(err);
  }
});

app.get('/blogs/:slug', async (req, res, next) => {
  try {
    const blog = await get('SELECT * FROM blogs WHERE slug = ? AND status = ?', [req.params.slug, 'published']);
    if (!blog) return res.status(404).render('404', { title: 'Blog Not Found | Dot Directions' });
    res.render('blogs/show', { title: `${blog.title} | Dot Directions`, blog });
  } catch (err) {
    next(err);
  }
});

app.get('/locations/:slug', (req, res) => {
  const location = siteData.locations.find(item => item.slug === req.params.slug);
  if (!location) return res.status(404).render('404', { title: 'Location Not Found | Dot Directions' });

  res.render('locations/show', {
    title: location.metaTitle,
    location
  });
});

// ============================================================
// Admin auth + dashboard
// ============================================================
app.get('/admin', (req, res) => {
  if (req.session && req.session.isAdmin) return res.redirect('/admin/dashboard');
  return res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
  res.render('admin/login', { title: 'Admin Login | Dot Directions', error: null });
});

app.post('/admin/login', (req, res) => {
  const { adminId, password } = req.body;
  if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.adminId = adminId;
    return res.redirect('/admin/dashboard');
  }
  return res.status(401).render('admin/login', {
    title: 'Admin Login | Dot Directions',
    error: 'Invalid admin ID or password.'
  });
});

app.post('/admin/logout', requireAdmin, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

app.get('/admin/dashboard', requireAdmin, async (req, res, next) => {
  try {
    const [leads, bookings, applications, blogs] = await Promise.all([
      countRows('leads'),
      countRows('bookings'),
      countRows('applications'),
      countRows('blogs')
    ]);
    const recentLeads = await all('SELECT * FROM leads ORDER BY createdAt DESC LIMIT 5');
    const recentBlogs = await all('SELECT * FROM blogs ORDER BY updatedAt DESC LIMIT 5');
    res.render('admin/dashboard', {
      title: 'Admin Dashboard | Dot Directions',
      counts: { leads, bookings, applications, blogs },
      recentLeads,
      recentBlogs
    });
  } catch (err) {
    next(err);
  }
});

app.get('/admin/leads', requireAdmin, async (req, res, next) => {
  try {
    const [leads, bookings, applications] = await Promise.all([
      all('SELECT * FROM leads ORDER BY createdAt DESC'),
      all('SELECT * FROM bookings ORDER BY createdAt DESC'),
      all('SELECT * FROM applications ORDER BY createdAt DESC')
    ]);
    res.render('admin/leads', {
      title: 'Admin | Leads & Inquiries',
      leads,
      bookings,
      applications: applications.map(a => ({ ...a, categories: a.categories ? JSON.parse(a.categories) : [] }))
    });
  } catch (err) {
    next(err);
  }
});

app.post('/admin/leads/:id/status', requireAdmin, async (req, res, next) => {
  try {
    await run('UPDATE leads SET status = ? WHERE id = ?', [req.body.status || 'new', req.params.id]);
    res.redirect('/admin/leads');
  } catch (err) {
    next(err);
  }
});

app.post('/admin/leads/:id/delete', requireAdmin, async (req, res, next) => {
  try {
    await run('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.redirect('/admin/leads');
  } catch (err) {
    next(err);
  }
});

// ============================================================
// Admin blog CRUD
// ============================================================
app.post('/admin/blogs/upload-image', requireAdmin, blogImageUpload.single('upload'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: 'No image uploaded.' } });
  }

  return res.json({
    url: `/uploads/blogs/${req.file.filename}`
  });
});

app.get('/admin/blogs', requireAdmin, async (req, res, next) => {
  try {
    const blogs = await all('SELECT * FROM blogs ORDER BY updatedAt DESC');
    res.render('admin/blogs/index', { title: 'Manage Blogs | Dot Directions', blogs });
  } catch (err) {
    next(err);
  }
});

app.get('/admin/blogs/new', requireAdmin, (req, res) => {
  res.render('admin/blogs/form', {
    title: 'New Blog | Dot Directions',
    blog: null,
    action: '/admin/blogs',
    submitLabel: 'Create Blog'
  });
});

app.post('/admin/blogs', requireAdmin, async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, status } = req.body;
    if (!title || !content) throw new Error('Blog title and content are required.');
    const slug = await ensureUniqueSlug(title);
    const now = new Date().toISOString();
    await run(
      'INSERT INTO blogs (title, slug, excerpt, content, coverImage, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, excerpt || '', content, coverImage || '', status === 'published' ? 'published' : 'draft', now, now]
    );
    res.redirect('/admin/blogs');
  } catch (err) {
    next(err);
  }
});

app.get('/admin/blogs/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const blog = await get('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (!blog) return res.status(404).render('404', { title: 'Blog Not Found | Dot Directions' });
    res.render('admin/blogs/form', {
      title: 'Edit Blog | Dot Directions',
      blog,
      action: `/admin/blogs/${blog.id}`,
      submitLabel: 'Update Blog'
    });
  } catch (err) {
    next(err);
  }
});

app.post('/admin/blogs/:id', requireAdmin, async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, status } = req.body;
    if (!title || !content) throw new Error('Blog title and content are required.');
    const slug = await ensureUniqueSlug(title, req.params.id);
    const now = new Date().toISOString();
    await run(
      'UPDATE blogs SET title = ?, slug = ?, excerpt = ?, content = ?, coverImage = ?, status = ?, updatedAt = ? WHERE id = ?',
      [title, slug, excerpt || '', content, coverImage || '', status === 'published' ? 'published' : 'draft', now, req.params.id]
    );
    res.redirect('/admin/blogs');
  } catch (err) {
    next(err);
  }
});

app.post('/admin/blogs/:id/delete', requireAdmin, async (req, res, next) => {
  try {
    await run('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.redirect('/admin/blogs');
  } catch (err) {
    next(err);
  }
});

// ============================================================
// API endpoints (dynamic data)
// ============================================================
app.get('/api/services', (req, res) => res.json({ success: true, data: services }));

app.get('/api/services/:tab', (req, res) => {
  const tab = req.params.tab;
  if (tab !== 'personal' && tab !== 'business') {
    return res.status(400).json({ success: false, message: 'Invalid tab. Use "personal" or "business".' });
  }
  res.json({ success: true, data: services.filter(s => s.tab === tab) });
});

app.get('/api/testimonials', (req, res) => res.json({ success: true, data: testimonials }));
app.get('/api/pricing', (req, res) => res.json({ success: true, data: pricingPlans }));
app.get('/api/gallery', (req, res) => res.json({ success: true, data: galleryImages }));

app.get('/api/bookings', async (req, res, next) => {
  try {
    const rows = await all('SELECT * FROM bookings ORDER BY createdAt DESC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
});

app.get('/api/applications', async (req, res, next) => {
  try {
    const rows = await all('SELECT * FROM applications ORDER BY createdAt DESC');
    res.json({ success: true, count: rows.length, data: rows.map(a => ({ ...a, categories: a.categories ? JSON.parse(a.categories) : [] })) });
  } catch (err) {
    next(err);
  }
});

app.get('/api/leads', async (req, res, next) => {
  try {
    const rows = await all('SELECT * FROM leads ORDER BY createdAt DESC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// Form submissions
// ============================================================
app.post('/api/book', async (req, res, next) => {
  try {
    const { service, location, date } = req.body;
    if (!service || service === 'Not Selected' || !location || !date) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields (service, location, and date).' });
    }
    const createdAt = new Date().toISOString();
    const result = await run(
      'INSERT INTO bookings (service, location, date, status, createdAt) VALUES (?, ?, ?, ?, ?)',
      [service, location, date, 'new', createdAt]
    );
    res.status(201).json({
      success: true,
      message: 'Booking request received! Our team will contact you shortly.',
      booking: { id: result.id, service, location, date, status: 'new', createdAt }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/lead', async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide both your name and phone number.' });
    }
    const createdAt = new Date().toISOString();
    const result = await run(
      'INSERT INTO leads (name, phone, source, status, createdAt) VALUES (?, ?, ?, ?, ?)',
      [name, phone, 'popup', 'new', createdAt]
    );
    res.status(201).json({
      success: true,
      message: 'Thank you! Our team will call you shortly.',
      lead: { id: result.id, name, phone, source: 'popup', status: 'new', createdAt }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/apply', upload.single('govId'), async (req, res, next) => {
  try {
    const body = req.body;
    const categories = Array.isArray(body.categories) ? body.categories : [body.categories].filter(Boolean);
    const createdAt = new Date().toISOString();
    const params = [
      body.legalName,
      body.studioName || '',
      body.email,
      body.phone,
      body.city,
      body.experience,
      JSON.stringify(categories),
      body.cameraBodies,
      body.lenses,
      body.videoDrone,
      body.portfolioUrl || '',
      body.socialUrl,
      body.driveUrl,
      body.styleDesc,
      body.baseRate,
      body.travelTerms,
      body.editingTerms,
      body.commission,
      body.ackTraining === 'true' ? 1 : 0,
      body.ackCalendar === 'true' ? 1 : 0,
      body.ackPayment === 'true' ? 1 : 0,
      body.ackPerformance === 'true' ? 1 : 0,
      req.file ? `/uploads/${req.file.filename}` : null,
      'pending_review',
      createdAt
    ];
    const result = await run(`INSERT INTO applications (
      legalName, studioName, email, phone, city, experience, categories, cameraBodies, lenses, videoDrone,
      portfolioUrl, socialUrl, driveUrl, styleDesc, baseRate, travelTerms, editingTerms, commission,
      ackTraining, ackCalendar, ackPayment, ackPerformance, govIdFile, status, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, params);

    res.status(201).json({
      success: true,
      message: 'Application received! Our QA team will review your portfolio within 3-5 business days.',
      application: { id: result.id, legalName: body.legalName, email: body.email, phone: body.phone, categories, status: 'pending_review', createdAt }
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// Error handling
// ============================================================
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found | Dot Directions' });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  if (req.path.startsWith('/api/')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).render('error', { title: 'Server Error | Dot Directions', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Dot Direction server running at http://localhost:${PORT}`);
  console.log(`   Homepage: http://localhost:${PORT}/`);
  console.log(`   Admin: http://localhost:${PORT}/admin/login`);
  console.log(`   Default admin: ${ADMIN_ID} / ${ADMIN_PASSWORD}\n`);
});

module.exports = app;