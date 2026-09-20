'use client';

// Navigation Header with Horizontal Logins
// Cyber Shield Pan-India B2B Crop Marketplace

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMarketplace } from '@/context/MarketplaceContext';
import { UserRole } from '@/types';
import {
  Shield,
  Sprout,
  Building2,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  Menu,
  X,
} from 'lucide-react';

export default function Header() {
  const { role, setRole, resetDatabase } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'farmer') router.push('/farmer');
    else if (newRole === 'officer') router.push('/officer');
    else if (newRole === 'buyer') router.push('/buyer');
    else if (newRole === 'admin') router.push('/admin');
    else if (newRole === 'fpo_representative') router.push('/farmer');
    else router.push('/');
  };

  const handleReset = async () => {
    if (confirm('Reset marketplace database to initial seed data?')) {
      setIsResetting(true);
      await resetDatabase();
      setIsResetting(false);
      alert('Marketplace database reset to initial state.');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-800/40 bg-emerald-900 text-white shadow-md">
      {/* Top Institutional Platform Strip */}
      <div className="bg-emerald-950 px-4 py-1.5 text-xs text-emerald-200/90 flex flex-wrap items-center justify-between border-b border-emerald-800/30">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400">Pan-India B2B Agriculture Platform</span>
          <span className="text-emerald-600 hidden sm:inline">•</span>
          <span className="text-emerald-300/80 hidden sm:inline">Direct Mandi & Escrow Trading Network</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-emerald-400/80">Escrow:</span>
          <span className="badge-demo text-[10px] py-0 px-2">SIMULATED BANKING ESCROW</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-2 flex items-center justify-center shadow-lg border border-emerald-400/30">
              <Shield className="w-6 h-6 text-white group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Cyber Shield
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 border border-emerald-600/40">
                  B2B
                </span>
              </div>
              <div className="text-[11px] text-emerald-300 tracking-wide font-medium">
                Pan-India Crop Marketplace
              </div>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/explore"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/explore'
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/bids"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/bids'
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              Bidding Windows
            </Link>
            <Link
              href="/officers"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/officers'
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              Officer Directory
            </Link>
            <Link
              href="/grievances"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/grievances'
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              Grievances
            </Link>
          </nav>

          {/* Top Horizontal Logins & Reset */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 mr-1 hidden xl:inline">
              Portals:
            </span>

            <button
              onClick={() => handleRoleSelect('farmer')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                role === 'farmer'
                  ? 'bg-emerald-800 text-white border-emerald-400 shadow-sm ring-1 ring-emerald-400'
                  : 'bg-emerald-950/70 text-emerald-100 border-emerald-700/60 hover:bg-emerald-800 hover:text-white'
              }`}
              title="Farmer & FPO Portal Login"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Farmer</span>
            </button>

            <button
              onClick={() => handleRoleSelect('officer')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                role === 'officer'
                  ? 'bg-blue-900 text-white border-blue-400 shadow-sm ring-1 ring-blue-400'
                  : 'bg-slate-900/70 text-blue-200 border-blue-800/60 hover:bg-blue-900/80 hover:text-white'
              }`}
              title="Agricultural Officer Desk Login"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Officer</span>
            </button>

            <button
              onClick={() => handleRoleSelect('buyer')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                role === 'buyer'
                  ? 'bg-purple-900 text-white border-purple-400 shadow-sm ring-1 ring-purple-400'
                  : 'bg-slate-900/70 text-purple-200 border-purple-800/60 hover:bg-purple-900/80 hover:text-white'
              }`}
              title="Registered B2B Buyer Hub Login"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Buyer</span>
            </button>

            <button
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                role === 'admin'
                  ? 'bg-amber-900 text-white border-amber-400 shadow-sm ring-1 ring-amber-400'
                  : 'bg-slate-900/70 text-amber-200 border-amber-800/60 hover:bg-amber-900/80 hover:text-white'
              }`}
              title="Government Platform Administrator Login"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>

            <div className="h-5 w-px bg-emerald-800/60 mx-1"></div>

            {/* Quick Reset Demo State */}
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors border border-emerald-700/50"
              title="Reset database to fresh seed state"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="p-1.5 rounded-lg bg-emerald-800/80 text-emerald-200 border border-emerald-700/50 sm:hidden"
              title="Reset data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-emerald-800 text-emerald-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-800 bg-emerald-950 px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800"
            >
              Marketplace
            </Link>
            <Link
              href="/bids"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800"
            >
              Bids Window
            </Link>
            <Link
              href="/officers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800"
            >
              Officer Directory
            </Link>
            <Link
              href="/grievances"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800"
            >
              Grievances
            </Link>
          </div>

          <div className="pt-2 border-t border-emerald-800/60">
            <div className="text-xs font-semibold text-emerald-400 mb-2">Login Portals:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  handleRoleSelect('farmer');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                  role === 'farmer'
                    ? 'bg-emerald-800 text-white border-emerald-400'
                    : 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50'
                }`}
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Farmer Login</span>
              </button>
              <button
                onClick={() => {
                  handleRoleSelect('officer');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                  role === 'officer'
                    ? 'bg-blue-900 text-white border-blue-400'
                    : 'bg-blue-950/60 text-blue-200 border-blue-800/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Officer Login</span>
              </button>
              <button
                onClick={() => {
                  handleRoleSelect('buyer');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                  role === 'buyer'
                    ? 'bg-purple-900 text-white border-purple-400'
                    : 'bg-purple-950/60 text-purple-200 border-purple-800/50'
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Buyer Login</span>
              </button>
              <button
                onClick={() => {
                  handleRoleSelect('admin');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                  role === 'admin'
                    ? 'bg-amber-900 text-white border-amber-400'
                    : 'bg-amber-950/60 text-amber-200 border-amber-800/50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
