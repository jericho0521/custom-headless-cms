import React from 'react';
import { FileEdit, CheckCircle2, Clock, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const configs = {
    draft: {
      label: 'Draft',
      icon: FileEdit,
      bg: 'bg-status-draft-bg text-status-draft-fg border-zinc-200 dark:border-zinc-800',
    },
    published: {
      label: 'Published',
      icon: CheckCircle2,
      bg: 'bg-status-published-bg text-status-published-fg border-emerald-200/50 dark:border-emerald-800/30',
    },
    scheduled: {
      label: 'Scheduled',
      icon: Clock,
      bg: 'bg-status-scheduled-bg text-status-scheduled-fg border-blue-200/50 dark:border-blue-800/30',
    },
    archived: {
      label: 'Archived',
      icon: Archive,
      bg: 'bg-status-archived-bg text-status-archived-fg border-orange-200/50 dark:border-orange-800/30',
    },
  };

  const current = configs[status] || configs.draft;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${current.bg} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
}
