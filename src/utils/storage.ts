import { ServerConfig, StoreItem, StaffMember, BlogPost } from '../types';

// Storage keys
const STORAGE_KEYS = {
  CONFIG: 'nexusmc_config',
  STORE: 'nexusmc_store_items',
  STAFF: 'nexusmc_staff_list',
  BLOG: 'nexusmc_blog_posts',
  ADMIN_TOKEN: 'nexusmc_owner_token',
  ADMIN_CUSTOM_PWD_HASH: 'nexusmc_custom_pwd_hash',
};

// Default Server Configuration
export const DEFAULT_CONFIG: ServerConfig = {
  serverName: 'NexusMC',
  tagline: 'The Premier Blue-Tea Enchanted Minecraft Network',
  serverIp: 'nexusmc.ultramc.co',
  bedrockPort: 22924,
  javaPort: 22924,
  version: 'Java & Bedrock 1.20 - 1.21.x',
  webstoreUrl: 'https://store.nexusmc.net',
  discordUrl: 'https://discord.gg/HFJYHcsvJy',
  simulatedPlayers: 0,
  maxPlayers: 20,
  pingMs: 19,
};

// Default Store Items
export const DEFAULT_STORE_ITEMS: StoreItem[] = [
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
    price: 12.5,
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
    name: '10x Dungeon Raid Keys',
    category: 'Crate Keys',
    price: 18.0,
    currency: 'USD',
    badge: 'Dungeon Pack',
    summary: 'Direct access keys to unlock high-tier mythic dungeon reward chests after slaying boss encounters.',
    perks: [
      '10x Mythic Dungeon Vault Keys',
      'Instant reward claim at Dungeon Outpost',
      'Bonus 2x Relic Fragments per unlock',
      'Tradeable with other players on the auction house',
    ],
    icon: 'Key',
    webstoreUrl: 'https://store.nexusmc.net/category/crates',
    active: true,
  },
  {
    id: 'item-6',
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

// Default Staff Members
export const DEFAULT_STAFF: StaffMember[] = [
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
    bio: 'Designed the floating celestial spawn, custom dungeon arenas, and seasonal holiday hubs.',
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

// Default Blog Posts
export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'NexusMC Realm Launch & Welcome to Season 1',
    slug: 'nexusmc-realm-launch-season-1',
    category: 'Announcement',
    author: 'Astraea',
    authorRole: 'Server Owner',
    date: 'Nov 9, 2026',
    readTime: '3 min read',
    summary: 'The gates to NexusMC are officially open! Experience our custom-engineered Survival SMP and handcrafted dungeon raid encounters.',
    content: `Welcome to the grand opening of **NexusMC**!

Over the past several months, our development team has put hundreds of hours into crafting a unique Minecraft multiplayer experience that merges the freedom of open-world survival with high-stakes PvE dungeon challenges.

### What to Expect in Season 1:
- **Floating Celestial Spawn Hub**: Explore shops, player trading halls, and quest boards.
- **Custom Dungeons**: Brave multi-floor dungeons with mythic bosses and relic drops.
- **Survival SMP**: Claim land, build towns, trade on the auction house, and level up McMMO skills.
- **Bedrock & Java Crossplay**: Connect seamlessly using **nexusmc.ultramc.co** on both platforms!

Grab your starter kit in-game with \`/kit starter\` and join our Discord community for weekly drop parties and tournaments!`,
    coverImage: '/src/assets/images/blog_nexusmc_update_1794187185782.jpg',
    featured: true,
  },
  {
    id: 'post-2',
    title: 'Custom Dungeons & Mythic Boss Chambers Released',
    slug: 'custom-dungeons-mythic-bosses',
    category: 'Server Update',
    author: 'Kairos',
    authorRole: 'Lead Architect',
    date: 'Nov 7, 2026',
    readTime: '4 min read',
    summary: 'Step through the dungeon portal to challenge the Catacombs of Eternity. Team up with your party to defeat bosses and earn rare relic gear.',
    content: `Adventurers, the sealed gates beneath spawn have finally opened.

The **Catacombs of Eternity** are now live for all players who have reached Level 10 or party up at the dungeon portal.

### Dungeon Highlights:
1. **Dynamic Scaling**: The dungeon difficulty scales dynamically based on party size (1–4 players).
2. **Boss Mechanics**: Face the *Celestial Warden*, featuring telegraphed ground slams and summon phases.
3. **Relic Vaults**: Collect Mythic Dungeon Keys to unlock the relic chest upon completing the final room.

Prepare your best gear and potions before heading inside!`,
    coverImage: '/src/assets/images/hero_nexusmc_spawn_1794187184123.jpg',
    featured: false,
  },
  {
    id: 'post-3',
    title: 'Weekend Community Tournament & Key Giveaway',
    slug: 'weekend-community-tournament',
    category: 'Community Event',
    author: 'Vortex',
    authorRole: 'Head Admin',
    date: 'Nov 5, 2026',
    readTime: '2 min read',
    summary: 'Join our Saturday tournament event with exclusive crate keys, donor ranks, and discord perks up for grabs!',
    content: `This Saturday at 7 PM EST, NexusMC will host our first weekly community minigame tournament!

### Event Prizes:
- **1st Place**: 1 Month Nexus+ VIP Rank + 10x Celestial Crate Keys
- **2nd Place**: MVP Rank + 5x Celestial Crate Keys
- **3rd Place**: VIP Rank + 3x Crate Keys
- **All Participants**: 1x Rare Crate Key + Discord Event Trophy Role

Be sure to link your Minecraft account in our Discord server to claim your tournament slot!`,
    coverImage: '/src/assets/images/store_nexusmc_items_1794187185099.jpg',
    featured: false,
  },
];

// Helper: Safely read from localStorage
function readStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    return parsed ?? defaultValue;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err);
    return defaultValue;
  }
}

// Helper: Safely write to localStorage
function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage:`, err);
  }
}

// ==========================================
// CONFIGURATION CRUD
// ==========================================

export function getConfig(): ServerConfig {
  const stored = readStorage<Partial<ServerConfig>>(STORAGE_KEYS.CONFIG, {});
  return { ...DEFAULT_CONFIG, ...stored };
}

export function saveConfig(updates: Partial<ServerConfig>): ServerConfig {
  const current = getConfig();
  const updated: ServerConfig = { ...current, ...updates };
  writeStorage(STORAGE_KEYS.CONFIG, updated);
  return updated;
}

// ==========================================
// STORE ITEMS CRUD
// ==========================================

export function getStoreItems(): StoreItem[] {
  return readStorage<StoreItem[]>(STORAGE_KEYS.STORE, DEFAULT_STORE_ITEMS);
}

export function saveStoreItems(items: StoreItem[]): void {
  writeStorage(STORAGE_KEYS.STORE, items);
}

export function addStoreItem(item: Omit<StoreItem, 'id'>): StoreItem {
  const items = getStoreItems();
  const newItem: StoreItem = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };
  const updated = [newItem, ...items];
  saveStoreItems(updated);
  return newItem;
}

export function updateStoreItem(id: string, updates: Partial<StoreItem>): StoreItem | null {
  const items = getStoreItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const updatedItem: StoreItem = { ...items[index], ...updates };
  items[index] = updatedItem;
  saveStoreItems(items);
  return updatedItem;
}

export function deleteStoreItem(id: string): boolean {
  const items = getStoreItems();
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  saveStoreItems(filtered);
  return true;
}

// ==========================================
// STAFF CRUD
// ==========================================

export function getStaff(): StaffMember[] {
  return readStorage<StaffMember[]>(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
}

export function saveStaff(staff: StaffMember[]): void {
  writeStorage(STORAGE_KEYS.STAFF, staff);
}

export function addStaff(member: Omit<StaffMember, 'id'>): StaffMember {
  const staff = getStaff();
  const newMember: StaffMember = {
    ...member,
    id: `staff-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };
  const updated = [...staff, newMember];
  saveStaff(updated);
  return newMember;
}

export function updateStaff(id: string, updates: Partial<StaffMember>): StaffMember | null {
  const staff = getStaff();
  const index = staff.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const updatedMember: StaffMember = { ...staff[index], ...updates };
  staff[index] = updatedMember;
  saveStaff(staff);
  return updatedMember;
}

export function deleteStaff(id: string): boolean {
  const staff = getStaff();
  const filtered = staff.filter((m) => m.id !== id);
  if (filtered.length === staff.length) return false;
  saveStaff(filtered);
  return true;
}

// ==========================================
// BLOG POSTS CRUD
// ==========================================

export function getBlogPosts(): BlogPost[] {
  return readStorage<BlogPost[]>(STORAGE_KEYS.BLOG, DEFAULT_BLOG_POSTS);
}

export function saveBlogPosts(posts: BlogPost[]): void {
  writeStorage(STORAGE_KEYS.BLOG, posts);
}

export function addBlogPost(post: Omit<BlogPost, 'id' | 'slug' | 'date'>): BlogPost {
  const posts = getBlogPosts();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newPost: BlogPost = {
    ...post,
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    slug: slug || `post-${Date.now()}`,
    date: dateStr,
  };

  const updated = [newPost, ...posts];
  saveBlogPosts(updated);
  return newPost;
}

export function updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const posts = getBlogPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedPost: BlogPost = { ...posts[index], ...updates };
  posts[index] = updatedPost;
  saveBlogPosts(posts);
  return updatedPost;
}

export function deleteBlogPost(id: string): boolean {
  const posts = getBlogPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  saveBlogPosts(filtered);
  return true;
}

// ==========================================
// RESET TO DEFAULTS
// ==========================================

export function resetAllDataToDefaults(): void {
  localStorage.removeItem(STORAGE_KEYS.CONFIG);
  localStorage.removeItem(STORAGE_KEYS.STORE);
  localStorage.removeItem(STORAGE_KEYS.STAFF);
  localStorage.removeItem(STORAGE_KEYS.BLOG);
}
