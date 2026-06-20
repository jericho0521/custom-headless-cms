'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Globe, 
  PanelRightClose, 
  PanelRight,
  Info,
  Calendar,
  Tag,
  FileImage,
  Sparkles,
  Bold,
  Italic,
  Link2,
  Heading1,
  Heading2,
  Quote,
  Code,
  List,
  CheckCircle2,
  Trash2,
  Archive,
  Image as ImageIcon
} from 'lucide-react';
import { mockPosts, mockUsers, mockMedia, ContentItem } from '@/lib/mockData';
import { StatusBadge } from '@/app/components/status-badge';

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);

  // Load post or create new empty post template
  const existingPost = mockPosts.find(p => p.id === id);
  const defaultType = searchParams.get('type') === 'story' ? 'story' : 'post';

  const [post, setPost] = useState<ContentItem>(() => {
    if (existingPost) return { ...existingPost };
    return {
      id: `post-${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
      status: 'draft',
      type: defaultType,
      author: mockUsers[0]?.name || 'Elena Rostova',
      authorEmail: mockUsers[0]?.email || 'elena@presscms.io',
      categories: ['General'],
      tags: [],
      seoTitle: '',
      seoDescription: ''
    } as any;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Handle changes in fields
  const handleFieldChange = (field: keyof ContentItem, value: any) => {
    setPost(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-slug generation from title
      if (field === 'title' && !existingPost) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
    setIsDirty(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsDirty(false);
      alert(`Content "${post.title || 'Untitled'}" saved successfully as ${post.status}.`);
    }, 1000);
  };

  const handlePublish = () => {
    setPost(prev => ({ ...prev, status: 'published', publishedAt: new Date().toISOString().split('T')[0] }));
    setIsDirty(true);
    alert('Status changed to Published. Click "Save Changes" to commit.');
  };

  const handleArchive = () => {
    setPost(prev => ({ ...prev, status: 'archived' }));
    setIsDirty(true);
    alert('Status changed to Archived. Click "Save Changes" to commit.');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!post.tags.includes(tagInput.trim())) {
        handleFieldChange('tags', [...post.tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleFieldChange('tags', post.tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="h-full flex flex-col -m-4 md:-m-6 relative selection:bg-zinc-200">
      
      {/* Editor Header Panel */}
      <div className="h-14 bg-card border-b border-border px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/content"
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-fast"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono font-bold uppercase tracking-wider bg-secondary px-1.5 py-0.5 rounded border border-border">
              {post.type}
            </span>
            <span className="text-sm font-semibold text-foreground max-w-[150px] sm:max-w-xs truncate">
              {post.title || 'Untitled Document'}
            </span>
            {isDirty ? (
              <span className="w-2 h-2 rounded-full bg-amber-500" title="Unsaved changes" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Changes saved" />
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded bg-secondary hover:bg-muted border border-border text-foreground transition-fast cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded bg-primary text-primary-foreground hover:bg-zinc-800 transition-fast disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <div className="h-5 w-px bg-border mx-1" />

          <button
            onClick={() => setShowInspector(!showInspector)}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-fast"
            title="Toggle Settings Inspector"
          >
            {showInspector ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Composer panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-card">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Title Area */}
            <div>
              <input
                type="text"
                value={post.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Title your story..."
                className="w-full text-3xl font-bold tracking-tight bg-transparent border-0 p-0 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0"
              />
              <div className="flex items-center gap-2 mt-2 text-xs font-mono text-muted-foreground border-b border-border/60 pb-3">
                <span>Slug:</span>
                <span className="text-foreground">/{post.slug || 'auto-generated'}</span>
              </div>
            </div>

            {/* Cover Image Picker Box */}
            <div className="border border-dashed border-border rounded-md overflow-hidden bg-secondary/10 group relative">
              {post.coverImage ? (
                <div className="relative aspect-[21/9]">
                  <img
                    src={post.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-fast flex items-center justify-center gap-2">
                    <button
                      onClick={() => setShowMediaPicker(true)}
                      className="px-3 py-1.5 text-xs font-bold bg-white text-black hover:bg-zinc-200 rounded"
                    >
                      Change Cover
                    </button>
                    <button
                      onClick={() => handleFieldChange('coverImage', '')}
                      className="px-3 py-1.5 text-xs font-bold bg-red-650 text-white hover:bg-red-700 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowMediaPicker(true)}
                  className="w-full py-12 flex flex-col items-center justify-center text-center text-muted-foreground hover:text-foreground transition-fast cursor-pointer"
                >
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs font-semibold">Pick article cover image</span>
                  <span className="text-[10px] mt-0.5">JPEG, PNG up to 5MB</span>
                </button>
              )}
            </div>

            {/* Excerpt Summary */}
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Summary / Excerpt
              </label>
              <textarea
                value={post.excerpt}
                onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                placeholder="A brief snippet summarizing this article for SEO feeds and cards..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            {/* Rich Editor Box with mock toolbar */}
            <div className="border border-border rounded-md overflow-hidden bg-card">
              {/* Format Buttons Bar */}
              <div className="bg-secondary/40 border-b border-border p-1.5 flex flex-wrap gap-1">
                <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground" title="Header 1"><Heading1 className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground" title="Header 2"><Heading2 className="w-3.5 h-3.5" /></button>
                <div className="w-px bg-border self-stretch mx-1" />
                <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground" title="Link"><Link2 className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground" title="Blockquote"><Quote className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground" title="Code"><Code className="w-3.5 h-3.5" /></button>
              </div>

              {/* Editable body textarea */}
              <textarea
                value={post.body}
                onChange={(e) => handleFieldChange('body', e.target.value)}
                placeholder="Start writing the markdown or content here..."
                rows={12}
                className="w-full px-4 py-3 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 font-sans leading-relaxed text-foreground placeholder:text-muted-foreground/30 resize-y"
              />
              <div className="bg-secondary/20 px-3 py-1.5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Markdown supported</span>
                <span>{post.body.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Collapsible Inspector Settings */}
        {showInspector && (
          <aside className="w-80 border-l border-border bg-secondary/10 flex flex-col h-full overflow-y-auto p-4 space-y-6">
            
            {/* Status Manager Block */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publishing status</h3>
              <div className="flex items-center gap-3 bg-card border border-border p-2.5 rounded-md">
                <StatusBadge status={post.status} />
                <div className="text-[10px] text-muted-foreground">
                  {post.publishedAt ? `Published ${post.publishedAt}` : 'Not live yet'}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                {post.status !== 'published' && (
                  <button
                    onClick={handlePublish}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold border border-border bg-card hover:bg-secondary text-foreground py-1.5 rounded transition-fast cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Make Published
                  </button>
                )}
                {post.status !== 'archived' && (
                  <button
                    onClick={handleArchive}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold border border-border bg-card hover:bg-secondary text-foreground py-1.5 rounded transition-fast cursor-pointer"
                  >
                    <Archive className="w-4 h-4 text-orange-500" /> Archive Article
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Taxonomy Metadata Block */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Metadata</h3>
              
              {/* Author Dropdown */}
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Author</label>
                <select
                  value={post.author}
                  onChange={(e) => handleFieldChange('author', e.target.value)}
                  className="w-full bg-card border border-border text-foreground text-xs px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  {mockUsers.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Tags
                </label>
                <input
                  type="text"
                  placeholder="Press enter to add..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full px-2.5 py-1.5 bg-card border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                
                {/* Active Tags tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-secondary border border-border font-medium text-foreground"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-muted-foreground hover:text-foreground font-bold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* SEO Metadata Fields */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO optimization</h3>
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Meta Title</label>
                <input
                  type="text"
                  value={post.seoTitle}
                  onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                  placeholder={post.title || 'Page title'}
                  className="w-full px-2.5 py-1.5 bg-card border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <span className="text-[9px] text-zinc-500 block mt-1">Recommended: &le; 60 characters</span>
              </div>

              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Meta Description</label>
                <textarea
                  value={post.seoDescription}
                  onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                  placeholder={post.excerpt || 'Page summary...'}
                  rows={3}
                  className="w-full px-2.5 py-1.5 bg-card border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
                <span className="text-[9px] text-zinc-500 block mt-1">Recommended: &le; 160 characters</span>
              </div>
            </div>

          </aside>
        )}
      </div>

      {/* -------------------- PREVIEW MODAL OVERLAY -------------------- */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="h-12 border-b border-border bg-secondary/50 px-4 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-foreground">Desktop Preview mode</span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-2.5 py-1 text-xs bg-primary text-primary-foreground hover:bg-zinc-800 rounded font-semibold transition-fast"
              >
                Close Preview
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white dark:bg-zinc-950">
              <article className="max-w-2xl mx-auto space-y-6 text-black dark:text-zinc-100">
                {/* Title */}
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {post.title || 'Untitled Article'}
                </h1>
                
                {/* Meta details */}
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold">
                    {post.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold block">{post.author}</span>
                    <span className="block text-[10px]">Updated {post.updatedAt}</span>
                  </div>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                  <div className="aspect-[21/9] rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <img src={post.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-base text-zinc-600 dark:text-zinc-400 italic border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 py-0.5">
                    {post.excerpt}
                  </p>
                )}

                {/* Body Content */}
                <div 
                  className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: post.body || '<p className="text-zinc-400">Write something in the editor to see it here.</p>' }}
                />
              </article>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MOCK MEDIA PICKER OVERLAY -------------------- */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-card border border-border rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[70vh]">
            <div className="h-12 border-b border-border bg-secondary/50 px-4 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-foreground">Select Cover Image</span>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-secondary/10">
              <div className="grid grid-cols-3 gap-3">
                {mockMedia.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => {
                      handleFieldChange('coverImage', file.url);
                      setShowMediaPicker(false);
                    }}
                    className="aspect-square bg-secondary rounded border border-border overflow-hidden cursor-pointer hover:border-primary hover:scale-102 transition-fast relative group"
                  >
                    <img src={file.url} alt={file.altText} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end p-2 transition-fast">
                      <span className="text-[9px] text-white truncate font-mono">{file.filename}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
