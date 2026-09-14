'use client';

// India-Wide Crop Marketplace & Discovery
// Prepared by Cyber Shield | SIH 26033

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Search,
  Filter,
  MapPin,
  Scale,
  Calendar,
  ShieldCheck,
  Building2,
  Tag,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function ExplorePage() {
  const { state } = useMarketplace();
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700/50">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pan-India B2B Discovery • All Quantities in kg</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            India-Wide Crop Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Browse verified produce directly from individual bulk farmers and FPO aggregation depots. Standardized unit pricing in INR/kg. Fruits such as bananas and coconuts are strictly weighed by kg.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-emerald-100 space-y-2 w-full md:w-auto">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-300" />
            <span>Market Discovery Protocol</span>
          </div>
          <ul className="space-y-1 text-[11px] text-emerald-200/90 list-disc list-inside">
            <li>State & District cascading filters</li>
            <li>Reference MSP & APMC benchmark prices</li>
            <li>Partial procurement in kg supported</li>
          </ul>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, variety, district, lot code..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 shrink-0">State:</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 shrink-0">District:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {districtsList.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Category */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 shrink-0">Crop:</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {cropsList.map((crp) => (
                <option key={crp} value={crp}>
                  {crp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredListings.length}</span> verified lots
            {selectedState !== 'All' && <span> in <b>{selectedState}</b></span>}
            {selectedDistrict !== 'All' && <span>, <b>{selectedDistrict}</b></span>}
          </div>

          {(selectedState !== 'All' || selectedDistrict !== 'All' || selectedCrop !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedDistrict('All');
                setSelectedCrop('All');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No crop listings match your criteria</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your state, district, or crop filters to see produce in other regions.
            </p>
          </div>
        ) : (
          filteredListings.map((listing) => {
            // Find reference price from catalogue
            const catItem = catalogue.find(
              (c) => c.cropName.toLowerCase() === listing.crop.toLowerCase()
            );

            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover-lift flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  {/* Status & Code */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {listing.listingCode}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        listing.sellerType === 'fpo'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {listing.sellerType === 'fpo' ? 'FPO Collective Lot' : 'Individual Bulk Farmer'}
                    </span>
                  </div>

                  {/* Title & Variety */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{listing.crop}</h3>
                    <div className="text-xs text-slate-600 font-medium">
                      {listing.variety} • {listing.productForm}
                    </div>
                  </div>

                  {/* Quantity & Price Card */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400 text-[11px]">Available Balance</div>
                      <div className="text-base font-extrabold text-slate-900">
                        {listing.availableQuantityKg.toLocaleString()} kg
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Total Lot: {listing.totalQuantityKg.toLocaleString()} kg
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Reserve Floor</div>
                      <div className="text-base font-extrabold text-emerald-700">
                        ₹{listing.minimumPricePerKg.toFixed(2)}
                        <span className="text-xs font-normal text-slate-500"> / kg</span>
                      </div>
                      <div className="text-[10px] text-slate-500">INR per kilogram</div>
                    </div>
                  </div>

                  {/* Reference Price Badge */}
                  {catItem && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl px-3 py-2 text-[11px] text-emerald-900 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-emerald-800">Govt/NAFED Benchmark: </span>
                        <span className="font-bold">₹{catItem.referencePricePerKg.toFixed(2)}/kg</span>
                      </div>
                      <span className="badge-demo text-[9px] py-0 px-1.5">DEMO BENCHMARK</span>
                    </div>
                  )}

                  {/* Location & Quality */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{listing.approximatePickupArea}, {listing.district}, {listing.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Expected Harvest: {listing.expectedHarvestDate}</span>
                    </div>
                  </div>

                  {/* Quality Terms Snapshot */}
                  <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700">Quality Spec: </span>
                    {listing.qualityTerms}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Seller: <span className="font-semibold text-slate-700">{listing.sellerName}</span>
                  </div>
                  <Link
                    href={`/bids?lot=${listing.id}`}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-1"
                  >
                    <span>Inspect & Bid</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
