'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Users,
  Settings,
  ChevronsUpDown,
  Layers,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Content Library', href: '/content', icon: FileText },
    { name: 'Media Library', href: '/media', icon: ImageIcon },
    { name: 'Users & Roles', href: '/users', icon: Users },
    { name: 'Settings Hub', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full select-none">
      {/* Workspace Switcher */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-secondary cursor-pointer transition-fast">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-sm">
              P
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-medium text-muted-foreground leading-none mb-1">
                Workspace
              </span>
              <span className="text-sm font-semibold text-foreground leading-none">
                Press Starter
              </span>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-fast ${
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border bg-secondary/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <BookOpen className="w-3.5 h-3.5" />
            <span>PressCMS v0.1.0</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-0.5"
          >
            <span>Docs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
