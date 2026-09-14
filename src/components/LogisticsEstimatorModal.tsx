'use client';

import React, { useState, useMemo } from 'react';
import {
  Truck,
  X,
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
} from 'lucide-react';
import {
  VEHICLE_CONFIGS,
  LOGISTICS_PARTNERS,
  CORRIDOR_DISTANCES,
  estimateDistanceKm,
  calculateLogisticsCost,
} from '@/lib/logistics';
import { VehicleTypeConfig, LogisticsPartner, LogisticsCalculationResult } from '@/types';

interface LogisticsEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeightKg?: number;
  initialOrigin?: string;
  initialCrop?: string;
  unitPricePerKg?: number;
  onSelectPartner?: (partner: LogisticsPartner, vehicle: VehicleTypeConfig, estimate: LogisticsCalculationResult) => void;
}

export function LogisticsEstimatorModal({
  isOpen,
  onClose,
  initialWeightKg = 2500,
  initialOrigin = 'Thanjavur',
  initialCrop = 'Paddy (Co-51)',
  unitPricePerKg = 22,
  onSelectPartner,
}: LogisticsEstimatorModalProps) {
  const [origin, setOrigin] = useState<string>(initialOrigin);
  const [destination, setDestination] = useState<string>('Chennai');
  const [customDistance, setCustomDistance] = useState<number>(() => estimateDistanceKm(initialOrigin, 'Chennai'));
  const [payloadKg, setPayloadKg] = useState<number>(initialWeightKg);
  const [cropName, setCropName] = useState<string>(initialCrop);
  const [isPerishable, setIsPerishable] = useState<boolean>(() => {
    const low = initialCrop.toLowerCase();
    return low.includes('banana') || low.includes('tomato') || low.includes('fruit') || low.includes('vegetable');
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Handle origin or destination change to update estimated distance
  const handleOriginChange = (val: string) => {
    setOrigin(val);
    setCustomDistance(estimateDistanceKm(val, destination));
  };

  const handleDestinationChange = (val: string) => {
    setDestination(val);
    setCustomDistance(estimateDistanceKm(origin, val));
  };

  // Run dynamic calculation
  const calculationResults = useMemo(() => {
    return calculateLogisticsCost(payloadKg, customDistance, selectedVehicleId || undefined, isPerishable);
  }, [payloadKg, customDistance, selectedVehicleId, isPerishable]);

  const bestFitEstimate = calculationResults[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Dynamic Freight & Logistics Recommender</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/40">
                  AI Dynamic Rates
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Accurate freight calculations and verified transport partners based on payload, distance & vehicle category.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Farm Origin:
              </label>
              <select
                value={origin}
                onChange={(e) => handleOriginChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-purple-600"
              >
                <option value="Thanjavur">Thanjavur, Tamil Nadu (Paddy/Coconut)</option>
                <option value="Nashik">Nashik, Maharashtra (Onions/Grapes)</option>
                <option value="Guntur">Guntur, Andhra Pradesh (Chillies)</option>
                <option value="Karnal">Karnal, Haryana (Wheat/Basmati)</option>
                <option value="Shimla">Shimla, Himachal Pradesh (Apples)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-purple-600" /> Destination City:
              </label>
              <select
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-purple-600"
              >
                <option value="Chennai">Chennai, Tamil Nadu</option>
                <option value="Bengaluru">Bengaluru, Karnataka</option>
                <option value="Coimbatore">Coimbatore, Tamil Nadu</option>
                <option value="Madurai">Madurai, Tamil Nadu</option>
                <option value="Hyderabad">Hyderabad, Telangana</option>
                <option value="Mumbai">Mumbai, Maharashtra</option>
                <option value="Delhi-NCR">Delhi-NCR (North Mandis)</option>
                <option value="Kolkata">Kolkata, West Bengal</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-600" /> Payload (kg):
              </label>
              <input
                type="number"
                min={100}
                max={50000}
                step={50}
                value={payloadKg}
                onChange={(e) => setPayloadKg(Math.max(50, Number(e.target.value)))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                <span>Distance:</span>
                <span className="font-bold text-purple-700">{customDistance} km</span>
              </label>
              <input
                type="range"
                min={15}
                max={2500}
                step={10}
                value={customDistance}
                onChange={(e) => setCustomDistance(Number(e.target.value))}
                className="w-full accent-purple-700 mt-2"
              />
            </div>
          </div>

          {/* Perishable & Quick Options */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={isPerishable}
                onChange={(e) => setIsPerishable(e.target.checked)}
                className="rounded text-purple-700 focus:ring-purple-600 w-4 h-4"
              />
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600" />
                Perishable Crop (Recommend Reefer Cold-Chain)
              </span>
            </label>

            {unitPricePerKg > 0 && (
              <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Crop Base: <b>₹{unitPricePerKg}/kg</b></span>
                {bestFitEstimate && (
                  <>
                    <span>+ Freight: <b>₹{bestFitEstimate.freightPerKgInr}/kg</b></span>
                    <span>= Landed: <b className="text-emerald-950 font-black">₹{(unitPricePerKg + bestFitEstimate.freightPerKgInr).toFixed(2)}/kg</b></span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Vehicle Recommendations List */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Recommended Vehicle Configurations ({calculationResults.length} options)</span>
              <span className="text-[11px] font-normal text-slate-500">Sorted by best fit for {payloadKg} kg payload</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calculationResults.map((result) => {
                const isOverloaded = payloadKg > result.vehicle.maxPayloadKg;
                const isOptimal = !isOverloaded && payloadKg >= result.vehicle.maxPayloadKg * 0.4;

                return (
                  <div
                    key={result.vehicle.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isOptimal
                        ? 'border-purple-300 bg-purple-50/40 shadow-sm ring-1 ring-purple-200'
                        : isOverloaded
                        ? 'border-rose-200 bg-rose-50/20 opacity-75'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{result.vehicle.name}</h4>
                          {isOptimal && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                              Best Fit
                            </span>
                          )}
                          {isOverloaded && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                              Exceeds Payload
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{result.vehicle.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-black text-purple-900">
                          ₹{result.totalFreightInr.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-lg inline-block">
                          ₹{result.freightPerKgInr} / kg
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown pills */}
                    <div className="grid grid-cols-4 gap-1.5 bg-white/80 p-2 rounded-xl border border-slate-200 text-[10px] mb-3">
                      <div>
                        <div className="text-slate-400">Base Fare</div>
                        <div className="font-bold text-slate-800">₹{result.baseFare}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Distance ({result.distanceKm} km)</div>
                        <div className="font-bold text-slate-800">₹{result.distanceFare}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Toll / Permit</div>
                        <div className="font-bold text-slate-800">₹{result.tollSurcharge}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Loading/Labor</div>
                        <div className="font-bold text-slate-800">₹{result.loadingUnloadingFare}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                      <span className="flex items-center gap-1 font-medium">
                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                        Rated: <b>{result.vehicle.maxPayloadKg.toLocaleString()} kg</b> ({(payloadKg / result.vehicle.maxPayloadKg * 100).toFixed(0)}% used)
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Est. Transit: <b>~{result.estimatedTransitHours} hrs</b>
                      </span>
                    </div>

                    {/* Suggested Partners for this vehicle */}
                    {result.suggestedPartners.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Available Verified Partners ({result.suggestedPartners.length}):
                        </div>
                        {result.suggestedPartners.slice(0, 2).map((partner) => (
                          <div
                            key={partner.id}
                            className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors"
                          >
                            <div>
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                {partner.name}
                                {partner.verifiedBadge && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" />
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                ★ {partner.rating} ({partner.reviewCount} reviews) • {partner.headquarters}
                              </div>
                            </div>

                            {onSelectPartner && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectPartner(partner, result.vehicle, result);
                                  onClose();
                                }}
                                className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1 transition-all"
                              >
                                <span>Select</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All estimates include mandatory transit insurance & GPS live gate tracking.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
