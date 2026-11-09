export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  coverImage: string;
  featured?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  minecraftIgn: string;
  role: string;
  tier: 'Leadership' | 'Creative & Dev' | 'Moderation' | 'Staff Team' | string;
  rankBadgeColor?: string;
  bio: string;
  joined: string;
  discord: string;
  avatarUrl: string;
  skinData?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'Ranks' | 'Crate Keys' | 'Boosters' | string;
  price: number;
  currency: string;
  badge?: string;
  summary: string;
  perks: string[];
  icon: string;
  webstoreUrl: string;
  active: boolean;
}

export interface ServerConfig {
  serverName: string;
  tagline: string;
  serverIp: string;
  bedrockPort: number;
  javaPort: number;
  version: string;
  webstoreUrl: string;
  discordUrl: string;
  simulatedPlayers: number;
  maxPlayers: number;
  pingMs: number;
}
