'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Grid, 
  List as ListIcon, 
  Upload, 
  X, 
  Copy, 
  Trash2, 
  Layers, 
  FileText,
  AlertCircle,
  Loader2,
  HardDrive
} from 'lucide-react';
import { mockMedia, MediaAsset } from '@/lib/mockData';

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>(mockMedia);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState<'all' | 'Local' | 'AWS S3' | 'Cloudflare R2'>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(mockMedia[0] || null);

  // Simulation states
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters
  const filteredAssets = useMemo(() => {
    if (simulateEmpty) return [];

    return mediaList.filter((asset) => {
      // Provider filter
      if (providerFilter !== 'all' && asset.provider !== providerFilter) return false;

      // Text search
      const query = searchQuery.toLowerCase();
      return (
        asset.filename.toLowerCase().includes(query) ||
        asset.altText.toLowerCase().includes(query)
      );
    });
  }, [mediaList, searchQuery, providerFilter, simulateEmpty]);

  // Simulate file upload
  const triggerMockUpload = (mode: 'success' | 'failure') => {
    setUploadError(null);
    setUploadingProgress(10);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setUploadingProgress(prev => {
        if (prev === null) return null;
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadingProgress(null);

      if (mode === 'success') {
        const randId = Math.floor(Math.random() * 1000) + 10;
        const newFile: MediaAsset = {
          id: `media-${randId}`,
          filename: `upload_${Date.now().toString().slice(-6)}.jpg`,
          url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
          altText: 'Newly uploaded mock landscape photo.',
          dimensions: '2560 x 1440',
          fileSize: '512 KB',
          uploadedAt: new Date().toISOString().split('T')[0],
          provider: providerFilter === 'all' ? 'Local' : providerFilter as any,
          mimeType: 'image/jpeg'
        };
        setMediaList(prev => [newFile, ...prev]);
        setSelectedAsset(newFile);
      } else {
        setUploadError('Failed to upload file. The storage provider bucket returned code 403 (Access Denied).');
      }
    }, 1200);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this media asset permanently?')) {
      setMediaList(prev => prev.filter(a => a.id !== id));
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
    }
  };

  const handleAltTextChange = (text: string) => {
    if (!selectedAsset) return;
    setMediaList(prev => 
      prev.map(a => a.id === selectedAsset.id ? { ...a, altText: text } : a)
    );
    setSelectedAsset(prev => prev ? { ...prev, altText: text } : null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-zinc-200 h-full flex flex-col">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Media Library</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload, inspect, and copy links for assets in your cloud or local buckets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Simulator button */}
          <button
            onClick={() => setSimulateEmpty(!simulateEmpty)}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded border transition-fast flex items-center gap-1.5 ${
              simulateEmpty 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' 
                : 'bg-secondary hover:bg-muted text-foreground border-border'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {simulateEmpty ? 'Mock Empty: ON' : 'Mock Empty State'}
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[500px]">
        
        {/* Left Side: Browser, Search, Grid */}
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border border-border p-3 rounded-md shadow-sm shrink-0">
            {/* Search */}
            <div className="w-full sm:w-64 relative">
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Filter by filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-secondary border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Provider and View Toggle */}
            <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <HardDrive className="w-3.5 h-3.5" /> Storage:
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value as any)}
                  className="bg-secondary border border-border text-foreground text-xs px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="all">All Providers</option>
                  <option value="Local">Local</option>
                  <option value="AWS S3">AWS S3</option>
                  <option value="Cloudflare R2">Cloudflare R2</option>
                </select>
              </div>

              <div className="h-5 w-px bg-border mx-1" />

              <div className="flex bg-secondary border border-border rounded p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-fast ${viewMode === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded transition-fast ${viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  title="List View"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Upload Box */}
          <div className="bg-card border border-border rounded-md shadow-sm p-4 shrink-0">
            {uploadingProgress !== null ? (
              <div className="border border-dashed border-border rounded-lg p-6 bg-secondary/10 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mb-2" />
                <span className="text-xs font-semibold text-foreground">Uploading files...</span>
                <div className="w-48 bg-border h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full transition-fast" style={{ width: `${uploadingProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="sm:col-span-2 border border-dashed border-border rounded-lg p-4 bg-secondary/15 flex flex-col items-center justify-center text-center">
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-xs font-semibold text-foreground">Drop images to upload</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Or click to browse file system</span>
                </div>
                
                {/* Simulated action triggers */}
                <div className="sm:col-span-2 space-y-2 border-l border-border pl-0 sm:pl-4">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Upload State Simulators
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerMockUpload('success')}
                      className="flex-1 text-[10px] font-bold bg-primary text-primary-foreground hover:bg-zinc-800 py-1.5 px-2.5 rounded transition-fast cursor-pointer"
                    >
                      Simulate Success
                    </button>
                    <button
                      onClick={() => triggerMockUpload('failure')}
                      className="flex-1 text-[10px] font-bold bg-secondary hover:bg-muted border border-border text-foreground py-1.5 px-2.5 rounded transition-fast cursor-pointer"
                    >
                      Simulate Fail
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error alerts */}
            {uploadError && (
              <div className="mt-3 p-2.5 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] rounded flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Media Grid / List Layout */}
          <div className="bg-card border border-border rounded-md shadow-sm flex-1 min-h-[300px]">
            {filteredAssets.length === 0 ? (
              <div className="py-16 text-center max-w-sm mx-auto flex flex-col items-center">
                <div className="w-12 h-12 bg-secondary text-muted-foreground rounded-full flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-foreground">No media assets found</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Upload images or clear your active filter configurations to find what you need.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`aspect-square rounded-md border bg-secondary/35 overflow-hidden cursor-pointer transition-fast relative group ${
                        isSelected 
                          ? 'border-primary ring-1 ring-primary' 
                          : 'border-border hover:border-zinc-400'
                      }`}
                    >
                      <img
                        src={asset.url}
                        alt={asset.altText}
                        className="w-full h-full object-cover transition-fast group-hover:scale-103"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2 transition-fast">
                        <span className="text-[10px] text-white truncate font-mono font-semibold">
                          {asset.filename}
                        </span>
                        <span className="text-[8px] text-zinc-300 font-mono mt-0.5">
                          {asset.dimensions} ({asset.provider})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs select-none">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-4">Preview</th>
                      <th className="py-2.5 px-4">Filename</th>
                      <th className="py-2.5 px-4">Provider</th>
                      <th className="py-2.5 px-4">Size</th>
                      <th className="py-2.5 px-4">Dimensions</th>
                      <th className="py-2.5 px-4">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredAssets.map((asset) => {
                      const isSelected = selectedAsset?.id === asset.id;
                      return (
                        <tr
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          className={`hover:bg-secondary/20 transition-fast cursor-pointer ${isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                        >
                          <td className="py-2 px-4">
                            <div className="w-10 h-10 rounded border border-border overflow-hidden bg-secondary">
                              <img src={asset.url} alt={asset.altText} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-2 px-4 font-semibold text-foreground">
                            {asset.filename}
                          </td>
                          <td className="py-2 px-4 font-medium text-muted-foreground">
                            {asset.provider}
                          </td>
                          <td className="py-2 px-4 font-mono text-[10px] text-muted-foreground">
                            {asset.fileSize}
                          </td>
                          <td className="py-2 px-4 font-mono text-[10px] text-muted-foreground">
                            {asset.dimensions}
                          </td>
                          <td className="py-2 px-4 font-mono text-[10px] text-muted-foreground">
                            {asset.uploadedAt}
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

        {/* Right Side: Slide Drawer Metadata details */}
        {selectedAsset && (
          <aside className="w-full lg:w-80 border border-border bg-card rounded-md shadow-sm flex flex-col shrink-0 overflow-y-auto">
            {/* Header info */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/20">
              <span className="text-xs font-bold text-foreground">Asset Specifications</span>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Preview Box */}
            <div className="p-4 bg-secondary/10 border-b border-border">
              <div className="aspect-video bg-secondary border border-border rounded overflow-hidden relative">
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Specifications Form */}
            <div className="p-4 space-y-4 flex-1">
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">File Name</label>
                <input
                  type="text"
                  readOnly
                  value={selectedAsset.filename}
                  className="w-full px-2.5 py-1.5 bg-secondary border border-border rounded text-xs text-muted-foreground font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Mock CDN URL</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="w-full px-2.5 py-1.5 bg-secondary border border-border rounded text-xs text-muted-foreground font-mono truncate focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                    className="p-2 border border-border hover:bg-secondary text-foreground rounded transition-fast relative cursor-pointer"
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedId === selectedAsset.id && (
                      <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 rounded text-[8px] bg-primary text-primary-foreground font-bold shadow-sm whitespace-nowrap animate-in fade-in">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Alt Text (Accessibility)</label>
                <textarea
                  value={selectedAsset.altText}
                  onChange={(e) => handleAltTextChange(e.target.value)}
                  placeholder="Enter alt tag to help screen readers..."
                  rows={3}
                  className="w-full px-2.5 py-1.5 bg-card border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-border pt-4">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Provider</span>
                  <span className="font-semibold text-foreground inline-flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {selectedAsset.provider}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Resolution</span>
                  <span className="font-semibold text-foreground font-mono mt-0.5 block">{selectedAsset.dimensions}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">File Size</span>
                  <span className="font-semibold text-foreground font-mono mt-0.5 block">{selectedAsset.fileSize}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Mime Type</span>
                  <span className="font-semibold text-foreground font-mono mt-0.5 block">{selectedAsset.mimeType}</span>
                </div>
              </div>
            </div>

            {/* Danger deletes footer */}
            <div className="p-4 border-t border-border bg-secondary/10 flex justify-end shrink-0">
              <button
                onClick={() => handleDeleteAsset(selectedAsset.id)}
                className="flex items-center gap-1 text-[11px] font-bold bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive py-1.5 px-3 rounded transition-fast cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete File
              </button>
            </div>
          </aside>
        )}
      </div>

    </div>
  );
}
