'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Eye, EyeOff, Loader2, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('elena@presscms.io');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Simulation switches
  const [simMode, setSimMode] = useState<'success' | 'failure'>('success');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple basic validations
    if (!email) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    // Simulate Network Delay
    setTimeout(() => {
      setLoading(false);
      if (simMode === 'success') {
        if (email === 'elena@presscms.io' && password === 'password') {
          router.push('/dashboard');
        } else {
          setError('Invalid credentials. Hint: use elena@presscms.io and password.');
        }
      } else {
        setError('Authentication server timeout. Please try again later.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 font-sans selection:bg-zinc-200">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg shadow-sm p-6 relative">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 bg-primary text-primary-foreground font-mono font-black text-lg flex items-center justify-center rounded mb-3">
            P
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Sign in to PressCMS
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Enter your editorial workspace credentials
          </p>
        </div>

        {/* Simulator controls helper */}
        <div className="mb-4 p-2 bg-secondary rounded border border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Simulation Mode:
          </span>
          <select
            value={simMode}
            onChange={(e) => setSimMode(e.target.value as 'success' | 'failure')}
            className="bg-card border border-border text-foreground px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="success">Normal (elena@presscms.io / password)</option>
            <option value="failure">Trigger Auth Server Error</option>
          </select>
        </div>

        {/* Error State Display */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md flex items-start gap-2">
            <span className="font-semibold shrink-0">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="editor@presscms.io"
              className="w-full px-3 py-2 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-fast disabled:opacity-50"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                className="w-full pl-3 pr-10 py-2 text-sm bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-fast disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-fast"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-zinc-800 h-10 rounded-md font-semibold text-sm transition-fast focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <span>Not configured yet? </span>
          <Link href="/setup" className="font-semibold text-foreground hover:underline">
            Run Setup wizard
          </Link>
        </div>
      </div>
    </div>
  );
}
