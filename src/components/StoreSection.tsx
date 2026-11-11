import React, { useState, useEffect } from 'react';
import { StoreItem, ServerConfig } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { loadStoreItems, saveStoreItems, INITIAL_STORE_ITEMS } from '../utils/localStore';
import { ShoppingBag, ExternalLink, Crown, Shield, Star, Key, Zap, Check, Edit3, Trash2, X, Settings2, Sparkles, RotateCcw } from 'lucide-react';

interface StoreSectionProps {
  config: ServerConfig;
  onOpenOwnerLogin: (hint?: string, onSuccess?: () => void) => void;
  onUpdateConfig?: (newConfig: Partial<ServerConfig>) => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  config,
  onOpenOwnerLogin,
  onUpdateConfig,
}) => {
  const { isAdmin } = useAdminAuth();
  // Pure local storage master state - never erased by server reboots
  const [storeItems, setStoreItems] = useState<StoreItem[]>(() => loadStoreItems());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Store Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);

  // New item form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ranks');
  const [price, setPrice] = useState('14.99');
  const [badge, setBadge] = useState('');
  const [summary, setSummary] = useState('');
  const [perksText, setPerksText] = useState('');
  const [icon, setIcon] = useState('Crown');
  const [itemWebstoreUrl, setItemWebstoreUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Webstore URL global config editor
  const [globalWebstoreUrl, setGlobalWebstoreUrl] = useState(config.webstoreUrl);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Sync from localStorage on mount and window focus
  useEffect(() => {
    const items = loadStoreItems();
    setStoreItems(items);

    const handleStorageChange = () => {
      setStoreItems(loadStoreItems());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'crown':
        return Crown;
      case 'shield':
        return Shield;
      case 'star':
        return Star;
      case 'key':
        return Key;
      case 'zap':
        return Zap;
      default:
        return Sparkles;
    }
  };

  // Only display active / available items in the player catalog as instructed:
  // "the store part only has the avaible things"
  const availableItems = storeItems.filter((item) => item.active);

  // Exact categories: Ranks, Crate Keys, Boosters (NO Currencies)
  const categories = ['All', 'Ranks', 'Crate Keys', 'Boosters'];

  const filteredItems = availableItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleOpenEditor = () => {
    if (!isAdmin) {
      onOpenOwnerLogin('Enter owner password to open Store & Ranks Editor', () => {
        setIsEditorOpen(true);
      });
    } else {
      setIsEditorOpen(true);
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      setFormError('Item name and price are required');
      return;
    }

    setFormError(null);

    // Every line formatted as a distinct feature you get
    const perksArray = perksText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    let updatedList: StoreItem[];

    if (editingItem) {
      const updatedItem: StoreItem = {
        ...editingItem,
        name: name.trim(),
        category,
        price: parseFloat(price) || 0,
        currency: 'USD',
        badge: badge.trim(),
        summary: summary.trim(),
        perks: perksArray,
        icon,
        webstoreUrl: itemWebstoreUrl.trim() || config.webstoreUrl,
        active: isActive,
      };
      updatedList = storeItems.map((item) => (item.id === editingItem.id ? updatedItem : item));
      setFormSuccess(`Rank "${updatedItem.name}" saved! Permanently stored.`);
    } else {
      const newItem: StoreItem = {
        id: `rank-${Date.now()}`,
        name: name.trim(),
        category,
        price: parseFloat(price) || 0,
        currency: 'USD',
        badge: badge.trim(),
        summary: summary.trim(),
        perks: perksArray,
        icon,
        webstoreUrl: itemWebstoreUrl.trim() || config.webstoreUrl,
        active: isActive,
      };
      updatedList = [newItem, ...storeItems];
      setFormSuccess(`Rank "${newItem.name}" created! Permanently stored.`);
    }

    // Direct, uneraseable persistence
    saveStoreItems(updatedList);
    setStoreItems(updatedList);
    resetForm();
    setTimeout(() => setFormSuccess(null), 3500);
  };

  const handleStartEdit = (item: StoreItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category || 'Ranks');
    setPrice(String(item.price));
    setBadge(item.badge || '');
    setSummary(item.summary || '');
    setPerksText(item.perks?.join('\n') || '');
    setIcon(item.icon || 'Crown');
    setItemWebstoreUrl(item.webstoreUrl || '');
    setIsActive(item.active);
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('Are you sure you want to remove this item from the store?')) return;
    const updatedList = storeItems.filter((item) => item.id !== id);
    saveStoreItems(updatedList);
    setStoreItems(updatedList);
    if (editingItem && editingItem.id === id) {
      resetForm();
    }
  };

  const handleToggleItemActive = (item: StoreItem) => {
    const updatedList = storeItems.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i));
    saveStoreItems(updatedList);
    setStoreItems(updatedList);
  };

  const handleResetToDefaults = () => {
    if (!confirm('Reset all ranks & crate keys to original default templates?')) return;
    saveStoreItems(INITIAL_STORE_ITEMS);
    setStoreItems(INITIAL_STORE_ITEMS);
    resetForm();
    setFormSuccess('Store reset to defaults!');
    setTimeout(() => setFormSuccess(null), 3000);
  };

  const handleUpdateGlobalUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig?.({ webstoreUrl: globalWebstoreUrl });
    setFormSuccess('Server webstore URL updated!');
    setTimeout(() => setFormSuccess(null), 3000);
  };

  const resetForm = () => {
    setEditingItem(null);
    setName('');
    setCategory('Ranks');
    setPrice('14.99');
    setBadge('');
    setSummary('');
    setPerksText('');
    setIcon('Crown');
    setItemWebstoreUrl('');
    setIsActive(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Store Header & Webstore Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-teal-500/30 bg-[#071622] p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-300">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Official NexusMC Webstore</span>
            <span aria-hidden="true">·</span>
            <span>Instant Automated Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            In-Game Ranks & Perks
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Every purchase directly supports our high-performance dedicated server nodes, custom plugin development, and 20.0 TPS hardware. All items are dispatched automatically to your Minecraft account in under 60 seconds!
          </p>

          {/* Main Webstore External Link Banner as requested */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={config.webstoreUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 hover:from-teal-300 hover:to-cyan-300 transition-all flex items-center gap-2 shadow-xl shadow-teal-500/25 hover:scale-[1.02]"
            >
              <span>Visit Main Webstore</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <span className="text-xs text-slate-400 font-mono">
              Store URL: <span className="text-teal-300">{config.webstoreUrl}</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Bar (Ranks, Crate Keys, Boosters - NO Currencies) */}
      <section className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#142838]">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-[#081722] text-slate-400 hover:text-white border border-[#142d40]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-teal-300 tabular-nums">{filteredItems.length}</span> available items
        </div>
      </section>

      {/* 3. Available Store Items Grid (Only available items shown to players) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
          const Icon = getIconComponent(item.icon);
          const buyUrl = item.webstoreUrl || config.webstoreUrl;

          return (
            <div
              key={item.id}
              className="group rounded-3xl bg-[#081822] border border-teal-900/40 hover:border-teal-400/60 transition-all duration-300 p-8 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Header row: Icon, Category & Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform shadow-lg shadow-teal-500/10">
                    <Icon className="w-6 h-6" />
                  </div>
                  {item.badge && (
                    <span className="text-[11px] font-bold text-teal-300 bg-teal-950/70 border border-teal-700/50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Title & Price */}
                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wider text-teal-400/80 font-semibold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                    {item.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      {item.currency}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {item.summary}
                </p>

                {/* Perks List: Every line formatted as an included feature with a checkmark */}
                <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block mb-2">
                    Features Included:
                  </span>
                  {item.perks?.map((perk, pIndex) => (
                    <div key={pIndex} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: Direct link to external store */}
              <div className="pt-8 mt-6 border-t border-slate-800/80">
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 group/btn"
                >
                  <span>Buy on Webstore</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. EDITOR ACCESS AT THE VERY BOTTOM */}
      {isAdmin ? (
        <section className="pt-8 border-t border-teal-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-teal-300">
                Owner Store Management Active
              </p>
              <p className="text-[11px] text-slate-400">
                Modify ranks, crate keys, prices, and line-by-line feature perks
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
            <span>Store Item & Ranks Editor</span>
          </button>
        </section>
      ) : (
        <section className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-white">Store Item & Ranks Editor</div>
            <div className="text-[11px] text-slate-400">
              Modify ranks, crate keys, prices, and line-by-line perks
            </div>
          </div>
          <button
            onClick={handleOpenEditor}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer"
            title="Open Admin Editor"
          >
            <Settings2 className="w-4 h-4" />
            <span>Admin Editor</span>
          </button>
        </section>
      )}

      {/* 5. STORE ITEM EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] bg-[#081822] border border-teal-500/40 rounded-3xl shadow-2xl flex flex-col text-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-teal-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Store Item & Ranks Editor</h2>
                  <p className="text-xs text-slate-400">
                    Create, modify, reprice, and format in-game ranks, crate keys, and boosters.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Reset to default items"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditorOpen(false);
                    resetForm();
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close store editor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {/* Global Webstore URL Configuration */}
              <div className="p-4 rounded-2xl bg-[#050f16] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                    Global Webstore URL
                  </label>
                  <p className="text-[11px] text-slate-400">
                    The destination webstore link where players purchase ranks and keys.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={globalWebstoreUrl}
                    onChange={(e) => setGlobalWebstoreUrl(e.target.value)}
                    className="bg-[#081822] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono w-60"
                  />
                  <button
                    onClick={handleUpdateGlobalUrl}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors"
                  >
                    Save URL
                  </button>
                </div>
              </div>

              {/* Add / Edit Item Form */}
              <form onSubmit={handleSaveItem} className="p-6 rounded-2xl bg-[#06121b] border border-teal-900/30 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-teal-300 uppercase tracking-wider">
                    {editingItem ? `Editing: ${editingItem.name}` : 'Create New Store Rank or Package'}
                  </h3>
                  {editingItem && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs text-slate-400 hover:text-white underline"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Item / Rank Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nexus+ VIP Rank"
                      className="w-full bg-[#040c12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#040c12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Ranks">Ranks</option>
                      <option value="Crate Keys">Crate Keys</option>
                      <option value="Boosters">Boosters</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Price (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="14.99"
                      className="w-full bg-[#040c12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Badge (Optional)</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. Most Popular"
                      className="w-full bg-[#040c12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Style</label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full bg-[#040c12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Crown">Crown (Ranks)</option>
                      <option value="Shield">Shield (Defender)</option>
                      <option value="Star">Star (VIP)</option>
                      <option value="Key">Key (Crates)</option>
                      <option value="Zap">Zap (Boosters)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Specific Webstore Buy Link</label>
                    <input
                      type="url"
                      value={itemWebstoreUrl}
                      onChange={(e) => setItemWebstoreUrl(e.target.value)}
                      placeholder={config.webstoreUrl}
                      className="w-full bg-[#040c12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Description</label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief description of the package benefits..."
                    className="w-full bg-[#040c12] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Features / Perks (Type one feature per line) *
                    </label>
                    <span className="text-[10px] text-teal-400 font-mono">
                      Every line formats as a feature you get
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={perksText}
                    onChange={(e) => setPerksText(e.target.value)}
                    placeholder="Glowing [NEXUS+] prefix in chat&#10;Access to /fly in personal claims&#10;10x Home points and 5x Vault chests&#10;Weekly Mythic Crate Key drop&#10;Priority queue bypass"
                    className="w-full bg-[#040c12] border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-teal-400"
                    />
                    <span>Available on Store (Checked = Visible to players)</span>
                  </label>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg"
                  >
                    {editingItem ? 'Save Item Changes' : 'Add Item to Catalog'}
                  </button>
                </div>

                {formError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{formSuccess}</span>
                  </div>
                )}
              </form>

              {/* Existing Items Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">All Store Items & Ranks</h3>
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#050f16]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#091a26] text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Rank / Item Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {storeItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-semibold text-white">
                            {item.name}
                            {item.badge && (
                              <span className="ml-2 text-[10px] text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded">
                                {item.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-400">{item.category}</td>
                          <td className="p-3 font-mono font-bold text-teal-300">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleItemActive(item)}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                                item.active
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-950 text-red-400 border border-red-500/30'
                              }`}
                              title="Click to toggle availability"
                            >
                              {item.active ? 'Available' : 'Hidden'}
                            </button>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-teal-300 rounded hover:bg-slate-800"
                              title="Edit item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
