'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  MoreVertical, 
  X,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { mockUsers, User } from '@/lib/mockData';

export default function UsersRolesPage() {
  const [usersList, setUsersList] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Admin' | 'Editor' | 'Viewer'>('all');
  
  // Drawer states
  const [inviteDrawerOpen, setInviteDrawerOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [inviting, setInviting] = useState(false);

  // Filtered lists
  const filteredUsers = usersList.filter((user) => {
    // Role filter
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;

    // Text search
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // Action handlers
  const handleRoleChange = (id: string, newRole: 'Admin' | 'Editor' | 'Viewer') => {
    setUsersList(prev => 
      prev.map(u => u.id === id ? { ...u, role: newRole } : u)
    );
  };

  const handleStatusToggle = (id: string, currentStatus: 'Active' | 'Pending' | 'Disabled') => {
    let nextStatus: 'Active' | 'Disabled' = 'Active';
    if (currentStatus === 'Active') {
      nextStatus = 'Disabled';
    }
    
    setUsersList(prev => 
      prev.map(u => u.id === id ? { ...u, status: nextStatus } : u)
    );
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) {
      alert('Please fill out all fields.');
      return;
    }

    setInviting(true);

    setTimeout(() => {
      setInviting(false);
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        status: 'Pending',
        avatar: inviteName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      };

      setUsersList(prev => [...prev, newUser]);
      setInviteDrawerOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('Editor');
      alert(`Invitation sent successfully to ${inviteEmail}`);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-zinc-200 h-full flex flex-col">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Users & Roles</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Invite, suspend, and configure authorization permissions for your publishing staff.
          </p>
        </div>
        <button
          onClick={() => setInviteDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-zinc-800 h-8 px-3 rounded transition-fast self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[450px]">
        
        {/* User Directory Table Pane */}
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border border-border p-3 rounded-md shadow-sm shrink-0">
            {/* Search */}
            <div className="w-full sm:w-64 relative">
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-secondary border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
              <span className="text-xs font-semibold text-muted-foreground">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-secondary border border-border text-foreground text-xs px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs select-none">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4">User</th>
                    <th className="py-2.5 px-4 w-40">Role</th>
                    <th className="py-2.5 px-4 w-28">Status</th>
                    <th className="py-2.5 px-4 w-32 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => {
                    const isPending = user.status === 'Pending';
                    const isDisabled = user.status === 'Disabled';
                    
                    return (
                      <tr 
                        key={user.id} 
                        className={`hover:bg-secondary/15 transition-fast ${isDisabled ? 'bg-secondary/10 opacity-70' : ''}`}
                      >
                        {/* Profile Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-semibold text-xs border border-border shrink-0">
                              {user.avatar || user.name.slice(0,2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-foreground block text-sm">{user.name}</span>
                              <span className="text-[10px] text-muted-foreground block truncate">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role Select Input */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Shield className={`w-3.5 h-3.5 ${user.role === 'Admin' ? 'text-purple-500' : user.role === 'Editor' ? 'text-blue-500' : 'text-zinc-400'}`} />
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                              className="bg-secondary/40 border border-border text-foreground text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer font-medium"
                            >
                              <option value="Admin">Admin</option>
                              <option value="Editor">Editor</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                              user.status === 'Active'
                                ? 'bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                                : user.status === 'Pending'
                                ? 'bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20'
                                : 'bg-red-500/5 text-red-700 dark:text-red-400 border-red-500/20'
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full ${
                              user.status === 'Active'
                                ? 'bg-emerald-500'
                                : user.status === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`} />
                            {user.status}
                          </span>
                        </td>

                        {/* Operations Dropdowns */}
                        <td className="py-3 px-4 text-right">
                          {user.status === 'Pending' ? (
                            <button 
                              onClick={() => alert(`Resent verification code to ${user.email}!`)}
                              className="text-[11px] font-bold text-primary hover:underline px-2.5 py-1 transition-fast"
                            >
                              Resend Invite
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusToggle(user.id, user.status)}
                              className={`text-[11px] font-bold border rounded px-2.5 py-1 transition-fast ${
                                user.status === 'Disabled'
                                  ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-550 hover:text-white text-emerald-600 dark:text-emerald-400'
                                  : 'border-destructive/20 bg-destructive/5 hover:bg-destructive text-destructive hover:text-white'
                              }`}
                            >
                              {user.status === 'Disabled' ? 'Re-activate' : 'Suspend'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Invite User Drawer Overlay */}
        {inviteDrawerOpen && (
          <aside className="w-full lg:w-80 border border-border bg-card rounded-md shadow-sm flex flex-col shrink-0 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/20 shrink-0">
              <span className="text-xs font-bold text-foreground">Invite Staff Member</span>
              <button
                onClick={() => setInviteDrawerOpen(false)}
                className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-4 space-y-4 flex-1">
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alexander Petrov"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-card border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-2.5 flex items-center text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    placeholder="name@presscms.io"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-card border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">
                  Assigned Permission Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-card border border-border text-foreground text-xs px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="Admin">Admin (Full Workspace Permissions)</option>
                  <option value="Editor">Editor (Read, Edit, & Publish Content)</option>
                  <option value="Viewer">Viewer (Read-only Access)</option>
                </select>
              </div>

              <div className="border-t border-border pt-4 text-[10px] text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1">Authorization Details:</p>
                Invited users will receive an email containing a secure one-time onboarding hyperlink, valid for 7 days.
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setInviteDrawerOpen(false)}
                  className="text-[11px] font-bold border border-border hover:bg-secondary text-foreground py-1.5 px-3 rounded transition-fast"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex items-center gap-1 text-[11px] font-bold bg-primary text-primary-foreground hover:bg-zinc-800 py-1.5 px-3 rounded transition-fast disabled:opacity-50 cursor-pointer"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...
                    </>
                  ) : (
                    'Send Invitation'
                  )}
                </button>
              </div>
            </form>
          </aside>
        )}
      </div>

    </div>
  );
}
