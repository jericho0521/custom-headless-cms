'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Key, 
  Webhook as WebhookIcon, 
  Plus, 
  Trash2, 
  Copy, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Info
} from 'lucide-react';
import { 
  mockApiTokens, 
  mockWebhooks, 
  mockStorageProviders, 
  ApiToken, 
  Webhook, 
  StorageProvider 
} from '@/lib/mockData';

export default function SettingsHubPage() {
  // Config state
  const [siteName, setSiteName] = useState('Press Starter Blog');
  const [siteUrl, setSiteUrl] = useState('http://localhost:3000');
  const [siteDescription, setSiteDescription] = useState('High velocity developer-centric digital publishing starter.');
  
  // Storage states
  const [storageProviders, setStorageProviders] = useState<StorageProvider[]>(mockStorageProviders);
  
  // API Token states
  const [apiTokens, setApiTokens] = useState<ApiToken[]>(mockApiTokens);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenRole, setNewTokenRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Viewer');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [tokenCopied, setTokenCopied] = useState(false);

  // Webhook states
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(['post.published']);
  const [showWebhookForm, setShowWebhookForm] = useState(false);

  // Simulation warning toggle
  const [showEnvWarning, setShowEnvWarning] = useState(true);

  // Save site settings simulation
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Site settings saved locally (Simulation)');
  };

  // Generate token simulation
  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim()) {
      alert('Please enter a descriptive token name');
      return;
    }
    const tokenVal = `cms_${newTokenRole.toLowerCase()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newToken: ApiToken = {
      id: `token-${Date.now()}`,
      name: newTokenName,
      token: tokenVal,
      role: newTokenRole,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never Used'
    };
    setApiTokens(prev => [...prev, newToken]);
    setGeneratedToken(tokenVal);
    setNewTokenName('');
    setTokenCopied(false);
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleDeleteToken = (id: string) => {
    if (confirm('Are you sure you want to revoke this API token? Any client using it will immediately receive unauthorized errors.')) {
      setApiTokens(prev => prev.filter(t => t.id !== id));
      if (generatedToken) setGeneratedToken(null);
    }
  };

  // Add webhook simulation
  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) {
      alert('Please enter a target webhook URL');
      return;
    }
    const newHook: Webhook = {
      id: `webhook-${Date.now()}`,
      url: newWebhookUrl,
      events: newWebhookEvents,
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`
    };
    setWebhooks(prev => [...prev, newHook]);
    setNewWebhookUrl('');
    setNewWebhookEvents(['post.published']);
    setShowWebhookForm(false);
    alert('Webhook endpoint added successfully');
  };

  const handleDeleteWebhook = (id: string) => {
    if (confirm('Are you sure you want to delete this webhook? No further events will be routed to this endpoint.')) {
      setWebhooks(prev => prev.filter(w => w.id !== id));
    }
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(prev => 
      prev.map(w => w.id === id ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' } : w)
    );
  };

  const handleToggleStorageDefault = (id: string) => {
    setStorageProviders(prev => 
      prev.map(p => ({
        ...p,
        isDefault: p.id === id,
        status: p.id === id && p.status === 'inactive' ? 'active' : p.status
      }))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto selection:bg-zinc-200">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Settings Hub</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure data adapters, API keys, webhooks, and general site metadata.
          </p>
        </div>
        <button
          onClick={() => setShowEnvWarning(!showEnvWarning)}
          className={`text-[11px] font-bold px-2 py-1 rounded border transition-fast flex items-center gap-1.5 ${
            showEnvWarning 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' 
              : 'bg-secondary hover:bg-muted text-foreground border-border'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {showEnvWarning ? 'Env warnings: Visible' : 'Env warnings: Hidden'}
        </button>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Site Metadata */}
          <section className="bg-card border border-border rounded-md shadow-sm">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" /> Site Configuration
              </h2>
            </div>
            <form onSubmit={handleSaveSiteSettings} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Site Title</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-secondary/30 border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Public Endpoint URL</label>
                  <input
                    type="url"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-secondary/30 border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Site Description</label>
                <textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 bg-secondary/30 border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex justify-end pt-2 border-t border-border/60">
                <button
                  type="submit"
                  className="text-xs font-bold bg-primary text-primary-foreground hover:bg-zinc-800 py-1.5 px-3 rounded transition-fast cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </section>

          {/* Section 2: API Keys Management */}
          <section className="bg-card border border-border rounded-md shadow-sm">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" /> API Tokens
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Generate new token form */}
              <form onSubmit={handleGenerateToken} className="bg-secondary/20 p-3 border border-border rounded-md flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Generate Token Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jamstack Production Server"
                    value={newTokenName}
                    onChange={(e) => setNewTokenName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-card border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="w-full sm:w-44">
                  <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Token Permission Scope</label>
                  <select
                    value={newTokenRole}
                    onChange={(e) => setNewTokenRole(e.target.value as any)}
                    className="w-full bg-card border border-border text-foreground text-xs px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                  >
                    <option value="Viewer">Viewer (Read Only)</option>
                    <option value="Editor">Editor (Write Content)</option>
                    <option value="Admin">Admin (Full Control)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto text-xs font-bold bg-primary text-primary-foreground hover:bg-zinc-800 py-1.5 px-3 rounded h-8 transition-fast flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Generate
                </button>
              </form>

              {/* Reveal newly generated token box */}
              {generatedToken && (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 rounded-md space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> API Token Generated Successfully
                  </div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-500">
                    Make sure to copy your API token now. For security purposes, it will not be displayed again.
                  </p>
                  <div className="flex gap-2 items-center bg-card border border-border p-2 rounded">
                    <span className="font-mono text-xs text-foreground select-all break-all flex-1">{generatedToken}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyToken(generatedToken)}
                      className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded shrink-0 relative"
                      title="Copy Key"
                    >
                      <Copy className="w-4 h-4" />
                      {tokenCopied && (
                        <span className="absolute bottom-full right-0 mb-1 px-1.5 py-0.5 rounded text-[8px] bg-primary text-primary-foreground font-bold shadow-sm whitespace-nowrap animate-in fade-in">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Active Tokens List */}
              <div className="border border-border rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs select-none">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Token Scope</th>
                      <th className="py-2 px-3">Last Used</th>
                      <th className="py-2 px-3 text-right">Revoke</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {apiTokens.map(token => (
                      <tr key={token.id} className="hover:bg-secondary/10">
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {token.name}
                          <span className="font-mono text-[9px] text-muted-foreground block mt-0.5">
                            {token.token.substring(0, 12)}...
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-muted-foreground">
                            {token.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-muted-foreground">
                          {token.lastUsed}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteToken(token.id)}
                            className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-fast"
                            title="Revoke Token"
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
          </section>

          {/* Section 3: Webhooks integration */}
          <section className="bg-card border border-border rounded-md shadow-sm">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <WebhookIcon className="w-4 h-4 text-muted-foreground" /> Webhook Integrations
              </h2>
              <button
                onClick={() => setShowWebhookForm(!showWebhookForm)}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Endpoint
              </button>
            </div>

            <div className="p-4 space-y-4">
              
              {/* Webhook form toggle */}
              {showWebhookForm && (
                <form onSubmit={handleAddWebhook} className="bg-secondary/20 p-3 border border-border rounded-md space-y-3">
                  <div>
                    <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Webhook Endpoint URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://yourdomain.com/api/webhook-receiver"
                      value={newWebhookUrl}
                      onChange={(e) => setNewWebhookUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-card border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Trigger Event Actions</label>
                    <div className="flex gap-4 pt-1 flex-wrap">
                      <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newWebhookEvents.includes('post.published')}
                          onChange={(e) => {
                            if (e.target.checked) setNewWebhookEvents(prev => [...prev, 'post.published']);
                            else setNewWebhookEvents(prev => prev.filter(ev => ev !== 'post.published'));
                          }}
                          className="rounded border-zinc-300 dark:border-zinc-700 bg-card text-primary w-3.5 h-3.5"
                        />
                        Post Published
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newWebhookEvents.includes('post.archived')}
                          onChange={(e) => {
                            if (e.target.checked) setNewWebhookEvents(prev => [...prev, 'post.archived']);
                            else setNewWebhookEvents(prev => prev.filter(ev => ev !== 'post.archived'));
                          }}
                          className="rounded border-zinc-300 dark:border-zinc-700 bg-card text-primary w-3.5 h-3.5"
                        />
                        Post Archived
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newWebhookEvents.includes('media.uploaded')}
                          onChange={(e) => {
                            if (e.target.checked) setNewWebhookEvents(prev => [...prev, 'media.uploaded']);
                            else setNewWebhookEvents(prev => prev.filter(ev => ev !== 'media.uploaded'));
                          }}
                          className="rounded border-zinc-300 dark:border-zinc-700 bg-card text-primary w-3.5 h-3.5"
                        />
                        Media Uploaded
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => setShowWebhookForm(false)}
                      className="text-[11px] font-bold border border-border hover:bg-secondary text-foreground py-1.5 px-3 rounded transition-fast"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-[11px] font-bold bg-primary text-primary-foreground hover:bg-zinc-800 py-1.5 px-3 rounded transition-fast cursor-pointer"
                    >
                      Save Receiver
                    </button>
                  </div>
                </form>
              )}

              {/* Webhooks listings */}
              <div className="space-y-2">
                {webhooks.map(hook => (
                  <div key={hook.id} className="p-3 border border-border rounded bg-secondary/10 flex items-center justify-between">
                    <div className="min-w-0 pr-4 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`w-2 h-2 rounded-full ${hook.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                          title={hook.status === 'active' ? 'Active Receiver' : 'Disabled Receiver'}
                        />
                        <span className="font-semibold text-foreground text-xs break-all">{hook.url}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {hook.events.map(ev => (
                          <span key={ev} className="text-[9px] bg-secondary text-muted-foreground border border-border px-1.5 py-0.2 rounded font-mono">
                            {ev}
                          </span>
                        ))}
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono">
                        Signing Secret: <span className="text-foreground">{hook.secret}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleToggleWebhook(hook.id)}
                        className={`text-[10px] font-bold px-2 py-1 border rounded transition-fast ${
                          hook.status === 'active'
                            ? 'border-zinc-300 dark:border-zinc-800 hover:bg-secondary text-foreground'
                            : 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {hook.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteWebhook(hook.id)}
                        className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-fast"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Storage Adapters overview */}
        <div className="space-y-6">
          
          {/* Active Cloud Providers */}
          <section className="bg-card border border-border rounded-md shadow-sm">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Database className="w-4 h-4" /> Storage Providers
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="text-xs text-muted-foreground leading-relaxed">
                Choose where uploaded media libraries write files. Only one adapter can be set as default.
              </div>

              <div className="space-y-3">
                {storageProviders.map((provider) => {
                  const isActive = provider.status === 'active';
                  const isError = provider.status === 'error';
                  const isDefault = provider.isDefault;

                  return (
                    <div 
                      key={provider.id} 
                      className={`p-3 border rounded-md space-y-2 relative transition-fast ${
                        isDefault 
                          ? 'border-primary ring-1 ring-primary bg-secondary/5' 
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-foreground text-xs block">{provider.name}</span>
                          <span className="text-[9px] uppercase font-mono text-zinc-500 font-bold block mt-0.5">{provider.provider} adapter</span>
                        </div>

                        {/* Status tag */}
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase ${
                            isActive
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : isError
                              ? 'bg-red-500/5 border-red-500/20 text-red-650 dark:text-red-400'
                              : 'bg-zinc-500/5 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                          }`}
                        >
                          {provider.status}
                        </span>
                      </div>

                      {/* Display warning conditions */}
                      {isError && showEnvWarning && (
                        <div className="bg-red-500/5 border border-red-500/10 p-2 text-[10px] text-destructive rounded-md flex gap-1.5 items-start">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Missing configuration fields:</p>
                            <p className="font-mono text-[9px] mt-0.5">AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY</p>
                          </div>
                        </div>
                      )}

                      {/* Display adapter details */}
                      <div className="text-[10px] font-mono text-muted-foreground bg-secondary/30 p-1.5 rounded space-y-0.5">
                        {provider.config.localPath && <div>Path: {provider.config.localPath}</div>}
                        {provider.config.bucketName && <div>Bucket: {provider.config.bucketName}</div>}
                        {provider.config.endpoint && <div className="truncate">Url: {provider.config.endpoint}</div>}
                      </div>

                      {/* Default selector */}
                      <div className="flex justify-end pt-1">
                        {isDefault ? (
                          <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" /> Primary Media Destination
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStorageDefault(provider.id)}
                            disabled={isError}
                            className="text-[10px] font-bold border border-border hover:bg-secondary text-foreground py-1 px-2.5 rounded transition-fast disabled:opacity-50 cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Quick tips panel */}
          <div className="bg-secondary/40 border border-border rounded-md p-4 flex gap-3">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground block mb-0.5">Adapter Environment Variables</span>
              Cloud adapters load keys directly from your local <span className="font-mono bg-secondary border border-border px-1 py-0.2 rounded text-[9px] text-foreground">.env.local</span> config file during runtime. Review our docs for deployment guidelines.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
