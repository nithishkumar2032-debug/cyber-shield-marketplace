'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Sprout, ShieldCheck, Building2, Shield } from 'lucide-react';

export default function HomePage() {
  const { setRole } = useMarketplace();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold tracking-wide">
            <span>Smart India Hackathon 2026 • SIH 26033</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Welcome to the Marketplace
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Select your secure login portal below to proceed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
          <Link
            href="/farmer"
            onClick={() => setRole('farmer')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Sprout className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Farmer Portal</h2>
            <p className="text-sm text-slate-500 mt-2">Manage listings & bids</p>
          </Link>

          <Link
            href="/officer"
            onClick={() => setRole('officer')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Officer Desk</h2>
            <p className="text-sm text-slate-500 mt-2">District administration</p>
          </Link>

          <Link
            href="/buyer"
            onClick={() => setRole('buyer')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Buyer Portal</h2>
            <p className="text-sm text-slate-500 mt-2">Institutional purchasing</p>
          </Link>

          <Link
            href="/admin"
            onClick={() => setRole('admin')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Platform Admin</h2>
            <p className="text-sm text-slate-500 mt-2">Global policies & audit</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
