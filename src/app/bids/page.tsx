'use client';

// Transparent Bidding Windows & Submission
// Prepared by Cyber Shield | SIH 26033

import React, { useState } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Clock,
  Scale,
  ShieldCheck,
  Building2,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function BidsPage() {
  const { state, submitBid, role } = useMarketplace();
  const listings = state?.listings || [];
  const bids = state?.bids || [];
  const buyers = state?.buyers || [];

  const [selectedListingId, setSelectedListingId] = useState<string>(
    listings[0]?.id || 'lst-canonical-50kg'
  );

  // New Bid Form State
  const [buyerId, setBuyerId] = useState<string>(buyers[0]?.id || 'byr-1');
  const [requestedKg, setRequestedKg] = useState<number>(10);
  const [offeredPrice, setOfferedPrice] = useState<number>(21.0);
  const [proposedPickupDate, setProposedPickupDate] = useState<string>('2026-09-16');
  const [validityHours, setValidityHours] = useState<number>(24);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentListing = listings.find((l) => l.id === selectedListingId) || listings[0];
  const lotBids = bids.filter((b) => b.listingId === currentListing?.id);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const res = await submitBid({
      listingId: currentListing.id,
      buyerId,
      requestedQuantityKg: requestedKg,
      offeredPricePerKg: offeredPrice,
      proposedPickupDate,
      validityHours,
    });

    setSubmitting(false);
    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `Bid of ${requestedKg} kg @ ₹${offeredPrice}/kg submitted successfully!`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'Failed to submit bid.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Short Bidding Windows • Quantity-Specific Offers</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Transparent Bidding Windows
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Registered buyers submit bids for the quantity they need in kg. All eligible participants see comparable rates, volumes, and timestamps. Sensitive contact and banking information is masked.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-slate-200 space-y-2 max-w-sm">
          <div className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SIH Partial Procurement Principle</span>
          </div>
          <p className="text-[11px] text-slate-300">
            A buyer can bid for 10 kg of a 50 kg lot. The farmer chooses preferred bids and allocates kg without exceeding the available balance. No automated winner.
          </p>
        </div>
      </div>

      {/* Lot Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {listings.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              setSelectedListingId(l.id);
              setStatusMessage(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              selectedListingId === l.id
                ? 'bg-emerald-800 text-white border-emerald-700 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <span>{l.crop} ({l.variety})</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/20 text-white">
              {l.availableQuantityKg} kg avail
            </span>
          </button>
        ))}
      </div>

      {currentListing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Lot Details & Bids Table */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lot Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {currentListing.listingCode}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {currentListing.crop} — {currentListing.variety}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Bidding Closes</span>
                  <span className="text-sm font-bold text-amber-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(currentListing.biddingDeadline).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Total Lot</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    {currentListing.totalQuantityKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-emerald-700 block text-[11px]">Available Balance</span>
                  <span className="font-extrabold text-emerald-900 text-base">
                    {currentListing.availableQuantityKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Farmer Floor Price</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    ₹{currentListing.minimumPricePerKg.toFixed(2)} / kg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Seller</span>
                  <span className="font-bold text-slate-800 text-xs truncate block">
                    {currentListing.sellerName}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-800">Quality Spec: </span>
                {currentListing.qualityTerms}
              </div>
            </div>

            {/* Bids Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Active Bids ({lotBids.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent comparison of prices, requested quantities, and totals.
                  </p>
                </div>
                <span className="badge-demo text-[10px] py-0 px-2">MASKED PRIVACY</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                      <th className="py-2.5 px-3">Buyer Category</th>
                      <th className="py-2.5 px-3">Organization</th>
                      <th className="py-2.5 px-3">Requested (kg)</th>
                      <th className="py-2.5 px-3">Offered Rate</th>
                      <th className="py-2.5 px-3">Total Value</th>
                      <th className="py-2.5 px-3">Proposed Pickup</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lotBids.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No bids submitted yet for this lot. Be the first verified buyer to bid.
                        </td>
                      </tr>
                    ) : (
                      lotBids.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-medium text-slate-600">{b.buyerCategory}</td>
                          <td className="py-3 px-3 font-bold text-slate-800">{b.buyerOrgName}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{b.requestedQuantityKg} kg</td>
                          <td className="py-3 px-3 font-extrabold text-emerald-700">₹{b.offeredPricePerKg.toFixed(2)}/kg</td>
                          <td className="py-3 px-3 font-extrabold text-slate-900">₹{b.totalBidAmount.toLocaleString()}</td>
                          <td className="py-3 px-3 text-slate-600">{b.proposedPickupDate}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                b.status === 'selected_by_farmer' || b.status === 'officer_confirmed' || b.status === 'accepted_by_buyer'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {b.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Notice regarding phone numbers */}
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Buyer & farmer phone numbers are strictly disclosed only after order confirmation and escrow lock.</span>
              </div>
            </div>
          </div>

          {/* Right Col: Verified Buyer Bid Submission Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Buyer Offer Panel</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Submit a B2B Bid</h3>
                <p className="text-xs text-slate-500">
                  Specify the kg volume you require and your offered price per kg.
                </p>
              </div>

              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmitBid} className="space-y-4">
                {/* Select Buyer Persona */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bidding Entity:
                  </label>
                  <select
                    value={buyerId}
                    onChange={(e) => setBuyerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {buyers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.organizationName} ({b.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Requested kg */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Requested Quantity (kg):
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Max: {currentListing.availableQuantityKg} kg
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={currentListing.availableQuantityKg}
                    step={1}
                    value={requestedKg}
                    onChange={(e) => setRequestedKg(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                  <span className="text-[10px] text-slate-400">
                    Partial procurement allowed (e.g. 10 kg, 20 kg)
                  </span>
                </div>

                {/* Offered Price INR / kg */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Offered Price (INR / kg):
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Floor: ₹{currentListing.minimumPricePerKg.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={currentListing.minimumPricePerKg}
                    step={0.5}
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                {/* Proposed Pickup Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Proposed Pickup Date:
                  </label>
                  <input
                    type="date"
                    value={proposedPickupDate}
                    onChange={(e) => setProposedPickupDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                {/* Order Calculation Preview */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Requested:</span>
                    <span>{requestedKg} kg</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Unit Rate:</span>
                    <span>₹{offeredPrice.toFixed(2)} / kg</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-sm">
                    <span>Total Bid Amount:</span>
                    <span className="text-emerald-700">
                      ₹{(requestedKg * offeredPrice).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || requestedKg <= 0 || requestedKg > currentListing.availableQuantityKg}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting Bid...' : 'Submit Transparent Bid'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
