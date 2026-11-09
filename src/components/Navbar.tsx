import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Lock, Activity } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface NavbarProps {
  activeTab: 'home' | 'blog' | 'staff' | 'store';
  setActiveTab: (tab: 'home' | 'blog' | 'staff' | 'store') => void;
  onOpenOwnerLogin: () => void;
  onOpenSettings?: () => void;
  serverIp: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenOwnerLogin,
  onOpenSettings,
  serverIp,
}) => {
  const { isAdmin, logout } = useAdminAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050c13]/95 backdrop-blur-md border-b border-[#132534] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single clean text element, no AI fluff) */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3.5 text-left focus:outline-none shrink-0 group"
        >
          {/* Voxel emblem */}
          <div className="w-9 h-9 rounded-lg bg-[#0a1824] border border-[#1b3b52] flex items-center justify-center text-teal-400 group-hover:border-teal-400 transition-colors shadow-sm">
            <svg
              className="w-5 h-5 text-teal-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-black tracking-wider uppercase text-white font-mono">
              Nexus<span className="text-teal-400">MC</span>
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-0.5">
              Network Portal
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean single-line text links with subtle hover underlines) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap transition-colors py-2 relative ${
              activeTab === 'home'
                ? 'text-teal-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`whitespace-nowrap transition-colors py-2 relative ${
              activeTab === 'blog'
                ? 'text-teal-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Blog & Updates
            {activeTab === 'blog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`whitespace-nowrap transition-colors py-2 relative ${
              activeTab === 'staff'
                ? 'text-teal-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff Roster
            {activeTab === 'staff' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`whitespace-nowrap transition-colors py-2 relative ${
              activeTab === 'store'
                ? 'text-teal-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Server Store
            {activeTab === 'store' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action (Professional Connection Control) */}
        <div className="flex items-center gap-3 shrink-0">
          {isAdmin && (
            <div className="flex items-center gap-2 bg-[#091f2e] border border-teal-500/40 rounded-lg px-2.5 py-1.5 text-xs text-teal-300">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] font-mono font-medium hidden sm:inline">Owner Verified</span>
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="text-[10px] font-mono text-teal-300 hover:text-white underline ml-1 cursor-pointer"
                  title="Edit Server Network Settings"
                >
                  Settings
                </button>
              )}
              <button
                onClick={logout}
                className="text-[10px] font-mono text-slate-400 hover:text-white underline ml-1 cursor-pointer"
                title="Log out of owner controls"
              >
                Lock
              </button>
            </div>
          )}

          {/* Professional Server IP Copy Button */}
          <button
            onClick={handleCopyIp}
            className={`group px-3.5 py-2 rounded-lg border text-xs font-mono transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
              copied
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-[#0a1b28] hover:bg-[#0e2436] border-[#1b3e57] hover:border-teal-400/60 text-slate-200'
            }`}
            title="Click to copy server IP"
          >
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
              <span className="text-slate-400 hidden sm:inline">JOIN:</span>
            </div>

            <span className="font-bold text-white tracking-wide">{serverIp}</span>

            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-teal-400/80 group-hover:text-teal-300 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-[#132534] bg-[#050d15] text-[11px] font-semibold uppercase">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1 rounded ${
            activeTab === 'home' ? 'text-teal-300 bg-[#0c2232]' : 'text-slate-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-3 py-1 rounded ${
            activeTab === 'blog' ? 'text-teal-300 bg-[#0c2232]' : 'text-slate-400'
          }`}
        >
          Blog
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-1 rounded ${
            activeTab === 'staff' ? 'text-teal-300 bg-[#0c2232]' : 'text-slate-400'
          }`}
        >
          Staff
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`px-3 py-1 rounded ${
            activeTab === 'store' ? 'text-teal-300 bg-[#0c2232]' : 'text-slate-400'
          }`}
        >
          Store
        </button>
      </div>
    </header>
  );
};
