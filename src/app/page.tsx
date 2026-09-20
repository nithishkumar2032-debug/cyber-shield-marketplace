'use client';

// Pan-India B2B Crop Marketplace Landing Page
// Multi-Role Direct Access & Institutional Procurement Exchange

import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Shield,
  Sprout,
  Building2,
  ShieldCheck,
  UserCheck,
  Lock,
  Truck,
  TrendingUp,
  Scale,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
} from 'lucide-react';

export default function HomePage() {
  const { state, setRole } = useMarketplace();
  const listings = state?.listings || [];

  return (
    <div className="space-y-12 pb-16">
      {/* Top Hero & Horizontal Role Gateways Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-10">
          {/* 1. HORIZONTAL LOGINS ON TOP */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                <span>Direct Role Gateways & Portal Access</span>
              </div>
              <span className="text-[11px] text-emerald-300/70 hidden sm:inline">
                Select your stakeholder portal to begin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Farmer / FPO Card */}
              <Link
                href="/farmer"
                onClick={() => setRole('farmer')}
                className="group p-4 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/50 hover:border-emerald-400/80 transition-all shadow-lg hover:shadow-emerald-900/30 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-800/60 text-emerald-300 border border-emerald-700/40">
                    Producer
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Farmer & FPO Portal
                  </div>
                  <p className="text-xs text-emerald-200/75 mt-1 leading-relaxed">
                    View bids, allocate kg, track escrow & OTP pickup.
                  </p>
                </div>
                <div className="pt-2 border-t border-emerald-800/50 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                  <span>Enter Farmer Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Agricultural Officer Card */}
              <Link
                href="/officer"
                onClick={() => setRole('officer')}
                className="group p-4 rounded-2xl bg-slate-900/80 hover:bg-blue-950/90 border border-blue-800/50 hover:border-blue-400/80 transition-all shadow-lg hover:shadow-blue-900/30 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/80 text-blue-300 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/40">
                    Field Verifier
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    Agri Officer Desk
                  </div>
                  <p className="text-xs text-blue-200/75 mt-1 leading-relaxed">
                    Field visits, confirm bids & verify farm handover.
                  </p>
                </div>
                <div className="pt-2 border-t border-blue-800/50 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>Enter Officer Desk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* B2B Buyer Card */}
              <Link
                href="/buyer"
                onClick={() => setRole('buyer')}
                className="group p-4 rounded-2xl bg-slate-900/80 hover:bg-purple-950/90 border border-purple-800/50 hover:border-purple-400/80 transition-all shadow-lg hover:shadow-purple-900/30 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/80 text-purple-300 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/40">
                    Buyer Hub
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    B2B Registered Buyer
                  </div>
                  <p className="text-xs text-purple-200/75 mt-1 leading-relaxed">
                    Submit bids, fund escrow & assign transport logistics.
                  </p>
                </div>
                <div className="pt-2 border-t border-purple-800/50 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                  <span>Enter Buyer Hub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Platform Admin Card */}
              <Link
                href="/admin"
                onClick={() => setRole('admin')}
                className="group p-4 rounded-2xl bg-slate-900/80 hover:bg-amber-950/90 border border-amber-800/50 hover:border-amber-400/80 transition-all shadow-lg hover:shadow-amber-900/30 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-900/80 text-amber-300 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/40">
                    Governance
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Platform Administrator
                  </div>
                  <p className="text-xs text-amber-200/75 mt-1 leading-relaxed">
                    Verify buyers, catalogue, policy rules & audit trail.
                  </p>
                </div>
                <div className="pt-2 border-t border-amber-800/50 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  <span>Enter Admin Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* 2. HERO HEADLINE & ACTIONS */}
          <div className="pt-6 border-t border-emerald-800/60">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Pan-India B2B <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  Crop Marketplace
                </span>
              </h1>

              <p className="text-base sm:text-xl text-emerald-100/90 leading-relaxed max-w-3xl mx-auto">
                Collective selling, transparent quantity-specific bids, and protected banking partner escrow for small and large farmers across India.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/explore"
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 group"
                >
                  <span>Explore India-Wide Crops</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/bids"
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base border border-slate-700 transition-all flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>View Bidding Windows</span>
                </Link>
              </div>

              {/* Protocol Guarantees */}
              <div className="pt-6 border-t border-emerald-800/60 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-emerald-300/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero minimum landholding condition</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pre-funded Escrow Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Officer Verified Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 6 Core Pillars of the Operating Model */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Engineered for Ground Realities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How the Pan-India Marketplace Protects Farmers
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Addressing middleman dependency, distress sales, delayed pickup, and payment risk with institutional safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Inclusive FPO Aggregation</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Small farmers combine produce into bulk lots via their Farmer Producer Organisation (Aavin milk-society model). Large farmers can list individually. Zero minimum land requirement.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Officer Assisted Onboarding</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Local Agricultural Officers visit the land, record GPS coordinates, check crop standing, and upload records. Generates an expiring single-use access link for the farmer.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Short Bidding & Farmer Choice</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Buyers bid for specific kg quantities during a published window. No automatic winner: the farmer chooses preferred bids and allocates kg. Officer confirms by phone.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Protected Banking Escrow</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Confirmed orders are 100% pre-funded into banking partner escrow before release. Officers do not hold funds. Custody transfer at pickup triggers seller payout.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">5. Buyer Transport & OTP Pickup</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Buyer arranges and registers transport partner, vehicle and driver. Handover is authenticated using an order-bound OTP, scale weighing, and triple confirmation.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">6. Accessible Human Support</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Village, Taluka, and District Agricultural Officers listed with contact numbers. Staged grievances, late cancellation compensation, and helpful navigational AI assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Live Marketplace Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Active Supply Pipeline
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Verified Crop Lots Available for B2B Bidding
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <span>View All All-India Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover-lift flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.listingCode}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {item.sellerType === 'fpo' ? 'FPO Collective Lot' : 'Individual Farmer'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.crop}</h3>
                  <div className="text-xs text-slate-500 font-medium">{item.variety} • {item.productForm}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">Available Balance</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {item.availableQuantityKg.toLocaleString()} kg
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      (Total lot: {item.totalQuantityKg.toLocaleString()} kg)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Reserve Price</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      ₹{item.minimumPricePerKg.toFixed(2)} / kg
                    </span>
                    <span className="text-[10px] text-slate-500 block">INR per kilogram</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.district}, {item.state}</span>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  Harvest: <span className="font-semibold text-slate-700">{item.expectedHarvestDate}</span>
                </div>
                <Link
                  href="/bids"
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                >
                  Place Bid
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
