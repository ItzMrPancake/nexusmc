/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BlogSection } from './components/BlogSection';
import { StaffSection } from './components/StaffSection';
import { StoreSection } from './components/StoreSection';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ServerConfig } from './types';

const DEFAULT_CONFIG: ServerConfig = {
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

function MainApp() {
  const { isAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'blog' | 'staff' | 'store'>('home');
  const [config, setConfig] = useState<ServerConfig>(DEFAULT_CONFIG);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginSectionHint, setLoginSectionHint] = useState<string | undefined>(undefined);
  const [loginSuccessCallback, setLoginSuccessCallback] = useState<(() => void) | undefined>(undefined);

  // Sync hash routing if user opens with #blog or #store
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'blog', 'staff', 'store'].includes(hash)) {
        setActiveTab(hash as 'home' | 'blog' | 'staff' | 'store');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const handleTabChange = (tab: 'home' | 'blog' | 'staff' | 'store') => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch server configuration
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setConfig((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load server config:', err);
      }
    }
    loadConfig();
  }, []);

  const handleOpenOwnerLogin = (hint?: string, onSuccess?: () => void) => {
    setLoginSectionHint(hint);
    setLoginSuccessCallback(() => onSuccess);
    setIsLoginModalOpen(true);
  };

  const handleUpdateConfig = (newConfig: Partial<ServerConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <div className="min-h-screen bg-[#050d14] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navigation Bar following the Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenOwnerLogin={() => handleOpenOwnerLogin('Enter owner password for administrative mode')}
        serverIp={config.serverIp}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {activeTab === 'home' && (
          <HeroSection
            config={config}
            onNavigateToStore={() => handleTabChange('store')}
            onNavigateToBlog={() => handleTabChange('blog')}
          />
        )}

        {activeTab === 'blog' && (
          <BlogSection onOpenOwnerLogin={handleOpenOwnerLogin} />
        )}

        {activeTab === 'staff' && (
          <StaffSection onOpenOwnerLogin={handleOpenOwnerLogin} />
        )}

        {activeTab === 'store' && (
          <StoreSection
            config={config}
            onOpenOwnerLogin={handleOpenOwnerLogin}
            onUpdateConfig={handleUpdateConfig}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        config={config}
        setActiveTab={handleTabChange}
        onOpenOwnerLogin={() => handleOpenOwnerLogin('Enter owner password')}
      />

      {/* Owner Authentication Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginSuccessCallback(undefined);
        }}
        onSuccess={() => {
          loginSuccessCallback?.();
          setLoginSuccessCallback(undefined);
        }}
        sectionHint={loginSectionHint}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <MainApp />
    </AdminAuthProvider>
  );
}
