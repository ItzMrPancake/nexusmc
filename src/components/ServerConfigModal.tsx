import React, { useState } from 'react';
import { ServerConfig } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Settings, X, Save, RotateCcw, Check, AlertCircle, Key, Server, Globe, MessageSquare } from 'lucide-react';
import { saveConfig, resetAllDataToDefaults, getConfig } from '../utils/storage';

interface ServerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ServerConfig;
  onConfigUpdated: (newConfig: ServerConfig) => void;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
}) => {
  const { changePassword } = useAdminAuth();
  const [formData, setFormData] = useState<ServerConfig>({ ...config });
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const saved = saveConfig(formData);
      onConfigUpdated(saved);

      if (newAdminPassword.trim()) {
        if (newAdminPassword.trim().length < 4) {
          setErrorMsg('New password must be at least 4 characters long.');
          return;
        }
        if (changePassword) {
          await changePassword(newAdminPassword.trim());
          setNewAdminPassword('');
        }
      }

      setSuccessMsg('Server settings saved successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch {
      setErrorMsg('Failed to save configuration.');
    }
  };

  const handleResetDefaults = () => {
    if (
      !confirm(
        'Are you sure you want to reset all site data (Store, Staff, Blog, and Server Config) back to original defaults?'
      )
    ) {
      return;
    }

    resetAllDataToDefaults();
    const defaults = getConfig();
    setFormData(defaults);
    onConfigUpdated(defaults);
    setSuccessMsg('All site data has been reset to defaults! Reloading...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0a1824] border border-teal-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 relative text-slate-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Server Network Settings</h2>
            <p className="text-xs text-slate-400">
              Update server IP, ports, branding, webstore, and links directly in the client.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-2 flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Server Name
              </label>
              <input
                type="text"
                name="serverName"
                value={formData.serverName}
                onChange={handleChange}
                required
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Minecraft Server IP
              </label>
              <input
                type="text"
                name="serverIp"
                value={formData.serverIp}
                onChange={handleChange}
                required
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Network Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Java Port
              </label>
              <input
                type="number"
                name="javaPort"
                value={formData.javaPort}
                onChange={handleChange}
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Bedrock Port
              </label>
              <input
                type="number"
                name="bedrockPort"
                value={formData.bedrockPort}
                onChange={handleChange}
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Supported Versions
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Webstore URL
              </label>
              <input
                type="url"
                name="webstoreUrl"
                value={formData.webstoreUrl}
                onChange={handleChange}
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Discord Invite URL
              </label>
              <input
                type="url"
                name="discordUrl"
                value={formData.discordUrl}
                onChange={handleChange}
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors font-mono"
              />
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">
                Change Owner Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current password (default: 241816)"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="w-full bg-[#061017] border border-slate-700 focus:border-teal-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 border border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Site to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
