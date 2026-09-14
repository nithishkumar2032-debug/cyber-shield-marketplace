'use client';

// Farmer & FPO Representative Portal
// Prepared by Cyber Shield | SIH 26033

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
} from 'lucide-react';

export default function FarmerPortalPage() {
  const { state, proposeAllocation, createListing } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'overview' | 'bids' | 'orders' | 'fpo' | 'new_listing'>('overview');

  // Currently authenticated demo farmer
  const farmer = state?.farmers.find((f) => f.id === 'fmr-1') || state?.farmers[0];
  const assignedOfficer = state?.officers.find((o) => o.officerId === farmer?.assignedOfficerId) || state?.officers[0] || {
    id: 'off-1',
    officerId: 'usr-officer-1',
    officerName: 'Dr. Anbarasan V.',
    roleTitle: 'Village Agriculture Officer' as const,
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    taluka: 'Budalur',
    phone: '+91 94431 82910',
    email: 'anbarasan.agri@tn.gov.in',
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
  const [allocatedKg, setAllocatedKg] = useState<number>(10);
  const [allocationStatus, setAllocationStatus] = useState<string | null>(null);

  // New Listing Form State
  const [crop, setCrop] = useState('Paddy / Rice');
  const [variety, setVariety] = useState('Ponni (Raw)');
  const [totalQty, setTotalQty] = useState(1500);
  const [minPrice, setMinPrice] = useState(25.0);
  const [harvestDate, setHarvestDate] = useState('2026-09-25');
  const [listingSuccess, setListingSuccess] = useState<string | null>(null);

  const handleAllocate = async (bidId: string) => {
    setAllocationStatus('Submitting proposed allocation to agricultural officer for phone verification...');
    const res = await proposeAllocation(bidId, allocatedKg);
    if (res.success) {
      setAllocationStatus(`Allocation of ${allocatedKg} kg submitted! Your Agricultural Officer will now record a phone confirmation with the buyer.`);
      setTimeout(() => {
        setSelectedBidId(null);
        setAllocationStatus(null);
      }, 3500);
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

  if (!farmer) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {farmer.fullName}
              </h1>
              <span className="badge-verified text-[11px]">
                OFFICER VERIFIED
              </span>
            </div>
            <div className="text-xs text-emerald-200/90 mt-1 flex flex-wrap items-center gap-3">
              <span>{farmer.village}, {farmer.taluka}, {farmer.district}</span>
              <span>•</span>
              <span>Land: <b>{farmer.landSizeAcres} acres</b> ({farmer.ownershipType})</span>
              <span>•</span>
              <span>Bank: <b>{farmer.bankAccountMasked}</b> ({farmer.ifscCode})</span>
            </div>
          </div>
        </div>

        {/* Assigned Officer Contact Card */}
        <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-700/50 text-xs text-emerald-100 flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 rounded-xl bg-emerald-800 text-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
              Assigned Agriculture Officer
            </div>
            <div className="font-bold text-white text-sm">{assignedOfficer.officerName}</div>
            <a
              href={`tel:${assignedOfficer.phone}`}
              className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1 mt-0.5"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{assignedOfficer.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Dashboard & Listings ({myListings.length})
        </button>
        <button
          onClick={() => setActiveTab('bids')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'bids'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Incoming Bids ({myBids.length})</span>
          {myBids.some((b) => b.status === 'submitted') && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'orders'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Orders, Escrow & OTP ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('fpo')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'fpo'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-600" />
          <span>FPO Collective Hub</span>
        </button>
        <button
          onClick={() => setActiveTab('new_listing')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors text-emerald-700 hover:text-emerald-900 ${
            activeTab === 'new_listing' ? 'border-emerald-700 font-extrabold' : 'border-transparent'
          }`}
        >
          + Create New Crop Lot
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-medium">Active Crop Lots</span>
              <div className="text-2xl font-extrabold text-slate-900">{myListings.length}</div>
              <span className="text-[11px] text-emerald-700">Listed across India</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-medium">Bids Awaiting Farmer Choice</span>
              <div className="text-2xl font-extrabold text-amber-700">
                {myBids.filter((b) => b.status === 'submitted').length}
              </div>
              <span className="text-[11px] text-slate-500">You choose preferred buyers & kg</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-medium">Secured In Escrow</span>
              <div className="text-2xl font-extrabold text-emerald-700">
                ₹{myEscrows.reduce((acc, e) => acc + (e.heldAmount || 0), 0).toLocaleString()}
              </div>
              <span className="badge-demo text-[9px] py-0 px-1">HELD BY BANK PARTNER</span>
            </div>
          </div>

          {/* Active Listings Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Crop Lots</h3>
                <p className="text-xs text-slate-500">Supply listings verified by your Agricultural Officer.</p>
              </div>
              <button
                onClick={() => setActiveTab('new_listing')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
              >
                + Add Lot
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="py-2.5 px-3">Lot Code</th>
                    <th className="py-2.5 px-3">Crop & Variety</th>
                    <th className="py-2.5 px-3">Total Volume</th>
                    <th className="py-2.5 px-3">Available Balance</th>
                    <th className="py-2.5 px-3">Floor Price</th>
                    <th className="py-2.5 px-3">Expected Harvest</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myListings.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-800">{l.listingCode}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{l.crop} ({l.variety})</td>
                      <td className="py-3 px-3">{l.totalQuantityKg.toLocaleString()} kg</td>
                      <td className="py-3 px-3 font-extrabold text-emerald-700">{l.availableQuantityKg.toLocaleString()} kg</td>
                      <td className="py-3 px-3 font-bold">₹{l.minimumPricePerKg.toFixed(2)}/kg</td>
                      <td className="py-3 px-3 text-slate-600">{l.expectedHarvestDate}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {l.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Incoming Bids & Farmer Choice */}
      {activeTab === 'bids' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Buyer Offers on Your Crops (Partial Procurement)
              </h3>
              <p className="text-xs text-slate-500">
                You retain complete freedom to choose preferred buyers and specify how many kg to allocate.
              </p>
            </div>
            <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl font-medium">
              No automatic winner: Farmer picks, officer confirms by phone.
            </div>
          </div>

          {allocationStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
              {allocationStatus}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-2.5 px-3">Buyer Organization</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Requested (kg)</th>
                  <th className="py-2.5 px-3">Offered Rate</th>
                  <th className="py-2.5 px-3">Total Value</th>
                  <th className="py-2.5 px-3">Proposed Pickup</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myBids.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No bids currently placed on your active lots.
                    </td>
                  </tr>
                ) : (
                  myBids.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{b.buyerOrgName}</td>
                      <td className="py-3 px-3 text-slate-600">{b.buyerCategory}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{b.requestedQuantityKg} kg</td>
                      <td className="py-3 px-3 font-extrabold text-emerald-700">₹{b.offeredPricePerKg.toFixed(2)}/kg</td>
                      <td className="py-3 px-3 font-bold text-slate-900">₹{b.totalBidAmount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-slate-600">{b.proposedPickupDate}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            b.status === 'selected_by_farmer'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : b.status === 'officer_confirmed' || b.status === 'accepted_by_buyer'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {b.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {b.status === 'submitted' ? (
                          <button
                            onClick={() => {
                              setSelectedBidId(b.id);
                              setAllocatedKg(b.requestedQuantityKg);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors"
                          >
                            Choose & Allocate
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Allocated</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Dialog Modal for Proposing Allocation */}
          {selectedBidId && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-base">Allocate Quantity to Buyer</h4>
                  <button
                    onClick={() => setSelectedBidId(null)}
                    className="text-slate-400 hover:text-slate-600 text-lg"
                  >
                    ×
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  You can accept the full requested amount or propose a partial quantity in kg. The Agricultural Officer will phone the buyer to verify these exact terms before an order is committed.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Allocated Quantity (kg):
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={allocatedKg}
                    onChange={(e) => setAllocatedKg(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedBidId(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAllocate(selectedBidId)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    Confirm Choice & Notify Officer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Orders, Escrow & OTP */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Confirmed Orders & Handover Status
              </h3>
              <p className="text-xs text-slate-500">
                Track prepaid escrow balances, driver details, and handover OTP.
              </p>
            </div>
            <span className="badge-demo text-[10px] py-0 px-2">PROTECTED SETTLEMENT</span>
          </div>

          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No orders confirmed yet. Orders are generated once the officer and buyer verify accepted bids.
              </div>
            ) : (
              myOrders.map((ord) => {
                const escrow = myEscrows.find((e) => e.orderId === ord.id);
                const pickup = state?.pickups.find((p) => p.orderId === ord.id);
                const transport = state?.transports.find((t) => t.orderId === ord.id);

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 ml-2">
                          {ord.confirmedQuantityKg} kg of {ord.crop} ({ord.variety})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          Total: ₹{ord.totalOrderAmount.toLocaleString()}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : ord.status === 'secured' || ord.status === 'vehicle_assigned'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      {/* Buyer Details */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[11px]">Buyer</span>
                        <span className="font-bold text-slate-800">{ord.buyerOrgName}</span>
                        <span className="text-emerald-700 block font-semibold mt-1">
                          Phone: {ord.buyerPhone || 'Available after escrow lock'}
                        </span>
                      </div>

                      {/* Escrow Status */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[11px]">Banking Partner Escrow</span>
                        <span className="font-bold text-emerald-700 block">
                          {escrow ? `₹${escrow.heldAmount.toLocaleString()} Held` : 'Awaiting Prepayment'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Ref: {escrow?.paymentReference || 'Pending'}
                        </span>
                      </div>

                      {/* Pickup Handover OTP */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[11px]">Pickup Handover OTP</span>
                        {pickup ? (
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-lg font-mono font-extrabold text-emerald-800 tracking-wider">
                              {pickup.pickupOtp}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                              Present at scale
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Generated when transport is assigned</span>
                        )}
                      </div>
                    </div>

                    {/* Transport Details if assigned */}
                    {transport && (
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-900">
                          <Truck className="w-4 h-4 text-emerald-700" />
                          <span>
                            Arriving Vehicle: <b>{transport.vehicleNumber}</b> (Capacity: {transport.vehicleCapacityKg} kg) • Driver: <b>{transport.driverName}</b> ({transport.driverPhone})
                          </span>
                        </div>
                        <span className="text-emerald-800 font-semibold text-[11px]">
                          ETA: {new Date(transport.estimatedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab: FPO Collective Supply Hub */}
      {activeTab === 'fpo' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Small Farmers Collective (Aavin Model)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {fpo?.name} ({fpo?.registrationNumber})
              </h3>
              <p className="text-xs text-slate-500">
                Representative: {fpo?.representativeName} • {fpo?.memberCount} small farmer members
              </p>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-sm">
              <b>Double-Selling Safeguard:</b> Once a member&apos;s kg contribution is committed to an FPO group lot, the portal locks that quantity from being offered individually.
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800">
              Verified Member Contributions in Current Collective Lot
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3">Farmer Name</th>
                    <th className="py-2.5 px-3">Crop & Variety</th>
                    <th className="py-2.5 px-3">Pledged Volume (kg)</th>
                    <th className="py-2.5 px-3">Harvest Window</th>
                    <th className="py-2.5 px-3">Allocated in Bids</th>
                    <th className="py-2.5 px-3">Remaining Balance</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fpoContributions.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-800">{c.farmerName}</td>
                      <td className="py-3 px-3">{c.crop} ({c.variety})</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{c.expectedKg} kg</td>
                      <td className="py-3 px-3 text-slate-600">{c.harvestWindow}</td>
                      <td className="py-3 px-3 text-emerald-700 font-semibold">{c.allocatedKg} kg</td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">{c.remainingKg} kg</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: New Listing Form */}
      {activeTab === 'new_listing' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Create a New Verified Crop Lot</h3>
            <p className="text-xs text-slate-500">
              Enter expected or available quantity in kg and reserve price in INR/kg.
            </p>
          </div>

          {listingSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{listingSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Name:</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Paddy / Rice">Paddy / Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Banana (Sold by Kg Weight)">Banana (Sold by Kg Weight)</option>
                  <option value="Coconut (Sold by Kg Weight)">Coconut (Sold by Kg Weight)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Variety / Product Form:</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Quantity (kg):</label>
                <input
                  type="number"
                  min={1}
                  value={totalQty}
                  onChange={(e) => setTotalQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum Floor Price (INR / kg):</label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expected Harvest Date:</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs sm:text-sm hover:bg-emerald-800 transition-colors shadow-md"
            >
              Publish Verified Listing
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
