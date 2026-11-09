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
import { ServerConfigModal } from './components/ServerConfigModal';
import { ServerConfig } from './types';
import { getConfig, saveConfig } from './utils/storage';

function MainApp() {
  const { isAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'blog' | 'staff' | 'store'>('home');
  const [config, setConfig] = useState<ServerConfig>(getConfig);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
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

  const handleOpenOwnerLogin = (hint?: string, onSuccess?: () => void) => {
    setLoginSectionHint(hint);
    setLoginSuccessCallback(() => onSuccess);
    setIsLoginModalOpen(true);
  };

  const handleOpenSettings = () => {
    if (!isAdmin) {
      handleOpenOwnerLogin('Enter owner password to edit Server Network Settings', () => {
        setIsSettingsModalOpen(true);
      });
    } else {
      setIsSettingsModalOpen(true);
    }
  };

  const handleUpdateConfig = (newConfig: Partial<ServerConfig>) => {
    const updated = saveConfig(newConfig);
    setConfig(updated);
  };

  return (
    <div className="min-h-screen bg-[#050d14] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navigation Bar following the Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenOwnerLogin={() => handleOpenOwnerLogin('Enter owner password for administrative mode')}
        onOpenSettings={handleOpenSettings}
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
        onOpenSettings={handleOpenSettings}
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

      {/* Server Network Settings Modal */}
      <ServerConfigModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onConfigUpdated={(newCfg) => setConfig(newCfg)}
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
