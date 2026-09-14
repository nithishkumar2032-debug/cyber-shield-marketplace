// API: Atomic Bid Allocation & Order Generation
import { NextRequest, NextResponse } from 'next/server';
import { getStore, saveStore, addAuditLog } from '@/lib/store';
import { AllocationRecord, OrderRecord, EscrowRecord } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const store = getStore();

    // 1. Farmer Selects Bid & Proposes Allocation
    if (action === 'farmer_select') {
      const { bidId, allocatedKg, farmerId } = body;
      const bid = store.bids.find((b) => b.id === bidId);
      if (!bid) {
        return NextResponse.json({ success: false, error: 'Bid not found.' }, { status: 404 });
      }

      const listing = store.listings.find((l) => l.id === bid.listingId);
      if (!listing) {
        return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
      }

      const qty = Number(allocatedKg);
      if (qty <= 0 || qty > listing.availableQuantityKg) {
        return NextResponse.json(
          { success: false, error: `Allocated quantity (${qty} kg) must be between 1 and available balance (${listing.availableQuantityKg} kg).` },
          { status: 400 }
        );
      }

      const totalVal = Math.round(qty * bid.offeredPricePerKg * 100) / 100;

      const allocation: AllocationRecord = {
        id: `alc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        listingId: listing.id,
        bidId: bid.id,
        buyerId: bid.buyerId,
        buyerOrgName: bid.buyerOrgName,
        allocatedKg: qty,
        agreedPricePerKg: bid.offeredPricePerKg,
        totalOrderValue: totalVal,
        farmerSelectedAt: new Date().toISOString(),
        status: 'proposed',
      };

      bid.status = 'selected_by_farmer';
      store.allocations.push(allocation);
      saveStore(store);

      addAuditLog(
        farmerId,
        listing.sellerName,
        'farmer',
        'FARMER_PROPOSE_ALLOCATION',
        'allocations',
        allocation.id,
        `Farmer proposed allocating ${qty} kg @ Rs. ${bid.offeredPricePerKg}/kg to ${bid.buyerOrgName}`
      );

      return NextResponse.json({ success: true, data: allocation });
    }

    // 2. Officer Records Phone Confirmation with Buyer
    if (action === 'officer_confirm') {
      const { allocationId, officerId, officerName, phoneNotes } = body;
      const allocation = store.allocations.find((a) => a.id === allocationId);
      if (!allocation) {
        return NextResponse.json({ success: false, error: 'Allocation record not found.' }, { status: 404 });
      }

      allocation.officerConfirmedAt = new Date().toISOString();
      allocation.officerPhoneNotes = phoneNotes || 'Telephonically verified quantity, price, and pickup schedule with buyer procurement lead.';
      allocation.status = 'officer_confirmed';

      const bid = store.bids.find((b) => b.id === allocation.bidId);
      if (bid) {
        bid.status = 'officer_confirmed';
      }

      saveStore(store);

      addAuditLog(
        officerId,
        officerName,
        'officer',
        'OFFICER_PHONE_CONFIRMATION',
        'allocations',
        allocation.id,
        allocation.officerPhoneNotes
      );

      return NextResponse.json({ success: true, data: allocation });
    }

    // 3. Buyer Accepts Final Terms -> Atomic Order Creation & Balance Locking
    if (action === 'buyer_accept') {
      const { allocationId, buyerId } = body;
      const allocation = store.allocations.find((a) => a.id === allocationId);
      if (!allocation) {
        return NextResponse.json({ success: false, error: 'Allocation not found.' }, { status: 404 });
      }

      const listing = store.listings.find((l) => l.id === allocation.listingId);
      if (!listing) {
        return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
      }

      // ATOMIC CHECK: Ensure lot balance is still available!
      if (allocation.allocatedKg > listing.availableQuantityKg) {
        return NextResponse.json(
          {
            success: false,
            error: `Overselling prevented: Requested allocation (${allocation.allocatedKg} kg) exceeds remaining available balance (${listing.availableQuantityKg} kg).`,
          },
          { status: 409 }
        );
      }

      // Atomically update listing balance
      listing.allocatedQuantityKg += allocation.allocatedKg;
      listing.availableQuantityKg = listing.totalQuantityKg - listing.allocatedQuantityKg;
      if (listing.availableQuantityKg <= 0) {
        listing.status = 'fully_allocated';
      } else {
        listing.status = 'partially_allocated';
      }

      allocation.buyerConfirmedAt = new Date().toISOString();
      allocation.status = 'converted_to_order';

      const bid = store.bids.find((b) => b.id === allocation.bidId);
      if (bid) {
        bid.status = 'accepted_by_buyer';
      }

      const buyer = store.buyers.find((b) => b.id === allocation.buyerId);
      const sellerPhone = store.farmers.find((f) => f.id === listing.sellerId)?.phone || '+91 94432 10982';

      // Create Independent Order Record with full digital snapshot
      const orderNumber = `ORD-${new Date().getFullYear()}-${listing.crop.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: OrderRecord = {
        id: `ord-${Date.now()}`,
        orderNumber,
        listingId: listing.id,
        allocationId: allocation.id,
        buyerId: allocation.buyerId,
        buyerOrgName: allocation.buyerOrgName,
        buyerPhone: buyer?.mobile || '+91 98401 22391',
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        sellerType: listing.sellerType,
        sellerPhone, // Revealed now upon order confirmation
        crop: listing.crop,
        variety: listing.variety,
        confirmedQuantityKg: allocation.allocatedKg,
        agreedPricePerKg: allocation.agreedPricePerKg,
        totalOrderAmount: allocation.totalOrderValue,
        qualityTermsSnapshot: listing.qualityTerms,
        pickupDeadline: listing.pickupWindowEnd,
        custodyRule: 'Buyer arranges transport. Custody transfers to buyer at farm gate upon triple OTP verification.',
        status: 'awaiting_payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create Initial Escrow Record linked to Order
      const newEscrow: EscrowRecord = {
        id: `esc-${Date.now()}`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        buyerId: newOrder.buyerId,
        sellerId: newOrder.sellerId,
        heldAmount: newOrder.totalOrderAmount,
        simulationBadge: 'DEMO/SIMULATED',
        status: 'awaiting',
        paymentReference: `ESC-SIM-${Date.now().toString().substring(5)}`,
      };

      store.orders.unshift(newOrder);
      store.escrows.unshift(newEscrow);
      saveStore(store);

      addAuditLog(
        buyerId,
        allocation.buyerOrgName,
        'buyer',
        'CONFIRM_ALLOCATION_ORDER_CREATED',
        'orders',
        newOrder.id,
        `Confirmed allocation for ${allocation.allocatedKg} kg of ${listing.crop}. Order ${orderNumber} created. Listing balance updated to ${listing.availableQuantityKg} kg remaining.`
      );

      return NextResponse.json({ success: true, data: { order: newOrder, escrow: newEscrow } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
