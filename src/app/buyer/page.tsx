'use client';

// Registered B2B Buyer Portal — Institutional Tier-1 Escrow Clearing Hub
// Prepared by Cyber Shield | SIH 26033
// Layout updated to match Stitch Sovereign Agritech Design

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Building2,
  Lock,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Scale,
  Receipt,
  Sparkles,
  Calculator,
  Navigation,
  QrCode,
  Download,
  Share2,
  MapPin,
  Compass,
  CreditCard,
  Check,
  Send,
  Timer,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { LogisticsEstimatorModal } from '@/components/LogisticsEstimatorModal';
import { calculateLogisticsCost, estimateDistanceKm, LOGISTICS_PARTNERS, VEHICLE_CONFIGS } from '@/lib/logistics';
import { LogisticsPartner, VehicleTypeConfig, LogisticsCalculationResult } from '@/types';

export default function BuyerPage() {
  const {
    state,
    buyerAcceptAllocation,
    prepayEscrow,
    assignTransport,
    closeOrder,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'bids_orders' | 'transport' | 'receipts'>('bids_orders');

  // Currently logged-in buyer persona with SSR fallback
  const buyer = state?.buyers.find((b) => b.id === 'byr-1') || state?.buyers[0] || {
    id: 'byr-1',
    organizationName: 'ITC Agri Business',
    category: 'Company / Processor' as const,
    authorizedPurchaser: 'Rajiv Mathur',
    mobile: '+91 98402 33419',
    email: 'procurement@itcagri.in',
    address: 'ITC Corporate Procurement Hub - South Zone',
    deliveryState: 'Tamil Nadu',
    deliveryDistrict: 'Erode',
    businessRegistrationNumber: 'GSTIN: 33AAACI1681G1ZM',
    status: 'verified' as const,
    documents: [],
    createdAt: '2026-03-20',
  };
  const myBids = state?.bids.filter((b) => b.buyerId === buyer?.id) || [];
  const myAllocations = state?.allocations.filter((a) => a.buyerId === buyer?.id) || [];
  const myOrders = state?.orders.filter((o) => o.buyerId === buyer?.id) || [];
  const myEscrows = state?.escrows.filter((e) => myOrders.some((o) => o.id === e.orderId)) || [];

  // Action status message
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Transport Assignment Form State
  const [selectedOrderId, setSelectedOrderId] = useState<string>(myOrders[0]?.id || '');
  const [transportPartner, setTransportPartner] = useState<string>('Bharat Green Agro-Freight Solutions');
  const [vehicleNumber, setVehicleNumber] = useState<string>('TN-49-AB-2041');
  const [vehicleCapacityKg, setVehicleCapacityKg] = useState<number>(28000);
  const [driverName, setDriverName] = useState<string>('M. Murugan');
  const [driverPhone, setDriverPhone] = useState<string>('+91 94421 88204');
  const [driverDl, setDriverDl] = useState<string>('TN4920150004921');
  const [vehicleTareKg, setVehicleTareKg] = useState<number>(8450);
  const [estimatedArrival, setEstimatedArrival] = useState<string>('2026-09-20T14:30');

  // Dynamic Logistics & Freight Estimator State
  const [isEstimatorOpen, setIsEstimatorOpen] = useState<boolean>(false);
  const [destinationCity, setDestinationCity] = useState<string>('Perundurai Hub (Erode)');
  const [distanceKm, setDistanceKm] = useState<number>(245);
  const [vehicleType, setVehicleType] = useState<string>('10-Wheeler Taurus Truck (28 MT)');
  const [estimatedFreightInr, setEstimatedFreightInr] = useState<number>(52000);
  const [freightPerKgInr, setFreightPerKgInr] = useState<number>(2.08);

  // Escrow wallet simulated balance
  const [walletBalance, setWalletBalance] = useState<number>(4250000);

  // Derive active order details
  const activeOrder = myOrders.find((o) => o.id === selectedOrderId) || myOrders[0];
  const activeWeight = activeOrder?.confirmedQuantityKg || 25000;
  const activeEscrow = myEscrows.find((e) => e.orderId === activeOrder?.id);
  const activeTransport = state?.transports.find((t) => t.orderId === activeOrder?.id);
  const activePickup = state?.pickups.find((p) => p.orderId === activeOrder?.id);

  // Dynamic real-time calculation for active order payload
  const activeEstimates = useMemo(() => {
    return calculateLogisticsCost(activeWeight, distanceKm);
  }, [activeWeight, distanceKm]);
  const recommendedFit = activeEstimates[0];

  const handlePartnerSelected = (
    partner: LogisticsPartner,
    vehicle: VehicleTypeConfig,
    estimate: LogisticsCalculationResult
  ) => {
    setTransportPartner(partner.name);
    setVehicleCapacityKg(vehicle.maxPayloadKg);
    setVehicleType(vehicle.name);
    setVehicleNumber(
      `TN-${Math.floor(10 + Math.random() * 89)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`
    );
    setDriverName(`M. Murugan (${partner.name.split(' ')[0]} Fleet)`);
    setDriverPhone(partner.phone);
    setEstimatedFreightInr(estimate.totalFreightInr);
    setFreightPerKgInr(estimate.freightPerKgInr);
    setDistanceKm(estimate.distanceKm);

    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setHours(14, 30, 0, 0);
    setEstimatedArrival(tomorrow.toISOString().slice(0, 16));

    setActionMsg({
      type: 'success',
      text: `Selected verified partner "${partner.name}" (${vehicle.name})! Freight estimated at ₹${estimate.totalFreightInr.toLocaleString('en-IN')} (₹${estimate.freightPerKgInr}/kg). Dispatch parameters pre-filled.`,
    });
  };

  const handleAcceptTerms = async (allocationId: string) => {
    setActionMsg(null);
    const res = await buyerAcceptAllocation(allocationId);
    if (res.success) {
      setActionMsg({
        type: 'success',
        text: `Terms accepted! Order generated. Please prepay escrow funds to lock lot allocation.`,
      });
    } else {
      setActionMsg({ type: 'error', text: res.error || 'Failed to accept allocation.' });
    }
  };

  const handlePrepay = async (orderId: string) => {
    setActionMsg(null);
    const res = await prepayEscrow(orderId);
    if (res.success) {
      setWalletBalance((prev) => Math.max(0, prev - (activeOrder?.totalOrderAmount || 682000)));
      setActionMsg({
        type: 'success',
        text: `Escrow Prepayment of 100% Confirmed! ₹${(activeOrder?.totalOrderAmount || 682000).toLocaleString('en-IN')} locked in SBI Sovereign Agri Escrow Node. You may now assign transport.`,
      });
    } else {
      setActionMsg({ type: 'error', text: res.error || 'Prepayment failed.' });
    }
  };

  const handleAssignTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMsg(null);
    const res = await assignTransport(selectedOrderId, {
      transportPartner,
      vehicleNumber,
      vehicleCapacityKg,
      driverName,
      driverPhone,
      estimatedArrival,
      distanceKm,
      vehicleType,
      estimatedFreightCostInr: estimatedFreightInr,
      freightCostPerKgInr: freightPerKgInr,
    });
    if (res.success) {
      setActionMsg({
        type: 'success',
        text: `Smart Transport Registered! Single-use Pickup OTP: ${res.data.pickup.pickupOtp}. Driver Murugan can present this at the farm gate terminal.`,
      });
      setActiveTab('bids_orders');
    } else {
      setActionMsg({ type: 'error', text: res.error || 'Failed to assign transport.' });
    }
  };

  const handleClose = async (orderId: string) => {
    const res = await closeOrder(orderId);
    if (res.success) {
      setActionMsg({
        type: 'success',
        text: `Delivery verified and accepted at destination hub! Settlement closed and verified on ledger.`,
      });
    }
  };

  // Derive valuation breakdown
  const baseCropVal = activeOrder ? activeOrder.totalOrderAmount : 630000;
  const freightVal = estimatedFreightInr || 52000;
  const totalClearingVal = baseCropVal + freightVal;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Institutional Profile Banner */}
      <div className="w-full bg-[#ffffff] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e2e7ff] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#005d42]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#f2f3ff] border border-[#e2e7ff] flex items-center justify-center text-[#005d42] shadow-inner shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#131b2e] tracking-tight">
                {buyer.organizationName || 'ITC Agri Business'}
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#005d42]" /> Registered Buyer
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#e2e7ff] text-[#64748b] text-[11px] font-bold font-mono">
                GSTIN: 33AAACI1681G1ZM
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748b]">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#005d42]" /> {buyer.deliveryDistrict}, {buyer.deliveryState} Hub
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#4e45d5]" /> Portal Version 2.4
              </span>
              <span>•</span>
              <span>Purchaser: <b className="text-[#131b2e]">{buyer.authorizedPurchaser}</b></span>
            </div>
          </div>
        </div>

        {/* Live Escrow Vault Indicator */}
        <div className="bg-[#f2f3ff] border border-[#dae2fd] p-5 rounded-2xl flex items-center gap-5 min-w-[320px] justify-between shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#005d42] animate-pulse"></span>
              ESCROW WALLET BALANCE
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#005d42] tracking-tight tabular-nums mt-0.5">
              ₹{walletBalance.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#64748b] flex items-center gap-1 mt-0.5">
              <Lock className="w-3 h-3 text-[#4e45d5]" />
              SBI Escrow Account
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setWalletBalance((prev) => prev + 1000000);
              setActionMsg({
                type: 'success',
                text: 'Simulated replenishment: Added ₹10,00,000 into SBI Corporate Escrow Wallet.',
              });
            }}
            className="h-10 px-4 rounded-xl bg-[#dae2fd] hover:bg-[#c3c0ff] text-[#131b2e] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <CreditCard className="w-4 h-4 text-[#4e45d5]" />
            Add Funds
          </button>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-sm transition-all ${
            actionMsg.type === 'success'
              ? 'bg-[#97f5cc]/40 text-[#002115] border border-[#005d42]/30'
              : 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30'
          }`}
        >
          {actionMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#005d42] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Navigation Switch Tabs */}
      <div className="w-full bg-[#f2f3ff] p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1 border border-[#dae2fd]">
        <button
          onClick={() => setActiveTab('bids_orders')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'bids_orders'
              ? 'bg-[#ffffff] text-[#005d42] shadow-sm'
              : 'text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Active Bids & Confirmed Orders ({myOrders.length})</span>
          {myAllocations.some((a) => a.status === 'officer_confirmed') && (
            <span className="w-2 h-2 rounded-full bg-[#4e45d5] animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'transport'
              ? 'bg-[#ffffff] text-[#005d42] shadow-sm'
              : 'text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>2. Assign Transport & Logistics</span>
        </button>

        <button
          onClick={() => setActiveTab('receipts')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'receipts'
              ? 'bg-[#ffffff] text-[#005d42] shadow-sm'
              : 'text-[#64748b] hover:text-[#131b2e]'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>3. Banking Escrow Receipts & Audit ({myEscrows.length})</span>
        </button>
      </div>

      {/* TAB 1: Confirmed Order & Escrow Prepayment */}
      {activeTab === 'bids_orders' && (
        <section className="space-y-8">
          {/* Section: Pending Allocations awaiting Buyer Acceptance */}
          {myAllocations.filter((a) => a.status === 'officer_confirmed').length > 0 && (
            <div className="bg-[#fffbeb] rounded-2xl p-6 border border-[#fef3c7] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-amber-900 font-display">
                    Allocations Confirmed by Officer — Awaiting Your Acceptance
                  </h3>
                  <p className="text-xs text-amber-700 mt-0.5">
                    The farmer selected your bid, and the Agricultural Officer recorded telephonic confirmation. Review and accept terms to finalize your Purchase Order.
                  </p>
                </div>
                <span className="badge-escrow text-[10px] self-start sm:self-auto">OFFICER CONFIRMED</span>
              </div>

              <div className="space-y-3">
                {myAllocations
                  .filter((a) => a.status === 'officer_confirmed')
                  .map((alc) => {
                    const listing = state?.listings.find((l) => l.id === alc.listingId);
                    return (
                      <div
                        key={alc.id}
                        className="bg-[#ffffff] p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-[#131b2e] text-sm">
                            {listing?.crop} ({listing?.variety})
                          </div>
                          <div className="text-[#64748b]">
                            Volume: <b className="text-[#131b2e] tabular-nums">{alc.allocatedKg.toLocaleString()} kg</b> @ ₹{alc.agreedPricePerKg.toFixed(2)}/kg
                          </div>
                          <div className="text-[#005d42] font-bold tabular-nums">
                            Total Valuation: ₹{alc.totalOrderValue.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-[#64748b] italic">
                            Officer Telephonic Note: &quot;{alc.officerPhoneNotes}&quot;
                          </div>
                        </div>

                        <button
                          onClick={() => handleAcceptTerms(alc.id)}
                          className="px-5 py-2.5 rounded-xl bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          Accept Terms & Create Order
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Primary Batch Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: Order Details and Settlement Breakdown */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e2e7ff] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f2f3ff] pb-5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold font-display text-[#131b2e]">
                        Confirmed Lot: {activeOrder ? activeOrder.orderNumber : '#TN-THJ-9821'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#005d42]" /> OFFICER VERIFIED
                      </span>
                    </div>
                    <span className="text-xs text-[#64748b] mt-0.5">
                      Thanjavur Delta Cluster • Farmer: {activeOrder ? activeOrder.sellerName : 'S. Ramalingam (ID: IND-TN-78211)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#e2e7ff] text-[#131b2e] text-[11px] font-mono font-semibold">
                      Mandi ID: TN-THJ-04
                    </span>
                    <span className="px-2.5 py-1 rounded bg-[#e3dfff] text-[#100069] text-[11px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#4e45d5]" /> LIVE RATES
                    </span>
                  </div>
                </div>

                {/* Crop & Lot Specs Graphic Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd]">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">COMMODITY & GRADE</span>
                    <span className="text-base font-bold text-[#131b2e] mt-1">
                      {activeOrder ? activeOrder.crop : 'Paddy Co-51'}
                    </span>
                    <span className="text-xs text-[#005d42] font-semibold">
                      {activeOrder ? activeOrder.variety : 'Fine Grain (Grade-A)'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">HARVEST LOT SIZE</span>
                    <span className="text-base font-bold text-[#131b2e] tabular-nums mt-1">45,000 kg</span>
                    <span className="text-xs text-[#64748b]">Delta Basin Lot</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">CONTRACT TRANCHE</span>
                    <span className="text-base font-bold text-[#005d42] tabular-nums mt-1">
                      {activeWeight.toLocaleString()} kg
                    </span>
                    <span className="text-xs text-[#64748b]">Contracted Lot</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">LAB MOISTURE</span>
                    <span className="text-base font-bold text-[#131b2e] tabular-nums mt-1">12.8%</span>
                    <span className="text-xs text-[#005d42] font-semibold">Standard &lt; 14%</span>
                  </div>
                </div>

                {/* Detailed Cost Breakdown Table */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    PAYMENT BREAKDOWN
                  </span>
                  <div className="bg-[#ffffff] rounded-2xl overflow-hidden border border-[#e2e7ff] shadow-sm">
                    <div className="flex items-center justify-between py-2.5 px-4 bg-[#e2e7ff]/70 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                      <span>ITEM DESCRIPTION</span>
                      <span className="text-right">CALCULATION & SUB-TOTAL</span>
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 border-b border-[#f2f3ff]">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#131b2e]">Base Crop Procurement Value</span>
                        <span className="text-xs text-[#64748b]">
                          Standardized Metric Settlement: {activeWeight.toLocaleString()} kg @ ₹{(baseCropVal / activeWeight).toFixed(2)} / kg
                        </span>
                      </div>
                      <span className="text-base font-bold text-[#131b2e] tabular-nums">
                        ₹{baseCropVal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 bg-[#f2f3ff]/50 border-b border-[#f2f3ff]">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#131b2e]">
                          Transport Cost
                        </span>
                        <span className="text-xs text-[#64748b]">
                          Route: Thanjavur Mandi to {destinationCity} ({activeWeight.toLocaleString()} kg @ ₹{freightPerKgInr.toFixed(2)} / kg)
                        </span>
                      </div>
                      <span className="text-base font-bold text-[#131b2e] tabular-nums">
                        ₹{freightVal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 border-b border-[#f2f3ff]">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#131b2e]">Govt. Mandi Fee & Market Cess (0%)</span>
                        <span className="text-xs text-[#005d42] font-semibold">
                          Fee Waived
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#131b2e]">₹0.00</span>
                    </div>

                    <div className="flex items-center justify-between py-4 px-4 bg-[#eaedff] text-[#131b2e]">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Total Clearing & Escrow Release Amount
                        </span>
                        <span className="text-xs text-[#64748b]">
                          100% Pre-funded directly into SBI Sovereign Agri Escrow Node
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#005d42] tabular-nums">
                          ₹{totalClearingVal.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] font-bold text-[#64748b] tracking-wider uppercase">
                          TOTAL ESCROW AMOUNT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Field Verification Sample & Telemetry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="relative rounded-2xl overflow-hidden h-44 shadow-sm bg-[#e2e7ff]">
                    <img
                      className="w-full h-full object-cover"
                      alt="Harvested Paddy sample"
                      src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
                    />
                    <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-[#ffffff]/90 backdrop-blur text-[11px] font-bold text-[#131b2e] flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#005d42]" />
                      Sample Inspection TN-9821-A
                    </div>
                  </div>

                  <div className="bg-[#f2f3ff] border border-[#dae2fd] rounded-2xl p-5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        ESCROW GUARANTEE STATUS
                      </span>
                      <h4 className="text-base font-bold text-[#131b2e] font-display">Conditional Sovereign Release</h4>
                      <p className="text-xs text-[#64748b] leading-relaxed">
                        Funds are ring-fenced in SBI Escrow. No payout is permitted until Agricultural Officer approves final weighbridge scale readings.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-3">
                      <span className="px-2 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold">
                        STIPULATION MET
                      </span>
                      <span className="text-[11px] text-[#64748b] font-mono">
                        SECURE PAYMENT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Banking Escrow Prepayment Execution Console */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 shadow-sm border border-[#e2e7ff] space-y-6 sticky top-44">
                <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
                  <span className="text-xs font-bold text-[#4e45d5] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    DEMO BANKING ESCROW
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#64748b] text-[10px] font-mono font-bold">
                    CONTRACT: #ESC-2026-99214
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-[#64748b]">Escrow Fund Allocation</span>
                  <div className="text-3xl font-bold font-display text-[#131b2e] tabular-nums">
                    ₹{totalClearingVal.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-[#005d42] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Available Wallet: ₹{walletBalance.toLocaleString('en-IN')} (Sufficient)
                  </span>
                </div>

                <div className="w-full bg-[#f2f3ff] p-4 rounded-xl space-y-2 border border-[#dae2fd]">
                  <div className="flex justify-between items-center text-xs text-[#64748b]">
                    <span>Beneficiary 1 (Farmer)</span>
                    <span className="font-bold text-[#131b2e] font-mono">
                      ₹{baseCropVal.toLocaleString('en-IN')} ({( (baseCropVal / totalClearingVal) * 100 ).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#64748b]">
                    <span>Beneficiary 2 (Logistics)</span>
                    <span className="font-bold text-[#131b2e] font-mono">
                      ₹{freightVal.toLocaleString('en-IN')} ({( (freightVal / totalClearingVal) * 100 ).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#dae2fd] h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-[#005d42] h-full" style={{ width: `${(baseCropVal / totalClearingVal) * 100}%` }}></div>
                    <div className="bg-[#4e45d5] h-full" style={{ width: `${(freightVal / totalClearingVal) * 100}%` }}></div>
                  </div>
                </div>

                {/* Prepay Action Box */}
                <div className="space-y-3">
                  {activeEscrow?.status === 'held' ? (
                    <div className="p-4 rounded-xl bg-[#97f5cc]/50 text-[#002115] border border-[#005d42]/30 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#005d42]" /> Secured in Escrow
                      </div>
                      <p className="text-xs text-[#002115]/80">
                        ₹{activeEscrow.heldAmount.toLocaleString('en-IN')} locked under State Banking Protocol SIH 26033. Ready for transport dispatch.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePrepay(activeOrder ? activeOrder.id : 'ord-1')}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#005d42] hover:bg-[#047857] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Prepay 100% (₹{totalClearingVal.toLocaleString('en-IN')}) into Escrow</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsEstimatorOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#4e45d5] font-bold text-xs border border-[#c3c0ff] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Open Dynamic Logistics Recommender
                  </button>
                </div>

                {/* Settlement Conditions Checklist */}
                <div className="space-y-2 pt-2 border-t border-[#f2f3ff]">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    SETTLEMENT CONDITIONS PRE-REQUISITE
                  </span>
                  <ul className="space-y-2 text-xs text-[#64748b]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#005d42] shrink-0 mt-0.5" />
                      <span>Vehicle arrives within 500m geofenced perimeter.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#005d42] shrink-0 mt-0.5" />
                      <span>Tare & Gross weight verified on digital scale by AO.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-[#4e45d5] shrink-0 mt-0.5" />
                      <span>Instant RTGS disbursal upon weighment sign-off.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#f2f3ff] p-3 rounded-xl flex items-center gap-2.5 border border-[#dae2fd] text-xs text-[#64748b]">
                  <ShieldCheck className="w-4 h-4 text-[#005d42] shrink-0" />
                  <span>Secure Bank Escrow Protocol</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: Smart Transport Registration & Geofence Protocol */}
      {activeTab === 'transport' && (
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Cols: Vehicle & Driver Dispatch Registration */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e2e7ff] space-y-6">
                <div className="flex flex-col gap-1 border-b border-[#f2f3ff] pb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#131b2e]">
                      Smart Transport Dispatch
                    </h2>
                    <span className="px-2.5 py-0.5 rounded bg-[#e3dfff] text-[#100069] text-[10px] font-bold uppercase tracking-wider">
                      AI ROUTE ASSIGNED
                    </span>
                  </div>
                  <span className="text-xs text-[#64748b]">
                    Auto-configured via Cyber Shield Logistics Match Engine for Lot #{activeOrder ? activeOrder.orderNumber : 'TN-THJ-9821'}
                  </span>
                </div>

                <form onSubmit={handleAssignTransport} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        LOGISTICS PROVIDER
                      </label>
                      <input
                        type="text"
                        value={transportPartner}
                        onChange={(e) => setTransportPartner(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-semibold text-[#131b2e]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        CARRIER REGISTRATION NUMBER
                      </label>
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-mono font-bold text-[#131b2e]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        ASSIGNED DRIVER NAME
                      </label>
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs text-[#131b2e]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        DRIVER CONTACT PHONE
                      </label>
                      <input
                        type="text"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-mono text-[#131b2e]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        VEHICLE TARE RATING
                      </label>
                      <input
                        type="number"
                        value={vehicleTareKg}
                        onChange={(e) => setVehicleTareKg(Number(e.target.value))}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-mono text-[#131b2e]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        PAYLOAD CAPACITY (KG)
                      </label>
                      <input
                        type="number"
                        value={vehicleCapacityKg}
                        onChange={(e) => setVehicleCapacityKg(Number(e.target.value))}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] text-xs font-mono text-[#131b2e]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        TELEMATICS GPS
                      </label>
                      <div className="w-full h-11 px-3.5 rounded-xl bg-[#97f5cc]/50 border border-[#005d42]/30 text-xs font-bold text-[#002115] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#005d42] animate-ping"></span>
                        Live VTS Active
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 w-full py-3 px-6 rounded-xl bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Register & Transmit Dispatch To Farm Gate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEstimatorOpen(true)}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#4e45d5] font-bold text-xs border border-[#c3c0ff] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calculator className="w-4 h-4" />
                      Recalculate Freight
                    </button>
                  </div>
                </form>

                {/* Geofencing & Telematics Live Sensor Radar */}
                <div className="bg-[#f2f3ff] p-5 rounded-2xl border border-[#dae2fd] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5 uppercase tracking-wider">
                      <Navigation className="w-4 h-4 text-[#005d42]" />
                      GEOFENCE RADIAL VALIDATION PROTOCOL
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#64748b] text-[10px] font-mono font-bold">
                      500M RADIUS STRICT
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#ffffff] border border-[#e2e7ff] flex items-start gap-3 text-xs">
                    <ShieldCheck className="w-5 h-5 text-[#4e45d5] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#131b2e] block">Geofencing Interlock Active</span>
                      <span className="text-[#64748b]">
                        Vehicle must ping within 500m of Farm Coordinates (<span className="font-mono text-[#131b2e] font-semibold">Lat 10.7870° N, Long 79.1378° E</span>) to unlock electronic weighbridge scale logging on the AO Terminal.
                      </span>
                    </div>
                  </div>

                  {/* Satellite Farm Gate Badge */}
                  <div className="w-full h-32 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
                    <div className="text-center space-y-1">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-emerald-200 text-xs font-mono">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Farm Cluster #49 - Thanjavur South Gate
                      </div>
                      <p className="text-[11px] text-white/70">
                        GPS Telemetry Sync: 10.7870° N, 79.1378° E • Tolerance Window: ±12m
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Cryptographic Pickup Challenge Generation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e2e7ff] space-y-6 sticky top-44">
                <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
                  <h3 className="text-lg font-bold font-display text-[#131b2e]">Gate Authentication Token</h3>
                  <span className="px-2.5 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold font-mono">
                    AES-256 SIGNED
                  </span>
                </div>

                <p className="text-xs text-[#64748b] leading-relaxed">
                  Cryptographic Pickup Challenge must be presented by Driver {driverName} at the farm gate terminal prior to weighbridge scale access.
                </p>

                {/* 6-Digit Single-Use OTP Display */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd] space-y-2 text-center">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">
                    SINGLE-USE PICKUP OTP
                  </span>
                  <div className="flex items-center gap-2">
                    {(activePickup?.pickupOtp || '849201').split('').map((char, idx) => (
                      <span
                        key={idx}
                        className="w-10 h-12 rounded-xl bg-[#ffffff] border border-[#dae2fd] flex items-center justify-center text-xl font-bold text-[#005d42] shadow-sm font-mono"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-[#64748b] flex items-center gap-1 pt-1">
                    <Timer className="w-3.5 h-3.5 text-[#4e45d5]" /> Valid for 3 Hours 45 Min
                  </span>
                </div>

                {/* Driver Mobile QR Challenge Code Presentation */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#eaedff]/60 border border-[#dae2fd] space-y-3 text-center">
                  <div className="w-36 h-36 bg-[#ffffff] rounded-2xl p-3 shadow-sm border border-[#e2e7ff] flex items-center justify-center relative">
                    <QrCode className="w-full h-full text-[#131b2e]" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-7 h-7 rounded-lg bg-[#005d42] text-white flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#131b2e]">Driver Gate QR Challenge Code</span>
                    <span className="text-[11px] text-[#64748b]">
                      Push directly to Driver App ({driverName} {driverPhone})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActionMsg({
                        type: 'success',
                        text: `Token pushed to driver terminal (${driverPhone}) successfully via SMS & Cyber Shield Telematics App.`,
                      });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#4e45d5] hover:bg-[#6860ef] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transmit Token to Driver Terminal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: Banking Escrow Receipts & Audit Trail */}
      {activeTab === 'receipts' && (
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: State Machine Ledger & Timeline */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e2e7ff] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f2f3ff] pb-4">
                  <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#131b2e]">
                      Escrow State Machine Ledger
                    </h2>
                    <span className="text-xs text-[#64748b]">
                      Lot #{activeOrder ? activeOrder.orderNumber : 'TN-THJ-9821'} • Vault Contract #ESC-2026-99214
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold flex items-center gap-1 uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#005d42]" /> STATE CLEARING AGENT
                  </span>
                </div>

                {/* Timeline of Escrow States */}
                <div className="relative pl-6 space-y-6 py-2 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#dae2fd]">
                  {/* State 1 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-[#005d42] text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#131b2e]">
                        10:00 AM: Prepayment of ₹{totalClearingVal.toLocaleString('en-IN')} Held in Escrow
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold">
                        COMPLETED
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b]">
                      Direct debit authorized from {buyer.organizationName} SBI Corporate Vault. Total sum held under sovereign encumbrance ledger.
                    </p>
                    <span className="text-[11px] text-[#64748b] font-mono">TXN_ID: SBIN00293810291_ESC</span>
                  </div>

                  {/* State 2 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-[#005d42] text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#131b2e]">
                        02:15 PM: Vehicle Arrived at Farm Gate
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold">
                        COMPLETED
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b]">
                      Truck #{vehicleNumber} entered geofenced perimeter. Driver OTP challenge verified by Farm Gate Sentry.
                    </p>
                    <span className="text-[11px] text-[#64748b] font-mono">GEOFENCE_RADIUS: 142m from center-point</span>
                  </div>

                  {/* State 3 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-[#4e45d5] text-white flex items-center justify-center shadow-sm">
                      <Scale className="w-3 h-3" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#4e45d5]">
                        Pending: Official Scale Weight Entry in kg by AO & Driver Sign-off
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#e3dfff] text-[#100069] text-[10px] font-bold">
                        IN PROGRESS
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b]">
                      Agricultural Officer calibrating certified weighbridge platform for gross vs. tare net subtraction. Metric standard strictly in kilograms.
                    </p>
                  </div>

                  {/* State 4 */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-[#dae2fd] text-[#64748b] flex items-center justify-center">
                      <Clock className="w-3 h-3" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#64748b]">
                        Auto-Trigger: Instant Real-Time Farmer Bank Payout via UPI/RTGS
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#64748b] text-[10px] font-bold">
                        QUEUED
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b]">
                      Automated atomic settlement: Immediate UPI/RTGS disbursement to Farmer upon AO tare weight approval. No manual release needed.
                    </p>
                  </div>
                </div>

                {/* Live Settlement Ledger Preview Table */}
                <div className="space-y-2 pt-4">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    CRYPTOGRAPHIC SETTLEMENT LEDGER ROWS
                  </span>
                  <div className="w-full overflow-x-auto rounded-xl bg-[#f2f3ff] border border-[#dae2fd]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#e2e7ff] text-[#64748b] text-[11px] font-bold uppercase">
                        <tr>
                          <th className="py-2.5 px-4">TIMESTAMP</th>
                          <th className="py-2.5 px-4">EVENT HASH</th>
                          <th className="py-2.5 px-4">ACTOR</th>
                          <th className="py-2.5 px-4 text-right">METRIC / SUM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#dae2fd]/60 font-mono text-[11px] text-[#131b2e]">
                        <tr>
                          <td className="py-2.5 px-4">10:00:14 IST</td>
                          <td className="py-2.5 px-4 text-[#4e45d5]">0x8a92...b41c</td>
                          <td className="py-2.5 px-4">Buyer Escrow Deposit</td>
                          <td className="py-2.5 px-4 text-right font-bold text-[#005d42]">
                            ₹{totalClearingVal.toLocaleString('en-IN')}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4">14:15:22 IST</td>
                          <td className="py-2.5 px-4 text-[#4e45d5]">0x3f11...98ae</td>
                          <td className="py-2.5 px-4">Geofence Ping Event</td>
                          <td className="py-2.5 px-4 text-right">500m Lat 10.7870°</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4">PENDING</td>
                          <td className="py-2.5 px-4 text-[#64748b]">0x0000...0000</td>
                          <td className="py-2.5 px-4">Tare Scale Sync</td>
                          <td className="py-2.5 px-4 text-right text-[#64748b]">{activeWeight.toLocaleString()} kg (Est)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Certified Escrow Audit Certificate */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 shadow-sm border border-[#e2e7ff] space-y-5 sticky top-44">
                <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
                  <h3 className="text-base font-bold font-display text-[#131b2e]">Escrow Certificate</h3>
                  <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#64748b] text-[10px] font-bold">
                    GOV-ISO CERTIFIED
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-7 h-7 text-[#005d42]" />
                    <div>
                      <span className="text-xs font-bold text-[#131b2e] block">
                        Official Escrow Agreement #ESC-99214.pdf
                      </span>
                      <span className="text-[11px] text-[#64748b]">
                        Digitally Signed by Cyber Shield Escrow Node
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 text-xs text-[#64748b]">
                    <div className="flex justify-between">
                      <span>Parties:</span>
                      <span className="font-semibold text-[#131b2e]">{buyer.organizationName} & Seller</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Regulator:</span>
                      <span className="font-semibold text-[#131b2e]">Agri Officer (Thanjavur)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escrow Agent:</span>
                      <span className="font-semibold text-[#131b2e]">SBI Agri Escrow Clearing</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActionMsg({
                      type: 'success',
                      text: 'Escrow Certificate #ESC-99214.pdf generated with digital sovereign signature stamp.',
                    });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#005d42] hover:bg-[#047857] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Agreement PDF</span>
                </button>

                <div className="p-4 rounded-xl bg-[#e3dfff]/40 border border-[#c3c0ff] space-y-1">
                  <span className="text-[10px] font-bold text-[#100069] flex items-center gap-1 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    SMART DISBURSEMENT GUARANTEE
                  </span>
                  <p className="text-xs text-[#64748b]">
                    Under Government of India SIH-26033 rules, funds deposited in Escrow cannot be unilaterally recalled while vehicle is at the loading gate.
                  </p>
                </div>

                {/* Agricultural Mandi Officer Verification Stamp */}
                <div className="border-2 border-dashed border-[#bdc9c1] p-4 rounded-xl flex items-center justify-between bg-[#ffffff]">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider">
                      Officer Digital Seal
                    </span>
                    <span className="text-xs font-bold text-[#131b2e]">Dr. Rajesh Kumar, AO</span>
                    <span className="text-[11px] text-[#64748b]">Govt of Tamil Nadu Dept. of Agri</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#97f5cc] flex items-center justify-center text-[#005d42]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Logistics Estimator Modal */}
      <LogisticsEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        initialCrop={activeOrder ? `${activeOrder.crop} (${activeOrder.variety})` : 'Paddy Co-51'}
        initialWeightKg={activeWeight}
        initialOrigin={buyer.deliveryDistrict || 'Thanjavur'}
        unitPricePerKg={25.2}
        onSelectPartner={handlePartnerSelected}
      />
    </div>
  );
}
