'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  Plus, 
  ChevronsUpDown,
  BookOpen,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { mockPosts, ContentItem } from '@/lib/mockData';
import { StatusBadge } from '@/app/components/status-badge';

type StatusFilter = 'all' | 'draft' | 'published' | 'scheduled' | 'archived';

export default function ContentListPage() {
  // State variables for search, sorting, filtering, selection, and empty state simulation
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'post' | 'story'>('all');
  const [sortBy, setSortBy] = useState<'updated-desc' | 'updated-asc' | 'title-asc'>('updated-desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [posts, setPosts] = useState<ContentItem[]>(mockPosts);

  // Apply filters and search queries
  const filteredItems = useMemo(() => {
    if (simulateEmpty) return [];

    return posts
      .filter((item) => {
        // Tab Status Filter
        if (activeTab !== 'all' && item.status !== activeTab) return false;
        
        // Type Filter
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;

        // Search text match
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.author.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'updated-desc') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === 'updated-asc') {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [posts, activeTab, searchQuery, typeFilter, sortBy, simulateEmpty]);

  // Bulk actions handling
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkPublish = () => {
    setPosts(prev => 
      prev.map(post => selectedIds.includes(post.id) ? { ...post, status: 'published', publishedAt: new Date().toISOString().split('T')[0] } : post)
    );
    alert(`Successfully published ${selectedIds.length} items (Mock state updated)`);
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    setPosts(prev => 
      prev.map(post => selectedIds.includes(post.id) ? { ...post, status: 'archived' } : post)
    );
    alert(`Successfully archived ${selectedIds.length} items (Mock state updated)`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} items? (This cannot be undone)`)) {
      setPosts(prev => prev.filter(post => !selectedIds.includes(post.id)));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-zinc-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Content Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your articles, announcements, and structural stories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Simulator button */}
          <button
            onClick={() => {
              setSimulateEmpty(!simulateEmpty);
              setSelectedIds([]);
            }}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded border transition-fast flex items-center gap-1.5 ${
              simulateEmpty 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' 
                : 'bg-secondary hover:bg-muted text-foreground border-border'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {simulateEmpty ? 'Mock Empty State: ON' : 'Mock Empty State'}
          </button>
          
          <Link
            href="/content/new?type=post"
            className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-zinc-800 h-8 px-3 rounded transition-fast"
          >
            <Plus className="w-3.5 h-3.5" /> New Article
          </Link>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center justify-between border-b border-border overflow-x-auto scrollbar-none">
        <div className="flex gap-4">
          {(['all', 'draft', 'published', 'scheduled', 'archived'] as StatusFilter[]).map((tab) => {
            const count = tab === 'all' 
              ? posts.length 
              : posts.filter(p => p.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedIds([]);
                }}
                className={`py-2 text-xs font-bold border-b-2 capitalize transition-fast whitespace-nowrap px-1 cursor-pointer ${
                  activeTab === tab
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab} <span className="ml-1 font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border/80 font-normal">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border border-border p-3 rounded-md shadow-sm">
        {/* Search */}
        <div className="w-full sm:w-80 relative">
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Filter by title, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-secondary border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Action Selects */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Filter className="w-3.5 h-3.5" /> Type:
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-secondary border border-border text-foreground text-xs px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="all">All Content</option>
              <option value="post">Posts Only</option>
              <option value="story">Pages/Stories Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <ChevronsUpDown className="w-3.5 h-3.5" /> Sort:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-secondary border border-border text-foreground text-xs px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="updated-desc">Newest First</option>
              <option value="updated-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-primary text-primary-foreground p-3 rounded-md shadow-md flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>{selectedIds.length} items selected</span>
            <button 
              onClick={() => setSelectedIds([])}
              className="p-0.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkPublish}
              className="flex items-center gap-1 text-[11px] font-bold bg-white text-black hover:bg-zinc-200 px-2.5 py-1 rounded transition-fast"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Publish
            </button>
            <button
              onClick={handleBulkArchive}
              className="flex items-center gap-1 text-[11px] font-bold bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1 rounded transition-fast"
            >
              <Archive className="w-3.5 h-3.5" /> Archive
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 text-[11px] font-bold bg-destructive text-destructive-foreground hover:bg-red-650 px-2.5 py-1 rounded transition-fast"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Content Table / List */}
      <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center max-w-sm mx-auto flex flex-col items-center">
            <div className="w-12 h-12 bg-secondary text-muted-foreground rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No editorial content found</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              No matching pages, posts, or stories were found in your library. Change your filters or click below to start writing.
            </p>
            <Link
              href="/content/new?type=post"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-zinc-800 h-8 px-4 rounded transition-fast"
            >
              <Plus className="w-3.5 h-3.5" /> Create New Content
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr className="border-b border-border bg-secondary/50 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                      className="rounded border-zinc-300 dark:border-zinc-700 bg-card focus:ring-primary text-primary cursor-pointer w-3.5 h-3.5"
                    />
                  </th>
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4 w-24">Type</th>
                  <th className="py-2.5 px-4 w-36">Author</th>
                  <th className="py-2.5 px-4 w-28">Status</th>
                  <th className="py-2.5 px-4 w-28">Last Update</th>
                  <th className="py-2.5 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-secondary/20 transition-fast ${isChecked ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="rounded border-zinc-300 dark:border-zinc-700 bg-card focus:ring-primary text-primary cursor-pointer w-3.5 h-3.5"
                        />
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground max-w-xs sm:max-w-md">
                        <Link 
                          href={`/content/${item.id}`} 
                          className="hover:underline line-clamp-1 block text-sm"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] text-muted-foreground font-mono block mt-0.5 max-w-xs truncate">
                          /{item.slug}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-muted-foreground">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">
                        {item.author}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-[10px]">
                        {item.updatedAt}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Link
                            href={`/content/${item.id}`}
                            className="px-2 py-1 border border-border hover:bg-secondary rounded text-foreground font-semibold"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
