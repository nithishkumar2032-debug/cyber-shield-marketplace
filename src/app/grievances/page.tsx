'use client';

// Grievance Mechanism & Dispute Resolution Desk
// Prepared by Cyber Shield | SIH 26033

import React, { useState } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  ShieldAlert,
  Send,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

export default function GrievancesPage() {
  const { state, submitGrievance } = useMarketplace();
  const grievances = state?.grievances || [];
  const orders = state?.orders || [];

  const [category, setCategory] = useState<
    'Shortage at Pickup' | 'Quality Dispute' | 'Payment Delay' | 'Vehicle / Logistics No-Show' | 'Officer Verification' | 'Portal Navigation'
  >('Vehicle / Logistics No-Show');
  const [complainantName, setComplainantName] = useState('Murugan Karuppasamy');
  const [complainantRole, setComplainantRole] = useState<'farmer' | 'buyer'>('farmer');
  const [complainantPhone, setComplainantPhone] = useState('+91 98421 77301');
  const [linkedOrderId, setLinkedOrderId] = useState(orders[0]?.id || '');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setStatusMsg(null);

    const res = await submitGrievance({
      complainantName,
      complainantRole,
      complainantPhone,
      category,
      linkedOrderId,
      description,
    });

    setSubmitting(false);
    if (res.success) {
      setStatusMsg(`Grievance registered! Complaint Ticket: ${res.data.complaintNumber}. Assigned to your Taluka Agricultural Officer for investigation.`);
      setDescription('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-rose-900/60">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900/80 text-rose-200 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
            <span>Accessible Support & Dispute Handling</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Grievance & Resolution Desk
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Report logistics delays, pickup weight mismatches, quality disputes, or portal assistance issues. Track responses and district/taluka escalations transparently.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-rose-100 space-y-1 max-w-sm">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-300" />
            <span>Resolution Hierarchy</span>
          </div>
          <p className="text-[11px] text-rose-200">
            Complaint opened → Evidence collected → Assigned officer review → District escalation if unresolved.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: File New Grievance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">File a Grievance</h3>
            <p className="text-xs text-slate-500">Provide details and link order ID if applicable.</p>
          </div>

          {statusMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Category:</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-rose-600"
              >
                <option value="Vehicle / Logistics No-Show">Vehicle / Logistics No-Show</option>
                <option value="Shortage at Pickup">Shortage at Pickup</option>
                <option value="Quality Dispute">Quality Dispute</option>
                <option value="Payment Delay">Payment Delay</option>
                <option value="Officer Verification">Officer Verification</option>
                <option value="Portal Navigation">Portal Navigation</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name:</label>
              <input
                type="text"
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role:</label>
                <select
                  value={complainantRole}
                  onChange={(e: any) => setComplainantRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                >
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone:</label>
                <input
                  type="text"
                  value={complainantPhone}
                  onChange={(e) => setComplainantPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Linked Order (Optional):</label>
              <select
                value={linkedOrderId}
                onChange={(e) => setLinkedOrderId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
              >
                <option value="">None / General Inquiry</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} ({o.crop})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Description of Issue:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, timestamps, vehicle numbers, or discrepancy..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="w-full py-3 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Registering Ticket...' : 'Submit Grievance Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Grievances History & Status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Active Grievance Tickets</h3>
                <p className="text-xs text-slate-500">Track assigned officer updates and resolution progress.</p>
              </div>
              <span className="text-xs font-bold text-slate-600">
                {grievances.length} Registered
              </span>
            </div>

            <div className="space-y-4">
              {grievances.map((g) => (
                <div
                  key={g.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <div>
                      <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                        {g.complaintNumber}
                      </span>
                      <span className="font-bold text-rose-800 ml-2">{g.category}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        g.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed">{g.description}</p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div>
                      Complainant: <b>{g.complainantName}</b> ({g.complainantRole})
                    </div>
                    <div>
                      Assigned Officer: <b>{g.assignedOfficerName}</b> ({g.hierarchyLevel} Level)
                    </div>
                  </div>

                  {/* Responses Thread */}
                  {g.responses && g.responses.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                      <div className="font-semibold text-slate-700 text-[11px]">Officer Investigation Notes:</div>
                      {g.responses.map((r, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold text-blue-700">{r.authorName}</span>
                            <span>{new Date(r.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-slate-700 text-[11px]">{r.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
