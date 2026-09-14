// API: Farmer Onboarding, Officer Field Visit & Activation
import { NextRequest, NextResponse } from 'next/server';
import { getStore, saveStore, addAuditLog } from '@/lib/store';
import { FarmerRecord } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const store = getStore();

    // 1. Farmer initiates onboarding request
    if (action === 'farmer_request') {
      const { fullName, phone, address, state, district, taluka, village, primaryCrop, estimatedLandAcres } = body;

      if (!fullName || !phone || !state || !district) {
        return NextResponse.json({ success: false, error: 'Name, phone, state, and district are mandatory.' }, { status: 400 });
      }

      const assignedOfficer = store.officers.find(
        (o) => o.district.toLowerCase() === district.toLowerCase()
      ) || store.officers[0];

      const newFarmer: FarmerRecord = {
        id: `fmr-${Date.now()}`,
        fullName,
        phone,
        address: address || `${village || 'Main Village'}, ${taluka || district}`,
        state,
        district,
        taluka: taluka || district,
        village: village || 'Local Village',
        landSizeAcres: Number(estimatedLandAcres) || 1.0,
        ownershipType: 'Owner',
        primaryCrops: [primaryCrop || 'Paddy / Rice'],
        expectedYieldKg: (Number(estimatedLandAcres) || 1.0) * 2000,
        bankAccountMasked: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000),
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India',
        status: 'onboarding_requested',
        assignedOfficerId: assignedOfficer.officerId,
        assignedOfficerName: assignedOfficer.officerName,
        isActivated: false,
        documentProofs: [],
        fieldPhotos: [],
        createdAt: new Date().toISOString(),
      };

      store.farmers.unshift(newFarmer);
      saveStore(store);

      addAuditLog(
        newFarmer.id,
        newFarmer.fullName,
        'farmer',
        'ONBOARDING_REQUESTED',
        'farmers',
        newFarmer.id,
        `Farmer approached portal for registration in ${district}, ${state}. Assigned to ${assignedOfficer.officerName}.`
      );

      return NextResponse.json({ success: true, data: newFarmer });
    }

    // 2. Agricultural Officer Conducts Field Visit & Uploads Verified Records
    if (action === 'officer_field_visit') {
      const {
        farmerId,
        officerId,
        officerName,
        lat,
        lng,
        ownershipType,
        verifiedCrops,
        expectedYieldKg,
        bankAccountMasked,
        ifscCode,
        bankName,
        fieldNotes,
        approvalStatus, // 'verified' or 'correction_required'
        correctionReason,
      } = body;

      const farmer = store.farmers.find((f) => f.id === farmerId);
      if (!farmer) {
        return NextResponse.json({ success: false, error: 'Farmer record not found.' }, { status: 404 });
      }

      if (lat && lng) {
        farmer.gpsCoordinates = { lat: Number(lat), lng: Number(lng) };
      }
      farmer.ownershipType = ownershipType || farmer.ownershipType;
      if (verifiedCrops) farmer.primaryCrops = verifiedCrops;
      if (expectedYieldKg) farmer.expectedYieldKg = Number(expectedYieldKg);
      if (bankAccountMasked) farmer.bankAccountMasked = bankAccountMasked;
      if (ifscCode) farmer.ifscCode = ifscCode;
      if (bankName) farmer.bankName = bankName;
      farmer.fieldNotes = fieldNotes || 'Field visit completed. Soil, crop standing, and water sources verified.';
      farmer.status = approvalStatus === 'correction_required' ? 'correction_required' : 'verified';
      farmer.correctionReason = correctionReason;

      // Generate secure single-use activation token for verified farmer
      if (farmer.status === 'verified') {
        farmer.activationToken = `ACT-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        farmer.activationExpiresAt = new Date(Date.now() + 86400000 * 7).toISOString(); // 7 days expiry
      }

      saveStore(store);

      addAuditLog(
        officerId,
        officerName,
        'officer',
        'FIELD_VISIT_SUBMISSION',
        'farmers',
        farmer.id,
        `Field visit conducted. Status set to ${farmer.status}. ${farmer.activationToken ? `Generated secure activation token ${farmer.activationToken}.` : ''}`
      );

      return NextResponse.json({ success: true, data: farmer });
    }

    // 3. Farmer claims activation token
    if (action === 'claim_activation') {
      const { token, phone } = body;
      const farmer = store.farmers.find(
        (f) => f.activationToken === token && (!phone || f.phone.includes(phone.replace(/\s+/g, '')))
      );

      if (!farmer) {
        return NextResponse.json({ success: false, error: 'Invalid activation token or phone mismatch.' }, { status: 400 });
      }

      if (farmer.activationExpiresAt && new Date() > new Date(farmer.activationExpiresAt)) {
        return NextResponse.json({ success: false, error: 'Activation token has expired. Please contact your assigned officer.' }, { status: 400 });
      }

      farmer.isActivated = true;
      farmer.activationToken = undefined; // single-use consume
      saveStore(store);

      addAuditLog(
        farmer.id,
        farmer.fullName,
        'farmer',
        'ACCOUNT_ACTIVATED',
        'farmers',
        farmer.id,
        'Farmer successfully claimed secure activation link and gained portal access.'
      );

      return NextResponse.json({ success: true, data: farmer });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
