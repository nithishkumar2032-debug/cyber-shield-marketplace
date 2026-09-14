// API: Dynamic Logistics & Freight Cost Calculator
// Prepared by Cyber Shield | SIH 26033

import { NextRequest, NextResponse } from 'next/server';
import {
  VEHICLE_CONFIGS,
  LOGISTICS_PARTNERS,
  CORRIDOR_DISTANCES,
  estimateDistanceKm,
  calculateLogisticsCost,
} from '@/lib/logistics';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get('origin') || '';
    const destination = searchParams.get('destination') || '';
    const weight = Number(searchParams.get('weight')) || 1000;

    let distance = 0;
    if (origin && destination) {
      distance = estimateDistanceKm(origin, destination);
    }

    return NextResponse.json({
      success: true,
      vehicles: VEHICLE_CONFIGS,
      partners: LOGISTICS_PARTNERS,
      corridors: CORRIDOR_DISTANCES,
      estimatedDistanceKm: distance,
      estimates: distance > 0 ? calculateLogisticsCost(weight, distance) : [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payloadKg, distanceKm, origin, destination, vehicleId, isPerishable } = body;

    let effectiveDistance = Number(distanceKm);

    if (!effectiveDistance || effectiveDistance <= 0) {
      effectiveDistance = estimateDistanceKm(origin || 'Thanjavur', destination || 'Chennai');
    }

    const weight = Number(payloadKg) || 1000;
    const estimates = calculateLogisticsCost(weight, effectiveDistance, vehicleId, Boolean(isPerishable));

    return NextResponse.json({
      success: true,
      data: {
        distanceKm: effectiveDistance,
        payloadKg: weight,
        estimates,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
