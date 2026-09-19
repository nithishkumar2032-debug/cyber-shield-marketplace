'use client';

// Government & Platform Administrator Portal
// Prepared by Cyber Shield | SIH 26033

import React, { useState } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Shield,
  UserCheck,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scale,
  Settings,
  ListFilter,
  History,
} from 'lucide-react';

export default function AdminPage() {
  const { state, verifyBuyer, appointOfficer } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'buyers' | 'catalogue' | 'policies' | 'audit' | 'officers'>('buyers');

  const buyers = state?.buyers || [];
  const catalogue = state?.catalogue || [];
  const auditLogs = state?.auditLogs || [];
  const officers = state?.officers || [];

  const [decisionMsg, setDecisionMsg] = useState<string | null>(null);
  const [newOfficer, setNewOfficer] = useState({
    officerName: '',
    roleTitle: 'Village Agriculture Officer',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    taluka: '',
    phone: '',
    email: '',
    officeAddress: '',
  });

  const handleAppoint = async (e: React.FormEvent) => {
    e.preventDefault();
    setDecisionMsg(null);
    const res = await appointOfficer(newOfficer);
    if (res.success) {
      setDecisionMsg(`Officer ${newOfficer.officerName} appointed successfully!`);
      setTimeout(() => setDecisionMsg(null), 3000);
      setNewOfficer({ ...newOfficer, officerName: '', phone: '', email: '', officeAddress: '', taluka: '' });
    } else {
      alert(res.error);
    }
  };

  const handleVerify = async (buyerId: string, newStatus: 'verified' | 'correction_required', reason?: string) => {
    setDecisionMsg(null);
    const res = await verifyBuyer(buyerId, newStatus, reason);
    if (res.success) {
      setDecisionMsg(`Buyer verification decision saved: ${newStatus.toUpperCase()}`);
      setTimeout(() => setDecisionMsg(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-800/80 border border-amber-500/40 flex items-center justify-center text-white font-bold shadow-md">
            <Shield className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Government Administration & Oversight
              </h1>
              <span className="badge-demo text-[10px] py-0 px-2">SIH PROTOTYPE</span>
            </div>
            <div className="text-xs text-amber-200/90 mt-1">
              Ministry of Agriculture & Farmers Welfare • Cyber Shield Platform Console
            </div>
          </div>
        </div>

        <div className="text-xs text-amber-200/80 bg-amber-950/80 p-3.5 rounded-2xl border border-amber-700/50 max-w-sm">
          <b>Governance Principle:</b> Central administration manages policies, officer jurisdictions, and buyer certifications. Administration does not hold escrow money or silently alter completed records.
        </div>
      </div>

      {decisionMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{decisionMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('buyers')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'buyers'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Buyer Verification ({buyers.filter((b) => b.status === 'under_review').length} Pending)</span>
        </button>
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'catalogue'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Crop Catalogue & Benchmarks ({catalogue.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'policies'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Versioned Policies</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Immutable Audit Log ({auditLogs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('officers')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'officers'
              ? 'border-amber-700 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Officer Jurisdictions ({officers.length})</span>
        </button>
      </div>

      {/* Tab: Buyer Verification */}
      {activeTab === 'buyers' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">B2B Buyer Applications</h3>
              <p className="text-xs text-slate-500">
                Verify business registration, authorization certificates, and delivery jurisdictions.
              </p>
            </div>
            <span className="badge-demo text-[10px] py-0 px-2">DOCUMENT CHECK</span>
          </div>

          <div className="space-y-4">
            {buyers.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{b.organizationName}</span>
                    <span className="ml-2 text-slate-500 font-medium">({b.category})</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : b.status === 'under_review'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {b.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Authorized Purchaser</span>
                    <span className="font-semibold text-slate-800">{b.authorizedPurchaser}</span>
                    <span className="text-slate-500 block">{b.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Delivery Jurisdiction</span>
                    <span className="font-semibold text-slate-800">{b.deliveryDistrict}, {b.deliveryState}</span>
                    <span className="text-slate-500 block">{b.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Registration No.</span>
                    <span className="font-mono text-slate-800 font-bold">{b.businessRegistrationNumber}</span>
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 block text-[11px] font-semibold">Verification Proofs:</span>
                  <div className="flex flex-wrap gap-2">
                    {b.documents.map((d, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>{d.title} ({d.filename})</span>
                        {d.verified ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {b.status !== 'verified' && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleVerify(b.id, 'verified')}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                    >
                      Approve & Activate for Bidding
                    </button>
                    <button
                      onClick={() => handleVerify(b.id, 'correction_required', 'Incomplete purchaser authorization letter.')}
                      className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
                    >
                      Request Document Correction
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Crop Catalogue */}
      {activeTab === 'catalogue' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Standard Crop & Variety Catalogue</h3>
              <p className="text-xs text-slate-500">
                Governs standardized listing options across India. Strictly adheres to kg units.
              </p>
            </div>
            <span className="badge-demo text-[10px] py-0 px-2">STANDARD UNITS (KG)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-2.5 px-3">Crop Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Supported Varieties & Forms</th>
                  <th className="py-2.5 px-3">Reference Benchmark</th>
                  <th className="py-2.5 px-3">Source & Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catalogue.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{c.cropName}</td>
                    <td className="py-3 px-3 text-slate-600">{c.category}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {c.varieties.map((v, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]"
                          >
                            {v.name} {v.productForm ? `(${v.productForm})` : ''}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-700">
                      ₹{c.referencePricePerKg.toFixed(2)} / kg
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {c.referenceSource} ({c.referenceDate})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Versioned Policies */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-3xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Configurable Platform Operating Policies</h3>
            <p className="text-xs text-slate-500">
              Assumptions and parameters documented in docs/DECISIONS.md.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 text-sm">Bidding Window Duration Default</div>
              <p className="text-slate-600">
                Configured duration for open B2B bidding: <b>24 Hours</b> (with prototype demo options for 2h, 6h, 12h, 48h).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 text-sm">Late Buyer Cancellation / No-Show Compensation</div>
              <p className="text-slate-600">
                Default prototype policy: <b>10%</b> of held escrow balance paid to farmer upon late buyer cancellation or no-show; 90% refunded. Uncollected stock reopened for sale.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 text-sm">Contact Number Disclosure Protocol</div>
              <p className="text-slate-600">
                Strict disclosure: Farmer mobile phone is revealed to buyer only <b>after</b> order confirmation and escrow lock. Phone numbers masked during public bidding.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Immutable Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Immutable Audit Trail</h3>
              <p className="text-xs text-slate-500">
                Timestamped chronicle of all status transitions, officer confirmations, allocations, and escrow releases.
              </p>
            </div>
            <span className="badge-demo text-[10px] py-0 px-2">TRACEABLE HISTORY</span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {log.action}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      on <b>{log.targetEntity}</b> ({log.targetId})
                    </span>
                  </div>
                  <div className="text-slate-800">{log.reason}</div>
                  <div className="text-[10px] text-slate-400">
                    Actor: <b>{log.actorName}</b> ({log.actorRole}) • Actor ID: {log.actorId}
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Officer Jurisdictions */}
      {activeTab === 'officers' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Officer Jurisdictions (Tamil Nadu Only)</h3>
              <p className="text-xs text-slate-500">
                Appoint and manage Agricultural Officers for districts in Tamil Nadu.
              </p>
            </div>
            <span className="badge-demo text-[10px] py-0 px-2">TN RESTRICTED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <form onSubmit={handleAppoint} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">Appoint New Officer</h4>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                <input type="text" value="Tamil Nadu" disabled className="w-full text-sm p-2 rounded border border-slate-300 bg-slate-200 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">District</label>
                <select
                  value={newOfficer.district}
                  onChange={(e) => setNewOfficer({ ...newOfficer, district: e.target.value })}
                  className="w-full text-sm p-2 rounded border border-slate-300 bg-white"
                >
                  {['Thanjavur', 'Madurai', 'Coimbatore', 'Tiruchirappalli', 'Pudukkottai', 'Erode', 'Chennai'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role Title</label>
                <select
                  value={newOfficer.roleTitle}
                  onChange={(e) => setNewOfficer({ ...newOfficer, roleTitle: e.target.value })}
                  className="w-full text-sm p-2 rounded border border-slate-300 bg-white"
                >
                  <option value="Village Agriculture Officer">Village Agriculture Officer</option>
                  <option value="Taluka Agriculture Officer">Taluka Agriculture Officer</option>
                  <option value="District Agricultural Officer">District Agricultural Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Officer Name</label>
                <input required type="text" value={newOfficer.officerName} onChange={(e) => setNewOfficer({ ...newOfficer, officerName: e.target.value })} className="w-full text-sm p-2 rounded border border-slate-300 bg-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                  <input required type="text" value={newOfficer.phone} onChange={(e) => setNewOfficer({ ...newOfficer, phone: e.target.value })} className="w-full text-sm p-2 rounded border border-slate-300 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" value={newOfficer.email} onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })} className="w-full text-sm p-2 rounded border border-slate-300 bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Office Address</label>
                <input required type="text" value={newOfficer.officeAddress} onChange={(e) => setNewOfficer({ ...newOfficer, officeAddress: e.target.value })} className="w-full text-sm p-2 rounded border border-slate-300 bg-white" />
              </div>

              <button type="submit" className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold rounded-xl transition-colors mt-2">
                Appoint Officer
              </button>
            </form>

            {/* List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              <h4 className="font-bold text-slate-800 text-sm pb-2">Active Officers</h4>
              {officers.map((off) => (
                <div key={off.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-sm">{off.officerName}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px] uppercase">
                      {off.district}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium">{off.roleTitle}</div>
                  <div className="text-slate-500">Phone: {off.phone} | Email: {off.email}</div>
                  <div className="text-slate-400 mt-2 text-[11px]">{off.officeAddress}</div>
                </div>
              ))}
              {officers.length === 0 && (
                <div className="text-center text-slate-500 text-sm py-10">No officers found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
