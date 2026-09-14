// API: Buyer Registration & Administrator Verification
import { NextRequest, NextResponse } from 'next/server';
import { getStore, saveStore, addAuditLog } from '@/lib/store';
import { BuyerRecord } from '@/types';

export async function GET() {
  try {
    const store = getStore();
    return NextResponse.json({ success: true, data: store.buyers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const store = getStore();

    // 1. Buyer self-registers
    if (action === 'register') {
      const {
        organizationName,
        category,
        authorizedPurchaser,
        mobile,
        email,
        address,
        deliveryState,
        deliveryDistrict,
        businessRegistrationNumber,
      } = body;

      if (!organizationName || !category || !authorizedPurchaser || !mobile || !deliveryState || !deliveryDistrict) {
        return NextResponse.json({ success: false, error: 'All primary organization and delivery fields are required.' }, { status: 400 });
      }

      const newBuyer: BuyerRecord = {
        id: `byr-${Date.now()}`,
        organizationName,
        category,
        authorizedPurchaser,
        mobile,
        email: email || 'procure@company.com',
        address: address || 'Warehouse Complex',
        deliveryState,
        deliveryDistrict,
        businessRegistrationNumber: businessRegistrationNumber || `REG-${Date.now().toString().substring(6)}`,
        documents: [
          { title: `${category} Registration Certificate`, filename: 'org_reg_doc.pdf', verified: false },
          { title: 'Purchaser Authorization Resolution', filename: 'auth_letter.pdf', verified: false },
        ],
        status: 'under_review',
        createdAt: new Date().toISOString(),
      };

      store.buyers.unshift(newBuyer);
      saveStore(store);

      addAuditLog(
        newBuyer.id,
        newBuyer.organizationName,
        'buyer',
        'BUYER_APPLICATION_SUBMITTED',
        'buyers',
        newBuyer.id,
        `New ${category} application submitted. Documents submitted for administrator review.`
      );

      return NextResponse.json({ success: true, data: newBuyer });
    }

    // 2. Administrator Verifies or Requests Correction
    if (action === 'verify') {
      const { buyerId, adminId, adminName, newStatus, correctionReason } = body;
      const buyer = store.buyers.find((b) => b.id === buyerId);
      if (!buyer) {
        return NextResponse.json({ success: false, error: 'Buyer not found.' }, { status: 404 });
      }

      buyer.status = newStatus === 'correction_required' ? 'correction_required' : 'verified';
      buyer.correctionReason = correctionReason;
      if (buyer.status === 'verified') {
        buyer.verifiedBy = adminName || 'Govt Administrator';
        buyer.documents.forEach((d) => (d.verified = true));
      }

      saveStore(store);

      addAuditLog(
        adminId || 'usr-admin-1',
        adminName || 'Platform Administrator',
        'admin',
        'BUYER_VERIFICATION_DECISION',
        'buyers',
        buyer.id,
        `Buyer status changed to ${buyer.status}. ${correctionReason ? `Reason: ${correctionReason}` : 'Documents verified and account activated for B2B bidding.'}`
      );

      return NextResponse.json({ success: true, data: buyer });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
