import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldAlert, Monitor, Palette } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 sm:p-12 selection:bg-zinc-800">
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white text-black font-mono font-black text-xs flex items-center justify-center rounded">
            P
          </div>
          <span className="font-mono text-xs tracking-wider uppercase">PressCMS Starter</span>
        </div>
        <div className="text-zinc-500 text-xs font-mono">v0.1.0 (Design Mode)</div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto my-auto py-12 flex flex-col gap-8 text-center sm:text-left">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-zinc-800 bg-zinc-900 text-zinc-400 mb-4">
            <Palette className="w-3 h-3" /> Editorial Design Spec
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl leading-tight">
            An Editorial Workspace Built for Creators
          </h1>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            Welcome to the front-end layout model of PressCMS. This kit offers a high-density, keyboard-friendly editorial workspace built on Next.js App Router and Tailwind CSS.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/login"
            className="flex h-11 items-center justify-center gap-2 rounded bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200 transition-fast"
          >
            Enter Admin Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="flex h-11 items-center justify-center rounded border border-zinc-850 px-5 text-sm font-semibold text-zinc-300 hover:bg-zinc-950 transition-fast"
          >
            Direct Login Access
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-8 mt-4 text-left">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-400 shrink-0">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-200">Dense Editorial Layout</h3>
              <p className="text-xs text-zinc-500 mt-1">High data density designed to minimize eye strain and maximize content visibility.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-200">State Demonstrations</h3>
              <p className="text-xs text-zinc-500 mt-1">Interactive state toggles to test empty states, loading progress, and error layouts.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
        <div>Custom Headless CMS Starter kit. Forkable and modular.</div>
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-zinc-400">GitHub</a>
          <a href="/dashboard" className="hover:text-zinc-400">Skip to Admin Shell</a>
        </div>
      </footer>
    </div>
  );
}
