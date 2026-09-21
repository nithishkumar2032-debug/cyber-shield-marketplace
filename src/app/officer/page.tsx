'use client';

// Agricultural Officer Desk
// Prepared by Cyber Shield | SIH 26033

import React, { useState } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  ShieldCheck,
  UserCheck,
  PhoneCall,
  Scale,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Truck,
} from 'lucide-react';

export default function OfficerPage() {
  const { state, officerConfirmAllocation, verifyPickup, officerFieldVisit } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'onboarding' | 'confirmations' | 'pickup' | 'grievances'>('confirmations');

  // Currently logged-in demo officer
  const officer = state?.officers[0] || {
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
  const allocations = state?.allocations || [];
  const pendingAllocations = allocations.filter((a) => a.status === 'proposed');
  const orders = state?.orders || [];
  const pickupReadyOrders = orders.filter((o) => o.status === 'secured' || o.status === 'vehicle_assigned');
  const grievances = state?.grievances || [];
  const pendingFarmers = state?.farmers.filter((f) => f.status === 'onboarding_requested') || [];

  // Phone Confirmation Form State
  const [selectedAllocationId, setSelectedAllocationId] = useState<string | null>(null);
  const [phoneNotes, setPhoneNotes] = useState<string>('Telephonically verified quantity, unit price and pickup schedule with buyer procurement lead.');
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  // Handover Verification State
  const [selectedOrderId, setSelectedOrderId] = useState<string>(pickupReadyOrders[0]?.id || orders[0]?.id || '');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [scaleWeightKg, setScaleWeightKg] = useState<number>(50);
  const [inspectionNotes, setInspectionNotes] = useState<string>('Calibrated digital scale test passed. Quality terms verified.');
  const [pickupResult, setPickupResult] = useState<string | null>(null);

  // Field Visit Form State
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(pendingFarmers[0]?.id || '');
  const [gpsLat, setGpsLat] = useState<number>(10.8812);
  const [gpsLng, setGpsLng] = useState<number>(79.1034);
  const [expectedYieldKg, setExpectedYieldKg] = useState<number>(3000);
  const [bankMasked, setBankMasked] = useState<string>('•••• •••• 4912');
  const [fieldNotes, setFieldNotes] = useState<string>('Field inspected. Canal irrigation healthy, crop canopy good.');
  const [fieldVisitResult, setFieldVisitResult] = useState<string | null>(null);

  const handlePhoneConfirm = async (allocationId: string) => {
    setConfirmStatus('Recording phone confirmation in immutable audit log...');
    const res = await officerConfirmAllocation(allocationId, phoneNotes);
    if (res.success) {
      setConfirmStatus('Phone confirmation recorded! The buyer can now formally accept final terms and commit the order.');
      setTimeout(() => {
        setSelectedAllocationId(null);
        setConfirmStatus(null);
      }, 3000);
    }
  };

  const handlePickupVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setPickupResult('Verifying OTP and recording digital scale weights...');
    const res = await verifyPickup(selectedOrderId, {
      enteredOtp,
      scaleWeightKg,
      inspectionNotes,
      officerId: officer?.officerId,
      officerName: officer?.officerName,
    });

    if (res.success) {
      setPickupResult(
        `Handover Verified! Custody transferred to buyer. Released ₹${res.data.escrow?.releasedAmount?.toLocaleString()} directly to seller's verified bank account.`
      );
    } else {
      setPickupResult(`Verification Failed: ${res.error}`);
    }
  };

  const handleFieldVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldVisitResult('Submitting field verification record...');
    const res = await officerFieldVisit({
      farmerId: selectedFarmerId,
      officerId: officer?.officerId,
      officerName: officer?.officerName,
      lat: gpsLat,
      lng: gpsLng,
      expectedYieldKg,
      bankAccountMasked: bankMasked,
      fieldNotes,
      approvalStatus: 'verified',
    });

    if (res.success) {
      setFieldVisitResult(
        `Farmer Verified! Secure single-use activation link generated: ${res.data.activationToken}. Expiring link issued for registered mobile.`
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-700/80 border border-blue-500/40 flex items-center justify-center text-white font-bold shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {officer?.officerName}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-800 text-blue-200 border border-blue-600">
                {officer?.roleTitle}
              </span>
            </div>
            <div className="text-xs text-blue-200/90 mt-1">
              Jurisdiction: <b>{officer?.taluka} Taluka</b>, {officer?.district} District, {officer?.state} • Phone: {officer?.phone}
            </div>
          </div>
        </div>

        <div className="bg-blue-950/80 p-3 rounded-2xl border border-blue-700/50 text-xs text-blue-200 space-y-1 w-full md:w-auto">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Officer Role Boundaries</span>
          </div>
          <p className="text-[11px] text-blue-200/80 max-w-xs">
            Officers verify field facts and record confirmations. Officers never receive, hold, or redirect escrow funds.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('confirmations')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'confirmations'
              ? 'border-blue-700 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Phone Confirmations ({pendingAllocations.length})</span>
          {pendingAllocations.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('pickup')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'pickup'
              ? 'border-blue-700 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Handover & Scale Weighing ({pickupReadyOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('onboarding')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'onboarding'
              ? 'border-blue-700 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Field Visits & Registration ({pendingFarmers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('grievances')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'grievances'
              ? 'border-blue-700 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Grievance Desk ({grievances.length})
        </button>
      </div>

      {/* Tab: Bidding Phone Confirmations */}
      {activeTab === 'confirmations' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Farmer Bid Allocations Awaiting Officer Phone Verification
              </h3>
              <p className="text-xs text-slate-500">
                Confirm quantity, agreed rate, and pickup arrangements by calling the buyer representative.
              </p>
            </div>
            <span className="badge-demo text-[10px] py-0 px-2">AUDIT-RECORDED</span>
          </div>

          {confirmStatus && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{confirmStatus}</span>
            </div>
          )}

          <div className="space-y-4">
            {pendingAllocations.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No allocations currently awaiting officer phone verification. When farmers select buyer bids, they will appear here.
              </div>
            ) : (
              pendingAllocations.map((alc) => {
                const listing = state?.listings.find((l) => l.id === alc.listingId);
                const buyer = state?.buyers.find((b) => b.id === alc.buyerId);

                return (
                  <div
                    key={alc.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                          {listing?.listingCode}
                        </span>
                        <span className="text-xs font-bold text-slate-800 ml-2">
                          {alc.allocatedKg} kg of {listing?.crop} ({listing?.variety})
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-emerald-700">
                        ₹{alc.agreedPricePerKg.toFixed(2)}/kg • Total: ₹{alc.totalOrderValue.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-slate-400 block text-[11px]">Buyer Information</span>
                        <div className="font-bold text-slate-900 text-sm">{alc.buyerOrgName}</div>
                        <div className="text-slate-600">
                          Authorized Purchaser: <b>{buyer?.authorizedPurchaser || 'Procurement Lead'}</b>
                        </div>
                        <div className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Phone to Call: {buyer?.mobile || '+91 98401 22391'}</span>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-slate-400 block text-[11px]">Farmer Selection</span>
                        <div className="font-bold text-slate-900 text-sm">{listing?.sellerName}</div>
                        <div className="text-slate-500 text-[11px]">
                          Proposed at: {new Date(alc.farmerSelectedAt).toLocaleString()}
                        </div>
                        <div className="text-slate-600 text-[11px] pt-1">
                          Available lot balance before allocation: {listing?.availableQuantityKg} kg
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Officer Telephonic Confirmation Notes:
                      </label>
                      <input
                        type="text"
                        value={phoneNotes}
                        onChange={(e) => setPhoneNotes(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        onClick={() => handlePhoneConfirm(alc.id)}
                        className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Record Phone Verification with Buyer</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab: Handover & Scale Weighing */}
      {activeTab === 'pickup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Farm Gate Physical Inspection & Scale Weighing
                </h3>
                <p className="text-xs text-slate-500">
                  Verify arrived driver, check scale weights in kg, and enter OTP to transfer custody.
                </p>
              </div>
              <span className="badge-demo text-[10px] py-0 px-2">TRIPLE CONFIRMATION</span>
            </div>

            {pickupResult && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  pickupResult.includes('Verified')
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {pickupResult.includes('Verified') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{pickupResult}</span>
              </div>
            )}

            <form onSubmit={handlePickupVerification} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Order for Handover:</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => {
                    setSelectedOrderId(e.target.value);
                    const sel = orders.find((o) => o.id === e.target.value);
                    if (sel) setScaleWeightKg(sel.confirmedQuantityKg);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} — {o.crop} ({o.confirmedQuantityKg} kg) — {o.buyerOrgName} (Status: {o.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Enter Driver Handover OTP:
                  </label>
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP (or master 888888)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-600 tracking-wider"
                    required
                  />
                  <span className="text-[10px] text-slate-400">
                    OTP provided on driver/farmer dashboard
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Calibrated Scale Measured Weight (kg):
                  </label>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={scaleWeightKg}
                    onChange={(e) => setScaleWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Physical Quality & Inspection Notes:
                </label>
                <textarea
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4" />
                <span>Verify Scale Weights & Record Verified Handover</span>
              </button>
            </form>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Inspection Protocol Checks</span>
            </h4>
            <ul className="space-y-2 text-[11px] leading-relaxed list-disc list-inside">
              <li>Match driver name and vehicle plate number against assignment record.</li>
              <li>Perform physical weighment in kg on verified weighing instrument.</li>
              <li>Record shortages as exceptions before handover; settlement pays for accepted weight.</li>
              <li>Verified handover generates a settlement instruction; payment completion is simulated in this prototype.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Field Visits & Farmer Assisted Registration */}
      {activeTab === 'onboarding' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Assisted Farmer Onboarding & Land Verification
            </h3>
            <p className="text-xs text-slate-500">
              Enter GPS coordinates, land records, estimated yield, and initial bank details.
            </p>
          </div>

          {fieldVisitResult && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
              {fieldVisitResult}
            </div>
          )}

          <form onSubmit={handleFieldVisitSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Farmer Onboarding Request:</label>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600"
              >
                {state?.farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName} — {f.village}, {f.district} (Status: {f.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">GPS Latitude:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={gpsLat}
                  onChange={(e) => setGpsLat(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">GPS Longitude:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={gpsLng}
                  onChange={(e) => setGpsLng(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Yield (kg):</label>
                <input
                  type="number"
                  value={expectedYieldKg}
                  onChange={(e) => setExpectedYieldKg(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Masked Bank Account:</label>
                <input
                  type="text"
                  value={bankMasked}
                  onChange={(e) => setBankMasked(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Field Inspection Notes:</label>
              <textarea
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-700 text-white font-bold text-xs sm:text-sm hover:bg-blue-800 transition-colors shadow-md"
            >
              Approve Verification & Generate Activation Link
            </button>
          </form>
        </div>
      )}

      {/* Tab: Grievances */}
      {activeTab === 'grievances' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Taluka Grievance Escalation Desk</h3>
              <p className="text-xs text-slate-500">Investigate pickup delays, quality disputes, and logistics issues.</p>
            </div>
          </div>

          <div className="space-y-3">
            {grievances.map((g) => (
              <div key={g.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{g.complaintNumber} — {g.category}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {g.status}
                  </span>
                </div>
                <p className="text-slate-600">{g.description}</p>
                <div className="text-[11px] text-slate-500">
                  Complainant: <b>{g.complainantName}</b> ({g.complainantRole}) • Phone: {g.complainantPhone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
