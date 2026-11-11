import { StoreItem, StaffMember, BlogPost, ServerConfig } from '../types';

const STORE_KEY = 'nexusmc_store_items_v2';
const STAFF_KEY = 'nexusmc_staff_members_v2';
const BLOG_KEY = 'nexusmc_blog_posts_v2';
const CONFIG_KEY = 'nexusmc_server_config_v2';

export const INITIAL_STORE_ITEMS: StoreItem[] = [
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
      'Auto-sell chest perk & 15% auction house fee discount'
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
      'Queue priority ahead of regular players'
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
      'Access to VIP-only lounge in spawn citadel'
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
      'Usable in Survival SMP and Custom Dungeons'
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
      'Tradeable with other players on the auction house'
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
      'Stackable with personal booster tokens'
    ],
    icon: 'Zap',
    webstoreUrl: 'https://store.nexusmc.net/category/boosters',
    active: true,
  },
];

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
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

export const INITIAL_CONFIG: ServerConfig = {
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

// --- Store Items Persistence ---
export function loadStoreItems(): StoreItem[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored store items, using fallback:', err);
  }
  // Initialize storage with defaults
  saveStoreItems(INITIAL_STORE_ITEMS);
  return INITIAL_STORE_ITEMS;
}

export function saveStoreItems(items: StoreItem[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
    // Optional background sync to backend if available, without blocking or erroring
    fetch('/api/store/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    }).catch(() => {});
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }
}

// --- Staff Members Persistence ---
export function loadStaffMembers(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored staff members, using fallback:', err);
  }
  saveStaffMembers(INITIAL_STAFF_MEMBERS);
  return INITIAL_STAFF_MEMBERS;
}

export function saveStaffMembers(members: StaffMember[]): void {
  try {
    localStorage.setItem(STAFF_KEY, JSON.stringify(members));
    fetch('/api/staff/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(members),
    }).catch(() => {});
  } catch (err) {
    console.error('LocalStorage write failed for staff:', err);
  }
}

// --- Blog Posts Persistence ---
export function loadBlogPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(BLOG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored blog posts:', err);
  }
  return [];
}

export function saveBlogPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(BLOG_KEY, JSON.stringify(posts));
    fetch('/api/blog/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posts),
    }).catch(() => {});
  } catch (err) {
    console.error('LocalStorage write failed for blog:', err);
  }
}

// --- Server Config Persistence ---
export function loadServerConfig(): ServerConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...INITIAL_CONFIG, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored config:', err);
  }
  return INITIAL_CONFIG;
}

export function saveServerConfig(config: ServerConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('LocalStorage write failed for config:', err);
  }
}
