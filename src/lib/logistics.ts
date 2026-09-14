// Logistics & Dynamic Freight Cost Engine
// Prepared by Cyber Shield | SIH 26033
// Provides dynamic freight calculations and verified logistics partner recommendations based on distance, payload, and vehicle type.

import type { VehicleTypeConfig, LogisticsPartner, LogisticsCalculationResult } from '@/types';

export const VEHICLE_CONFIGS: VehicleTypeConfig[] = [
  {
    id: 'mini-truck',
    name: 'Tata Ace / Mini Truck',
    category: 'Mini Truck',
    maxPayloadKg: 1200,
    baseFareInr: 1200,
    ratePerKmInr: 18,
    minDistanceKm: 15,
    tollSurchargePerKmInr: 1.5,
    loadingUnloadingChargeInr: 500,
    suitableCrops: ['Tomato', 'Onion', 'Banana', 'Green Chillies', 'Vegetables'],
    description: 'Optimal for small lot pickups, farm-to-mandi, and local inter-taluka distribution (up to 1.2 Tonne).',
  },
  {
    id: 'pickup-maxi',
    name: 'Mahindra Bolero Maxi Truck',
    category: 'Pickup',
    maxPayloadKg: 2500,
    baseFareInr: 2000,
    ratePerKmInr: 24,
    minDistanceKm: 25,
    tollSurchargePerKmInr: 2.5,
    loadingUnloadingChargeInr: 800,
    suitableCrops: ['Paddy', 'Wheat', 'Coconut', 'Turmeric', 'Pulses'],
    description: 'Reliable rural farm-gate access with 2.5 Tonne payload capacity and rugged suspension.',
  },
  {
    id: 'icv-14ft',
    name: 'Eicher Pro 14ft - 19ft (ICV)',
    category: 'Light Commercial',
    maxPayloadKg: 7500,
    baseFareInr: 4500,
    ratePerKmInr: 34,
    minDistanceKm: 50,
    tollSurchargePerKmInr: 4.5,
    loadingUnloadingChargeInr: 1500,
    suitableCrops: ['Paddy (Rice)', 'Wheat', 'Soybean', 'Cotton Bales', 'Millets', 'Pulses'],
    description: 'Intermediate Commercial Vehicle for state-wide mandi aggregation and bulk wholesale lots (up to 7.5 MT).',
  },
  {
    id: 'heavy-6w',
    name: '6-Wheeler Heavy Truck (10 Tonne)',
    category: 'Medium Truck',
    maxPayloadKg: 12000,
    baseFareInr: 7500,
    ratePerKmInr: 46,
    minDistanceKm: 80,
    tollSurchargePerKmInr: 6.5,
    loadingUnloadingChargeInr: 2500,
    suitableCrops: ['Paddy', 'Wheat', 'Sugar', 'Maize', 'Groundnut'],
    description: 'Heavy 6-wheeler for inter-district commercial cargo and large bulk FPO aggregated lots (up to 12 MT).',
  },
  {
    id: 'taurus-multi',
    name: '10/12-Wheeler Taurus Multi-Axle',
    category: 'Heavy Multi-Axle',
    maxPayloadKg: 25000,
    baseFareInr: 14000,
    ratePerKmInr: 65,
    minDistanceKm: 120,
    tollSurchargePerKmInr: 9.5,
    loadingUnloadingChargeInr: 4000,
    suitableCrops: ['Wheat', 'Paddy', 'Cotton', 'Fertilizers', 'Bulk Grains'],
    description: 'Long-haul national highway interstate freight carrier for industrial and institutional buyers (up to 25 MT).',
  },
  {
    id: 'cold-reefer',
    name: 'Temperature-Controlled Reefer (+4°C to -18°C)',
    category: 'Cold-Chain Reefer',
    maxPayloadKg: 8000,
    baseFareInr: 8500,
    ratePerKmInr: 52,
    minDistanceKm: 40,
    tollSurchargePerKmInr: 6.0,
    loadingUnloadingChargeInr: 2000,
    suitableCrops: ['Banana', 'Mango', 'Tomato', 'Grapes', 'Dairy & Perishables'],
    description: 'IoT-monitored refrigerated container preventing transit spoilage for delicate horticultural crops.',
  },
];

export const LOGISTICS_PARTNERS: LogisticsPartner[] = [
  {
    id: 'lp-1',
    name: 'Kisan Express Agri-Logistics Pvt Ltd',
    operatingStates: ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Kerala', 'Telangana'],
    rating: 4.85,
    reviewCount: 342,
    verifiedBadge: true,
    vehicleFleet: ['mini-truck', 'pickup-maxi', 'icv-14ft', 'heavy-6w'],
    phone: '+91 94421 88019',
    headquarters: 'Thanjavur & Coimbatore, TN',
    transitSpeedKmPerDay: 420,
    transitInsuranceAvailable: true,
  },
  {
    id: 'lp-2',
    name: 'Bharat Green Freight Fleet (Kisan Rath Partner)',
    operatingStates: ['Pan-India', 'Maharashtra', 'Madhya Pradesh', 'Gujarat', 'Punjab', 'Haryana', 'Tamil Nadu'],
    rating: 4.78,
    reviewCount: 512,
    verifiedBadge: true,
    vehicleFleet: ['pickup-maxi', 'icv-14ft', 'heavy-6w', 'taurus-multi'],
    phone: '+91 98203 11982',
    headquarters: 'Nashik & Pune, MH',
    transitSpeedKmPerDay: 480,
    transitInsuranceAvailable: true,
  },
  {
    id: 'lp-3',
    name: 'SafeCold Agri-Reefer Chain Ltd',
    operatingStates: ['Pan-India', 'Tamil Nadu', 'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Delhi-NCR'],
    rating: 4.92,
    reviewCount: 189,
    verifiedBadge: true,
    vehicleFleet: ['cold-reefer', 'icv-14ft'],
    phone: '+91 91223 90145',
    headquarters: 'Bengaluru & Chennai',
    transitSpeedKmPerDay: 500,
    transitInsuranceAvailable: true,
  },
  {
    id: 'lp-4',
    name: 'Dakshin Cargo Haulers & Mandi Connect',
    operatingStates: ['Tamil Nadu', 'Kerala', 'Karnataka'],
    rating: 4.65,
    reviewCount: 228,
    verifiedBadge: true,
    vehicleFleet: ['mini-truck', 'pickup-maxi', 'icv-14ft'],
    phone: '+91 97891 02931',
    headquarters: 'Madurai & Tiruchirappalli, TN',
    transitSpeedKmPerDay: 380,
    transitInsuranceAvailable: false,
  },
  {
    id: 'lp-5',
    name: 'VRL Agri-Commercial National Transport',
    operatingStates: ['Pan-India'],
    rating: 4.81,
    reviewCount: 890,
    verifiedBadge: true,
    vehicleFleet: ['heavy-6w', 'taurus-multi', 'cold-reefer'],
    phone: '+91 98450 77123',
    headquarters: 'Hubballi & Mumbai',
    transitSpeedKmPerDay: 550,
    transitInsuranceAvailable: true,
  },
];

// Reference Indian Agricultural Distance Matrix (km)
export const CORRIDOR_DISTANCES: Record<string, Record<string, number>> = {
  Thanjavur: {
    Chennai: 340,
    Bengaluru: 410,
    Coimbatore: 270,
    Madurai: 185,
    Tiruchirappalli: 55,
    Hyderabad: 910,
    Mumbai: 1380,
    'Delhi-NCR': 2420,
    Kolkata: 1980,
  },
  Nashik: {
    Mumbai: 165,
    Pune: 210,
    Surat: 240,
    Ahmedabad: 470,
    Bengaluru: 990,
    Chennai: 1280,
    'Delhi-NCR': 1250,
    Kolkata: 1720,
  },
  Guntur: {
    Hyderabad: 275,
    Vijayawada: 35,
    Chennai: 390,
    Bengaluru: 610,
    Visakhapatnam: 380,
    Mumbai: 990,
    'Delhi-NCR': 1810,
    Kolkata: 1220,
  },
  Karnal: {
    'Delhi-NCR': 125,
    Chandigarh: 125,
    Jaipur: 390,
    Lucknow: 620,
    Mumbai: 1520,
    Kolkata: 1580,
    Chennai: 2320,
  },
  Shimla: {
    Chandigarh: 110,
    'Delhi-NCR': 345,
    Jaipur: 610,
    Mumbai: 1740,
    Bengaluru: 2540,
  },
};

/**
 * Estimates road distance between agricultural origin and destination.
 * Falls back to sensible default if pair is not pre-mapped.
 */
export function estimateDistanceKm(origin: string, destination: string): number {
  if (!origin || !destination) return 250;

  const originClean = origin.trim();
  const destClean = destination.trim();

  if (originClean.toLowerCase() === destClean.toLowerCase()) return 35;

  // Direct lookup
  for (const [hub, map] of Object.entries(CORRIDOR_DISTANCES)) {
    if (originClean.toLowerCase().includes(hub.toLowerCase())) {
      for (const [target, dist] of Object.entries(map)) {
        if (destClean.toLowerCase().includes(target.toLowerCase())) {
          return dist;
        }
      }
    }
  }

  // Reverse lookup
  for (const [hub, map] of Object.entries(CORRIDOR_DISTANCES)) {
    if (destClean.toLowerCase().includes(hub.toLowerCase())) {
      for (const [target, dist] of Object.entries(map)) {
        if (originClean.toLowerCase().includes(target.toLowerCase())) {
          return dist;
        }
      }
    }
  }

  // Sensible state/inter-district fallback
  return 320;
}

/**
 * Calculates dynamic logistics cost and matches verified partners.
 */
export function calculateLogisticsCost(
  payloadKg: number,
  distanceKm: number,
  vehicleId?: string,
  isPerishable?: boolean
): LogisticsCalculationResult[] {
  const safeWeight = Math.max(1, Number(payloadKg) || 100);
  const safeDist = Math.max(5, Number(distanceKm) || 50);

  // Filter and sort vehicles by best fit
  let candidateVehicles = VEHICLE_CONFIGS;

  if (vehicleId) {
    const selected = VEHICLE_CONFIGS.find((v) => v.id === vehicleId);
    if (selected) candidateVehicles = [selected];
  } else {
    // Sort vehicles: valid capacities first (smallest capacity >= safeWeight first), followed by larger
    const fits = VEHICLE_CONFIGS.filter((v) => v.maxPayloadKg >= safeWeight).sort(
      (a, b) => a.maxPayloadKg - b.maxPayloadKg
    );

    const under = VEHICLE_CONFIGS.filter((v) => v.maxPayloadKg < safeWeight).sort(
      (a, b) => b.maxPayloadKg - a.maxPayloadKg
    );

    if (fits.length > 0) {
      candidateVehicles = fits.concat(under);
    } else {
      // If payload exceeds all single vehicles (e.g. 30,000 kg), start with the largest
      candidateVehicles = under;
    }

    if (isPerishable) {
      const reeferIdx = candidateVehicles.findIndex((v) => v.id === 'cold-reefer');
      if (reeferIdx > 0) {
        const [reefer] = candidateVehicles.splice(reeferIdx, 1);
        candidateVehicles.unshift(reefer);
      }
    }
  }

  return candidateVehicles.map((vehicle) => {
    const billableDistance = Math.max(vehicle.minDistanceKm, safeDist);
    const baseFare = vehicle.baseFareInr;
    const distanceFare = Math.round(billableDistance * vehicle.ratePerKmInr);
    const tollSurcharge = Math.round(billableDistance * vehicle.tollSurchargePerKmInr);
    const loadingUnloadingFare = vehicle.loadingUnloadingChargeInr;

    const totalFreightInr = baseFare + distanceFare + tollSurcharge + loadingUnloadingFare;
    const freightPerKgInr = Number((totalFreightInr / safeWeight).toFixed(2));

    // Commercial transit speed: ~38 km/h on Indian highway network + 1 hr loading/unloading
    const estimatedTransitHours = Math.max(2, Math.round(billableDistance / 38) + 2);

    // Matching verified partners
    const suggestedPartners = LOGISTICS_PARTNERS.filter((partner) =>
      partner.vehicleFleet.includes(vehicle.id)
    );

    return {
      vehicle,
      distanceKm: billableDistance,
      payloadKg: safeWeight,
      totalFreightInr,
      freightPerKgInr,
      baseFare,
      distanceFare,
      tollSurcharge,
      loadingUnloadingFare,
      estimatedTransitHours,
      suggestedPartners,
    };
  });
}
