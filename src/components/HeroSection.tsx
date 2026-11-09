import React, { useState } from 'react';
import { Copy, Check, Users, Compass, Swords, Pickaxe, ArrowRight, ExternalLink, Box, Castle, Flame, Shield, Radio, Activity } from 'lucide-react';
import { ServerConfig } from '../types';
import { useMinecraftLiveStatus } from '../utils/useMinecraftLiveStatus';

interface HeroSectionProps {
  config: ServerConfig;
  onNavigateToStore: () => void;
  onNavigateToBlog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onNavigateToStore,
  onNavigateToBlog,
}) => {
  const [copied, setCopied] = useState(false);
  const targetIp = config.serverIp || 'nexusmc.ultramc.co';
  const liveStatus = useMinecraftLiveStatus(targetIp);

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText(targetIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const gamemodes = [
    {
      title: 'Survival SMP Realm',
      icon: Compass,
      tag: 'Flagship Realm',
      description: 'Expansive open-world survival enhanced with player claims, town warps, community chest shops, and balanced vanilla-plus progression.',
      features: ['Town & Land Protection', 'Player Economy & Markets', 'Custom Enchants', 'Jobs & Skills System'],
    },
    {
      title: 'Custom Dungeons & Boss Raids',
      icon: Castle,
      tag: 'PvE Adventure',
      description: 'Challenging handcrafted dungeon levels, mythical boss battles, ancient puzzles, and exclusive legendary gear drops found nowhere else.',
      features: ['Multi-Floor Dungeons', 'Mythic Boss Encounters', 'Unique Relic Weapons', 'Party Raid Scaling'],
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Professional Dark Geometric Hero Banner with Crisp Voxel Accents (No AI Artifacts) */}
      <section className="relative rounded-2xl overflow-hidden border border-[#142838] bg-[#061018] shadow-2xl">
        {/* Crisp Isometric Voxel Mesh Backdrop (100% Geometric, Zero AI Fluff) */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="isometric-grid" width="60" height="104" patternUnits="userSpaceOnUse">
                {/* Isometric cube outline */}
                <path
                  d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z"
                  fill="none"
                  stroke="#102b3d"
                  strokeWidth="0.75"
                />
                <path
                  d="M30 0 L30 34.64 L0 17.32 M30 34.64 L60 17.32 M30 34.64 L30 69.28"
                  fill="none"
                  stroke="#102b3d"
                  strokeWidth="0.75"
                />
                <path
                  d="M30 69.28 L60 86.6 L60 121.24 L30 138.56 L0 121.24 L0 86.6 Z"
                  fill="none"
                  stroke="#102b3d"
                  strokeWidth="0.75"
                />
                <path
                  d="M30 69.28 L30 103.92 L0 86.6 M30 103.92 L60 86.6 M30 103.92 L30 138.56"
                  fill="none"
                  stroke="#102b3d"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#isometric-grid)" />
          </svg>
        </div>

        {/* Ambient Radial Deep Blue Tea Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Authoritative, Professional Typography featuring Custom Dungeons & Survival SMP */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold tracking-wider uppercase text-teal-400">
                <span className="w-1.5 h-1.5 rounded-sm bg-teal-400" />
                <span>NEXUSMC NETWORK</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">CUSTOM DUNGEONS & SURVIVAL SMP</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] font-sans">
                Conquer <span className="text-teal-400">Custom Dungeons</span>. Rule the <span className="text-cyan-400">Survival SMP</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Dive into multi-floor custom dungeon chambers with epic boss raids and rare relic weapons, or claim your territory and thrive in our community-driven Survival SMP realm.
              </p>

              {/* Action Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={handleCopyIp}
                  className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2.5 shadow-lg ${
                    copied
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-teal-500/20'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>COPIED: {targetIp}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY IP: {targetIp}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onNavigateToStore}
                  className="px-4 py-3 rounded-xl text-xs font-semibold text-slate-200 bg-[#0a1b26] hover:bg-[#0e2738] border border-[#193b54] hover:border-teal-400/50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Browse Webstore</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                </button>
              </div>

              {/* Server Ports & Specifications */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-[#122736]">
                <div className="flex items-center gap-1.5">
                  <span className="text-teal-400 font-semibold">Address:</span>
                  <code className="text-slate-200 bg-slate-900/60 px-2 py-0.5 rounded">{targetIp}</code>
                </div>
                <span className="text-slate-700">·</span>
                <div>
                  <span className="text-cyan-400 font-semibold">Version:</span> {liveStatus.version || config.version}
                </div>
                <span className="text-slate-700">·</span>
                <div className="text-slate-400">
                  Java & Bedrock
                </div>
              </div>
            </div>

            {/* Right Column: Clean Telemetry Panel featuring Live Scanner, Custom Dungeons & Survival SMP */}
            <div className="lg:col-span-5">
              <div className="bg-[#091722] border border-[#16354b] rounded-xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#12283a]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${liveStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      {liveStatus.online ? 'Network Online' : 'Scanning Server...'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Radio className={`w-3 h-3 text-teal-400 ${liveStatus.isScanning ? 'animate-spin' : ''}`} />
                    <span>Live Ping Scanner</span>
                  </span>
                </div>

                {/* Player count metrics */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between text-xs font-mono">
                    <span className="uppercase text-slate-400 tracking-wider">
                      Online Players
                    </span>
                    <span className="text-xl font-bold text-white tabular-nums">
                      {liveStatus.players.online}{' '}
                      <span className="text-xs font-normal text-slate-400">/ {liveStatus.players.max || 20}</span>
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-[#050f16] overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(
                          liveStatus.players.online > 0 ? (liveStatus.players.online / (liveStatus.players.max || 20)) * 100 : 5
                        ))}%`
                      }}
                    />
                  </div>

                  {liveStatus.motd && liveStatus.motd.length > 0 && (
                    <p className="text-[11px] text-teal-300 font-mono pt-1 truncate">
                      MOTD: {liveStatus.motd[0]}
                    </p>
                  )}
                </div>

                {/* Custom Dungeons & Survival SMP Spotlight Cards (Replacing hardware speed specs) */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-[#050e16] border border-[#112738]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono mb-1">
                      <Compass className="w-3.5 h-3.5 text-teal-400" />
                      <span>FEATURED</span>
                    </div>
                    <span className="font-bold text-white block">Survival SMP</span>
                    <span className="text-[10px] text-teal-400/90 font-mono">Claims & Economy</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050e16] border border-[#112738]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono mb-1">
                      <Castle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ADVENTURE</span>
                    </div>
                    <span className="font-bold text-white block">Custom Dungeons</span>
                    <span className="text-[10px] text-cyan-400/90 font-mono">Bosses & Relics</span>
                  </div>
                </div>

                {/* Discord Link */}
                <a
                  href={config.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#0b1d2a] hover:bg-[#102738] border border-[#17374e] flex items-center justify-center gap-2 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>Join Discord Community</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Gamemodes Bento Grid */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#142838]">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 block mb-1">
              REALM CLUSTERS
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Featured Game Realms
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Jump directly into our custom dungeon raids or start building in the Survival SMP realm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {gamemodes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-xl bg-[#07141f] border border-[#142d40] hover:border-teal-500/40 transition-colors shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0a1e2d] border border-[#183a52] flex items-center justify-center text-teal-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-teal-300 bg-[#092233] border border-teal-800/40 px-2.5 py-0.5 rounded">
                      {mode.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                    {mode.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#112739] text-xs text-slate-300">
                  {mode.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal-400" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Connection Instructions in 3 Steps */}
      <section className="p-8 rounded-2xl bg-[#06121c] border border-[#142d40] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 block mb-1">
              QUICK START
            </span>
            <h3 className="text-lg font-bold text-white">How to Connect to NexusMC</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Compatible with Minecraft 1.20 - 1.21.x</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-[#081724] border border-[#142f44] space-y-2">
            <span className="text-xs font-mono font-bold text-teal-400">STEP 01</span>
            <h4 className="text-sm font-bold text-white">Launch Minecraft Client</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open Minecraft (Java or Bedrock) and navigate to the Multiplayer menu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#081724] border border-[#142f44] space-y-2">
            <span className="text-xs font-mono font-bold text-teal-400">STEP 02</span>
            <h4 className="text-sm font-bold text-white">Add Server Address</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add server <span className="text-white font-semibold">NexusMC</span> and enter address <code className="text-teal-300 font-mono">{targetIp}</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#081724] border border-[#142f44] space-y-2">
            <span className="text-xs font-mono font-bold text-teal-400">STEP 03</span>
            <h4 className="text-sm font-bold text-white">Connect & Play</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click Connect to join the lobby and warp directly to Survival SMP or Custom Dungeons.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
