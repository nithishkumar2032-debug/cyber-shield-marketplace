'use client';

// Navigation Header & Role Switcher
// Prepared by Cyber Shield | SIH 26033

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMarketplace } from '@/context/MarketplaceContext';
import { UserRole } from '@/types';
import { Shield, Sprout, Building2, UserCheck, ShieldCheck, RefreshCw, Menu, X, ChevronDown, Bot } from 'lucide-react';

export default function Header() {
  const { role, setRole, resetDatabase } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'farmer') router.push('/farmer');
    else if (newRole === 'officer') router.push('/officer');
    else if (newRole === 'buyer') router.push('/buyer');
    else if (newRole === 'admin') router.push('/admin');
    else if (newRole === 'fpo_representative') router.push('/farmer');
    else router.push('/');
  };

  const handleReset = async () => {
    if (confirm('Reset marketplace database to initial prototype seed data?')) {
      setIsResetting(true);
      await resetDatabase();
      setIsResetting(false);
      alert('Marketplace database reset to initial state.');
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'farmer':
        return { label: 'Farmer / FPO (Murugan K.)', icon: Sprout, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'officer':
        return { label: 'Agri Officer (Dr. Anbarasan)', icon: ShieldCheck, color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'buyer':
        return { label: 'B2B Buyer (AgroPure Foods)', icon: Building2, color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'admin':
        return { label: 'Platform Admin (Govt Oversight)', icon: UserCheck, color: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: 'Public / Guest View', icon: Shield, color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const activeBadge = getRoleBadge();
  const BadgeIcon = activeBadge.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-800/40 bg-emerald-900 text-white shadow-md">
      {/* Top Prototype & Attribution Bar */}
      <div className="bg-emerald-950 px-4 py-1.5 text-xs text-emerald-200/90 flex flex-wrap items-center justify-between border-b border-emerald-800/30">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400">SIH 26033</span>
          <span className="text-emerald-500">|</span>
          <span>Smart India Hackathon 2026 Prototype</span>
          <span className="text-emerald-500">•</span>
          <span className="font-medium text-amber-300">Prepared by Cyber Shield</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-emerald-400/80">Escrow:</span>
          <span className="badge-demo text-[10px] py-0 px-2">SIMULATED BANKING ESCROW</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
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

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/explore"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/explore'
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/bids"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/bids'
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              Bidding Windows
            </Link>
            <Link
              href="/officers"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/officers'
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              Officer Directory
            </Link>
            <Link
              href="/grievances"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/grievances'
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              Grievances
            </Link>
          </nav>

          {/* Right Role Switcher & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Interactive Role Switcher Modal Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${activeBadge.color} hover:shadow`}
                title="Switch role persona to test all system perspectives"
              >
                <BadgeIcon className="w-4 h-4" />
                <span>{activeBadge.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white text-slate-900 shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Test Role Personas
                  </div>
                  <button
                    onClick={() => handleRoleSelect('farmer')}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2.5 text-sm font-medium text-slate-800"
                  >
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div>Farmer / FPO Representative</div>
                      <div className="text-[11px] text-slate-500">View bids, allocate kg, track escrow & OTP</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('officer')}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-sm font-medium text-slate-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <div>Agricultural Officer</div>
                      <div className="text-[11px] text-slate-500">Field visits, verify bids & pickup handover</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('buyer')}
                    className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center gap-2.5 text-sm font-medium text-slate-800"
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <div>
                      <div>Registered B2B Buyer</div>
                      <div className="text-[11px] text-slate-500">Submit bids, fund escrow, assign transport</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center gap-2.5 text-sm font-medium text-slate-800"
                  >
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    <div>
                      <div>Government / Platform Admin</div>
                      <div className="text-[11px] text-slate-500">Buyer verification, policies & immutable audits</div>
                    </div>
                  </button>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button
                    onClick={() => handleRoleSelect('guest')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2.5 text-sm font-medium text-slate-700"
                  >
                    <Shield className="w-4 h-4 text-slate-500" />
                    <div>
                      <div>Public Guest</div>
                      <div className="text-[11px] text-slate-500">All-India browse and open transparent bids</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Reset Demo State */}
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors border border-emerald-700/50"
              title="Reset database to fresh seed state"
            >
              <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
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
        <div className="md:hidden border-t border-emerald-800 bg-emerald-950 px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-emerald-900/60 text-emerald-100"
            >
              Marketplace
            </Link>
            <Link
              href="/bids"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-emerald-900/60 text-emerald-100"
            >
              Bids Window
            </Link>
            <Link
              href="/officers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-emerald-900/60 text-emerald-100"
            >
              Officer Directory
            </Link>
            <Link
              href="/grievances"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-emerald-900/60 text-emerald-100"
            >
              Grievances
            </Link>
          </div>

          <div className="pt-2 border-t border-emerald-800/60">
            <div className="text-xs font-semibold text-emerald-400 mb-2">Switch Role:</div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => {
                  handleRoleSelect('farmer');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-emerald-900 text-emerald-200 text-left"
              >
                👨‍🌾 Farmer
              </button>
              <button
                onClick={() => {
                  handleRoleSelect('officer');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-emerald-900 text-blue-200 text-left"
              >
                🏛️ Agri Officer
              </button>
              <button
                onClick={() => {
                  handleRoleSelect('buyer');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-emerald-900 text-purple-200 text-left"
              >
                🏢 Buyer
              </button>
              <button
                onClick={() => {
                  handleRoleSelect('admin');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-emerald-900 text-amber-200 text-left"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
