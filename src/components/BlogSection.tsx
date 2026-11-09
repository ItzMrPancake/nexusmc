import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Search, PlusCircle, Trash2, Edit3, Lock, ShieldCheck, Calendar, Clock, User, ArrowRight, X, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

interface BlogSectionProps {
  onOpenOwnerLogin: (hint?: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenOwnerLogin }) => {
  const { isAdmin, authHeaders } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReadingPost, setActiveReadingPost] = useState<BlogPost | null>(null);

  // Creation form state
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Server Update');
  const [author, setAuthor] = useState('Astraea (Server Owner)');
  const [authorRole, setAuthorRole] = useState('Server Management');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('/src/assets/images/blog_nexusmc_update_1794187185782.jpg');
  const [featured, setFeatured] = useState(false);

  // Edit modal state
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError('Title and content are required');
      return;
    }

    setIsPublishing(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title,
          category,
          author,
          authorRole,
          summary,
          content,
          coverImage,
          featured,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormSuccess('Article published successfully!');
        setTitle('');
        setSummary('');
        setContent('');
        setFeatured(false);
        fetchPosts();
        setTimeout(() => setFormSuccess(null), 4000);
      } else {
        setFormError(data.error || 'Failed to create post. Owner authorization required.');
      }
    } catch (err) {
      setFormError('Network error while publishing post');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        fetchPosts();
      } else {
        alert('Failed to delete post. Unauthorized.');
      }
    } catch (err) {
      alert('Network error deleting post');
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      const res = await fetch(`/api/blog/${editingPost.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(editingPost),
      });
      if (res.ok) {
        setEditingPost(null);
        fetchPosts();
      } else {
        alert('Failed to update post. Unauthorized.');
      }
    } catch (err) {
      alert('Error saving post changes');
    }
  };

  const categories = ['All', 'Server Update', 'Community Event', 'Announcement'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Blog Header & Controls */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-teal-900/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-400 mb-2">
              <span>Chronicles & Dispatches</span>
              <span aria-hidden="true">·</span>
              <span>NexusMC Dispatch</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Server News & Patch Notes
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Stay up to date with realm wipes, balance patches, community build contests, and feature releases directly from the development team.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#071621] border border-slate-800 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors pl-9"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Category Filters (Interactive Filter tabs) */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-[#081722] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full py-20 px-6 text-center rounded-2xl bg-[#07141f] border border-[#142e42] shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#0b2131] border border-[#1a3d54] flex items-center justify-center text-teal-400 mb-3.5">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              No Server Dispatches Published Yet
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              The blog is completely clean. Official realm patch notes, wipe notices, and event announcements will be posted here.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-2xl bg-[#081722] border border-teal-900/30 hover:border-teal-500/40 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081722] via-transparent to-transparent" />
                  {post.featured && (
                    <span className="absolute top-3 left-3 bg-teal-400 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                      Featured
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  {/* Zero-Pill Unboxed Metadata */}
                  <div className="flex items-center gap-2 text-xs text-teal-400/90 font-medium">
                    <span>{post.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{post.date}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-800/60 mt-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span className="truncate max-w-[130px]">{post.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-1.5 text-slate-400 hover:text-teal-300 rounded-lg hover:bg-slate-800/80 transition-colors"
                        title="Edit post"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800/80 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setActiveReadingPost(post)}
                    className="text-xs font-semibold text-teal-300 hover:text-teal-200 flex items-center gap-1 group/btn"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* ---------------- OWNER SECTION AT THE BOTTOM OF BLOG (ONLY VISIBLE WHEN LOGGED IN) ---------------- */}
      {isAdmin ? (
        <section id="owner-editorial-desk" className="pt-8 border-t border-teal-900/40">
          <div className="rounded-3xl bg-[#071622] border border-teal-500/30 p-8 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Owner Editorial Desk</h2>
                  <p className="text-xs text-slate-400">
                    Compose and publish official news dispatches and patch updates to NexusMC.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
                <span>Owner Mode Active (Verified)</span>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Season 5 Nether Expansion & Mob Arenas"
                    className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  >
                    <option value="Server Update">Server Update</option>
                    <option value="Community Event">Community Event</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Patch Notes">Patch Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                    Author Display
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                    className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Server Owner, Head Developer"
                    className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                  Cover Image URL
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="/src/assets/images/... or https://"
                    className="flex-1 bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setCoverImage('/src/assets/images/blog_nexusmc_update_1794187185782.jpg')}
                    className="text-teal-400 hover:underline"
                  >
                    Ancient City Portal
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setCoverImage('/src/assets/images/hero_nexusmc_spawn_1794187184123.jpg')}
                    className="text-teal-400 hover:underline"
                  >
                    Spawn Citadel
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setCoverImage('/src/assets/images/store_nexusmc_items_1794187185099.jpg')}
                    className="text-teal-400 hover:underline"
                  >
                    Crate Vault
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                  Short Summary (Excerpt)
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A concise 1-2 sentence overview for the card..."
                  className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                  Full Article Body (Markdown supported) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full announcement, patch breakdown, or event schedule..."
                  className="w-full bg-[#050f16] border border-slate-700 focus:border-teal-400 rounded-xl p-4 text-xs text-slate-100 font-mono placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-teal-400"
                  />
                  <span>Mark as Featured Post</span>
                </label>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors flex items-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isPublishing ? 'Publishing...' : 'Publish to Server Blog'}</span>
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
          </div>
        </section>
      ) : (
        <div className="pt-6 border-t border-slate-800/60 flex items-center justify-between">
          <button
            onClick={() => onOpenOwnerLogin('Enter owner password to compose blog posts')}
            className="text-xs font-mono text-slate-500 hover:text-teal-300 transition-colors px-3 py-1.5 rounded-lg bg-[#07131d] border border-slate-800 hover:border-teal-500/40 cursor-pointer flex items-center gap-2"
            title="Blog Editorial Desk"
          >
            <span>admin editor</span>
            <span className="text-slate-600">·</span>
            <span className="text-[10px] text-slate-400">blog writer</span>
          </button>
          <span className="text-[11px] text-slate-600 font-mono">news & dispatches</span>
        </div>
      )}

      {/* Reading Modal */}
      {activeReadingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[85vh] bg-[#081822] border border-teal-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
            <div className="relative aspect-[21/9] bg-slate-900 overflow-hidden">
              <img
                src={activeReadingPost.coverImage}
                alt={activeReadingPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081822] via-[#081822]/40 to-transparent" />
              <button
                onClick={() => setActiveReadingPost(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
                  <span>{activeReadingPost.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">{activeReadingPost.date}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">{activeReadingPost.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeReadingPost.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <span>By <strong className="text-slate-200">{activeReadingPost.author}</strong></span>
                  <span>({activeReadingPost.authorRole})</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line border-t border-slate-800 pt-6">
                {activeReadingPost.content}
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveReadingPost(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  Close Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#091a26] border border-teal-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white">Edit Blog Dispatch</h3>
              <button
                onClick={() => setEditingPost(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full bg-[#050f16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Summary</label>
                <input
                  type="text"
                  value={editingPost.summary}
                  onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                  className="w-full bg-[#050f16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 mb-1">Content</label>
                <textarea
                  rows={6}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full bg-[#050f16] border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
