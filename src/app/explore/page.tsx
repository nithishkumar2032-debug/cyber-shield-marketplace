'use client';

// Sovereign B2B Marketplace Discovery
// Implemented per Google Stitch Design System (AgroShield Exchange | SIH 26033)

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Search,
  MapPin,
  Scale,
  Calendar,
  ShieldCheck,
  Building2,
  Tag,
  ArrowRight,
  Info,
  Truck,
  Calculator,
  Layers,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Lock,
  Download,
} from 'lucide-react';
import { LogisticsEstimatorModal } from '@/components/LogisticsEstimatorModal';

export default function ExplorePage() {
  const { state } = useMarketplace();
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [estimatorListing, setEstimatorListing] = useState<any | null>(null);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState<boolean>(false);

  // Listen for global open-freight-estimator event from Header
  useEffect(() => {
    const handleOpen = () => {
      setEstimatorListing(null);
      setIsEstimatorOpen(true);
    };
    window.addEventListener('open-freight-estimator', handleOpen);
    return () => window.removeEventListener('open-freight-estimator', handleOpen);
  }, []);

  const listings = state?.listings || [];
  const catalogue = state?.catalogue || [];

  // Extract unique states & districts
  const statesList = ['All', ...Array.from(new Set(listings.map((l) => l.state)))];
  const districtsList = [
    'All',
    ...Array.from(
      new Set(
        listings
          .filter((l) => selectedState === 'All' || l.state === selectedState)
          .map((l) => l.district)
      )
    ),
  ];
  const cropsList = ['All', ...Array.from(new Set(catalogue.map((c) => c.cropName)))];

  // Filtering
  const filteredListings = listings.filter((item) => {
    const matchesState = selectedState === 'All' || item.state.toLowerCase() === selectedState.toLowerCase();
    const matchesDistrict = selectedDistrict === 'All' || item.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesCrop = selectedCrop === 'All' || item.crop.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch =
      !searchQuery.trim() ||
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.listingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesState && matchesDistrict && matchesCrop && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 pb-16">
      {/* 1. Top Sovereign Institutional Banner from Google Stitch */}
      <section className="w-full bg-[#f2f3ff] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden border-b border-[#e2e7ff]">
        <div className="absolute -right-20 -top-24 w-96 h-96 rounded-full bg-[#7bd8b1]/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto flex flex-col gap-6 relative z-10">
          {/* Operational Metric Ticker Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#005d42] text-white uppercase tracking-wider">
                Protocol Layer 01
              </span>
              <span className="text-slate-600 font-medium">
                National APMC Clearing Grid • Real-Time Landed Quotation Engine
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#047857]"></span>
                SETTLEMENT LATENCY: 140ms
              </span>
              <span className="text-slate-300">/</span>
              <span>CURRENCY: INR (₹)</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#005d42] font-black uppercase">SOVEREIGN ESCROW LOCKED</span>
            </div>
          </div>

          {/* Main Headline Block */}
          <div className="rounded-2xl bg-gradient-to-r from-[#005d42] via-[#047857] to-[#002115] p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="flex flex-col max-w-3xl gap-3">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full w-fit border border-white/20">
                <ShieldCheck className="w-4 h-4 text-[#97f5cc]" />
                <span className="text-[11px] font-bold text-[#97f5cc] uppercase tracking-wider">
                  Autonomous Dispute-Proof Mandi Gateway
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Pan-India B2B Crop Exchange & Procurement Network
              </h1>

              <p className="text-xs sm:text-sm text-[#9ffdd3]/90 max-w-2xl leading-relaxed">
                Direct institutional sourcing from GPS-verified FPOs and agricultural collectives. Multi-signature escrow settlement, field officer quality assays, strictly unified in metric kilograms (kg).
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEstimatorListing(null);
                    setIsEstimatorOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#005d42] font-bold text-xs shadow hover:bg-[#f2f3ff] transition-all"
                >
                  <Truck className="w-4 h-4 text-[#005d42]" />
                  <span>Launch Freight Recommender</span>
                </button>

                <Link
                  href="/bids"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/15 text-white font-semibold text-xs hover:bg-white/25 transition-all border border-white/20"
                >
                  <Layers className="w-4 h-4 text-white" />
                  <span>Inspect Live Bidding Order Book</span>
                </Link>
              </div>
            </div>

            {/* Metric Cards Pillar from Stitch */}
            <div className="grid grid-cols-3 gap-2 w-full lg:w-auto bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
              <div className="flex flex-col pr-4 border-r border-white/15">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#97f5cc]/80">Verified Lots</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  48,520 <span className="text-[10px] font-bold">kg</span>
                </span>
                <span className="text-[10px] text-[#9ffdd3] mt-0.5">Active pan-India</span>
              </div>

              <div className="flex flex-col px-4 border-r border-white/15">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#97f5cc]/80">Escrow Vault</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  ₹142.8 <span className="text-[10px] font-bold">Lakh</span>
                </span>
                <span className="text-[10px] text-[#9ffdd3] mt-0.5">Under custody</span>
              </div>

              <div className="flex flex-col pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#97f5cc]/80">Registered</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">1,240</span>
                <span className="text-[10px] text-[#9ffdd3] mt-0.5">Certified FPOs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cascading Multi-Filter & Verification Rail from Stitch */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop, variety, or lot ID (e.g., LOT-2026-FPO-PAD-001)..."
                className="w-full h-11 pl-10 pr-4 bg-[#f2f3ff] rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005d42] transition-all border border-slate-200"
              />
            </div>

            {/* Cascading Selectors */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* State Filter */}
              <div>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict('All');
                  }}
                  className="w-full h-11 px-3 bg-[#f2f3ff] rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 focus:ring-2 focus:ring-[#005d42]"
                >
                  <option value="All">All India States</option>
                  {statesList.filter((s) => s !== 'All').map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full h-11 px-3 bg-[#f2f3ff] rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 focus:ring-2 focus:ring-[#005d42]"
                >
                  <option value="All">All Districts</option>
                  {districtsList.filter((d) => d !== 'All').map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop Filter */}
              <div>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full h-11 px-3 bg-[#f2f3ff] rounded-xl text-xs font-semibold text-slate-800 border border-slate-200 focus:ring-2 focus:ring-[#005d42]"
                >
                  <option value="All">All Crop Categories</option>
                  {cropsList.filter((c) => c !== 'All').map((crp) => (
                    <option key={crp} value={crp}>
                      {crp}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Active Filters & Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Displaying:</span>
              <span className="font-bold text-[#005d42]">{filteredListings.length} Verified Crop Lots</span>
              <span>• Standardized in metric kilograms (kg)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge-escrow">
                <Lock className="w-3 h-3" />
                ESCROW PROTECTED
              </span>
              <span className="badge-ai">
                <Truck className="w-3 h-3" />
                FREIGHT CALCULATOR ATTACHED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Crop Batch Cards Grid (Stitch High-Data Density Architecture) */}
      <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-800">No Produce Lots Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No crop listings matched your filter criteria. Try resetting the state or search term.
            </p>
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedDistrict('All');
                setSelectedCrop('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#005d42] text-white font-bold text-xs hover:bg-[#047857] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const catItem = catalogue.find((c) => c.cropName.toLowerCase() === listing.crop.toLowerCase());
              const percentRemaining = Math.round((listing.availableQuantityKg / listing.totalQuantityKg) * 100);

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#047857]/40 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-4">
                    {/* Top Rail: Mandi Code & Verified Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-slate-500 tracking-wider">
                          {listing.listingCode}
                        </span>
                        <div className="text-[10px] text-slate-400">MANDI: {listing.district.toUpperCase()}-01</div>
                      </div>

                      {listing.sellerType === 'fpo' ? (
                        <span className="badge-escrow">
                          <Building2 className="w-3 h-3" />
                          FPO COLLECTIVE LOT
                        </span>
                      ) : (
                        <span className="badge-officer">
                          <CheckCircle2 className="w-3 h-3" />
                          OFFICER VERIFIED
                        </span>
                      )}
                    </div>

                    {/* Commodity Title & Variety */}
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900">{listing.crop}</h3>
                      <div className="text-xs text-[#005d42] font-semibold flex items-center gap-1.5 mt-0.5">
                        <span>Variety: {listing.variety}</span>
                        <span>•</span>
                        <span>{listing.productForm}</span>
                      </div>
                    </div>

                    {/* Metric Grid from Stitch: Price & Available kg */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Reserve Floor
                        </span>
                        <div className="text-lg font-extrabold text-[#005d42] tabular-nums mt-0.5">
                          ₹{listing.minimumPricePerKg.toFixed(2)}
                          <span className="text-xs font-normal text-slate-600"> / kg</span>
                        </div>
                        <span className="text-[9px] text-slate-500">INR per kilogram</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Available Lot
                        </span>
                        <div className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
                          {listing.availableQuantityKg.toLocaleString('en-IN')}{' '}
                          <span className="text-xs font-normal text-slate-600">kg</span>
                        </div>
                        {/* Progress Stock bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div
                            className="bg-[#005d42] h-full rounded-full transition-all"
                            style={{ width: `${percentRemaining}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Benchmark MSP reference badge */}
                    {catItem && (
                      <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl px-3 py-1.5 text-[11px] text-[#065f46] flex items-center justify-between">
                        <div>
                          <span className="font-bold">Govt / NAFED MSP: </span>
                          <span className="font-extrabold tabular-nums">₹{catItem.referencePricePerKg.toFixed(2)}/kg</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase bg-white/80 px-1.5 py-0.5 rounded border border-[#a7f3d0]">
                          MSP ANCHOR
                        </span>
                      </div>
                    )}

                    {/* Location & Farm-Gate Specs */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800">
                          {listing.approximatePickupArea}, {listing.district}, {listing.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Ready for Pickup: {listing.expectedHarvestDate}</span>
                      </div>
                    </div>

                    {/* Quality Spec Snapshot */}
                    <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-200/80">
                      <span className="font-bold text-slate-700">Quality Spec: </span>
                      {listing.qualityTerms}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEstimatorListing(listing);
                        setIsEstimatorOpen(true);
                      }}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#4e45d5] border border-[#c7d2fe] transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#4e45d5]" />
                      <span>Estimate Freight</span>
                    </button>

                    <Link
                      href={`/bids?lot=${listing.id}`}
                      className="text-xs font-bold px-4 py-1.5 rounded-xl bg-[#005d42] text-white hover:bg-[#047857] transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>Inspect & Bid</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Dynamic Freight & Logistics Estimator Modal */}
      <LogisticsEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        initialWeightKg={estimatorListing ? Math.min(estimatorListing.availableQuantityKg, 5000) : 2500}
        initialOrigin={estimatorListing?.district || 'Thanjavur'}
        initialCrop={estimatorListing?.crop || 'Paddy (Co-51)'}
        unitPricePerKg={estimatorListing?.minimumPricePerKg || 22}
      />
    </div>
  );
}
