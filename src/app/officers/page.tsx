'use client';

// Agricultural Officer Directory
// Prepared by Cyber Shield | SIH 26033

import React, { useState } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Building,
  UserCheck,
  Search,
  Users,
} from 'lucide-react';

export default function OfficersPage() {
  const { state } = useMarketplace();
  const officers = state?.officers || [];
  const [filterState, setFilterState] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const states = ['All', ...Array.from(new Set(officers.map((o) => o.state)))];

  const filteredOfficers = officers.filter((o) => {
    const matchState = filterState === 'All' || o.state.toLowerCase() === filterState.toLowerCase();
    const matchSearch =
      !search.trim() ||
      o.officerName.toLowerCase().includes(search.toLowerCase()) ||
      o.district.toLowerCase().includes(search.toLowerCase()) ||
      (o.taluka && o.taluka.toLowerCase().includes(search.toLowerCase())) ||
      o.roleTitle.toLowerCase().includes(search.toLowerCase());

    return matchState && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-blue-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Institutional Field Network • Human Verification</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Agricultural Officer Directory
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Direct contacts for Village, Taluka/Block, and District Agricultural Officers responsible for field inspection, assisted onboarding, bidding confirmation, and pickup custody verification.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-blue-100 space-y-2 max-w-sm">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-300" />
            <span>Support Stays Human</span>
          </div>
          <p className="text-[11px] text-blue-200">
            Officers provide unbiased on-ground verification. AI assists only with simple instructions, never replacing human certification.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search officer name, taluka, district, or jurisdiction..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 shrink-0">State Filter:</label>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Officer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfficers.map((officer) => (
          <div
            key={officer.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover-lift flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {officer.roleTitle}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {officer.officerName}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {officer.taluka ? `${officer.taluka} Taluka, ` : ''}
                    {officer.district} District, {officer.state}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <a
                    href={`tel:${officer.phone}`}
                    className="font-semibold text-slate-800 hover:text-emerald-700"
                  >
                    {officer.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <a
                    href={`mailto:${officer.email}`}
                    className="text-slate-600 hover:underline truncate"
                  >
                    {officer.email}
                  </a>
                </div>

                <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                  <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-500 leading-tight">
                    {officer.officeAddress}
                  </span>
                </div>
              </div>
            </div>

            {officer.backupOfficerName && (
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700">Backup Coverage: </span>
                {officer.backupOfficerName}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
