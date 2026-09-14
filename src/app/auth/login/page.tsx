'use client';

// Multi-Role Authentication & Secure Farmer Activation Link Claim
// Prepared by Cyber Shield | SIH 26033

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Shield,
  Sprout,
  Building2,
  ShieldCheck,
  UserCheck,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const { setRole, claimActivation } = useMarketplace();

  const [claimToken, setClaimToken] = useState(initialToken);
  const [claimPhone, setClaimPhone] = useState('+91 97890 12345');
  const [claimStatus, setClaimStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setClaimStatus(null);

    const res = await claimActivation(claimToken, claimPhone);
    setLoading(false);

    if (res.success) {
      setClaimStatus({
        type: 'success',
        text: `Activation successful for ${res.data.fullName}! Loading your verified farmer dashboard...`,
      });
      setRole('farmer');
      setTimeout(() => router.push('/farmer'), 1500);
    } else {
      setClaimStatus({
        type: 'error',
        text: res.error || 'Invalid or expired activation token.',
      });
    }
  };

  const handleQuickLogin = (role: any, path: string) => {
    setRole(role);
    router.push(path);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multi-Role Access & Single-Use Link Authentication</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pan-India Marketplace Authentication
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Farmers claim single-use activation links issued by agricultural officers. Registered buyers, officers, and administrators access respective dashboards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Col: Farmer Secure Activation Claim */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-lg space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Officer-Assisted Activation</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Claim Farmer Access Link</h2>
            <p className="text-xs text-slate-500">
              Enter the activation token generated during your Agricultural Officer&apos;s land visit.
            </p>
          </div>

          {claimStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                claimStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {claimStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{claimStatus.text}</span>
            </div>
          )}

          <form onSubmit={handleClaim} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Single-Use Activation Token:
              </label>
              <input
                type="text"
                value={claimToken}
                onChange={(e) => setClaimToken(e.target.value)}
                placeholder="e.g. ACT-9821-X4K2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold tracking-wider text-slate-900 focus:ring-2 focus:ring-emerald-600"
                required
              />
              <span className="text-[10px] text-slate-400">
                Single-use; tied to your verified mobile number
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Registered Mobile Number:
              </label>
              <input
                type="text"
                value={claimPhone}
                onChange={(e) => setClaimPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !claimToken.trim()}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Sprout className="w-4 h-4" />
              <span>{loading ? 'Validating Token...' : 'Claim Link & Enter Farmer Portal'}</span>
            </button>
          </form>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <b>Prototype Demo Token Available:</b> Token <code className="bg-white px-1.5 py-0.5 rounded border font-mono">ACT-9821-X4K2</code> is ready for testing with phone <code className="bg-white px-1.5 py-0.5 rounded border">+91 97890 12345</code> (Farmer Suresh Kumar).
          </div>
        </div>

        {/* Right Col: Instant Persona Gateways for Evaluator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Reviewer Fast Access</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Direct Role Sign-In</h2>
            <p className="text-xs text-slate-500">
              One-click entry into pre-authenticated stakeholder accounts:
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleQuickLogin('farmer', '/farmer')}
              className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">Farmer Murugan K.</div>
                  <div className="text-[11px] text-emerald-700">Small farmer, Thanjavur (1.5 acres)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>

            <button
              onClick={() => handleQuickLogin('officer', '/officer')}
              className="w-full p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-950">Dr. Anbarasan V.</div>
                  <div className="text-[11px] text-blue-700">Village Agricultural Officer, Budalur</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-700" />
            </button>

            <button
              onClick={() => handleQuickLogin('buyer', '/buyer')}
              className="w-full p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-950">AgroPure Foods Ltd.</div>
                  <div className="text-[11px] text-purple-700">B2B Food Processor, Chennai</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </button>

            <button
              onClick={() => handleQuickLogin('admin', '/admin')}
              className="w-full p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950">Govt Platform Admin</div>
                  <div className="text-[11px] text-amber-700">Oversight, audits & policy rules</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading authentication portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
