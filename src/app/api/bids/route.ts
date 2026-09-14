// API: Bids submission & retrieval
import { NextRequest, NextResponse } from 'next/server';
import { getStore, saveStore, addAuditLog } from '@/lib/store';
import { BidRecord } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const store = getStore();
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');
    const buyerId = searchParams.get('buyerId');

    let bids = store.bids;
    if (listingId) {
      bids = bids.filter((b) => b.listingId === listingId);
    }
    if (buyerId) {
      bids = bids.filter((b) => b.buyerId === buyerId);
    }

    return NextResponse.json({ success: true, data: bids });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      listingId,
      buyerId,
      requestedQuantityKg,
      offeredPricePerKg,
      proposedPickupDate,
      validityHours,
    } = body;

    const store = getStore();
    const buyer = store.buyers.find((b) => b.id === buyerId);
    if (!buyer) {
      return NextResponse.json({ success: false, error: 'Buyer record not found.' }, { status: 404 });
    }
    if (buyer.status !== 'verified') {
      return NextResponse.json(
        { success: false, error: 'Only verified buyers can place bids. Your account is currently pending verification.' },
        { status: 403 }
      );
    }

    const listing = store.listings.find((l) => l.id === listingId);
    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
    }

    if (listing.status !== 'open_for_bids' && listing.status !== 'partially_allocated') {
      return NextResponse.json(
        { success: false, error: `This lot is not open for bidding (Current status: ${listing.status}).` },
        { status: 400 }
      );
    }

    // Server-side enforcement of published bidding deadline
    const now = new Date();
    const deadline = new Date(listing.biddingDeadline);
    if (now > deadline) {
      return NextResponse.json(
        { success: false, error: 'The bidding window for this lot has closed.' },
        { status: 400 }
      );
    }

    const reqKg = Number(requestedQuantityKg);
    const pricePerKg = Number(offeredPricePerKg);

    if (reqKg <= 0 || pricePerKg <= 0) {
      return NextResponse.json({ success: false, error: 'Quantity and price must be positive numbers.' }, { status: 400 });
    }

    if (reqKg > listing.availableQuantityKg) {
      return NextResponse.json(
        { success: false, error: `Requested quantity (${reqKg} kg) exceeds available lot balance (${listing.availableQuantityKg} kg). Partial procurement allows bidding for any amount up to available balance.` },
        { status: 400 }
      );
    }

    const totalAmount = Math.round(reqKg * pricePerKg * 100) / 100;
    const validityDeadline = new Date(Date.now() + (Number(validityHours) || 24) * 3600000).toISOString();

    const newBid: BidRecord = {
      id: `bid-${Date.now()}`,
      listingId: listing.id,
      listingCode: listing.listingCode,
      crop: listing.crop,
      variety: listing.variety,
      buyerId: buyer.id,
      buyerOrgName: buyer.organizationName,
      buyerCategory: buyer.category,
      requestedQuantityKg: reqKg,
      offeredPricePerKg: pricePerKg,
      totalBidAmount: totalAmount,
      proposedPickupDate: proposedPickupDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      bidValidityDeadline: validityDeadline,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };

    store.bids.unshift(newBid);
    saveStore(store);

    addAuditLog(
      buyer.id,
      buyer.organizationName,
      'buyer',
      'SUBMIT_BID',
      'bids',
      newBid.id,
      `Submitted bid of ${reqKg} kg @ Rs. ${pricePerKg}/kg (Total: Rs. ${totalAmount}) for ${listing.listingCode}`
    );

    return NextResponse.json({ success: true, data: newBid });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
