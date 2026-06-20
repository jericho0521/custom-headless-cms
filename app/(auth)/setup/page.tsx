'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Database, HardDrive, User, Check, Loader2, ArrowRight } from 'lucide-react';

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [dbType, setDbType] = useState('sqlite');
  const [storageType, setStorageType] = useState('local');
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setFinished(true);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 font-sans selection:bg-zinc-200">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-sm p-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
          <div className="w-8 h-8 bg-primary text-primary-foreground font-mono font-bold text-sm flex items-center justify-center rounded">
            P
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">PressCMS Configuration Wizard</h2>
            <p className="text-xs text-muted-foreground">Initialize local schema & storage layers</p>
          </div>
        </div>

        {/* Steps Breadcrumb */}
        {!finished && (
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-6 px-1">
            <span className={step >= 1 ? 'text-primary' : ''}>1. Data Layer</span>
            <span>&rarr;</span>
            <span className={step >= 2 ? 'text-primary' : ''}>2. Storage Adapter</span>
            <span>&rarr;</span>
            <span className={step >= 3 ? 'text-primary' : ''}>3. Admin Setup</span>
          </div>
        )}

        {/* Wizard Forms */}
        {finished ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">CMS Initialized Successfully!</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              We wrote database tables to your local SQLite and mapped media outputs to local public uploads.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-6 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-zinc-800 h-10 px-5 rounded-md font-semibold text-sm transition-fast"
            >
              Continue to Login
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground">Deploying Database Schemas...</p>
            <p className="text-xs text-muted-foreground mt-1">Creating tables: posts, pages, users, keys</p>
          </div>
        ) : (
          <div className="space-y-4 min-h-[160px]">
            {/* Step 1: Database selection */}
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Database className="w-4 h-4" /> Select Database Provider
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setDbType('sqlite')}
                    className={`p-3 border rounded-md text-left transition-fast ${
                      dbType === 'sqlite'
                        ? 'border-primary bg-secondary/30 ring-1 ring-primary'
                        : 'border-border hover:bg-secondary/40'
                    }`}
                  >
                    <div className="text-sm font-bold text-foreground">SQLite</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Zero-config file database (Local dev default)</div>
                  </button>
                  <button
                    onClick={() => setDbType('postgres')}
                    className={`p-3 border rounded-md text-left transition-fast ${
                      dbType === 'postgres'
                        ? 'border-primary bg-secondary/30 ring-1 ring-primary'
                        : 'border-border hover:bg-secondary/40'
                    }`}
                  >
                    <div className="text-sm font-bold text-foreground">Postgres</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Connect with external hosting services</div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Storage adapter */}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4" /> Select Media Storage Adapter
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setStorageType('local')}
                    className={`p-3 border rounded-md text-left transition-fast ${
                      storageType === 'local'
                        ? 'border-primary bg-secondary/30 ring-1 ring-primary'
                        : 'border-border hover:bg-secondary/40'
                    }`}
                  >
                    <div className="text-sm font-bold text-foreground">Local Directory</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Writes to ./public/uploads folder</div>
                  </button>
                  <button
                    onClick={() => setStorageType('s3_r2')}
                    className={`p-3 border rounded-md text-left transition-fast ${
                      storageType === 's3_r2'
                        ? 'border-primary bg-secondary/30 ring-1 ring-primary'
                        : 'border-border hover:bg-secondary/40'
                    }`}
                  >
                    <div className="text-sm font-bold text-foreground">AWS S3 / R2</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Saves media assets directly in cloud buckets</div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Admin account creation */}
            {step === 3 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Admin Account Credentials
                </h3>
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Super User Email</label>
                    <input
                      type="email"
                      readOnly
                      value="elena@presscms.io"
                      className="w-full px-3 py-1.5 text-xs bg-secondary border border-border rounded text-muted-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Temporary Password</label>
                    <input
                      type="text"
                      readOnly
                      value="password"
                      className="w-full px-3 py-1.5 text-xs bg-secondary border border-border rounded text-muted-foreground focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 italic">
                    PressCMS writes a seed admin row with these parameters. You can change these in Users & Roles.
                  </p>
                </div>
              </div>
            )}

            {/* Control buttons */}
            <div className="flex gap-2 justify-end pt-4 border-t border-border mt-6">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-3 py-1.5 text-xs font-medium border border-border hover:bg-secondary rounded transition-fast"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-zinc-800 rounded transition-fast flex items-center gap-1"
              >
                {step === 3 ? 'Deploy CMS System' : 'Next Step'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
