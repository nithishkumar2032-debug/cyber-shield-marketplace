'use client';

// Dynamic Freight & Logistics Recommender — Pan-India Corridor Calculator
// Prepared by Cyber Shield | SIH 26033
// Layout built to match Stitch Dynamic Freight & Logistics Recommender

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  MapPin,
  Scale,
  Navigation,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ThermometerSnowflake,
  Calculator,
  ChevronRight,
  Phone,
  Sparkles,
  Lock,
  Download,
  Share2,
  HelpCircle,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  calculateLogisticsCost,
  estimateDistanceKm,
  LOGISTICS_PARTNERS,
  VEHICLE_CONFIGS,
  CORRIDOR_DISTANCES,
} from '@/lib/logistics';
import { VehicleTypeConfig, LogisticsPartner, LogisticsCalculationResult } from '@/types';

export default function FreightPage() {
  const [origin, setOrigin] = useState<string>('Thanjavur, Tamil Nadu (Delta Hub)');
  const [destinationCity, setDestinationCity] = useState<string>('Bengaluru APMC Yard');
  const [distanceKm, setDistanceKm] = useState<number>(380);
  const [weightKg, setWeightKg] = useState<number>(25000);
  const [produceBasePrice, setProduceBasePrice] = useState<number>(24.5);
  const [isReefer, setIsReefer] = useState<boolean>(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Destinations available
  const DESTINATIONS = [
    { city: 'Chennai Central Warehouse', km: 340 },
    { city: 'Bengaluru APMC Yard', km: 380 },
    { city: 'Hyderabad Genome Valley Agri Hub', km: 680 },
    { city: 'Mumbai Bhiwandi Logistics Park', km: 1180 },
    { city: 'Delhi-NCR Kundli Cold Terminal', km: 2150 },
  ];

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = DESTINATIONS.find((d) => d.city === e.target.value);
    if (selected) {
      setDestinationCity(selected.city);
      setDistanceKm(selected.km);
    }
  };

  // Calculate dynamic logistics models
  const estimates = useMemo(() => {
    return calculateLogisticsCost(weightKg, distanceKm);
  }, [weightKg, distanceKm]);

  const recommended = estimates[0] || {
    vehicle: VEHICLE_CONFIGS[4],
    partner: LOGISTICS_PARTNERS[0],
    distanceKm: 380,
    baseCostInr: 32000,
    fuelSurchargeInr: 4500,
    tollChargesInr: 840,
    insuranceCoverInr: 1200,
    totalFreightInr: 38540,
    freightPerKgInr: 1.54,
    estimatedTransitHours: 10,
    co2EmissionsKg: 310,
    recommended: true,
  };

  const reeferAdjustment = isReefer ? 1.18 : 1.0;
  const freightTariffPerKg = Number((recommended.freightPerKgInr * reeferAdjustment).toFixed(2));
  const tollAndInsPerKg = 0.35;
  const totalLandedPerKg = Number((produceBasePrice + freightTariffPerKg + tollAndInsPerKg).toFixed(2));
  const totalShipmentFreight = Math.round(weightKg * freightTariffPerKg);
  const totalGrossShipmentVal = Math.round(weightKg * totalLandedPerKg);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Strategic Bar: Header & Protocol Badges */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-[#dae2fd]/60">
        <div className="flex flex-col max-w-3xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#e3dfff] text-[#100069] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#4e45d5]" /> AI DYNAMIC RATES
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#97f5cc] text-[#002115] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#005d42]" /> SIH 26033 CERTIFIED
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#e2e7ff] text-[#64748b] uppercase tracking-wider">
              NATIONAL LOGISTICS MATRIX
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-display text-[#131b2e] tracking-tight">
            Dynamic Freight & Logistics Recommender
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
            Compute accurate landed farm-to-warehouse transportation costs per kg, automatically match certified transporters, and integrate directly into sovereign B2B escrow.
          </p>
        </div>

        {/* Quick Action Secondary Buttons */}
        <div className="flex items-center gap-3 self-start lg:self-end">
          <button
            type="button"
            onClick={() => setActionSuccess('Waybill Specification PDF (ISO-9001 Format) generated and exported.')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] font-bold text-xs transition-all border border-[#dae2fd]"
          >
            <Download className="w-4 h-4 text-[#005d42]" />
            <span>Export Waybill Spec</span>
          </button>
          <Link
            href="/buyer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#005d42] text-white hover:bg-[#047857] font-bold text-xs shadow-md transition-all"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Freight in Escrow</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 bg-[#97f5cc]/50 text-[#002115] border border-[#005d42]/30 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#005d42] shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Calculator Inputs vs Real-Time Fleet & Route Synthesis */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Interactive Input Matrix (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 shadow-sm border border-[#e2e7ff] space-y-5">
            <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005d42]"></span>
                <h2 className="text-base font-bold font-display text-[#131b2e]">Transit Parameters</h2>
              </div>
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider font-mono">
                STANDARD ROUTE NODE
              </span>
            </div>

            {/* Origin */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e] flex items-center justify-between">
                <span>Origin Farm District / Mandi</span>
                <span className="text-[11px] text-[#005d42] font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> GPS Linked
                </span>
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-xs font-semibold border border-[#dae2fd] outline-none cursor-pointer"
              >
                <option>Thanjavur, Tamil Nadu (Delta Hub)</option>
                <option>Nashik, Maharashtra (Grape & Onion Cluster)</option>
                <option>Guntur, Andhra Pradesh (Spices Mandi)</option>
                <option>Karnal, Haryana (Basmati Clearing Terminal)</option>
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#131b2e] flex items-center justify-between">
                <span>Destination Terminal / Silo</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#e2e7ff] text-[#64748b] rounded">
                  {distanceKm} KM NH ROUTE
                </span>
              </label>
              <select
                value={destinationCity}
                onChange={handleDestinationChange}
                className="w-full h-11 px-3.5 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-xs font-semibold border border-[#dae2fd] outline-none cursor-pointer"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.city} value={d.city}>
                    {d.city} ({d.km} km)
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Distance Slider */}
            <div className="bg-[#f2f3ff] rounded-xl p-4 border border-[#dae2fd] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748b]">Calibrated Road Distance</span>
                <span className="text-base font-bold text-[#005d42] tabular-nums font-mono">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="10"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-[#005d42] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748b]">
                <span>50 km (Local)</span>
                <span>1,200 km</span>
                <span>2,500 km (Pan-India)</span>
              </div>
            </div>

            {/* Payload Weight Input & Quick Selects */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#131b2e]">Payload Metric Mass (Kg)</label>
                <span className="text-[11px] text-[#64748b]">Standardized Metric</span>
              </div>
              <div className="flex items-center bg-[#f2f3ff] rounded-xl overflow-hidden border border-[#dae2fd]">
                <span className="px-3.5 text-[#64748b] font-bold text-xs">KG</span>
                <input
                  type="number"
                  min="500"
                  max="50000"
                  step="500"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full h-11 px-2 bg-transparent text-[#131b2e] font-bold text-base outline-none tabular-nums"
                />
                <span className="px-3 text-[#64748b] text-xs font-mono bg-[#e2e7ff] py-3">
                  {(weightKg / 100).toFixed(0)} Quintal
                </span>
              </div>

              {/* Quick Payload Chips */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[1200, 7500, 15000, 25000].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeightKg(w)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                      weightKg === w
                        ? 'bg-[#005d42] text-white shadow-sm'
                        : 'bg-[#f2f3ff] text-[#64748b] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    {w.toLocaleString()} KG
                  </button>
                ))}
              </div>
            </div>

            {/* Perishable Reefer Protection Toggle */}
            <div className="bg-[#eaedff] p-4 rounded-xl border border-[#c3c0ff] flex items-start gap-3">
              <ThermometerSnowflake className="w-5 h-5 text-[#4e45d5] shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#131b2e]">Perishable Reefer Protection</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isReefer}
                      onChange={(e) => setIsReefer(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4e45d5]"></div>
                  </label>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  Perishable Cold Chain Protocol: Active climate cooling (+4°C to +8°C) with telematics temperature loggers (+18% tariff).
                </p>
              </div>
            </div>
          </div>

          {/* E-Way Highway Telemetry Card */}
          <div className="bg-[#f2f3ff] rounded-2xl p-5 border border-[#dae2fd] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                E-WAY HIGHWAY TELEMETRY
              </span>
              <span className="text-[10px] font-bold text-[#005d42] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005d42]"></span> FASTAG OPTIMIZED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#97f5cc] text-[#002115] flex items-center justify-center font-bold text-[10px]">
                  A
                </span>
                <div className="flex-1">
                  <span className="font-bold text-[#131b2e] block">{origin}</span>
                  <span className="text-[11px] text-[#64748b]">Gate Weighbridge Calibrated</span>
                </div>
                <span className="text-[11px] text-[#64748b] font-mono">KM 0</span>
              </div>

              <div className="ml-3 pl-4 h-3 border-l-2 border-dashed border-[#dae2fd]"></div>

              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#dae2fd] text-[#131b2e] flex items-center justify-center font-bold text-[10px]">
                  T
                </span>
                <div className="flex-1">
                  <span className="font-bold text-[#131b2e] block">FASTag Mandi Corridors (NH-44 / NH-83)</span>
                  <span className="text-[11px] text-[#64748b]">Auto-cleared via Logistics Transit Escrow</span>
                </div>
                <span className="text-[11px] text-[#64748b] font-mono">₹840 Toll</span>
              </div>

              <div className="ml-3 pl-4 h-3 border-l-2 border-dashed border-[#dae2fd]"></div>

              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#e3dfff] text-[#100069] flex items-center justify-center font-bold text-[10px]">
                  B
                </span>
                <div className="flex-1">
                  <span className="font-bold text-[#131b2e] block">{destinationCity}</span>
                  <span className="text-[11px] text-[#64748b]">Direct Cold-Dock Ingestion Node</span>
                </div>
                <span className="text-[11px] text-[#4e45d5] font-bold font-mono">{distanceKm} KM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Landed Cost Highlight & Transporter Selection (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* High Prominence Landed Cost Hero Summary Card */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e2e7ff] space-y-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#005d42]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f2f3ff] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#005d42] uppercase tracking-wider block">
                  DYNAMIC PROCUREMENT CALCULATION
                </span>
                <h3 className="text-lg font-bold font-display text-[#131b2e]">
                  Consolidated Landed Cost Breakdown
                </h3>
              </div>
              <div className="px-3 py-1.5 bg-[#f2f3ff] rounded-xl text-right border border-[#dae2fd]">
                <span className="text-[10px] text-[#64748b] block">Est. Transit Time</span>
                <span className="text-xs font-bold text-[#131b2e] font-mono">
                  {Math.round(distanceKm / 42)} hrs {((distanceKm % 42) * 1.4).toFixed(0)} mins
                </span>
              </div>
            </div>

            {/* Formula Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#f2f3ff] rounded-2xl border border-[#dae2fd]">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#64748b]">Produce Base</span>
                <span className="text-base font-bold text-[#131b2e] tabular-nums mt-0.5">
                  ₹{produceBasePrice.toFixed(2)}<span className="text-xs font-normal text-[#64748b]">/kg</span>
                </span>
                <span className="text-[10px] text-[#64748b] mt-0.5">Mandi Settlement</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-[#64748b]">Freight Tariff</span>
                <span className="text-base font-bold text-[#4e45d5] tabular-nums mt-0.5">
                  ₹{freightTariffPerKg.toFixed(2)}<span className="text-xs font-normal text-[#64748b]">/kg</span>
                </span>
                <span className="text-[10px] text-[#4e45d5] font-semibold mt-0.5">{recommended.vehicle.name}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-[#64748b]">Toll & Insurance</span>
                <span className="text-base font-bold text-[#131b2e] tabular-nums mt-0.5">
                  ₹{tollAndInsPerKg.toFixed(2)}<span className="text-xs font-normal text-[#64748b]">/kg</span>
                </span>
                <span className="text-[10px] text-[#64748b] mt-0.5">Govt Cargo Cover</span>
              </div>

              <div className="flex flex-col bg-[#97f5cc] p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-[#002115] uppercase">TOTAL LANDED</span>
                <span className="text-base font-bold text-[#002115] tabular-nums mt-0.5">
                  ₹{totalLandedPerKg.toFixed(2)}<span className="text-xs font-normal text-[#002115]/70">/kg</span>
                </span>
                <span className="text-[10px] text-[#002115]/80 mt-0.5">At Warehouse Dock</span>
              </div>
            </div>

            {/* Total Shipment Bottom Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-xs text-[#64748b] block">Gross Consignment Landed Valuation</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-bold font-display text-[#005d42] tabular-nums">
                    ₹{totalGrossShipmentVal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#64748b]">for {weightKg.toLocaleString()} kg</span>
                </div>
              </div>

              <div className="space-y-1 w-full sm:w-64">
                <div className="flex justify-between text-[10px] text-[#64748b] font-mono">
                  <span>Base (92%)</span>
                  <span>Freight (6.5%)</span>
                  <span>Ins. (1.5%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#dae2fd] rounded-full overflow-hidden flex">
                  <div className="bg-[#005d42] h-full" style={{ width: '92.5%' }}></div>
                  <div className="bg-[#4e45d5] h-full" style={{ width: '6.0%' }}></div>
                  <div className="bg-[#6860ef] h-full" style={{ width: '1.5%' }}></div>
                </div>
                <span className="text-[10px] text-[#64748b] block text-right">Escrow pre-allocation locked</span>
              </div>
            </div>
          </div>

          {/* Transporter Fast-Track Cards */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 shadow-sm border border-[#e2e7ff] space-y-4">
            <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
              <div>
                <h3 className="text-base font-bold font-display text-[#131b2e]">
                  Verified Mandi Transporters
                </h3>
                <p className="text-xs text-[#64748b]">
                  SIH Officer Verified Fleet operators with active Escrow Bonds
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#005d42] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> BOND SECURED
              </span>
            </div>

            <div className="space-y-3">
              {LOGISTICS_PARTNERS.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dae2fd] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:border-[#005d42] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#131b2e] text-sm">{p.name}</span>
                      <span className="px-2 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold">
                        ★ {p.rating}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded bg-[#e3dfff] text-[#100069] text-[10px] font-bold">
                          BEST FIT
                        </span>
                      )}
                    </div>
                    <div className="text-[#64748b] flex flex-wrap items-center gap-3 text-[11px]">
                      <span>{p.vehicleFleet.length} Vehicle Categories</span>
                      <span>•</span>
                      <span>HQ: {p.headquarters}</span>
                      <span>•</span>
                      <span className="font-mono text-[#131b2e]">{p.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#005d42] tabular-nums block">
                        ₹{(freightTariffPerKg * (1 + idx * 0.05)).toFixed(2)}/kg
                      </span>
                      <span className="text-[10px] text-[#64748b]">
                        Est. ₹{Math.round(totalShipmentFreight * (1 + idx * 0.05)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      href="/buyer"
                      className="px-4 py-2 rounded-xl bg-[#005d42] hover:bg-[#047857] text-white font-bold text-xs transition-colors shadow-sm whitespace-nowrap"
                    >
                      Assign Fleet
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
