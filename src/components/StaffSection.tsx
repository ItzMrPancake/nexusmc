import React, { useState, useEffect, useRef } from 'react';
import { StaffMember } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { extractHeadFromSkin, getMinecraftAvatarUrl } from '../utils/minecraftSkin';
import { loadStaffMembers, saveStaffMembers, INITIAL_STAFF_MEMBERS } from '../utils/localStore';
import { ShieldCheck, Upload, UserPlus, Edit3, Trash2, Check, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';

interface StaffSectionProps {
  onOpenOwnerLogin: (hint?: string) => void;
}

export const StaffSection: React.FC<StaffSectionProps> = ({ onOpenOwnerLogin }) => {
  const { isAdmin, authHeaders } = useAdminAuth();
  const [staffList, setStaffList] = useState<StaffMember[]>(() => loadStaffMembers());
  const [selectedTier, setSelectedTier] = useState<string>('All');

  // Staff creation / edit form state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [minecraftIgn, setMinecraftIgn] = useState('');
  const [role, setRole] = useState('Moderator');
  const [tier, setTier] = useState('Moderation');
  const [bio, setBio] = useState('');
  const [discord, setDiscord] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Skin file upload states
  const [showSkinUploader, setShowSkinUploader] = useState<boolean>(false);
  const [skinPreviewUrl, setSkinPreviewUrl] = useState<string | null>(null);
  const [extractedHeadUrl, setExtractedHeadUrl] = useState<string | null>(null);
  const [includeHatLayer, setIncludeHatLayer] = useState<boolean>(true);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isProcessingSkin, setIsProcessingSkin] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStaffList(loadStaffMembers());
  }, []);

  // When IGN or Name is typed, automatically update head preview without requiring file upload
  const handleIgnChange = (newIgn: string) => {
    setMinecraftIgn(newIgn);
    if (!skinPreviewUrl) {
      const clean = newIgn.trim() || name.trim();
      if (clean) {
        const autoUrl = getMinecraftAvatarUrl(clean, 128);
        setExtractedHeadUrl(autoUrl);
        setAvatarUrl(autoUrl);
        setUploadStatus(`Auto-loaded head for ${clean}`);
      } else {
        setExtractedHeadUrl(null);
        setAvatarUrl('');
        setUploadStatus(null);
      }
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    if (!minecraftIgn.trim() && !skinPreviewUrl) {
      const clean = newName.trim();
      if (clean) {
        const autoUrl = getMinecraftAvatarUrl(clean, 128);
        setExtractedHeadUrl(autoUrl);
        setAvatarUrl(autoUrl);
        setUploadStatus(`Auto-loaded head for ${clean}`);
      }
    }
  };

  // Optional skin file upload (.png)
  const handleSkinFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png') && !file.name.endsWith('.png')) {
      setFormError('Please select a valid Minecraft skin .png file (64x64 or 64x32).');
      return;
    }

    setIsProcessingSkin(true);
    setFormError(null);
    setUploadStatus('Reading skin file...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      setSkinPreviewUrl(rawDataUrl);

      try {
        const headDataUrl = await extractHeadFromSkin(rawDataUrl, {
          size: 128,
          includeHat: includeHatLayer,
        });

        setExtractedHeadUrl(headDataUrl);
        setAvatarUrl(headDataUrl);
        setUploadStatus('Custom skin head extracted!');

        if (isAdmin) {
          try {
            const uploadRes = await fetch('/api/staff/upload-skin', {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({
                base64Data: headDataUrl,
                filename: file.name,
              }),
            });
            const uploadData = await uploadRes.json();
            if (uploadRes.ok && uploadData.fileUrl) {
              setAvatarUrl(uploadData.fileUrl);
              setUploadStatus('Custom skin saved to server!');
            }
          } catch (uploadErr) {
            console.error('Failed to upload head to server:', uploadErr);
          }
        }
      } catch (extractErr) {
        setFormError('Failed to parse skin head. Make sure this is a standard Minecraft skin file.');
      } finally {
        setIsProcessingSkin(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Re-extract head if hat layer toggle changes
  const handleToggleHat = async (newHatState: boolean) => {
    setIncludeHatLayer(newHatState);
    if (skinPreviewUrl) {
      try {
        const head = await extractHeadFromSkin(skinPreviewUrl, {
          size: 128,
          includeHat: newHatState,
        });
        setExtractedHeadUrl(head);
        setAvatarUrl(head);
      } catch (err) {
        console.error('Error re-rendering head:', err);
      }
    }
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setFormError('Name and role are required');
      return;
    }

    setFormError(null);

    const targetIgn = minecraftIgn.trim() || name.trim();
    const finalAvatar = avatarUrl || getMinecraftAvatarUrl(targetIgn, 128);

    let updatedList: StaffMember[];

    if (isEditing && editingId) {
      const updatedMember: StaffMember = {
        id: editingId,
        name: name.trim(),
        minecraftIgn: targetIgn,
        role: role.trim(),
        tier,
        bio: bio.trim(),
        joined: '2024',
        discord: discord.trim(),
        avatarUrl: finalAvatar,
        skinData: extractedHeadUrl || '',
      };
      updatedList = staffList.map((m) => (m.id === editingId ? updatedMember : m));
      setFormSuccess(`Staff member "${updatedMember.name}" saved! Permanently stored.`);
    } else {
      const newMember: StaffMember = {
        id: `staff-${Date.now()}`,
        name: name.trim(),
        minecraftIgn: targetIgn,
        role: role.trim(),
        tier,
        bio: bio.trim(),
        joined: 'Just Joined',
        discord: discord.trim(),
        avatarUrl: finalAvatar,
        skinData: extractedHeadUrl || '',
      };
      updatedList = [newMember, ...staffList];
      setFormSuccess(`Staff member "${newMember.name}" added! Permanently stored.`);
    }

    saveStaffMembers(updatedList);
    setStaffList(updatedList);
    resetForm();
    setTimeout(() => setFormSuccess(null), 3500);
  };

  const handleStartEdit = (member: StaffMember) => {
    setIsEditing(true);
    setEditingId(member.id);
    setName(member.name);
    setMinecraftIgn(member.minecraftIgn);
    setRole(member.role);
    setTier(member.tier || 'Staff Team');
    setBio(member.bio);
    setDiscord(member.discord || '');
    setAvatarUrl(member.avatarUrl);
    setExtractedHeadUrl(member.avatarUrl);
    setSkinPreviewUrl(null);
    setShowSkinUploader(false);
    window.scrollTo({
      top: document.getElementById('staff-editor-panel')?.offsetTop || 0,
      behavior: 'smooth',
    });
  };

  const handleDeleteStaff = (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    const updatedList = staffList.filter((m) => m.id !== id);
    saveStaffMembers(updatedList);
    setStaffList(updatedList);
    if (editingId === id) {
      resetForm();
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setMinecraftIgn('');
    setRole('Moderator');
    setTier('Moderation');
    setBio('');
    setDiscord('');
    setAvatarUrl('');
    setSkinPreviewUrl(null);
    setExtractedHeadUrl(null);
    setUploadStatus(null);
    setShowSkinUploader(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const tiers = ['All', 'Leadership', 'Creative & Dev', 'Moderation'];

  const filteredStaff = staffList.filter((m) => {
    if (selectedTier === 'All') return true;
    return m.tier === selectedTier;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#142838]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase text-teal-400 mb-2">
              <span>Community Guardians</span>
              <span aria-hidden="true">·</span>
              <span>NexusMC Team</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Server Staff Roster
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Meet the builders, developers, and moderators who keep NexusMC vibrant, balanced, and cheat-free 24/7.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                  selectedTier === t
                    ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-[#081722] text-slate-400 hover:text-white border border-[#142d40]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="group rounded-2xl bg-[#081822] border border-[#142d40] hover:border-teal-500/50 transition-all duration-300 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Top row: Avatar head + Info */}
              <div className="flex items-start gap-4 mb-4">
                {/* Pixelated Minecraft Head */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-[#050f16] border-2 border-teal-500/40 p-1 flex items-center justify-center shadow-lg shadow-teal-500/10 group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src={member.avatarUrl}
                      alt={`${member.name}'s Minecraft head`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain pixelated"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <h3 className="text-base font-bold text-white truncate group-hover:text-teal-300 transition-colors">
                    {member.name}
                  </h3>
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      member.rankBadgeColor || 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {member.bio}
              </p>
            </div>

            {/* Bottom Meta & Owner Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 truncate">
                <MessageSquare className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{member.discord || 'In-game only'}</span>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(member)}
                    className="p-1.5 text-slate-400 hover:text-teal-300 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Edit staff member"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(member.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Remove staff member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ---------------- STAFF & SKIN STUDIO (ONLY VISIBLE WHEN LOGGED IN AS OWNER) ---------------- */}
      {isAdmin ? (
        <section id="staff-editor-panel" className="pt-8 border-t border-[#142d40]">
          <div className="rounded-2xl bg-[#071622] border border-teal-500/30 p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#142d40]">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Staff Member & Head Studio
                </h2>
                <p className="text-xs text-slate-400">
                  Type the staff member's name or IGN to automatically generate their Minecraft head. Uploading a custom skin file is optional.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
                <span>Owner Mode</span>
              </div>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  {isEditing ? `Editing Staff Member: ${name}` : 'Add New Staff Member'}
                </span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {/* Name, IGN & Live Auto Head Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1.5">
                        Staff Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Astraea"
                        className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1.5">
                        Minecraft In-Game Name (IGN) *
                      </label>
                      <input
                        type="text"
                        required
                        value={minecraftIgn}
                        onChange={(e) => handleIgnChange(e.target.value)}
                        placeholder="e.g. AstraeaMC (auto-fetches head)"
                        className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1.5">
                        Role Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Head Admin, Moderator"
                        className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1.5">
                        Tier Group
                      </label>
                      <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value)}
                        className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                      >
                        <option value="Leadership">Leadership</option>
                        <option value="Creative & Dev">Creative & Dev</option>
                        <option value="Moderation">Moderation</option>
                        <option value="Staff Team">Staff Team</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1.5">
                        Discord Username
                      </label>
                      <input
                        type="text"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                        placeholder="e.g. astraea#0001"
                        className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1.5">
                      Bio & Responsibilities
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share what this staff member works on..."
                      className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl p-3 text-xs text-slate-100 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Head Preview & Optional Skin Upload Box */}
                <div className="lg:col-span-4 bg-[#050f16] border border-[#142d40] rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-[11px] font-mono font-semibold text-teal-300 uppercase tracking-wider">
                    Head Avatar Preview
                  </span>

                  <div className="w-20 h-20 rounded-xl bg-[#03090e] border-2 border-teal-500/50 p-1.5 flex items-center justify-center shadow-lg shadow-teal-500/10">
                    {extractedHeadUrl || avatarUrl ? (
                      <img
                        src={extractedHeadUrl || avatarUrl}
                        alt="Staff head preview"
                        className="w-full h-full object-contain pixelated"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-500">Type IGN to preview</span>
                    )}
                  </div>

                  {uploadStatus && (
                    <span className="text-[10px] text-teal-400 font-mono">
                      {uploadStatus}
                    </span>
                  )}

                  {/* Optional Skin File Upload Toggle */}
                  <div className="pt-2 w-full border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowSkinUploader(!showSkinUploader)}
                      className="text-[11px] text-teal-400 hover:text-teal-300 underline font-medium block mx-auto"
                    >
                      {showSkinUploader ? 'Hide Custom Skin Upload' : '+ Or upload custom skin .png (optional)'}
                    </button>

                    {showSkinUploader && (
                      <div className="mt-3 space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/png"
                          onChange={handleSkinFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 px-3 rounded-lg border border-dashed border-teal-500/40 hover:border-teal-400 bg-[#081722] text-[11px] text-slate-300 flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-teal-400" />
                          <span>Choose .png Skin File</span>
                        </button>
                        <label className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={includeHatLayer}
                            onChange={(e) => handleToggleHat(e.target.checked)}
                            className="rounded bg-slate-800 border-slate-700 text-teal-500"
                          />
                          <span>Include Helmet/Hat layer</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isEditing ? 'Save Staff Changes' : 'Add Staff Member'}</span>
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}
            </form>
          </div>
        </section>
      ) : (
        /* Accessible bottom-left admin editor link for owner */
        <div className="pt-6 border-t border-slate-800/60 flex items-center justify-between">
          <button
            onClick={() => onOpenOwnerLogin('Enter owner password to open Staff Editor')}
            className="text-xs font-mono text-slate-500 hover:text-teal-300 transition-colors px-3 py-1.5 rounded-lg bg-[#07131d] border border-slate-800 hover:border-teal-500/40 cursor-pointer flex items-center gap-2"
            title="Staff Editor"
          >
            <span>admin editor</span>
            <span className="text-slate-600">·</span>
            <span className="text-[10px] text-slate-400">staff manager</span>
          </button>
          <span className="text-[11px] text-slate-600 font-mono">staff roster</span>
        </div>
      )}
    </div>
  );
};
