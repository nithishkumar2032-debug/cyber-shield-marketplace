import { NextRequest, NextResponse } from 'next/server';
import { getStore, saveStore, addAuditLog } from '@/lib/store';
import { OfficerJurisdiction } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const store = getStore();

    if (action === 'appoint') {
      const {
        officerName,
        roleTitle,
        state,
        district,
        taluka,
        phone,
        email,
        officeAddress,
        backupOfficerName,
      } = body;

      if (!officerName || !roleTitle || !state || !district || !phone || !email || !officeAddress) {
        return NextResponse.json({ success: false, error: 'Missing required fields for appointment.' }, { status: 400 });
      }

      const newOfficer: OfficerJurisdiction = {
        id: `off-${Date.now()}`,
        officerId: `usr-officer-${Date.now()}`,
        officerName,
        roleTitle,
        state,
        district,
        taluka,
        phone,
        email,
        officeAddress,
        backupOfficerName,
      };

      store.officers.push(newOfficer);
      saveStore(store);

      addAuditLog(
        'sys-admin',
        'Platform Administrator',
        'admin',
        'APPOINT_OFFICER',
        'officers',
        newOfficer.officerId,
        `Admin appointed ${officerName} to ${district}, ${state} as ${roleTitle}.`
      );

      return NextResponse.json({ success: true, data: newOfficer });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
