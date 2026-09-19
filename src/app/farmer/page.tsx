'use client';

// Farmer & FPO Representative Portal — Sovereign Agritech Clearing Node
// Prepared by Cyber Shield | SIH 26033
// Layout updated to match Stitch Sovereign Agritech Design

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Sprout,
  Users,
  ShieldCheck,
  Scale,
  Lock,
  Phone,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  MapPin,
  ChevronRight,
  Sparkles,
  KeyRound,
  RotateCw,
  Eye,
  Check,
  PlusCircle,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function FarmerPortalPage() {
  const { state, proposeAllocation, createListing } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'overview' | 'bids' | 'orders' | 'fpo' | 'new_listing'>('overview');

  // Currently authenticated demo farmer with SSR fallback
  const farmer = state?.farmers.find((f) => f.id === 'fmr-1') || state?.farmers[0] || {
    id: 'fmr-1',
    fullName: 'Ramanathan Swaminathan',
    phone: '+91 94432 10982',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    taluka: 'Budalur',
    village: 'Kallaperambur',
    address: 'Cauvery Basin Farm Gate #49',
    landSizeAcres: 14.5,
    ownershipType: 'Owner' as const,
    primaryCrops: ['Paddy / Rice'],
    expectedYieldKg: 48000,
    bankAccountMasked: '•••• •••• 4410',
    ifscCode: 'SBIN0001429',
    bankName: 'State Bank of India',
    status: 'verified' as const,
    assignedOfficerId: 'off-1',
    assignedOfficerName: 'Dr. Rajesh Kumar',
    isActivated: true,
    documentProofs: [],
    fieldPhotos: [],
    createdAt: '2026-03-20',
  };
  const assignedOfficer = state?.officers.find((o) => o.officerId === farmer?.assignedOfficerId) || state?.officers[0] || {
    id: 'off-1',
    officerId: 'usr-officer-1',
    officerName: 'Dr. Rajesh Kumar',
    roleTitle: 'Village Agriculture Officer' as const,
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    taluka: 'Budalur',
    phone: '+91 94431 82910',
    email: 'rajesh.agri@tn.gov.in',
    officeAddress: 'Agri Extension Center, Budalur',
  };

  const myListings = state?.listings.filter((l) => l.sellerId === farmer?.id || l.sellerType === 'fpo') || [];
  const myBids = state?.bids.filter((b) => myListings.some((l) => l.id === b.listingId)) || [];
  const myOrders = state?.orders.filter((o) => o.sellerId === farmer?.id || o.sellerId === 'fpo-1') || [];
  const myEscrows = state?.escrows.filter((e) => myOrders.some((o) => o.id === e.orderId)) || [];
  const myGrievances = state?.grievances.filter((g) => g.complainantId === farmer?.id) || [];

  // FPO state
  const fpo = state?.fpos[0];
  const fpoContributions = state?.fpoContributions.filter((c) => c.fpoId === fpo?.id) || [];

  // Allocation Dialog State
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [allocatedKg, setAllocatedKg] = useState<number>(15000);
  const [allocationStatus, setAllocationStatus] = useState<string | null>(null);

  // Dynamic PIN State
  const [gatePin, setGatePin] = useState<string>('749 201');

  // New Listing Form State
  const [crop, setCrop] = useState('Paddy / Rice');
  const [variety, setVariety] = useState('Ponni (Raw)');
  const [totalQty, setTotalQty] = useState(25000);
  const [minPrice, setMinPrice] = useState(24.5);
  const [harvestDate, setHarvestDate] = useState('2026-09-25');
  const [listingSuccess, setListingSuccess] = useState<string | null>(null);

  // Per-buyer allocation input states
  const [itcAllocKg, setItcAllocKg] = useState<number>(15000);
  const [adaniAllocKg, setAdaniAllocKg] = useState<number>(10000);

  const handleAllocate = async (bidId: string, customKg?: number) => {
    const qty = customKg || allocatedKg;
    setAllocationStatus('Submitting proposed allocation to agricultural officer for phone verification...');
    const res = await proposeAllocation(bidId, qty);
    if (res.success) {
      setAllocationStatus(`Allocation of ${qty.toLocaleString()} kg confirmed! Your Agricultural Officer (${assignedOfficer.officerName}) will record telephonic confirmation with the buyer.`);
      setTimeout(() => {
        setSelectedBidId(null);
        setAllocationStatus(null);
      }, 4000);
    } else {
      setAllocationStatus(`Error: ${res.error}`);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setListingSuccess(null);
    const res = await createListing({
      sellerType: 'individual',
      sellerId: farmer?.id,
      sellerName: farmer?.fullName,
      crop,
      variety,
      productForm: 'Fresh Harvest Grade A',
      totalQuantityKg: totalQty,
      minimumPricePerKg: minPrice,
      expectedHarvestDate: harvestDate,
      state: farmer?.state || 'Tamil Nadu',
      district: farmer?.district || 'Thanjavur',
      approximatePickupArea: farmer?.address || 'Thiruvaiyaru Farm Gate',
      qualityTerms: 'Fair average quality, clean, inspected by Village Agricultural Officer.',
    });

    if (res.success) {
      setListingSuccess(`Lot published successfully! Code: ${res.data.listingCode}. Buyers across India can now submit bids in kg.`);
      setActiveTab('overview');
    }
  };

  const refreshPin = () => {
    const random1 = Math.floor(100 + Math.random() * 900);
    const random2 = Math.floor(100 + Math.random() * 900);
    setGatePin(`${random1} ${random2}`);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Sovereign Breadcrumb & Status Header Strip */}
      <div className="w-full bg-[#f2f3ff] px-4 py-2.5 rounded-xl border border-[#dae2fd] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#64748b]">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#005d42]">
            <span className="w-2 h-2 rounded-full bg-[#005d42] animate-pulse"></span>
            Node Active
          </span>
          <span>/</span>
          <span>Tamil Nadu Cauvery Basin Zone</span>
          <span>/</span>
          <span className="text-[#131b2e] font-semibold font-mono">FPO Group: Cauvery Delta FPO</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
          <span className="px-2 py-0.5 rounded bg-[#97f5cc] text-[#002115] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#005d42]" /> VERIFIED FARMER
          </span>
          <span className="px-2 py-0.5 rounded bg-[#e3dfff] text-[#100069] flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#4e45d5]" /> SECURE SELLING
          </span>
          <span className="text-[#64748b] hidden sm:inline font-sans font-normal">Last Audit: 12m ago</span>
        </div>
      </div>

      {allocationStatus && (
        <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 bg-[#97f5cc]/50 text-[#002115] border border-[#005d42]/30 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#005d42] shrink-0" />
          <span>{allocationStatus}</span>
        </div>
      )}

      {/* Navigation Switch Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dae2fd] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          FPO Overview & Harvest Telemetry
        </button>

        <button
          onClick={() => setActiveTab('bids')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'bids'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <span>Incoming Buyer Bids ({myBids.length > 0 ? myBids.length : 3})</span>
          <span className="w-2 h-2 rounded-full bg-[#005d42] animate-ping"></span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'orders'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          Orders & Escrow Release ({myOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('fpo')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'fpo'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#4e45d5]" />
          <span>FPO Collective Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('new_listing')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'new_listing'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#005d42]" />
          <span>Publish Harvest Lot</span>
        </button>
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Section 1: Farmer Identity, Field Verification & Visual Land Context */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Identity & Field Officer Card */}
            <div className="lg:col-span-8 bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 flex flex-col justify-between gap-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#f2f3ff] border border-[#dae2fd] overflow-hidden shrink-0 shadow-inner flex items-center justify-center text-3xl">
                    🌾
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold font-display text-[#131b2e]">
                        {farmer.fullName || 'Ramanathan Swaminathan'}
                      </h1>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#f2f3ff] text-[#64748b] font-bold">
                        UID: XXXX-XXXX-4819
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#005d42] font-semibold text-xs">
                      <Users className="w-3.5 h-3.5" />
                      <span>Cauvery Delta Agro Farmers Producer Organization (FPO)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#64748b] text-xs">
                      <Scale className="w-3.5 h-3.5 text-[#005d42]" />
                      <span>Title Inspected: <b>Patta #4912/2019-B</b> | Thanjavur Revenue Division</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <span className="px-2.5 py-1 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 self-start sm:self-auto shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#005d42]" /> OFFICER VERIFIED
                  </span>
                  <span className="text-xs text-[#64748b]">Status: Land Title Inspected</span>
                </div>
              </div>

              {/* Metric Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex flex-col">
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">DECLARED LAND</span>
                  <span className="text-lg font-bold text-[#131b2e] mt-0.5 tabular-nums">
                    {farmer.landSizeAcres || 14.5} Acres
                  </span>
                  <span className="text-xs text-[#64748b]">Delta Wet Zone</span>
                </div>

                <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex flex-col">
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">EST. HARVEST</span>
                  <span className="text-lg font-bold text-[#005d42] mt-0.5 tabular-nums">48,000 kg</span>
                  <span className="text-xs text-[#64748b]">Paddy Co-51</span>
                </div>

                <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex flex-col">
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">MOISTURE TIER</span>
                  <span className="text-lg font-bold text-[#131b2e] mt-0.5 tabular-nums">13.2 %</span>
                  <span className="text-xs text-[#005d42] font-semibold">Govt Spec &lt; 14%</span>
                </div>

                <div className="p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex flex-col">
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">GOVT MSP ANCHOR</span>
                  <span className="text-lg font-bold text-[#131b2e] mt-0.5 tabular-nums">₹22.03/kg</span>
                  <span className="text-xs text-[#005d42] font-semibold">+14.4% Market Premium</span>
                </div>
              </div>

              {/* Verification Banner from Agricultural Officer */}
              <div className="p-3.5 bg-[#eaedff] rounded-xl border border-[#c3c0ff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#005d42] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#131b2e] block">
                      Inspected by {assignedOfficer.officerName}, {assignedOfficer.roleTitle}
                    </span>
                    <span className="text-[#64748b] font-mono text-[11px]">
                      Geo-tag: Lat 10.7870° N, Long 79.1378° E | Drone Bio-mass Audited
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${assignedOfficer.phone}`}
                    className="px-3 py-1 rounded-lg bg-[#ffffff] text-[#005d42] font-bold text-xs shadow-sm hover:bg-[#f2f3ff] transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Officer</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Live Geo Map & Satellite Yield Tile */}
            <div className="lg:col-span-4 bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-5 flex flex-col justify-between gap-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#64748b] uppercase flex items-center gap-1.5 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005d42]"></span>
                  Farm Map View
                </span>
                <span className="text-[11px] font-bold text-[#005d42] font-mono">
                  HEALTHY CROP
                </span>
              </div>

              <div className="w-full h-44 rounded-xl overflow-hidden relative shadow-inner bg-[#f2f3ff]">
                <img
                  className="w-full h-full object-cover"
                  alt="Satellite crop field view"
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#131b2e]/90 text-white rounded-lg text-[10px] font-mono flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#97f5cc]" />
                  <span>Sentinel-2 L2A Stream</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#64748b] pt-1">
                <span>Soil Nitrogen: <strong className="text-[#131b2e]">Optimal (312 kg/ha)</strong></span>
                <span className="text-[#005d42] font-semibold">100% Traceable</span>
              </div>
            </div>
          </div>

          {/* Section 2: FPO Collective Lot Pooling & Anti-Double-Selling Monitor */}
          <div className="w-full bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#f2f3ff] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#131b2e] text-[10px] font-mono font-bold">
                    LOT #TN-THJ-9821
                  </span>
                  <h2 className="text-base font-bold font-display text-[#131b2e]">
                    Group Selling Monitor
                  </h2>
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Combine your crops with other farmers to sell in bulk to large buyers.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#97f5cc]/50 text-[#002115] text-xs font-bold border border-[#005d42]/30">
                  <Lock className="w-3.5 h-3.5 text-[#005d42]" />
                  <span>Double-Selling Lock: <strong className="text-[#005d42]">ENGAGED</strong></span>
                </div>
              </div>
            </div>

            {/* Multi-Part Progress Bar */}
            <div className="space-y-2 bg-[#f2f3ff] p-4 rounded-xl border border-[#dae2fd]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-semibold text-[#131b2e]">
                    <span className="w-3 h-3 rounded-sm bg-[#005d42]"></span>
                    Ramanathan: 12,500 kg
                  </span>
                  <span className="flex items-center gap-1.5 text-[#64748b]">
                    <span className="w-3 h-3 rounded-sm bg-[#c3c0ff]"></span>
                    Other 8 FPO Members: 32,500 kg
                  </span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-[#4e45d5]">Committed in Bids: 28,000 kg (62.2%)</span>
                  <span className="text-[#64748b]">|</span>
                  <span className="text-[#005d42]">Unreserved: 17,000 kg (37.8%)</span>
                </div>
              </div>

              <div className="w-full h-5 bg-[#dae2fd] rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#6860ef] to-[#4e45d5] flex items-center justify-center text-white text-[10px] font-bold px-2"
                  style={{ width: '62.2%' }}
                >
                  28,000 kg LOCKED IN ESCROW
                </div>
                <div
                  className="h-full bg-[#005d42] flex items-center justify-center text-white text-[10px] font-bold px-2"
                  style={{ width: '37.8%' }}
                >
                  17,000 kg AVAILABLE
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748b] pt-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-[#005d42]" />
                  <span>Verified by Agricultural Officer</span>
                </div>
                <span className="text-[#131b2e] font-medium">Total Collective Lot: 45,000 kg (Grade-A Paddy Co-51)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Farm-Gate Dispatch & Scale Weighment Verification */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Scheduled Vehicle Dispatch Card */}
            <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 flex flex-col justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f2f3ff] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#005d42] animate-ping"></span>
                    IN-TRANSIT TO FARM-GATE
                  </span>
                  <h3 className="text-base font-bold font-display text-[#131b2e] mt-0.5">
                    Live Scheduled Vehicle Dispatch
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#e2e7ff] text-[#131b2e] text-[10px] font-mono font-bold">
                  TRANSIT ID #LOG-TN-4091
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#005d42]" />
                    <div>
                      <span className="text-[10px] font-bold text-[#64748b] uppercase block">Carrier Assigned</span>
                      <span className="text-base font-bold text-[#131b2e] font-mono">TN-49-AB-2041</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#64748b] block">10-Wheeler Taurus | Capacity 28 MT</span>
                  <div className="pt-1 flex items-center gap-1 text-xs text-[#005d42] font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>FastTag Mandi Toll cleared at 03:15 PM</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#dae2fd] md:pl-4 pt-2 md:pt-0">
                  <div>
                    <span className="text-[10px] font-bold text-[#64748b] uppercase block">Driver Identity</span>
                    <span className="text-sm font-bold text-[#131b2e]">M. Murugan</span>
                    <span className="text-xs text-[#64748b] block font-mono">+91 98421-XXXXX (Aadhaar Verified)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#ffffff] flex items-center justify-between border border-[#dae2fd]">
                    <span className="text-[10px] font-bold text-[#64748b] uppercase">Estimated Arrival</span>
                    <span className="text-xs text-[#005d42] font-bold">Today, 04:30 PM (22 mins)</span>
                  </div>
                </div>
              </div>

              {/* Scale Tare Status Indicator */}
              <div className="p-3 bg-[#eaedff] rounded-xl border border-[#c3c0ff] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-5 h-5 text-[#4e45d5] shrink-0" />
                  <div>
                    <span className="font-bold text-[#131b2e]">Farm-Gate Digital Scale Challenge</span>
                    <span className="text-[#64748b] block text-[11px]">
                      Digital Bluetooth Scale (Essae DS-215) Connected via Cyber Shield Mobile Bridge
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold self-start sm:self-auto">
                  CALIBRATED & READY
                </span>
              </div>
            </div>

            {/* One-Time Secure Handover PIN Challenge Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#ffffff] to-[#f2f3ff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#005d42]" />
                  <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                    Secure Gate Release
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#64748b] text-[10px] font-mono font-bold">
                  SINGLE-USE AUTH
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center py-2 space-y-3">
                <p className="text-xs text-[#64748b] max-w-xs leading-relaxed">
                  Display this 6-Digit Secure PIN to Driver M. Murugan only after the Agricultural Officer completes Tare Weighment.
                </p>

                <div className="my-2 px-8 py-3 bg-[#131b2e] rounded-2xl shadow-md flex items-center justify-center gap-2">
                  <span className="text-3xl font-mono tracking-widest text-[#ffffff] font-bold">
                    {gatePin}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#005d42] font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bound to Escrow Release #ESC-9821-ITC</span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <button
                  type="button"
                  onClick={refreshPin}
                  className="w-full py-2.5 rounded-xl bg-[#4e45d5] hover:bg-[#6860ef] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Regenerate Gate PIN</span>
                </button>
                <span className="text-center font-body-sm text-[11px] text-[#64748b] block">
                  PIN expires in 38 minutes or upon truck scale tare confirmation
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: FPO Co-Members Transparency Manifest */}
          <div className="w-full bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
              <div>
                <h4 className="text-sm font-bold font-display text-[#131b2e]">
                  Other Farmers in your Group (Lot #TN-THJ-9821)
                </h4>
                <span className="text-xs text-[#64748b]">
                  Verified by Agricultural Officer
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider">
                ALL 9 FARMERS KYC VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#131b2e] block">K. Subramanian</span>
                  <span className="text-[11px] text-[#64748b]">Kallaperambur, 4.2 Ac</span>
                </div>
                <span className="text-xs font-bold text-[#005d42] tabular-nums">6,200 kg</span>
              </div>

              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#131b2e] block">M. Ranganathan</span>
                  <span className="text-[11px] text-[#64748b]">Thiruvaiyaru, 3.8 Ac</span>
                </div>
                <span className="text-xs font-bold text-[#005d42] tabular-nums">5,800 kg</span>
              </div>

              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#131b2e] block">P. Arumugam</span>
                  <span className="text-[11px] text-[#64748b]">Budalur, 5.0 Ac</span>
                </div>
                <span className="text-xs font-bold text-[#005d42] tabular-nums">7,500 kg</span>
              </div>

              <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#131b2e] block">S. Marimuthu</span>
                  <span className="text-[11px] text-[#64748b]">Papanasam, 4.5 Ac</span>
                </div>
                <span className="text-xs font-bold text-[#005d42] tabular-nums">6,500 kg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: INCOMING BUYER BIDS */}
      {activeTab === 'bids' && (
        <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#f2f3ff] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display text-[#131b2e]">
                  Institutional B2B Bids & Lot Allocator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#e3dfff] text-[#100069] text-[10px] font-bold">
                  3 ACTIVE OFFERS
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                Divide and accept quantities among verified corporate institutional buyers. Escrow balances verified in real-time.
              </p>
            </div>

            <div className="px-4 py-2 bg-[#eaedff] rounded-xl border border-[#c3c0ff] flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-[#4e45d5]" />
              <div>
                <span className="text-[10px] font-bold text-[#131b2e] uppercase block">Official Audio Record Log</span>
                <span className="text-[#64748b]">Conf #AO-THJ-882: AO Verified Ramanathan lot allocation parameters</span>
              </div>
            </div>
          </div>

          {/* Bids Manifest Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f2f3ff] text-[#64748b] text-[11px] font-bold tracking-wider uppercase border-b border-[#dae2fd]">
                  <th className="py-3 px-4">Institutional Buyer</th>
                  <th className="py-3 px-3">Bid Rate</th>
                  <th className="py-3 px-3">Requested</th>
                  <th className="py-3 px-3">Total Valuation</th>
                  <th className="py-3 px-3">Pickup Date</th>
                  <th className="py-3 px-3">Escrow Status</th>
                  <th className="py-3 px-4 text-right">Allocation & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f3ff] text-[#131b2e]">
                {/* Row 1: ITC Agri Business */}
                <tr className="hover:bg-[#f2f3ff]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#97f5cc] text-[#005d42] flex items-center justify-center font-bold text-xs">
                        ITC
                      </div>
                      <div>
                        <span className="font-bold text-[#131b2e] block">ITC Agri Business Ltd</span>
                        <span className="text-[11px] text-[#64748b]">GST: 33AAACI1681G1ZM | Corporate Buyer</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-sm font-bold text-[#005d42] tabular-nums block">₹25.20/kg</span>
                    <span className="text-[10px] text-[#005d42] font-semibold">+₹3.17 above MSP</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold tabular-nums">15,000 kg</td>
                  <td className="py-3.5 px-3 font-bold tabular-nums">₹3,78,000</td>
                  <td className="py-3.5 px-3 text-[#64748b]">18 Oct 2026</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e3dfff] text-[#100069] text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-[#4e45d5]" /> 100% IN ESCROW
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="inline-flex items-center bg-[#f2f3ff] rounded-lg px-2 py-1 border border-[#dae2fd]">
                        <span className="text-[10px] font-bold text-[#64748b] mr-1">KG</span>
                        <input
                          type="number"
                          value={itcAllocKg}
                          onChange={(e) => setItcAllocKg(Number(e.target.value))}
                          className="w-16 bg-transparent text-right font-bold text-[#131b2e] outline-none text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleAllocate('bid-itc-1', itcAllocKg)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Release</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 2: Adani Wilmar Sourcing */}
                <tr className="hover:bg-[#f2f3ff]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#e3dfff] text-[#4e45d5] flex items-center justify-center font-bold text-xs">
                        AW
                      </div>
                      <div>
                        <span className="font-bold text-[#131b2e] block">Adani Wilmar Sourcing</span>
                        <span className="text-[11px] text-[#64748b]">GST: 24AAACA1282D1Z0 | Institutional Aggregator</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-sm font-bold text-[#005d42] tabular-nums block">₹24.80/kg</span>
                    <span className="text-[10px] text-[#005d42] font-semibold">+₹2.77 above MSP</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold tabular-nums">10,000 kg</td>
                  <td className="py-3.5 px-3 font-bold tabular-nums">₹2,48,000</td>
                  <td className="py-3.5 px-3 text-[#64748b]">19 Oct 2026</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e3dfff] text-[#100069] text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-[#4e45d5]" /> 100% IN ESCROW
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="inline-flex items-center bg-[#f2f3ff] rounded-lg px-2 py-1 border border-[#dae2fd]">
                        <span className="text-[10px] font-bold text-[#64748b] mr-1">KG</span>
                        <input
                          type="number"
                          value={adaniAllocKg}
                          onChange={(e) => setAdaniAllocKg(Number(e.target.value))}
                          className="w-16 bg-transparent text-right font-bold text-[#131b2e] outline-none text-xs"
                        />
                      </div>
                      <button
                        onClick={() => handleAllocate('bid-adani-1', adaniAllocKg)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Release</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 3: BigBasket Wholesale */}
                <tr className="hover:bg-[#f2f3ff]/60 transition-colors opacity-85">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#f2f3ff] text-[#64748b] flex items-center justify-center font-bold text-xs border border-[#dae2fd]">
                        BB
                      </div>
                      <div>
                        <span className="font-bold text-[#131b2e] block">BigBasket Wholesale</span>
                        <span className="text-[11px] text-[#64748b]">GST: 29AABCS8841F1ZS | Retail Chain</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-sm font-bold text-[#131b2e] tabular-nums block">₹24.60/kg</span>
                    <span className="text-[10px] text-[#64748b]">+₹2.57 above MSP</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold tabular-nums">8,000 kg</td>
                  <td className="py-3.5 px-3 font-bold tabular-nums">₹1,96,800</td>
                  <td className="py-3.5 px-3 text-[#64748b]">21 Oct 2026</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f2f3ff] text-[#64748b] text-[10px] font-bold border border-[#dae2fd]">
                      <Clock className="w-3 h-3 text-amber-500" /> PENDING ESCROW
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-xs text-[#64748b] italic">Awaiting RTGS Clearance</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ORDERS & ESCROW */}
      {activeTab === 'orders' && (
        <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-4">
          <div className="border-b border-[#f2f3ff] pb-3">
            <h3 className="text-base font-bold font-display text-[#131b2e]">Your Confirmed Orders & Escrows</h3>
            <p className="text-xs text-[#64748b]">
              Track carrier dispatch, farm-gate weighbridge confirmation, and automated RTGS payout.
            </p>
          </div>

          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748b] bg-[#f2f3ff] rounded-xl">
                No active orders yet. Orders are generated after buyers accept your lot allocations.
              </div>
            ) : (
              myOrders.map((ord) => {
                const escrow = myEscrows.find((e) => e.orderId === ord.id);
                const transport = state?.transports.find((t) => t.orderId === ord.id);
                const pickup = state?.pickups.find((p) => p.orderId === ord.id);

                return (
                  <div key={ord.id} className="p-5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dae2fd]/60 pb-3">
                      <div>
                        <span className="font-mono font-bold text-[#131b2e] bg-white px-2 py-0.5 rounded border border-[#dae2fd]">
                          {ord.orderNumber}
                        </span>
                        <span className="font-bold text-[#131b2e] ml-2">
                          {ord.confirmedQuantityKg.toLocaleString()} kg of {ord.crop}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#005d42] tabular-nums text-sm">
                          ₹{ord.totalOrderAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold uppercase">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-[#e2e7ff]">
                        <span className="text-[#64748b] block text-[10px] font-bold uppercase">Buyer</span>
                        <span className="font-bold text-[#131b2e] mt-0.5 block">{ord.buyerOrgName}</span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-[#e2e7ff]">
                        <span className="text-[#64748b] block text-[10px] font-bold uppercase">Banking Escrow</span>
                        <span className="font-bold text-[#005d42] mt-0.5 block">
                          {escrow?.status === 'held' ? '₹' + escrow.heldAmount.toLocaleString('en-IN') + ' Locked' : 'Pending'}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-[#e2e7ff]">
                        <span className="text-[#64748b] block text-[10px] font-bold uppercase">Transport</span>
                        <span className="font-bold text-[#131b2e] mt-0.5 block font-mono">
                          {transport?.vehicleNumber || 'Assigned soon'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB: FPO HUB */}
      {activeTab === 'fpo' && (
        <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
            <div>
              <h3 className="text-base font-bold font-display text-[#131b2e]">
                {fpo?.name || 'Cauvery Delta Agro Farmers Producer Organization'}
              </h3>
              <p className="text-xs text-[#64748b]">
                Registration: {fpo?.registrationNumber || 'TN-FPO-2021-9941'} • {fpo?.memberCount || 420} Registered Smallholder Farmers
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold">
              COLLECTIVE ESCROW HUB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
              <span className="text-[10px] font-bold text-[#64748b] uppercase">Total Acreage Pooled</span>
              <div className="text-xl font-bold text-[#131b2e] mt-1">1,450 Acres</div>
              <span className="text-xs text-[#64748b]">Cauvery Delta Wet Basin</span>
            </div>

            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
              <span className="text-[10px] font-bold text-[#64748b] uppercase">Season Volume Traded</span>
              <div className="text-xl font-bold text-[#005d42] mt-1 tabular-nums">4,85,000 kg</div>
              <span className="text-xs text-[#005d42] font-semibold">100% Escrow Settled</span>
            </div>

            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
              <span className="text-[10px] font-bold text-[#64748b] uppercase">Average Price Realized</span>
              <div className="text-xl font-bold text-[#4e45d5] mt-1 tabular-nums">₹25.10 / kg</div>
              <span className="text-xs text-[#64748b]">+13.9% vs Local Mandi Spot</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: NEW LISTING FORM */}
      {activeTab === 'new_listing' && (
        <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-[#f2f3ff] pb-3">
            <h3 className="text-lg font-bold font-display text-[#131b2e]">
              Publish New Crop Harvest Lot
            </h3>
            <p className="text-xs text-[#64748b]">
              List your harvested volume in metric kilograms. Verified institutional buyers across India can bid with escrow protection.
            </p>
          </div>

          {listingSuccess && (
            <div className="p-4 rounded-xl bg-[#97f5cc]/50 text-[#002115] border border-[#005d42]/30 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#005d42]" />
              <span>{listingSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#64748b] uppercase">COMMODITY CROP</label>
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-semibold text-[#131b2e]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#64748b] uppercase">VARIETY / GRADE</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-semibold text-[#131b2e]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#64748b] uppercase">TOTAL HARVEST (KG)</label>
                <input
                  type="number"
                  value={totalQty}
                  onChange={(e) => setTotalQty(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-mono font-bold text-[#131b2e]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#64748b] uppercase">MIN FLOOR PRICE (₹/KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-mono font-bold text-[#131b2e]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#64748b] uppercase">EXPECTED HARVEST DATE</label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs text-[#131b2e]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Harvest Lot to National Marketplace</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
