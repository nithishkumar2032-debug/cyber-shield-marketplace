'use client';

// Sovereign Institutional Navigation Header & Role Switcher
// Designed per Google Stitch Design System (AgroShield Exchange | SIH 26033)

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useMarketplace } from '@/context/MarketplaceContext';
import { UserRole } from '@/types';
import {
  Shield,
  Sprout,
  Building2,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Lock,
  Zap,
  CheckCircle2,
  RefreshCw,
  Truck,
  FileText,
  AlertTriangle,
  User,
  ChevronDown,
} from 'lucide-react';

export default function Header() {
  const { role, setRole, resetDatabase } = useMarketplace();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI' | 'TA'>('EN');
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

  const openChatbot = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-agri-chatbot'));
    }
  };

  const openFreightModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-freight-estimator'));
    }
  };

  const getUserDetails = () => {
    switch (role) {
      case 'farmer':
        return { name: 'Murugan K.', title: 'Farmer (Cauvery Delta FPO)', icon: Sprout, color: 'text-emerald-700 bg-emerald-100' };
      case 'officer':
        return { name: 'Dr. Anbarasan V.', title: 'AO (Thanjavur Zone)', icon: ShieldCheck, color: 'text-blue-700 bg-blue-100' };
      case 'buyer':
        return { name: 'AgroPure Foods Ltd', title: 'Institutional Tier-1', icon: Building2, color: 'text-purple-700 bg-purple-100' };
      case 'admin':
        return { name: 'Govt. Oversight Desk', title: 'Platform Authority', icon: UserCheck, color: 'text-amber-700 bg-amber-100' };
      default:
        return { name: 'Public Guest', title: 'All-India Observer', icon: User, color: 'text-slate-700 bg-slate-100' };
    }
  };

  const user = getUserDetails();
  const UserIcon = user.icon;

  const navItems = [
    { label: 'Explore Market', path: '/explore' },
    { label: 'Active Bids & Escrow', path: '/bids' },
    { label: 'Farmer Portal', path: '/farmer' },
    { label: 'B2B Buyer Hub', path: '/buyer' },
    { label: 'Officer Console', path: '/officer' },
    { label: 'Grievance Desk', path: '/grievances' },
    { label: 'Officer Directory', path: '/officers' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-slate-200">
      {/* 1. Top Tier: Sovereign Brand & Core Control Strip */}
      <div className="h-16 sm:h-20 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 border-b border-slate-100">
        {/* Left Brand Identity */}
        <Link href="/" className="flex items-center gap-3 min-w-max group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 p-2 flex items-center justify-center shadow-md border border-emerald-500/30 group-hover:scale-105 transition-all">
            <Shield className="w-5 h-5 text-emerald-100" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base sm:text-lg text-[#005d42] tracking-tight">
                Cyber Shield
              </span>
              <span className="px-1.5 py-0.5 bg-[#eaedff] text-[#4e45d5] font-bold text-[10px] tracking-wider rounded uppercase">
                SIH 26033
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Pan-India B2B Crop Marketplace • Prepared by Cyber Shield
            </span>
          </div>
        </Link>

        {/* Center/Right Protocol Badges & Actions */}
        <div className="flex items-center gap-3">
          {/* Institutional Badges (Desktop) */}
          <div className="hidden xl:flex items-center gap-1.5">
            <span className="badge-escrow">
              <Lock className="w-3 h-3" />
              DEMO BANKING ESCROW
            </span>
            <span className="badge-ai">
              <Zap className="w-3 h-3" />
              AI DYNAMIC RATES
            </span>
            <span className="badge-officer">
              <CheckCircle2 className="w-3 h-3" />
              OFFICER VERIFIED
            </span>
          </div>

          {/* Ask Agri-Assistant Chatbot Trigger */}
          <button
            type="button"
            onClick={openChatbot}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4e45d5] hover:bg-[#4338ca] text-white font-medium text-xs shadow-sm transition-all hover:shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span className="font-semibold">Ask Agri-Assistant</span>
          </button>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center bg-[#f2f3ff] rounded-lg p-0.5 border border-[#e2e7ff]">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                language === 'EN' ? 'bg-white text-[#131b2e] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('HI')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                language === 'HI' ? 'bg-white text-[#131b2e] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('TA')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                language === 'TA' ? 'bg-white text-[#131b2e] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* Role Persona Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] border border-slate-200 text-xs font-semibold shadow-2xs transition-all"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${user.color}`}>
                <UserIcon className="w-3 h-3" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold text-slate-800 leading-none">{user.name}</span>
                <span className="text-[9px] text-slate-500 leading-none mt-0.5">{user.title}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white text-slate-900 shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Switch Role Perspective</span>
                  <button
                    onClick={handleReset}
                    disabled={isResetting}
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-bold text-[10px]"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
                    <span>Reset Data</span>
                  </button>
                </div>

                <button
                  onClick={() => handleRoleSelect('farmer')}
                  className={`w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2.5 text-xs transition-colors ${
                    role === 'farmer' ? 'bg-emerald-50/80 font-bold text-emerald-950' : 'text-slate-800'
                  }`}
                >
                  <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div>Farmer / FPO Representative</div>
                    <div className="text-[10px] text-slate-500">View bids, allocate kg, track escrow & OTP</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('officer')}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-xs transition-colors ${
                    role === 'officer' ? 'bg-blue-50/80 font-bold text-blue-950' : 'text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div>Agricultural Officer</div>
                    <div className="text-[10px] text-slate-500">Field visits, verify bids & pickup handover</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('buyer')}
                  className={`w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center gap-2.5 text-xs transition-colors ${
                    role === 'buyer' ? 'bg-purple-50/80 font-bold text-purple-950' : 'text-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <div>Registered B2B Buyer</div>
                    <div className="text-[10px] text-slate-500">Submit bids, fund escrow, assign transport</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center gap-2.5 text-xs transition-colors ${
                    role === 'admin' ? 'bg-amber-50/80 font-bold text-amber-950' : 'text-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div>Platform Administrator</div>
                    <div className="text-[10px] text-slate-500">KYC verification, policy rules & audit trail</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Secondary Navigation Rail from Google Stitch */}
      <div className="w-full px-4 sm:px-6 lg:px-8 bg-[#f2f3ff] border-b border-[#e2e7ff] flex items-center justify-between overflow-x-auto">
        <nav className="flex items-center gap-1 py-1.5 text-xs font-medium whitespace-nowrap">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#005d42] text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-[#131b2e] hover:bg-white/60'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Live MSP & Institutional Settlement Ticker from Stitch */}
      <div className="w-full bg-[#eaedff] py-1 px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[#131b2e] text-[11px] border-b border-[#dae2fd]">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex items-center gap-1 text-[#005d42] font-black tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#005d42] animate-ping inline-block"></span>
            LIVE MSP
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-700">
            Govt. Benchmark MSP live update: <b>Paddy ₹2,203/100kg (₹22.03/kg)</b> • Certified Escrow Guarantee Active • Metric Standards: <b>kg & ₹/kg only</b>
          </span>
        </div>
        <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-wider text-slate-500">
          ISO 9001:2015 COMPLIANT SETTLEMENT
        </span>
      </div>
    </header>
  );
}
