'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Plus, 
  Image as ImageIcon, 
  Upload, 
  ArrowRight,
  TrendingUp,
  Database,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { mockPosts, mockMedia, mockStorageProviders } from '@/lib/mockData';
import { StatusBadge } from '@/app/components/status-badge';

export default function DashboardPage() {
  // Compute analytics numbers from mockData
  const totalContent = mockPosts.length;
  const draftCount = mockPosts.filter(p => p.status === 'draft').length;
  const publishedCount = mockPosts.filter(p => p.status === 'published').length;
  const scheduledCount = mockPosts.filter(p => p.status === 'scheduled').length;
  const activeStorage = mockStorageProviders.find(s => s.isDefault)?.name || 'Local Dev Storage';

  // Filters recent posts (draft or scheduled)
  const pendingContent = mockPosts.filter(p => p.status === 'draft' || p.status === 'scheduled');
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-zinc-200">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Editorial Desk</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor publications, scheduled articles, and assets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/content/new?type=post"
            className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-zinc-800 h-8 px-3 rounded transition-fast"
          >
            <Plus className="w-3.5 h-3.5" /> New Post
          </Link>
          <Link
            href="/content/new?type=story"
            className="inline-flex items-center gap-1 text-xs font-semibold bg-secondary hover:bg-muted text-foreground border border-border h-8 px-3 rounded transition-fast"
          >
            <Plus className="w-3.5 h-3.5" /> New Page
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-card border border-border p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Content</span>
            <FileText className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-foreground">{totalContent}</span>
            <span className="text-[10px] text-zinc-500 font-mono">Posts & Pages</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card border border-border p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Published</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-foreground">{publishedCount}</span>
            <span className="text-[10px] text-emerald-600 font-mono font-medium">Live on Site</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card border border-border p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Scheduled</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-foreground">{scheduledCount}</span>
            <span className="text-[10px] text-blue-600 font-mono font-medium">{scheduledCount} Pending</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-card border border-border p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Media Adapter</span>
            <Database className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-sm font-bold text-foreground truncate max-w-full block">{activeStorage}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Listings) & Right (Sidebar widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Pending Publications & Drafts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-md shadow-sm">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Work in Progress
              </h2>
              <Link 
                href="/content" 
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                View all content <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            {pendingContent.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No items are currently in Draft or Scheduled status.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pendingContent.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-fast">
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <StatusBadge status={item.status} />
                        <span className="text-[10px] font-mono text-muted-foreground uppercase bg-secondary px-1 py-0.2 rounded border border-border/60">
                          {item.type}
                        </span>
                      </div>
                      <Link 
                        href={`/content/${item.id}`}
                        className="text-sm font-semibold text-foreground hover:underline line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                        <span>By {item.author}</span>
                        <span>•</span>
                        <span>Updated {item.updatedAt}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/content/${item.id}`}
                      className="px-2.5 py-1 text-xs border border-border hover:bg-secondary text-foreground font-medium rounded transition-fast"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Warnings / Config Checklist */}
          <div className="bg-orange-500/5 dark:bg-orange-950/10 border border-orange-500/20 rounded-md p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-orange-700 dark:text-orange-400">Environment Configuration warning</h3>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-1 leading-relaxed">
                Your AWS S3 storage configuration is failing. The CMS fallback directory (Local) is active. Please review details in the settings panel to update your AWS access credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions & Media upload grid */}
        <div className="space-y-6">
          
          {/* Quick Actions Container */}
          <div className="bg-card border border-border rounded-md shadow-sm p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Media Hub Actions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/media"
                className="flex flex-col items-center justify-center p-3 rounded-md border border-border hover:bg-secondary/40 text-center transition-fast group"
              >
                <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground mb-1.5 transition-fast" />
                <span className="text-xs font-medium text-foreground">Media library</span>
              </Link>
              <Link
                href="/media"
                className="flex flex-col items-center justify-center p-3 rounded-md border border-border hover:bg-secondary/40 text-center transition-fast group"
              >
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-foreground mb-1.5 transition-fast" />
                <span className="text-xs font-medium text-foreground">Upload file</span>
              </Link>
            </div>
          </div>

          {/* Recent Media Panel */}
          <div className="bg-card border border-border rounded-md shadow-sm">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent Media
              </h2>
              <Link 
                href="/media" 
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Library
              </Link>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {mockMedia.slice(0, 4).map((file) => (
                  <div 
                    key={file.id} 
                    className="relative group aspect-square bg-secondary border border-border rounded overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={file.url} 
                      alt={file.altText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-fast"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-fast flex items-end p-2">
                      <span className="text-[10px] text-white truncate max-w-full font-mono">
                        {file.filename}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
