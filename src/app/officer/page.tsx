'use client';

// Agricultural Officer Desk — Sovereign Verification Console & Grievance Redressal Desk
// Prepared by Cyber Shield | SIH 26033
// Layout updated to match Stitch Sovereign Agritech Design

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
  Phone,
  Timer,
  Check,
  Sparkles,
  Gavel,
  Radio,
  Satellite,
  Compass,
} from 'lucide-react';

export default function OfficerPage() {
  const { state, officerConfirmAllocation, verifyPickup, officerFieldVisit } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'console' | 'confirmations' | 'field_visit' | 'grievances'>('console');

  // Currently logged-in demo officer
  const officer = state?.officers[0] || {
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

  const officerListings = (state?.listings || []).filter((l) => l.district === officer.district);
  const officerListingIds = officerListings.map((l) => l.id);

  const allocations = (state?.allocations || []).filter((a) => officerListingIds.includes(a.listingId));
  const pendingAllocations = allocations.filter((a) => a.status === 'proposed');
  
  const orders = (state?.orders || []).filter((o) => officerListingIds.includes(o.listingId));
  const pickupReadyOrders = orders.filter((o) => o.status === 'secured' || o.status === 'vehicle_assigned');
  
  const grievances = (state?.grievances || []);
  const pendingFarmers = (state?.farmers || []).filter((f) => f.status === 'onboarding_requested' && f.district === officer.district);

  // Phone Confirmation Form State
  const [selectedAllocationId, setSelectedAllocationId] = useState<string | null>(null);
  const [phoneNotes, setPhoneNotes] = useState<string>('Telephonically verified quantity, unit price and pickup schedule with buyer procurement lead.');
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  // Farm-Gate Weighment Protocol State
  const [selectedOrderId, setSelectedOrderId] = useState<string>(pickupReadyOrders[0]?.id || orders[0]?.id || 'ord-1');
  const [enteredOtp, setEnteredOtp] = useState<string>('849201');
  const [grossWeightKg, setGrossWeightKg] = useState<number>(34200);
  const [tareWeightKg, setTareWeightKg] = useState<number>(9150);
  const netWeightKg = Math.max(0, grossWeightKg - tareWeightKg);
  const [inspectionNotes, setInspectionNotes] = useState<string>('Calibrated digital scale test passed. Quality terms verified.');
  const [pickupResult, setPickupResult] = useState<string | null>(null);
  const [isEscrowSettled, setIsEscrowSettled] = useState<boolean>(false);

  // Field Visit & AI Yield Estimator Form State
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(pendingFarmers[0]?.id || 'fmr-1');
  const [farmerFullName, setFarmerFullName] = useState<string>('Govindasamy Pillai');
  const [farmerAadhaar, setFarmerAadhaar] = useState<string>('TN-FMR-2026-7782');
  const [cropVariety, setCropVariety] = useState<string>('Paddy (Ponni Samba)');
  const [sowingDate, setSowingDate] = useState<string>('2025-11-15');
  const [acreage, setAcreage] = useState<number>(4.5);
  const [gpsLocation, setGpsLocation] = useState<string>('10.7870° N, 79.1378° E (Thanjavur Delta Block #2)');
  const [fieldVisitResult, setFieldVisitResult] = useState<string | null>(null);

  // Derived yield calculation
  const yieldPerAcreKg = 2600;
  const totalEstimatedHarvestKg = acreage * yieldPerAcreKg;

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

  const handleAuthorizeRelease = async () => {
    setPickupResult('Verifying OTP and recording digital scale weights...');
    const res = await verifyPickup(selectedOrderId, {
      enteredOtp,
      scaleWeightKg: netWeightKg,
      inspectionNotes,
      officerId: officer?.officerId,
      officerName: officer?.officerName,
    });

    setIsEscrowSettled(true);
    setPickupResult(
      `Escrow Settled Instantly! ₹6,30,000 successfully remitted to Farmer Ramanathan S. (Bank Acc ending 4410) via RTGS ref: #TN-ESCROW-2026-99214.`
    );
  };

  const handleFieldVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldVisitResult('Submitting field verification record...');
    const res = await officerFieldVisit({
      farmerId: selectedFarmerId,
      officerId: officer?.officerId,
      officerName: officer?.officerName,
      lat: 10.787,
      lng: 79.1378,
      expectedYieldKg: totalEstimatedHarvestKg,
      bankAccountMasked: '•••• •••• 4410',
      fieldNotes: `Inspected ${acreage} acres for ${cropVariety}. AI Satellite NDVI 0.78 Healthy. Yield certified at ${totalEstimatedHarvestKg.toLocaleString()} kg.`,
      approvalStatus: 'verified',
    });

    if (res.success) {
      setFieldVisitResult(
        `Field Plot Cadastral #TN-TJ-891 successfully logged with TN-E-Agri Registry! Activation Token: ${res.data.activationToken}`
      );
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Identity & Sovereign Telemetry Banner */}
      <div className="relative overflow-hidden bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 sm:p-8">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#005d42]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#005d42] text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#005d42] text-white uppercase tracking-wider">
                  STATE AUTHENTICATED
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#97f5cc] text-[#002115] font-mono flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#005d42]" /> TN-AGRI-84210
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#e2e7ff] text-[#64748b]">
                  ISO 9001:2015 AUDITED
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#131b2e] tracking-tight">
                Officer Verification Console & Grievance Redressal Desk
              </h1>
              <p className="text-xs text-[#64748b] flex flex-wrap items-center gap-2">
                <span>Logged in as: <strong className="text-[#131b2e]">{officer?.officerName}</strong></span>
                <span>•</span>
                <span>{officer?.roleTitle}, {officer?.district} District</span>
                <span>•</span>
                <span className="text-[#005d42] font-semibold">Govt. of Tamil Nadu Field Node</span>
              </p>
            </div>
          </div>

          {/* Live Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd]">
            <div className="bg-[#ffffff] p-3 rounded-lg shadow-sm border border-[#e2e7ff]">
              <span className="text-[10px] font-bold text-[#64748b] uppercase block">Live Escrow Node</span>
              <span className="text-base font-bold text-[#005d42] flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#005d42] animate-pulse"></span>ACTIVE
              </span>
              <span className="text-[11px] text-[#64748b]">3 Dispatches Queued</span>
            </div>
            <div className="bg-[#ffffff] p-3 rounded-lg shadow-sm border border-[#e2e7ff]">
              <span className="text-[10px] font-bold text-[#64748b] uppercase block">Today&apos;s Release</span>
              <span className="text-base font-bold text-[#131b2e] mt-0.5 tabular-nums">₹14.85 L</span>
              <span className="text-[11px] text-[#005d42] font-semibold">0 Disputes</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-[#ffffff] p-3 rounded-lg shadow-sm border border-[#e2e7ff]">
              <span className="text-[10px] font-bold text-[#64748b] uppercase block">SLA Compliance</span>
              <span className="text-base font-bold text-[#4e45d5] mt-0.5 tabular-nums">99.4%</span>
              <span className="text-[11px] text-[#64748b]">&lt; 3.2h Avg Release</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dae2fd] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('console')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'console'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Farm-Gate Weighment Protocol & Escrow Release</span>
        </button>

        <button
          onClick={() => setActiveTab('confirmations')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'confirmations'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Telephonic Confirmations ({pendingAllocations.length})</span>
          {pendingAllocations.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('field_visit')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'field_visit'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Cadastral Field Audit & Yield Model</span>
        </button>

        <button
          onClick={() => setActiveTab('grievances')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'grievances'
              ? 'border-[#005d42] text-[#005d42]'
              : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Grievance Arbitration Desk ({grievances.length > 0 ? grievances.length : 3})</span>
        </button>
      </div>

      {confirmStatus && (
        <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 bg-[#97f5cc]/50 text-[#002115] border border-[#005d42]/30 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#005d42] shrink-0" />
          <span>{confirmStatus}</span>
        </div>
      )}

      {/* TAB: CONSOLE (Main Weighment & Escrow Release Protocol) */}
      {activeTab === 'console' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Section 1 Farm-Gate Handover & Digital Scale Weighment Console (7 cols) */}
            <div className="xl:col-span-7 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 sm:p-7 space-y-6">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
                  <div className="flex items-center gap-3">
                    <Scale className="w-6 h-6 text-[#005d42]" />
                    <div>
                      <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider block">
                        INSTITUTIONAL PROTOCOL
                      </span>
                      <h2 className="text-base font-bold font-display text-[#131b2e]">
                        Farm-Gate Weighment & Escrow Release
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e3dfff] text-[#100069]">
                      LOT #TN-THJ-9821
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#97f5cc] text-[#002115]">
                      PADDY PONNI A
                    </span>
                  </div>
                </div>

                {/* Lot & Actor Manifest */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-[#f2f3ff] p-3.5 rounded-xl border border-[#dae2fd]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#64748b] uppercase">Farmer</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#005d42]" />
                    </div>
                    <p className="text-xs font-bold text-[#131b2e] mt-1">Ramanathan S.</p>
                    <p className="text-[11px] text-[#64748b]">ID: FMR-TN-4190</p>
                    <p className="text-[11px] text-[#005d42] font-semibold">Bank A/c: •••• 4410</p>
                  </div>

                  <div className="bg-[#f2f3ff] p-3.5 rounded-xl border border-[#dae2fd]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#64748b] uppercase">Transporter</span>
                      <Truck className="w-3.5 h-3.5 text-[#4e45d5]" />
                    </div>
                    <p className="text-xs font-bold text-[#131b2e] mt-1">M. Murugan</p>
                    <p className="text-[11px] text-[#64748b] font-mono">Lorry: TN-49-AZ-8812</p>
                    <p className="text-[11px] text-[#64748b]">Waybill: CS-EWAY-3091</p>
                  </div>

                  <div className="bg-[#f2f3ff] p-3.5 rounded-xl border border-[#dae2fd]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#64748b] uppercase">Procurement Buyer</span>
                      <FileText className="w-3.5 h-3.5 text-[#4e45d5]" />
                    </div>
                    <p className="text-xs font-bold text-[#131b2e] mt-1">ITC Agri Business</p>
                    <p className="text-[11px] text-[#64748b]">Ref: PO-ITC-9902</p>
                    <p className="text-[11px] text-[#64748b]">Agreed: ₹25.20/kg</p>
                  </div>
                </div>

                {/* Digital Weighbridge Scale Panel */}
                <div className="bg-[#eaedff] rounded-2xl p-5 space-y-4 border border-[#c3c0ff]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#005d42] animate-ping"></span>
                      <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                        IoT Weighbridge Terminal Node #4
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffffff] text-[#005d42] shadow-sm">
                      DIGITAL SCALE CALIBRATED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Gross Loaded Weight */}
                    <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#dae2fd]">
                      <span className="text-[10px] font-bold text-[#64748b] uppercase block">
                        1. Gross Loaded Weight
                      </span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <input
                          type="number"
                          value={grossWeightKg}
                          onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                          className="text-2xl font-bold text-[#131b2e] tabular-nums w-24 bg-transparent outline-none"
                        />
                        <span className="text-xs font-bold text-[#64748b]">kg</span>
                      </div>
                      <span className="text-[11px] text-[#64748b] block mt-0.5">Lorry + Loaded Sacks</span>
                    </div>

                    {/* Tare Weight (Empty) */}
                    <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#dae2fd]">
                      <span className="text-[10px] font-bold text-[#64748b] uppercase block">
                        2. Vehicle Tare Weight
                      </span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <input
                          type="number"
                          value={tareWeightKg}
                          onChange={(e) => setTareWeightKg(Number(e.target.value))}
                          className="text-2xl font-bold text-[#64748b] tabular-nums w-24 bg-transparent outline-none"
                        />
                        <span className="text-xs font-bold text-[#64748b]">kg</span>
                      </div>
                      <span className="text-[11px] text-[#64748b] block mt-0.5">Authenticated Empty Tare</span>
                    </div>

                    {/* Net Weight Result */}
                    <div className="bg-[#005d42] text-white p-4 rounded-xl shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#97f5cc] block">
                        3. Net Crop Weight
                      </span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-2xl font-bold tabular-nums">{netWeightKg.toLocaleString()}</span>
                        <span className="text-xs font-bold text-[#97f5cc]">kg</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[#97f5cc]">
                        <Check className="w-3 h-3" />
                        <span>Agreed: 25,000 kg (+0.2% Tol.)</span>
                      </div>
                    </div>
                  </div>

                  {/* Moisture & Foreign Matter Lab Meters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-[#ffffff] p-3 rounded-xl flex items-center justify-between shadow-sm border border-[#dae2fd]">
                      <div>
                        <span className="text-[10px] font-bold text-[#64748b] uppercase block">Moisture Analyzer</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-[#005d42]">12.8%</span>
                          <span className="text-[11px] text-[#64748b]">(Spec &le; 14.0%)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#97f5cc] text-[#002115]">
                        OPTIMAL DRYNESS
                      </span>
                    </div>

                    <div className="bg-[#ffffff] p-3 rounded-xl flex items-center justify-between shadow-sm border border-[#dae2fd]">
                      <div>
                        <span className="text-[10px] font-bold text-[#64748b] uppercase block">Foreign Matter Refraction</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-[#005d42]">0.4%</span>
                          <span className="text-[11px] text-[#64748b]">(Spec &le; 1.0%)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#005d42] text-white">
                        GRADE A CERTIFIED
                      </span>
                    </div>
                  </div>
                </div>



                {/* Live Escrow Execution Container */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#f2f3ff] p-5 rounded-2xl border border-[#dae2fd]">
                    <div>
                      <span className="text-[10px] font-bold text-[#64748b] uppercase block tracking-wider">
                        CALCULATED NET SETTLEMENT VALUATION
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-bold text-[#005d42] tabular-nums">₹6,30,000</span>
                        <span className="text-xs text-[#64748b]">({netWeightKg.toLocaleString()} kg @ ₹25.20/kg)</span>
                      </div>
                      <span className="text-[11px] text-[#64748b]">Demonstration Escrow Node: RBI Gateway TN-ESC-90812</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAuthorizeRelease}
                      disabled={isEscrowSettled}
                      className={`px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                        isEscrowSettled
                          ? 'bg-[#97f5cc] text-[#002115] cursor-default'
                          : 'bg-[#005d42] hover:bg-[#047857] text-white active:scale-95'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isEscrowSettled ? 'SETTLEMENT EXECUTED' : 'AUTHORIZE TRIPLE-SIGN & RELEASE ₹6,30,000'}</span>
                    </button>
                  </div>

                  {pickupResult && (
                    <div className="p-4 bg-[#97f5cc]/50 text-[#002115] border border-[#005d42]/30 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#005d42] text-white flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#005d42] block">Escrow Settled Instantly!</span>
                          <span className="text-xs text-[#002115]/90">{pickupResult}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#005d42] text-white text-[10px] font-bold uppercase tracking-wider">
                        COMPLETE
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Field Photo Verification Record */}
              <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider block">
                      ON-SITE VISUAL DOCUMENTATION
                    </span>
                    <h3 className="text-base font-bold font-display text-[#131b2e]">
                      Field-Gate Quality & Truck Manifest
                    </h3>
                  </div>
                  <span className="text-xs text-[#64748b]">Time-stamped: 2026-09-20 11:38 AM IST</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative overflow-hidden rounded-xl h-44 bg-[#f2f3ff] border border-[#dae2fd]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Sample crop inspect"
                      src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                      <span className="text-[10px] font-mono uppercase block text-[#97f5cc]">Physical Sample Inspect</span>
                      <span className="text-xs">Grade A Ponni Paddy - Moisture 12.8%</span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl h-44 bg-[#f2f3ff] border border-[#dae2fd]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Lorry dispatch slip"
                      src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                      <span className="text-[10px] font-mono uppercase block text-[#97f5cc]">Lorry Dispatch Slip</span>
                      <span className="text-xs">TN-49-AZ-8812 Loaded - 25,050 kg Net</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Section 2 Yield Estimator & Farm Verification (5 cols) */}
            <div className="xl:col-span-5 space-y-6">
              {/* Cadastral Field Audit & Yield Model */}
              <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider block">
                      CADASTRAL FIELD AUDIT
                    </span>
                    <h3 className="text-base font-bold font-display text-[#131b2e]">
                      Farmer Registration & Yield Model
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e3dfff] text-[#100069]">
                    AI YIELD ENGINE
                  </span>
                </div>

                <form onSubmit={handleFieldVisitSubmit} className="space-y-3.5 text-xs">
                  {/* GPS Geolocation Auto Fetch */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-[#64748b] uppercase">GPS Geolocation</label>
                      <button
                        type="button"
                        onClick={() => setGpsLocation('10.7870° N, 79.1378° E (Thanjavur Delta Block #2)')}
                        className="text-[10px] font-bold text-[#005d42] hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" /> RE-LOCATE
                      </button>
                    </div>
                    <input
                      type="text"
                      value={gpsLocation}
                      readOnly
                      className="w-full h-10 px-3 bg-[#f2f3ff] text-[#131b2e] rounded-xl font-mono text-xs border border-[#dae2fd]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#64748b] uppercase">Farmer Name</label>
                      <input
                        type="text"
                        value={farmerFullName}
                        onChange={(e) => setFarmerFullName(e.target.value)}
                        className="w-full h-10 px-3 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-xs border border-[#dae2fd]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#64748b] uppercase">Aadhaar / Farmer ID</label>
                      <input
                        type="text"
                        value={farmerAadhaar}
                        onChange={(e) => setFarmerAadhaar(e.target.value)}
                        className="w-full h-10 px-3 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-xs font-mono border border-[#dae2fd]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#64748b] uppercase">Crop & Variety</label>
                      <select
                        value={cropVariety}
                        onChange={(e) => setCropVariety(e.target.value)}
                        className="w-full h-10 px-3 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-xs border border-[#dae2fd]"
                      >
                        <option>Paddy (Ponni Samba)</option>
                        <option>Wheat (Sharbati Gold)</option>
                        <option>Gram (Desi Chana)</option>
                        <option>Mustard (Pusa Bold)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#64748b] uppercase">Sowing Date</label>
                      <input
                        type="date"
                        value={sowingDate}
                        onChange={(e) => setSowingDate(e.target.value)}
                        className="w-full h-10 px-3 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-xs border border-[#dae2fd]"
                      />
                    </div>
                  </div>

                  {/* Acreage Slider */}
                  <div className="space-y-1.5 bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd]">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-[#131b2e] uppercase">Verified Acreage</label>
                      <span className="text-sm font-bold text-[#005d42]">{acreage} Acres</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="25"
                      step="0.5"
                      value={acreage}
                      onChange={(e) => setAcreage(Number(e.target.value))}
                      className="w-full accent-[#005d42] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#64748b]">
                      <span>0.5 Ac (Smallholding)</span>
                      <span>12.5 Ac</span>
                      <span>25.0 Ac (Commercial)</span>
                    </div>
                  </div>

                  {/* AI Satellite Crop Estimator Box */}
                  <div className="bg-[#eaedff] rounded-xl p-4 space-y-2 border border-[#c3c0ff]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider">
                        AI SATELLITE CROP ESTIMATOR
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#ffffff] text-[#131b2e] text-[10px] font-bold">
                        NDVI: 0.78 (HEALTHY)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-[#ffffff] p-3 rounded-lg border border-[#dae2fd]">
                        <span className="text-[10px] font-bold text-[#64748b] uppercase block">Est. Yield / Acre</span>
                        <span className="text-sm font-bold text-[#131b2e]">{yieldPerAcreKg.toLocaleString()} kg</span>
                        <span className="text-[10px] text-[#64748b] block">Optimal Cauvery basin</span>
                      </div>
                      <div className="bg-[#005d42] text-white p-3 rounded-lg">
                        <span className="text-[10px] font-bold uppercase block text-[#97f5cc]">Total Expected</span>
                        <span className="text-sm font-bold">{totalEstimatedHarvestKg.toLocaleString()} kg</span>
                        <span className="text-[10px] text-[#97f5cc] block">~{(totalEstimatedHarvestKg / 100).toFixed(0)} Quintals</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>CERTIFY FIELD REGISTRATION & LOG SATELLITE PLOT</span>
                  </button>

                  {fieldVisitResult && (
                    <div className="p-3 bg-[#97f5cc]/50 text-[#002115] border border-[#005d42]/30 rounded-xl text-center text-xs font-semibold">
                      {fieldVisitResult}
                    </div>
                  )}
                </form>
              </div>

              {/* 24-Hour SLA Escalation Guard Widget */}
              <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#4e45d5]" />
                    <div>
                      <span className="text-[10px] font-bold text-[#4e45d5] uppercase tracking-wider block">
                        GOVT MANDATED RESOLUTION
                      </span>
                      <h4 className="text-sm font-bold font-display text-[#131b2e]">
                        24-Hour SLA Escalation Guard
                      </h4>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#4e45d5] text-white text-[10px] font-bold">
                    LIVE DESK
                  </span>
                </div>

                <p className="text-xs text-[#64748b] leading-relaxed">
                  Under SIH-26033 Sovereign Guidelines, all mandi logistics, tare discrepancies, and quality disputes must receive preliminary officer adjudication within 24 hours to prevent liquidity freeze.
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#131b2e] font-semibold">Ticket #GRV-2026-0812 Time Left</span>
                    <span className="text-[#4e45d5] font-bold font-mono">17h 41m left</span>
                  </div>
                  <div className="w-full bg-[#eaedff] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#4e45d5] h-full rounded-full" style={{ width: '27%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CONFIRMATIONS */}
      {activeTab === 'confirmations' && (
        <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-6">
          <div className="border-b border-[#f2f3ff] pb-3">
            <h3 className="text-base font-bold font-display text-[#131b2e]">
              Farmer Allocations Awaiting Officer Telephonic Confirmation
            </h3>
            <p className="text-xs text-[#64748b]">
              Before a buyer can execute an escrow order, the Agricultural Officer verifies terms directly with the buyer procurement desk.
            </p>
          </div>

          <div className="space-y-4">
            {pendingAllocations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748b] bg-[#f2f3ff] rounded-xl">
                All allocations are currently confirmed. Check the Handover tab for live dispatches.
              </div>
            ) : (
              pendingAllocations.map((alc) => {
                const listing = state?.listings.find((l) => l.id === alc.listingId);
                const buyerObj = state?.buyers.find((b) => b.id === alc.buyerId);

                return (
                  <div key={alc.id} className="p-5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] space-y-4 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dae2fd]/60 pb-3">
                      <div>
                        <span className="font-bold text-[#131b2e] text-sm">
                          Allocation for {listing?.crop} ({listing?.variety})
                        </span>
                        <span className="text-[#64748b] ml-2">
                          Proposed: <b className="text-[#131b2e]">{alc.allocatedKg.toLocaleString()} kg</b> @ ₹{alc.agreedPricePerKg.toFixed(2)}/kg
                        </span>
                      </div>
                      <span className="font-bold text-[#005d42] tabular-nums text-sm">
                        Total: ₹{alc.totalOrderValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-[#64748b] uppercase block">Buyer Contact</span>
                        <span className="font-bold text-[#131b2e] block mt-0.5">{buyerObj?.organizationName}</span>
                        <a href={`tel:${buyerObj?.mobile}`} className="text-[#005d42] font-semibold mt-1 inline-flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {buyerObj?.mobile} ({buyerObj?.authorizedPurchaser})
                        </a>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#64748b] uppercase block">Phone Verification Notes</label>
                        <input
                          type="text"
                          value={phoneNotes}
                          onChange={(e) => setPhoneNotes(e.target.value)}
                          className="w-full h-9 px-3 bg-white rounded-lg border border-[#dae2fd] text-xs text-[#131b2e]"
                        />
                        <button
                          onClick={() => handlePhoneConfirm(alc.id)}
                          className="px-4 py-2 rounded-lg bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Record Phone Confirmation</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB: FIELD VISIT */}
      {activeTab === 'field_visit' && (
        <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-6">
          <div className="border-b border-[#f2f3ff] pb-3">
            <h3 className="text-base font-bold font-display text-[#131b2e]">
              Farmer Assisted Onboarding & Field Geo-Tagging
            </h3>
            <p className="text-xs text-[#64748b]">
              Verify cadastral boundaries, test soil nitrogen, and issue expiring single-use activation tokens.
            </p>
          </div>

          <div className="p-4 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] text-xs text-[#64748b]">
            Use the Cadastral Field Audit form in the main Console tab to register new plots with AI Satellite yield predictions.
          </div>
        </div>
      )}

      {/* TAB: GRIEVANCES */}
      {activeTab === 'grievances' && (
        <div className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#e2e7ff] p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-[#f2f3ff] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[#005d42]" />
                <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider">OMBUDSMAN DESK</span>
              </div>
              <h2 className="text-xl font-bold font-display text-[#131b2e]">
                Active Grievance Tickets & Settlement Arbitration
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Officer adjudication authority for freight delays, lab quality variances, and weighment disagreements.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f2f3ff] text-[#64748b] text-[11px] font-bold uppercase border-b border-[#dae2fd]">
                  <th className="py-3 px-4">Ticket & Mandi</th>
                  <th className="py-3 px-3">Category / Nature</th>
                  <th className="py-3 px-3">Parties Involved</th>
                  <th className="py-3 px-3">Escalation Tier</th>
                  <th className="py-3 px-3">SLA / Status</th>
                  <th className="py-3 px-4 text-right">Adjudication Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f3ff] text-[#131b2e]">
                <tr className="hover:bg-[#f2f3ff]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#131b2e] block">#GRV-2026-0812</span>
                    <span className="text-[11px] text-[#64748b]">Mandi: TN-THJ-KBL</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-rose-700 block">Pickup Delay (&gt;6 hours)</span>
                    <span className="text-[11px] text-[#64748b]">Lorry detained at toll bypass</span>
                  </td>
                  <td className="py-3.5 px-3 text-[11px]">
                    <div><b>Farmer:</b> K. Balan</div>
                    <div className="text-[#64748b]"><b>Carrier:</b> FastTrack Agri Logistics</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e2e7ff] text-[#64748b]">
                      Taluka Officer Review
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdad6] text-[#93000a]">
                      17h 41m left
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert('Adjudication: Fast-track pass issued to Carrier. Escrow deadline extended by 4 hours.')}
                      className="px-3 py-1.5 rounded-lg bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      Arbitrate Ticket
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-[#f2f3ff]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#131b2e] block">#GRV-2026-0819</span>
                    <span className="text-[11px] text-[#64748b]">Mandi: TN-THJ-04</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[#005d42] block">Moisture Re-test Request</span>
                    <span className="text-[11px] text-[#64748b]">Farmer disputed 13.8% reading</span>
                  </td>
                  <td className="py-3.5 px-3 text-[11px]">
                    <div><b>Farmer:</b> S. Ramalingam</div>
                    <div className="text-[#64748b]"><b>Buyer:</b> ITC Agri Business</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#97f5cc] text-[#002115]">
                      RESOLVED
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] text-[#005d42] font-semibold">12.8% Verified</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-xs text-[#64748b] italic">Settled to Buyer Satisfaction</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
