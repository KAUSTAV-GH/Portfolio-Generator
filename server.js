const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'portfolios.json');

const uploadStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({ storage: uploadStorage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

function readPortfolios() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function savePortfolios(portfolios) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(portfolios, null, 2));
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toList(raw) {
  return raw
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPortfolio(portfolio) {
  const renderItems = (items) =>
    items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(portfolio.name)} - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {
      --text: #f8fbff;
      --muted: #c5d1ff;
      --glass-bg: rgba(255, 255, 255, 0.12);
      --glass-border: rgba(255, 255, 255, 0.28);
      --card-bg: rgba(9, 18, 45, 0.45);
      --accent: #52ddff;
      --accent-2: #9e7dff;
      --shadow-soft: 0 22px 45px rgba(7, 11, 27, 0.5);
      --shadow-hover: 0 26px 58px rgba(7, 11, 27, 0.6);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: 'Inter', Arial, sans-serif;
      color: var(--text);
      background: linear-gradient(130deg, #0f153e, #25145b 42%, #5f236d 72%, #10274d);
      background-size: 260% 260%;
      animation: bgShift 14s ease infinite;
      overflow-x: hidden;
      position: relative;
    }

    .bg-orb {
      position: fixed;
      border-radius: 50%;
      opacity: 0.45;
      filter: blur(2px);
      z-index: -1;
      pointer-events: none;
      animation: float 10s ease-in-out infinite;
    }
    .orb-1 {
      width: 340px;
      height: 340px;
      top: -110px;
      left: -60px;
      background: radial-gradient(circle, #5ab3ff, transparent 70%);
    }
    .orb-2 {
      width: 400px;
      height: 400px;
      top: 20%;
      right: -120px;
      background: radial-gradient(circle, #8a74ff, transparent 68%);
      animation-direction: reverse;
      animation-duration: 12s;
    }
    .orb-3 {
      width: 360px;
      height: 360px;
      bottom: -140px;
      left: 26%;
      background: radial-gradient(circle, #ff5fbf, transparent 70%);
      animation-duration: 11s;
    }

    .container {
      width: 100%;
      max-width: 1140px;
      margin: 0 auto;
      padding: 34px 18px 44px;
    }

    .hero {
      display: grid;
      grid-template-columns: 170px 1fr;
      gap: 24px;
      align-items: center;
      padding: 28px;
      border-radius: 24px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      box-shadow: var(--shadow-soft);
      transition: transform .35s ease, box-shadow .35s ease;
      animation: fadeUp .8s ease both;
    }

    .hero:hover {
      transform: translateY(-4px) rotateX(2deg) rotateY(-2deg);
      box-shadow: var(--shadow-hover);
    }

    .photo {
      width: 170px;
      height: 170px;
      border-radius: 22px;
      object-fit: cover;
      border: 2px solid rgba(255,255,255,.35);
      box-shadow: 0 16px 34px rgba(23, 80, 170, 0.4);
    }

    .name {
      margin: 0;
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: .2px;
    }

    .tagline {
      margin: 10px 0 0;
      color: var(--muted);
      font-size: 1.03rem;
      line-height: 1.7;
    }

    .contact {
      margin-top: 14px;
      padding: 12px 14px;
      border-radius: 12px;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.15);
      color: #edf2ff;
      font-size: .98rem;
      word-break: break-word;
    }

    .section-grid {
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .section {
      background: var(--card-bg);
      border: 1px solid rgba(174, 193, 255, 0.22);
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 14px 26px rgba(8, 14, 35, .33);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: transform .25s ease, border-color .25s ease;
      animation: fadeUp .8s ease both;
    }

    .section:hover {
      transform: translateY(-3px);
      border-color: rgba(102, 217, 255, 0.6);
    }

    h2 {
      margin: 0 0 10px;
      color: var(--accent);
      font-size: 1.18rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      line-height: 1.72;
      color: #eef4ff;
    }

    .made {
      margin: 20px 4px 0;
      color: var(--muted);
      font-size: .95rem;
    }

    .back {
      color: var(--accent-2);
      text-decoration: none;
      font-weight: 600;
    }

    .back:hover { text-decoration: underline; }

    @supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
      .hero,
      .section {
        background: rgba(20, 29, 70, 0.88);
      }
    }

    @media (max-width: 760px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .photo { margin: 0 auto; }
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bgShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes float {
      0%,100% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-14px) translateX(9px); }
    }
  </style>
</head>
<body>
  <span class="bg-orb orb-1"></span>
  <span class="bg-orb orb-2"></span>
  <span class="bg-orb orb-3"></span>

  <main class="container">
    <section class="hero">
      <img class="photo" src="${escapeHtml(portfolio.profilePhoto)}" alt="${escapeHtml(portfolio.name)} profile photo" />
      <div>
        <h1 class="name">${escapeHtml(portfolio.name)}</h1>
        <p class="tagline">${escapeHtml(portfolio.about)}</p>
        <p class="contact"><strong>Contact:</strong> ${escapeHtml(portfolio.contact)}</p>
      </div>
    </section>

    <section class="section-grid">
      <article class="section">
        <h2>Skills</h2>
        <ul>${renderItems(portfolio.skills)}</ul>
      </article>
      <article class="section">
        <h2>Projects</h2>
        <ul>${renderItems(portfolio.projects)}</ul>
      </article>
      <article class="section">
        <h2>Education</h2>
        <ul>${renderItems(portfolio.education)}</ul>
      </article>
    </section>

    <p class="made">Generated with Portfolio Generator · <a href="/" class="back">Create another portfolio</a></p>
  </main>
</body>
</html>`;
}

app.post('/api/portfolio', upload.single('profilePhoto'), (req, res) => {
  const { name, about, skills, projects, education, contact } = req.body;

  if (!name || !about || !skills || !projects || !education || !contact || !req.file) {
    return res.status(400).json({ error: 'Please fill all fields and upload a profile photo.' });
  }

  const portfolios = readPortfolios();
  const baseSlug = slugify(name) || `user-${Date.now()}`;

  let username = baseSlug;
  let counter = 1;

  while (portfolios.some((p) => p.username === username)) {
    username = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const newPortfolio = {
    username,
    name,
    about,
    skills: toList(skills),
    projects: toList(projects),
    education: toList(education),
    contact,
    profilePhoto: `/uploads/${req.file.filename}`,
    createdAt: new Date().toISOString()
  };

  portfolios.push(newPortfolio);
  savePortfolios(portfolios);

  return res.status(201).json({
    message: 'Portfolio created successfully!',
    link: `/portfolio/${username}`
  });
});

app.get('/portfolio/:username', (req, res) => {
  const portfolios = readPortfolios();
  const portfolio = portfolios.find((item) => item.username === req.params.username);

  if (!portfolio) {
    return res.status(404).send('Portfolio not found.');
  }

  return res.send(renderPortfolio(portfolio));
});

app.get('/api/portfolios', (_, res) => {
  const portfolios = readPortfolios().map(({ profilePhoto, ...rest }) => rest);
  res.json(portfolios);
});

app.listen(PORT, () => {
  console.log(`Portfolio Generator running on http://localhost:${PORT}`);
});