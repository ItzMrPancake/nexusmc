import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || '241816';

// Body parsers with payload limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Persistence directories
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Security: Brute-force protection & Active admin tokens
interface LoginAttempt {
  count: number;
  blockedUntil: number;
}
const loginAttempts = new Map<string, LoginAttempt>();
const activeAdminTokens = new Map<string, { createdAt: number; expiresAt: number }>();

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Seed data files if not present
const BLOG_FILE = path.resolve(DATA_DIR, 'blog.json');
const STAFF_FILE = path.resolve(DATA_DIR, 'staff.json');
const STORE_FILE = path.resolve(DATA_DIR, 'store.json');
const CONFIG_FILE = path.resolve(DATA_DIR, 'config.json');

const INITIAL_CONFIG = {
  serverName: 'NexusMC',
  tagline: 'The Premier Blue-Tea Enchanted Minecraft Network',
  serverIp: 'play.nexusmc.net',
  bedrockPort: 19132,
  javaPort: 25565,
  version: 'Java & Bedrock 1.20 - 1.21.x',
  webstoreUrl: 'https://store.nexusmc.net',
  discordUrl: 'https://discord.gg/nexusmc',
  simulatedPlayers: 312,
  maxPlayers: 600,
  pingMs: 19,
};

const INITIAL_BLOG: any[] = [];

const INITIAL_STAFF = [
  {
    id: 'staff-1',
    name: 'Astraea',
    minecraftIgn: 'Astraea',
    role: 'Owner',
    tier: 'Leadership',
    rankBadgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    bio: 'Founder and lead developer of NexusMC. Focused on server architecture, custom plugins, and keeping the community friendly and competitive.',
    joined: 'Jan 2024',
    discord: 'astraea#0001',
    avatarUrl: 'https://mc-heads.net/avatar/Astraea/128',
    skinData: '',
  },
  {
    id: 'staff-2',
    name: 'Vortex',
    minecraftIgn: 'VortexByte',
    role: 'Head Admin',
    tier: 'Leadership',
    rankBadgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    bio: 'Oversees staff operations, event moderation, and community tournaments. Reach out on Discord for inquiries!',
    joined: 'Mar 2024',
    discord: 'vortex.nexus',
    avatarUrl: 'https://mc-heads.net/avatar/VortexByte/128',
    skinData: '',
  },
  {
    id: 'staff-3',
    name: 'Kairos',
    minecraftIgn: 'KairosCraft',
    role: 'Lead Architect',
    tier: 'Creative & Dev',
    rankBadgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    bio: 'Designed the floating celestial spawn, custom dungeon arenas, and the seasonal holiday hubs.',
    joined: 'May 2024',
    discord: 'kairos_builds',
    avatarUrl: 'https://mc-heads.net/avatar/KairosCraft/128',
    skinData: '',
  },
  {
    id: 'staff-4',
    name: 'EchoRider',
    minecraftIgn: 'EchoRider',
    role: 'Senior Moderator',
    tier: 'Moderation',
    rankBadgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    bio: 'Enforcing server rules, handling chat tickets, and helping new adventurers find their way around the realm.',
    joined: 'Jul 2024',
    discord: 'echorider_mc',
    avatarUrl: 'https://mc-heads.net/avatar/EchoRider/128',
    skinData: '',
  },
  {
    id: 'staff-5',
    name: 'Lunaria',
    minecraftIgn: 'LunariaGlow',
    role: 'Community Moderator',
    tier: 'Moderation',
    rankBadgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    bio: 'Manages discord events, player giveaways, and in-game minigame tournaments.',
    joined: 'Oct 2024',
    discord: 'lunaria.sky',
    avatarUrl: 'https://mc-heads.net/avatar/LunariaGlow/128',
    skinData: '',
  },
  {
    id: 'staff-6',
    name: 'ZephyrTech',
    minecraftIgn: 'ZephyrCode',
    role: 'Systems Engineer',
    tier: 'Creative & Dev',
    rankBadgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    bio: 'Handles server proxies, velocity network clustering, and custom packet anti-cheat integrations.',
    joined: 'Feb 2024',
    discord: 'zephyr.tech',
    avatarUrl: 'https://mc-heads.net/avatar/ZephyrCode/128',
    skinData: '',
  },
];

const INITIAL_STORE = [
  {
    id: 'item-1',
    name: 'Nexus+ VIP Rank',
    category: 'Ranks',
    price: 34.99,
    currency: 'USD',
    badge: 'Most Popular',
    summary: 'The ultimate tier of membership on NexusMC with permanent global perks across all realms.',
    perks: [
      'Glowing [NEXUS+] prefix in chat & tablist',
      'Priority queue bypass during peak server hours',
      'Access to /fly in personal claims and spawn hubs',
      '10x Home points and 5x Vault chests',
      'Weekly Mythic Crate Key drop',
      'Exclusive Blue Tea particle trail and cape cosmetic',
      'Auto-sell chest perk & 15% auction house fee discount',
    ],
    icon: 'Crown',
    webstoreUrl: 'https://store.nexusmc.net/category/ranks',
    active: true,
  },
  {
    id: 'item-2',
    name: 'MVP Rank',
    category: 'Ranks',
    price: 19.99,
    currency: 'USD',
    badge: 'Value Choice',
    summary: 'Elevated status with essential quality-of-life perks, custom colors, and vault space.',
    perks: [
      'Bold [MVP] cyan badge prefix in chat',
      'Access to /workbench, /anvil, and /enderchest anywhere',
      '6x Home set points across all realms',
      'Monthly Epic Crate Key voucher',
      'Custom colored signs and chat formatting',
      'Queue priority ahead of regular players',
    ],
    icon: 'Shield',
    webstoreUrl: 'https://store.nexusmc.net/category/ranks',
    active: true,
  },
  {
    id: 'item-3',
    name: 'VIP Rank',
    category: 'Ranks',
    price: 9.99,
    currency: 'USD',
    badge: 'Starter Rank',
    summary: 'Our gateway rank providing vital early-game commands and supporter recognition.',
    perks: [
      '[VIP] green prefix in chat',
      '3x Home set points',
      'Access to /hat and /near commands',
      '1x Rare Crate Key upon activation',
      'Access to VIP-only lounge in spawn citadel',
    ],
    icon: 'Star',
    webstoreUrl: 'https://store.nexusmc.net/category/ranks',
    active: true,
  },
  {
    id: 'item-4',
    name: '5x Celestial Crate Keys Bundle',
    category: 'Crate Keys',
    price: 12.50,
    currency: 'USD',
    badge: 'Featured Drop',
    summary: 'Unlock the Celestial Crate at spawn for chances at legendary armor, god tools, and rare cosmetics.',
    perks: [
      '5x Celestial Keys credited to your inventory or virtual pouch',
      'Guaranteed 1x Epic+ loot tier item per spin',
      'Chance at exclusive Celestial Elytra cosmetic and weapon skins',
      'Usable in Survival SMP and Custom Dungeons',
    ],
    icon: 'Key',
    webstoreUrl: 'https://store.nexusmc.net/category/crates',
    active: true,
  },
  {
    id: 'item-5',
    name: 'Realm Global Booster (3 Hours)',
    category: 'Boosters',
    price: 7.99,
    currency: 'USD',
    badge: 'Community Buff',
    summary: 'Activate a 2x McMMO and 2x Mob XP multiplier for EVERY player currently online in your realm.',
    perks: [
      '2x Skill Exp multiplier for 3 hours server-wide',
      'Your name announced in chat and title banner across all players',
      'Permanent Booster Champion profile badge',
      'Stackable with personal booster tokens',
    ],
    icon: 'Zap',
    webstoreUrl: 'https://store.nexusmc.net/category/boosters',
    active: true,
  },
];

// Helper functions for reading/writing JSON
function loadJson<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
  return fallback;
}

function saveJson<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    throw err;
  }
}

// Initialize seed data
loadJson(CONFIG_FILE, INITIAL_CONFIG);
loadJson(BLOG_FILE, INITIAL_BLOG);
loadJson(STAFF_FILE, INITIAL_STAFF);
loadJson(STORE_FILE, INITIAL_STORE);

// Static uploads serving
app.use('/api/uploads', express.static(UPLOADS_DIR));

// Authentication Middleware
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const customToken = req.headers['x-owner-token'];
  const directPassword = req.headers['x-owner-password'];

  // Check Bearer Token
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof customToken === 'string') {
    token = customToken.trim();
  }

  if (token && activeAdminTokens.has(token)) {
    const session = activeAdminTokens.get(token)!;
    if (Date.now() < session.expiresAt) {
      return next();
    } else {
      activeAdminTokens.delete(token);
    }
  }

  // Fallback: direct password header with constant-time check
  if (typeof directPassword === 'string') {
    try {
      const pwdBuffer = Buffer.from(directPassword);
      const expectedBuffer = Buffer.from(OWNER_PASSWORD);
      if (pwdBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(pwdBuffer, expectedBuffer)) {
        return next();
      }
    } catch {
      // ignore timing error
    }
  }

  res.status(401).json({
    error: 'Owner authorization required',
    message: 'Invalid or expired owner credentials. Please provide valid password or session token.',
  });
}

// ---------------- API ENDPOINTS ---------------- //

// 1. Owner Login / Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, blockedUntil: 0 };

  if (attempt.blockedUntil > now) {
    const remainingSecs = Math.ceil((attempt.blockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Too many failed attempts. Try again in ${remainingSecs} seconds.`,
    });
  }

  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }

  const safeExpected = Buffer.from(OWNER_PASSWORD);
  const safeGiven = Buffer.from(password);

  let isMatch = false;
  if (safeGiven.length === safeExpected.length) {
    try {
      isMatch = crypto.timingSafeEqual(safeGiven, safeExpected);
    } catch {
      isMatch = false;
    }
  }

  if (!isMatch) {
    attempt.count += 1;
    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      attempt.blockedUntil = now + BLOCK_DURATION_MS;
      attempt.count = 0;
    }
    loginAttempts.set(ip, attempt);
    return res.status(401).json({ error: 'Incorrect owner password.' });
  }

  // Successful login: reset attempts and generate 64-char crypto token
  loginAttempts.delete(ip);
  const token = crypto.randomBytes(32).toString('hex');
  activeAdminTokens.set(token, {
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });

  return res.json({
    success: true,
    token,
    expiresAt: now + SESSION_TTL_MS,
    message: 'Owner access granted',
  });
});

app.get('/api/admin/check', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const customToken = req.headers['x-owner-token'];
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof customToken === 'string') {
    token = customToken.trim();
  }

  if (token && activeAdminTokens.has(token)) {
    const session = activeAdminTokens.get(token)!;
    if (Date.now() < session.expiresAt) {
      return res.json({ authenticated: true, expiresAt: session.expiresAt });
    }
  }
  return res.json({ authenticated: false });
});

// 2. Server Config
app.get('/api/config', (_req: Request, res: Response) => {
  const config = loadJson(CONFIG_FILE, INITIAL_CONFIG);
  res.json(config);
});

app.put('/api/config', requireAdminAuth, (req: Request, res: Response) => {
  const config = loadJson(CONFIG_FILE, INITIAL_CONFIG);
  const updated = { ...config, ...req.body };
  saveJson(CONFIG_FILE, updated);
  res.json({ success: true, config: updated });
});

// 3. Blog Endpoints
app.get('/api/blog', (_req: Request, res: Response) => {
  const posts = loadJson(BLOG_FILE, INITIAL_BLOG);
  res.json(posts);
});

app.post('/api/blog', requireAdminAuth, (req: Request, res: Response) => {
  const { title, category, summary, content, author, authorRole, coverImage } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const posts = loadJson<any[]>(BLOG_FILE, INITIAL_BLOG);
  const newPost = {
    id: `post-${Date.now()}`,
    title: String(title).trim(),
    slug: String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    category: category ? String(category).trim() : 'Announcement',
    author: author ? String(author).trim() : 'Server Staff',
    authorRole: authorRole ? String(authorRole).trim() : 'Owner / Admin',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    readTime: `${Math.max(1, Math.ceil(String(content).split(/\s+/).length / 180))} min read`,
    summary: summary ? String(summary).trim() : String(content).substring(0, 140) + '...',
    content: String(content).trim(),
    coverImage: coverImage || '/src/assets/images/blog_nexusmc_update_1794187185782.jpg',
    featured: Boolean(req.body.featured),
  };

  posts.unshift(newPost);
  saveJson(BLOG_FILE, posts);
  res.status(201).json({ success: true, post: newPost });
});

app.put('/api/blog/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const posts = loadJson<any[]>(BLOG_FILE, INITIAL_BLOG);
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  posts[index] = { ...posts[index], ...req.body, id };
  saveJson(BLOG_FILE, posts);
  res.json({ success: true, post: posts[index] });
});

app.delete('/api/blog/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  let posts = loadJson<any[]>(BLOG_FILE, INITIAL_BLOG);
  const initialLength = posts.length;
  posts = posts.filter((p) => p.id !== id);
  if (posts.length === initialLength) {
    return res.status(404).json({ error: 'Post not found' });
  }
  saveJson(BLOG_FILE, posts);
  res.json({ success: true, message: 'Post removed' });
});

// 4. Staff Endpoints
app.get('/api/staff', (_req: Request, res: Response) => {
  const staff = loadJson(STAFF_FILE, INITIAL_STAFF);
  res.json(staff);
});

app.post('/api/staff', requireAdminAuth, (req: Request, res: Response) => {
  const { name, minecraftIgn, role, tier, bio, discord, avatarUrl, rankBadgeColor } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  const staff = loadJson<any[]>(STAFF_FILE, INITIAL_STAFF);
  const ign = (minecraftIgn || name).trim();
  const defaultAvatar = `https://mc-heads.net/avatar/${encodeURIComponent(ign)}/128`;

  const newStaff = {
    id: `staff-${Date.now()}`,
    name: String(name).trim(),
    minecraftIgn: ign,
    role: String(role).trim(),
    tier: tier ? String(tier).trim() : 'Staff Team',
    rankBadgeColor:
      rankBadgeColor ||
      (role.toLowerCase().includes('owner')
        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'),
    bio: bio ? String(bio).trim() : 'Dedicated member of the NexusMC staff team.',
    joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    discord: discord ? String(discord).trim() : '',
    avatarUrl: avatarUrl || defaultAvatar,
    skinData: req.body.skinData || '',
  };

  staff.push(newStaff);
  saveJson(STAFF_FILE, staff);
  res.status(201).json({ success: true, staff: newStaff });
});

app.put('/api/staff/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const staff = loadJson<any[]>(STAFF_FILE, INITIAL_STAFF);
  const index = staff.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  staff[index] = { ...staff[index], ...req.body, id };
  saveJson(STAFF_FILE, staff);
  res.json({ success: true, staff: staff[index] });
});

app.delete('/api/staff/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  let staff = loadJson<any[]>(STAFF_FILE, INITIAL_STAFF);
  const initialLength = staff.length;
  staff = staff.filter((s) => s.id !== id);
  if (staff.length === initialLength) {
    return res.status(404).json({ error: 'Staff member not found' });
  }
  saveJson(STAFF_FILE, staff);
  res.json({ success: true, message: 'Staff member deleted' });
});

// Upload skin file endpoint
app.post('/api/staff/upload-skin', requireAdminAuth, (req: Request, res: Response) => {
  const { base64Data, filename } = req.body;
  if (!base64Data || typeof base64Data !== 'string') {
    return res.status(400).json({ error: 'Base64 image data is required' });
  }

  // Validate format and size
  const matches = base64Data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  const rawBase64 = matches ? matches[2] : base64Data;
  const buffer = Buffer.from(rawBase64, 'base64');

  // Limit file size to 2MB
  if (buffer.length > 2 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds 2MB limit' });
  }

  const safeName = `skin-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.png`;
  const targetPath = path.resolve(UPLOADS_DIR, safeName);

  fs.writeFileSync(targetPath, buffer);
  const fileUrl = `/api/uploads/${safeName}`;

  res.json({
    success: true,
    fileUrl,
    message: 'Skin uploaded and stored securely',
  });
});

// 5. Store Endpoints
app.get('/api/store', (_req: Request, res: Response) => {
  const items = loadJson(STORE_FILE, INITIAL_STORE);
  res.json(items);
});

app.post('/api/store', requireAdminAuth, (req: Request, res: Response) => {
  const { name, category, price, summary, perks, icon, webstoreUrl, badge } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const items = loadJson<any[]>(STORE_FILE, INITIAL_STORE);
  const newItem = {
    id: `item-${Date.now()}`,
    name: String(name).trim(),
    category: category ? String(category).trim() : 'Ranks',
    price: parseFloat(price) || 0,
    currency: 'USD',
    badge: badge ? String(badge).trim() : '',
    summary: summary ? String(summary).trim() : '',
    perks: Array.isArray(perks)
      ? perks.map((p) => String(p).trim()).filter(Boolean)
      : typeof perks === 'string'
      ? perks
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean)
      : [],
    icon: icon ? String(icon).trim() : 'Crown',
    webstoreUrl: webstoreUrl ? String(webstoreUrl).trim() : 'https://store.nexusmc.net',
    active: req.body.active !== false,
  };

  items.push(newItem);
  saveJson(STORE_FILE, items);
  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/store/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const items = loadJson<any[]>(STORE_FILE, INITIAL_STORE);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Store item not found' });
  }

  const existing = items[index];
  const perks = req.body.perks !== undefined
    ? Array.isArray(req.body.perks)
      ? req.body.perks
      : typeof req.body.perks === 'string'
      ? req.body.perks.split('\n').map((p: string) => p.trim()).filter(Boolean)
      : existing.perks
    : existing.perks;

  items[index] = {
    ...existing,
    ...req.body,
    perks,
    price: req.body.price !== undefined ? parseFloat(req.body.price) || 0 : existing.price,
    id,
  };

  saveJson(STORE_FILE, items);
  res.json({ success: true, item: items[index] });
});

app.delete('/api/store/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  let items = loadJson<any[]>(STORE_FILE, INITIAL_STORE);
  const initialLength = items.length;
  items = items.filter((i) => i.id !== id);
  if (items.length === initialLength) {
    return res.status(404).json({ error: 'Store item not found' });
  }
  saveJson(STORE_FILE, items);
  res.json({ success: true, message: 'Store item deleted' });
});

// Vite middleware or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexusMC server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
