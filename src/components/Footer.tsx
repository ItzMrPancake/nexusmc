import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ServerConfig } from '../types';

interface FooterProps {
  config: ServerConfig;
  setActiveTab: (tab: 'home' | 'blog' | 'staff' | 'store') => void;
  onOpenOwnerLogin: () => void;
  onOpenSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  setActiveTab,
  onOpenOwnerLogin,
  onOpenSettings,
}) => {
  const { isAdmin, logout } = useAdminAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText(config.serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <footer className="w-full bg-[#040b10] border-t border-teal-950/60 text-slate-400 text-xs mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-400 flex items-center justify-center font-minecraft text-lg text-slate-950 font-bold">
                N
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Nexus<span className="text-teal-400">MC</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier blue-tea enchanted Minecraft network featuring custom dungeons, balanced Survival SMP, and community-driven progression.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={handleCopyIp}
                className="text-[11px] font-mono text-teal-300 hover:text-teal-200 flex items-center gap-1.5 bg-[#071622] border border-teal-900/40 px-3 py-1 rounded-lg"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{config.serverIp}</span>
              </button>
              <a
                href={config.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <span>Discord</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 flex justify-start md:justify-end">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-2">
                Navigation
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Home & Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('blog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Blog & Patch Notes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('staff');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Staff Roster & Skins
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('store');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    In-Game Store
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer with super small bottom-left admin link */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <p>
              &copy; {new Date().getFullYear()} NexusMC Network. All rights reserved. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
            </p>
            {/* Discreet owner button at bottom-left */}
            <div className="flex items-center gap-2">
              <button
                onClick={isAdmin ? logout : onOpenOwnerLogin}
                className="text-[11px] text-slate-400 hover:text-teal-300 font-mono transition-colors tracking-tight select-none cursor-pointer px-2.5 py-1 rounded bg-[#07131d] border border-slate-800/80 hover:border-teal-500/40 flex items-center gap-1.5"
                title={isAdmin ? "Owner session active (click to lock)" : "Admin Editor"}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-emerald-400' : 'bg-teal-400'}`} />
                <span>{isAdmin ? 'admin: active (logout)' : 'admin editor'}</span>
              </button>
              {isAdmin && onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="text-[11px] text-teal-300 hover:text-white font-mono transition-colors tracking-tight select-none cursor-pointer px-2.5 py-1 rounded bg-[#07131d] border border-teal-500/30 hover:border-teal-400 flex items-center gap-1.5"
                  title="Configure server settings"
                >
                  <span>settings</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Java & Bedrock Compatible</span>
            <span aria-hidden="true">·</span>
            <span>Blue Tea Palette</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
