'use client';

// Footer Component
// Prepared by Cyber Shield | SIH 26033

import React from 'react';
import Link from 'next/link';
import { Shield, AlertCircle, HeartHandshake, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Attribution */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              CS
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Pan-India B2B Crop Marketplace
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Connecting verified individual small/large farmers and FPO collectives with registered B2B buyers across India. Protected escrow, transparent bidding, and verified pickup.
          </p>
          <div className="text-xs text-amber-400 font-medium">
            Prepared by Cyber Shield • SIH 26033 Prototype
          </div>
          <div className="inline-block p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Prototype Scope Disclaimer
            </div>
            <div>
              Proposed SIH arrangement. Central Government administration and live banking integration are proposed operating models, not claims of an existing live deployment. Banking partner escrow is simulated with audit logs.
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Portals</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/farmer" className="hover:text-emerald-400 transition-colors">
                Farmer & FPO Portal
              </Link>
            </li>
            <li>
              <Link href="/officer" className="hover:text-emerald-400 transition-colors">
                Agricultural Officer Desk
              </Link>
            </li>
            <li>
              <Link href="/buyer" className="hover:text-emerald-400 transition-colors">
                Registered Buyer Portal
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                Platform Administrator
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-emerald-400 transition-colors">
                Claim Activation Link
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Directory */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Support & Policies</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/officers" className="hover:text-emerald-400 transition-colors">
                Officer Contact Directory
              </Link>
            </li>
            <li>
              <Link href="/grievances" className="hover:text-emerald-400 transition-colors">
                File Grievance / Dispute
              </Link>
            </li>
            <li>
              <Link href="/bids" className="hover:text-emerald-400 transition-colors">
                Active Bidding Windows
              </Link>
            </li>
            <li>
              <span className="text-xs text-slate-500 block pt-2">
                Emergency Agri-Kisan Support: 1800-180-1551 (National Toll-free)
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-6 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div>© 2026 Cyber Shield. Smart India Hackathon Prototype.</div>
        <div>All crop quantities in kg • All prices in INR/kg</div>
      </div>
    </footer>
  );
}
