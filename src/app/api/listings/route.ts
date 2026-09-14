// API: Listings management
import { NextRequest, NextResponse } from 'next/server';
import { getStore, saveStore, addAuditLog } from '@/lib/store';
import { CropListing } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const store = getStore();
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    const crop = searchParams.get('crop');

    let listings = store.listings;

    if (state && state !== 'All') {
      listings = listings.filter((l) => l.state.toLowerCase() === state.toLowerCase());
    }
    if (district && district !== 'All') {
      listings = listings.filter((l) => l.district.toLowerCase() === district.toLowerCase());
    }
    if (crop && crop !== 'All') {
      listings = listings.filter((l) => l.crop.toLowerCase().includes(crop.toLowerCase()));
    }

    return NextResponse.json({ success: true, data: listings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sellerType,
      sellerId,
      sellerName,
      crop,
      variety,
      productForm,
      totalQuantityKg,
      minimumPricePerKg,
      expectedHarvestDate,
      pickupWindowStart,
      pickupWindowEnd,
      state,
      district,
      approximatePickupArea,
      qualityTerms,
      biddingDeadline,
      fpoContributionIds,
    } = body;

    if (!crop || !variety || !totalQuantityKg || !minimumPricePerKg || !state || !district) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory fields. All crops must specify kg quantity and INR/kg price.' },
        { status: 400 }
      );
    }

    const store = getStore();

    // If FPO listing, verify member contributions and prevent double selling
    if (sellerType === 'fpo' && fpoContributionIds && fpoContributionIds.length > 0) {
      let combinedContributionKg = 0;
      for (const contribId of fpoContributionIds) {
        const contrib = store.fpoContributions.find((c) => c.id === contribId);
        if (!contrib) {
          return NextResponse.json(
            { success: false, error: `FPO member contribution ${contribId} not found.` },
            { status: 400 }
          );
        }
        if (contrib.remainingKg <= 0 || contrib.status === 'committed') {
          return NextResponse.json(
            { success: false, error: `Member ${contrib.farmerName}'s contribution is already allocated. Double selling is strictly prevented.` },
            { status: 400 }
          );
        }
        combinedContributionKg += contrib.remainingKg;
        // Mark contribution as committed to this lot
        contrib.allocatedKg = contrib.expectedKg;
        contrib.status = 'committed';
      }

      if (totalQuantityKg > combinedContributionKg) {
        return NextResponse.json(
          { success: false, error: `Listing total (${totalQuantityKg} kg) exceeds sum of selected member contributions (${combinedContributionKg} kg).` },
          { status: 400 }
        );
      }
    }

    const newListing: CropListing = {
      id: `lst-${Date.now()}`,
      listingCode: `LOT-${new Date().getFullYear()}-${crop.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      sellerType: sellerType || 'individual',
      sellerId: sellerId || 'fmr-1',
      sellerName: sellerName || 'Verified Producer',
      crop,
      variety,
      productForm: productForm || 'Standard Commercial Grade',
      totalQuantityKg: Number(totalQuantityKg),
      allocatedQuantityKg: 0,
      availableQuantityKg: Number(totalQuantityKg),
      minimumPricePerKg: Number(minimumPricePerKg),
      expectedHarvestDate,
      pickupWindowStart: pickupWindowStart || new Date().toISOString(),
      pickupWindowEnd: pickupWindowEnd || new Date(Date.now() + 86400000 * 5).toISOString(),
      state,
      district,
      approximatePickupArea,
      qualityTerms: qualityTerms || 'Fair Average Quality (FAQ) standard; verified by local agricultural officer.',
      images: ['/crops/generic.jpg'],
      status: 'open_for_bids',
      biddingDeadline: biddingDeadline || new Date(Date.now() + 86400000 * 2).toISOString(),
      officerInspectionNotes: 'Verified on-site by field officer.',
      fpoContributionIds,
      createdAt: new Date().toISOString(),
    };

    store.listings.unshift(newListing);
    saveStore(store);

    addAuditLog(
      sellerId,
      sellerName,
      sellerType === 'fpo' ? 'fpo_representative' : 'farmer',
      'CREATE_CROP_LISTING',
      'listings',
      newListing.id,
      `Published new listing for ${newListing.totalQuantityKg} kg of ${newListing.crop} (${newListing.variety}) at Rs. ${newListing.minimumPricePerKg}/kg`
    );

    return NextResponse.json({ success: true, data: newListing });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
