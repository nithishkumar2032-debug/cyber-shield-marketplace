// API: Grievance Mechanism & Escalation Hierarchy
import { NextRequest, NextResponse } from 'next/server';
import { getStore, saveStore, addAuditLog } from '@/lib/store';
import { GrievanceRecord } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const store = getStore();
    const { searchParams } = new URL(req.url);
    const complainantId = searchParams.get('complainantId');

    let grievances = store.grievances;
    if (complainantId) {
      grievances = grievances.filter((g) => g.complainantId === complainantId);
    }

    return NextResponse.json({ success: true, data: grievances });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const store = getStore();

    // 1. Submit a Grievance
    if (action === 'submit') {
      const {
        complainantId,
        complainantName,
        complainantRole,
        complainantPhone,
        category,
        description,
        linkedOrderId,
        linkedListingId,
      } = body;

      if (!category || !description) {
        return NextResponse.json({ success: false, error: 'Category and description are required.' }, { status: 400 });
      }

      const assignedOfficer = store.officers[0];
      const complaintNumber = `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const grievance: GrievanceRecord = {
        id: `grv-${Date.now()}`,
        complaintNumber,
        complainantId: complainantId || 'fmr-1',
        complainantName: complainantName || 'Complainant',
        complainantRole: complainantRole || 'farmer',
        complainantPhone: complainantPhone || '+91 94431 00000',
        category,
        description,
        linkedOrderId,
        linkedListingId,
        evidenceFiles: [],
        assignedOfficerId: assignedOfficer.officerId,
        assignedOfficerName: assignedOfficer.officerName,
        hierarchyLevel: 'Taluka',
        status: 'opened',
        responses: [
          {
            authorName: 'System Bot / Desk',
            authorRole: 'System',
            message: `Grievance registered under ticket ${complaintNumber}. Assigned to ${assignedOfficer.officerName} (${assignedOfficer.roleTitle}) for verification.`,
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };

      store.grievances.unshift(grievance);
      saveStore(store);

      addAuditLog(
        grievance.complainantId,
        grievance.complainantName,
        grievance.complainantRole,
        'FILE_GRIEVANCE',
        'grievances',
        grievance.id,
        `Grievance ticket ${complaintNumber} filed under category '${category}'.`
      );

      return NextResponse.json({ success: true, data: grievance });
    }

    // 2. Officer Responds, Escalates, or Resolves Grievance
    if (action === 'respond') {
      const { grievanceId, authorName, authorRole, message, newStatus, hierarchyLevel, resolutionNotes } = body;
      const grievance = store.grievances.find((g) => g.id === grievanceId);
      if (!grievance) {
        return NextResponse.json({ success: false, error: 'Grievance not found.' }, { status: 404 });
      }

      if (message) {
        grievance.responses.push({
          authorName: authorName || 'Agricultural Officer',
          authorRole: authorRole || 'Officer',
          message,
          timestamp: new Date().toISOString(),
        });
      }

      if (newStatus) grievance.status = newStatus;
      if (hierarchyLevel) grievance.hierarchyLevel = hierarchyLevel;
      if (resolutionNotes) {
        grievance.resolutionNotes = resolutionNotes;
        grievance.status = 'resolved';
        grievance.closedAt = new Date().toISOString();
      }

      saveStore(store);

      addAuditLog(
        'usr-officer-1',
        authorName || 'Officer',
        'officer',
        'GRIEVANCE_ACTION',
        'grievances',
        grievance.id,
        `Updated grievance ${grievance.complaintNumber}: status=${grievance.status}, level=${grievance.hierarchyLevel}`
      );

      return NextResponse.json({ success: true, data: grievance });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
