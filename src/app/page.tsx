'use client';

// Trusted Farm-Gate Transaction Layer Landing Page
// Prepared by Cyber Shield | SIH 26033

import React from 'react';
import TransactionTimeline from '@/components/TransactionTimeline';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Shield,
  Sprout,
  Building2,
  ShieldCheck,
  Lock,
  Truck,
  TrendingUp,
  Scale,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { state, setRole } = useMarketplace();
  const listings = state?.listings || [];

  return (
    <div className="space-y-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"><TransactionTimeline completed={8} /></div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Smart India Hackathon 2026 • SIH 26033</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Pan-India B2B <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  Crop Marketplace
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                Verify → Trade → Execute → Settlement → Bank → Audit. A simulated B2B transaction workflow connecting farmers/FPOs and verified buyers.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/explore"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 group"
                >
                  <span>Explore Crop Lots</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/bids"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base border border-slate-700 transition-all flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>View Bidding Windows</span></Link>
                <Link href="/demo" className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base transition-all flex items-center gap-2">SIH End-to-End Demo</Link>              </div>

              {/* Attribution and Protocol Guarantee */}
              <div className="pt-4 border-t border-emerald-800/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-emerald-300/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero minimum landholding condition</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sandbox Payment Protection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Handover Workflow</span>
                </div>
              </div>
            </div>

            {/* Hero Quick Role Selector Cards */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/20 shadow-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center justify-between">
                <span>Direct Role Gateways</span>
                <span className="badge-demo text-[9px] py-0 px-1.5">Interactive Persona</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <Link
                  href="/farmer"
                  onClick={() => setRole('farmer')}
                  className="p-3.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-800/90 border border-emerald-700/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-800 text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">Farmer & FPO Portal</div>
                      <div className="text-xs text-emerald-300/80">Select bids, allocate kg, track escrow & OTP</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/officer"
                  onClick={() => setRole('officer')}
                  className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-blue-900/70 border border-blue-700/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-900 text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">Agricultural Officer Desk</div>
                      <div className="text-xs text-blue-200/80">Field visits, confirm bids, verify farm pickup</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/buyer"
                  onClick={() => setRole('buyer')}
                  className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-purple-900/70 border border-purple-700/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-900 text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">B2B Registered Buyer</div>
                      <div className="text-xs text-purple-200/80">Submit bids, fund escrow, assign transport</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setRole('admin')}
                  className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-amber-950/70 border border-amber-700/40 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-900/80 text-amber-300 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">Government Administrator</div>
                      <div className="text-xs text-amber-200/80">Verify buyers, catalogue, policy rules & audits</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </Link>
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
            How Cyber Shield Protects the Transaction
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
            <h3 className="text-base font-bold text-slate-900">4. Sandbox Payment / Settlement</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Demo orders use a payment-partner sandbox simulation. Officers do not hold funds. After verified handover, a settlement instruction is generated.
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
              Demo Transaction Pipeline
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Verified Crop Lots Available for B2B Bidding
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <span>View All Crop Lots</span>
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
