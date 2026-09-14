'use client';

// Registered B2B Buyer Portal
// Prepared by Cyber Shield | SIH 26033

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

  // Currently logged-in buyer persona
  const buyer = state?.buyers.find((b) => b.id === 'byr-1') || state?.buyers[0];
  const myBids = state?.bids.filter((b) => b.buyerId === buyer?.id) || [];
  const myAllocations = state?.allocations.filter((a) => a.buyerId === buyer?.id) || [];
  const myOrders = state?.orders.filter((o) => o.buyerId === buyer?.id) || [];
  const myEscrows = state?.escrows.filter((e) => myOrders.some((o) => o.id === e.orderId)) || [];

  // Action status message
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Transport Assignment Form State
  const [selectedOrderId, setSelectedOrderId] = useState<string>(myOrders[0]?.id || '');
  const [transportPartner, setTransportPartner] = useState<string>('Express Agri Logistics Pvt Ltd');
  const [vehicleNumber, setVehicleNumber] = useState<string>('TN-04-AB-9821');
  const [vehicleCapacityKg, setVehicleCapacityKg] = useState<number>(3000);
  const [driverName, setDriverName] = useState<string>('Selvam Murugesan');
  const [driverPhone, setDriverPhone] = useState<string>('+91 97891 02931');
  const [estimatedArrival, setEstimatedArrival] = useState<string>('2026-09-19T10:00');

  // Dynamic Logistics & Freight Estimator State
  const [isEstimatorOpen, setIsEstimatorOpen] = useState<boolean>(false);
  const [destinationCity, setDestinationCity] = useState<string>('Chennai');
  const [distanceKm, setDistanceKm] = useState<number>(340);
  const [vehicleType, setVehicleType] = useState<string>('Mahindra Bolero Maxi Truck');
  const [estimatedFreightInr, setEstimatedFreightInr] = useState<number>(10960);
  const [freightPerKgInr, setFreightPerKgInr] = useState<number>(4.38);

  // Derive active order details
  const activeOrder = myOrders.find((o) => o.id === selectedOrderId) || myOrders[0];
  const activeWeight = activeOrder?.confirmedQuantityKg || 2500;

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
    setDriverName(`S. Murugan (${partner.name.split(' ')[0]} Fleet)`);
    setDriverPhone(partner.phone);
    setEstimatedFreightInr(estimate.totalFreightInr);
    setFreightPerKgInr(estimate.freightPerKgInr);
    setDistanceKm(estimate.distanceKm);

    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setHours(10, 0, 0, 0);
    setEstimatedArrival(tomorrow.toISOString().slice(0, 16));

    setActionMsg({
      type: 'success',
      text: `Selected verified partner "${partner.name}" (${vehicle.name})! Freight estimated at ₹${estimate.totalFreightInr.toLocaleString('en-IN')} (₹${estimate.freightPerKgInr}/kg). Form details pre-filled.`,
    });
  };

  const handleAcceptTerms = async (allocationId: string) => {
    setActionMsg(null);
    const res = await buyerAcceptAllocation(allocationId);
    if (res.success) {
      setActionMsg({
        type: 'success',
        text: `Terms accepted! Order created. Please prepay funds into banking partner escrow before goods release.`,
      });
    } else {
      setActionMsg({ type: 'error', text: res.error || 'Failed to accept allocation.' });
    }
  };

  const handlePrepay = async (orderId: string) => {
    setActionMsg(null);
    const res = await prepayEscrow(orderId);
    if (res.success) {
      setActionMsg({
        type: 'success',
        text: `Simulated Escrow Prepayment Confirmed! Funds are held safely. You may now assign transport.`,
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
        text: `Transport registered! Single-use Pickup OTP generated: ${res.data.pickup.pickupOtp}. Driver can present this at farm gate.`,
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
        text: `Delivery confirmed at destination warehouse! Order closed.`,
      });
    }
  };

  if (!buyer) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-800/80 border border-purple-500/40 flex items-center justify-center text-white font-bold shadow-md">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {buyer.organizationName}
              </h1>
              <span className="badge-verified text-[11px]">
                {buyer.status.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-purple-200/90 mt-1 flex flex-wrap items-center gap-3">
              <span>Category: <b>{buyer.category}</b></span>
              <span>•</span>
              <span>Purchaser: <b>{buyer.authorizedPurchaser}</b></span>
              <span>•</span>
              <span>Delivery District: <b>{buyer.deliveryDistrict}, {buyer.deliveryState}</b></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/explore"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Browse India-Wide Crops
          </Link>
          <Link
            href="/bids"
            className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs border border-purple-600 shadow-md transition-colors"
          >
            Place New Bid
          </Link>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-sm ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {actionMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bids_orders')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'bids_orders'
              ? 'border-purple-700 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Bids & Orders ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('transport')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'transport'
              ? 'border-purple-700 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Assign Transport & Vehicle
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'receipts'
              ? 'border-purple-700 text-purple-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Simulated Escrow Receipts ({myEscrows.length})
        </button>
      </div>

      {/* Tab: Bids & Orders */}
      {activeTab === 'bids_orders' && (
        <div className="space-y-6">
          {/* Section: Pending Allocations awaiting Buyer Acceptance */}
          {myAllocations.filter((a) => a.status === 'officer_confirmed').length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-amber-900">
                    Allocations Confirmed by Officer — Awaiting Your Acceptance
                  </h3>
                  <p className="text-xs text-amber-700">
                    The farmer selected your bid, and the Agricultural Officer has telephonically confirmed the terms. Please review and accept to generate your purchase order.
                  </p>
                </div>
                <span className="badge-demo text-[10px] py-0 px-2">FINAL STEP</span>
              </div>

              <div className="space-y-3">
                {myAllocations
                  .filter((a) => a.status === 'officer_confirmed')
                  .map((alc) => {
                    const listing = state?.listings.find((l) => l.id === alc.listingId);
                    return (
                      <div
                        key={alc.id}
                        className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {listing?.crop} ({listing?.variety})
                          </div>
                          <div className="text-slate-600">
                            Confirmed Volume: <b>{alc.allocatedKg} kg</b> @ ₹{alc.agreedPricePerKg.toFixed(2)}/kg
                          </div>
                          <div className="text-emerald-700 font-bold mt-0.5">
                            Total Order Amount: ₹{alc.totalOrderValue.toLocaleString()}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-1">
                            Officer Note: {alc.officerPhoneNotes}
                          </div>
                        </div>

                        <button
                          onClick={() => handleAcceptTerms(alc.id)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-sm whitespace-nowrap"
                        >
                          Accept Terms & Create Order
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Section: Orders */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Procurement Orders</h3>
                <p className="text-xs text-slate-500">
                  Prepay escrow, view seller contact info, assign logistics, and track handover.
                </p>
              </div>
              <span className="badge-demo text-[10px] py-0 px-2">ESCROW SECURED</span>
            </div>

            <div className="space-y-4">
              {myOrders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No active orders yet. Orders appear after you accept officer-confirmed allocations.
                </div>
              ) : (
                myOrders.map((ord) => {
                  const escrow = myEscrows.find((e) => e.orderId === ord.id);
                  const transport = state?.transports.find((t) => t.orderId === ord.id);
                  const pickup = state?.pickups.find((p) => p.orderId === ord.id);

                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div>
                          <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                            {ord.orderNumber}
                          </span>
                          <span className="font-bold text-slate-800 ml-2">
                            {ord.confirmedQuantityKg} kg of {ord.crop} ({ord.variety})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">
                            ₹{ord.totalOrderAmount.toLocaleString()}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === 'paid' || ord.status === 'closed'
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

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Seller Contact Info (Revealed after confirmation) */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px]">Seller & Pickup Contact</span>
                          <div className="font-bold text-slate-900 mt-0.5">{ord.sellerName}</div>
                          <div className="text-emerald-700 font-semibold mt-1">
                            Phone: {ord.sellerPhone || '+91 94432 10982'}
                          </div>
                        </div>

                        {/* Escrow Status & Action */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Banking Partner Escrow</span>
                            <div className="font-bold text-slate-900 mt-0.5">
                              {escrow?.status === 'held' ? (
                                <span className="text-emerald-700">₹{escrow.heldAmount.toLocaleString()} Held</span>
                              ) : escrow?.status === 'released' ? (
                                <span className="text-emerald-700">Settled to Seller</span>
                              ) : (
                                <span className="text-amber-700">Payment Pending</span>
                              )}
                            </div>
                          </div>

                          {ord.status === 'awaiting_payment' && (
                            <button
                              onClick={() => handlePrepay(ord.id)}
                              className="mt-2 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors"
                            >
                              Prepay into Escrow (Demo)
                            </button>
                          )}
                        </div>

                        {/* Transport Assignment Status */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Logistics Assignment</span>
                            {transport ? (
                              <div className="mt-0.5">
                                <div className="font-bold text-slate-900">{transport.vehicleNumber}</div>
                                <div className="text-slate-600 text-[11px]">
                                  {transport.driverName} ({transport.driverPhone})
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-400 mt-0.5">Vehicle not yet assigned</div>
                            )}
                          </div>

                          {ord.status === 'secured' && !transport && (
                            <button
                              onClick={() => {
                                setSelectedOrderId(ord.id);
                                setActiveTab('transport');
                              }}
                              className="mt-2 py-1.5 px-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] transition-colors"
                            >
                              Assign Vehicle
                            </button>
                          )}

                          {ord.status === 'paid' && (
                            <button
                              onClick={() => handleClose(ord.id)}
                              className="mt-2 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] transition-colors"
                            >
                              Confirm Arrival & Close Order
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Pickup OTP if ready */}
                      {pickup && (
                        <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-700" />
                            <span>
                              Driver Handover OTP: <b className="font-mono text-sm tracking-widest text-emerald-900">{pickup.pickupOtp}</b>
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-800 font-medium">
                            Give this code to your driver to present at the farm gate
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Assign Transport */}
      {activeTab === 'transport' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Buyer-Arranged Transport Registration</h3>
            <p className="text-xs text-slate-500">
              Link the transportation partner, vehicle capacity, driver contact, and arrival schedule.
            </p>
          </div>

          <form onSubmit={handleAssignTransport} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Order:</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-600"
              >
                {myOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} — {o.crop} ({o.confirmedQuantityKg} kg) (Status: {o.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Smart Logistics Recommender & Real-Time Freight Calculator Card */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white rounded-2xl p-4 sm:p-5 border border-purple-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                      Smart Logistics Partner Recommender
                      <span className="text-[9px] font-black uppercase tracking-wider bg-purple-200/80 text-purple-900 px-1.5 py-0.5 rounded">
                        Dynamic AI Rates
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Payload: <b className="text-purple-950">{activeWeight.toLocaleString()} kg</b> • Farm Origin: <b>Thanjavur, TN</b>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEstimatorOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-100/70 text-purple-900 font-bold text-xs border border-purple-300 shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <Calculator className="w-3.5 h-3.5 text-purple-700" />
                  <span>Full Freight Calculator</span>
                  <ChevronRight className="w-3 h-3 text-purple-600" />
                </button>
              </div>

              {/* Corridor & Quick Live Estimate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Delivery Destination:
                  </label>
                  <select
                    value={destinationCity}
                    onChange={(e) => {
                      const city = e.target.value;
                      setDestinationCity(city);
                      setDistanceKm(estimateDistanceKm('Thanjavur', city));
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Chennai">Chennai, TN (~340 km)</option>
                    <option value="Bengaluru">Bengaluru, KA (~410 km)</option>
                    <option value="Coimbatore">Coimbatore, TN (~270 km)</option>
                    <option value="Madurai">Madurai, TN (~185 km)</option>
                    <option value="Hyderabad">Hyderabad, TS (~910 km)</option>
                    <option value="Mumbai">Mumbai, MH (~1380 km)</option>
                  </select>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended Vehicle
                  </div>
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {recommendedFit?.vehicle.name || 'Bolero Maxi Truck'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Cap: {recommendedFit?.vehicle.maxPayloadKg.toLocaleString()} kg • ~{recommendedFit?.estimatedTransitHours}h transit
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-purple-200/80 flex flex-col justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                    Est. Dynamic Freight
                  </div>
                  <div className="text-sm sm:text-base font-black text-purple-900">
                    ₹{recommendedFit?.totalFreightInr.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] font-bold text-purple-700 font-sans">
                      (₹{recommendedFit?.freightPerKgInr}/kg)
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Partners Chips (1-Click Auto-Fill) */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Suggested Verified Partners for {activeWeight} kg ({destinationCity}):</span>
                  <span className="text-purple-700 font-semibold cursor-pointer hover:underline" onClick={() => setIsEstimatorOpen(true)}>
                    Compare All 5 Partners →
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LOGISTICS_PARTNERS.slice(0, 2).map((partner) => (
                    <div
                      key={partner.id}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 flex items-center justify-between gap-2 shadow-2xs transition-all"
                    >
                      <div className="truncate">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1 truncate">
                          {partner.name}
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ★ {partner.rating} • Insurance Included
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (recommendedFit) {
                            handlePartnerSelected(partner, recommendedFit.vehicle, recommendedFit);
                          }
                        }}
                        className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-[10px] shrink-0 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-Fill</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transport Partner:</label>
                <input
                  type="text"
                  value={transportPartner}
                  onChange={(e) => setTransportPartner(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Category & Model:</label>
                <input
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="e.g. Mahindra Bolero Maxi Truck"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Plate Number:</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Freight Cost (INR):</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={estimatedFreightInr}
                    onChange={(e) => {
                      const cost = Number(e.target.value);
                      setEstimatedFreightInr(cost);
                      setFreightPerKgInr(Number((cost / activeWeight).toFixed(2)));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-purple-950"
                  />
                  <div className="bg-purple-50 text-purple-800 border border-purple-200 rounded-xl px-2.5 py-2 font-bold text-[11px] shrink-0">
                    ₹{freightPerKgInr}/kg
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Driver / Collector Name:</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Driver Phone Number:</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Capacity (kg):</label>
                <input
                  type="number"
                  value={vehicleCapacityKg}
                  onChange={(e) => setVehicleCapacityKg(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Arrival at Farm Gate:</label>
                <input
                  type="datetime-local"
                  value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Register Transport & Generate Handover OTP</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: Simulated Escrow Receipts */}
      {activeTab === 'receipts' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Banking Partner Escrow Transaction Receipts
              </h3>
              <p className="text-xs text-slate-500">
                Audit trail of simulated fund receipts, holds, and settlement releases.
              </p>
            </div>
            <span className="badge-demo text-[10px] py-0 px-2">DEMO BANKING LEDGER</span>
          </div>

          <div className="space-y-4">
            {myEscrows.map((esc) => (
              <div
                key={esc.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-mono font-bold text-slate-800">{esc.paymentReference}</span>
                  <span className="badge-demo text-[10px] py-0 px-1.5">
                    {esc.simulationBadge}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Held Amount</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      ₹{esc.heldAmount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status</span>
                    <span className="font-bold text-emerald-700 uppercase">{esc.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Funded Timestamp</span>
                    <span className="text-slate-700">{esc.fundedAt ? new Date(esc.fundedAt).toLocaleDateString() : 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Settlement Date</span>
                    <span className="text-slate-700">{esc.settledAt ? new Date(esc.settledAt).toLocaleDateString() : 'Held until pickup'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Full Logistics & Dynamic Freight Estimator Modal */}
      <LogisticsEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        initialWeightKg={activeWeight}
        initialOrigin="Thanjavur"
        initialCrop={activeOrder?.crop || 'Paddy (Co-51)'}
        unitPricePerKg={activeOrder?.agreedPricePerKg || 22}
        onSelectPartner={handlePartnerSelected}
      />
    </div>
  );
}
