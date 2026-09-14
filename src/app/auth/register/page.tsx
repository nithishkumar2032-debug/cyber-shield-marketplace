'use client';

// Registration Portal: Buyer Category Onboarding & Farmer Approach Form
// Prepared by Cyber Shield | SIH 26033

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Building2,
  Sprout,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerBuyer, requestOnboarding } = useMarketplace();
  const [activeMode, setActiveMode] = useState<'buyer' | 'farmer'>('buyer');

  // Buyer Form State
  const [orgName, setOrgName] = useState('');
  const [buyerCategory, setBuyerCategory] = useState<'Company / Processor' | 'College / Institution' | 'Retail Store'>('Company / Processor');
  const [purchaserName, setPurchaserName] = useState('');
  const [buyerMobile, setBuyerMobile] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [deliveryState, setDeliveryState] = useState('Tamil Nadu');
  const [deliveryDistrict, setDeliveryDistrict] = useState('Chennai');
  const [buyerRegNumber, setBuyerRegNumber] = useState('');

  // Farmer Form State
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerState, setFarmerState] = useState('Tamil Nadu');
  const [farmerDistrict, setFarmerDistrict] = useState('Thanjavur');
  const [farmerTaluka, setFarmerTaluka] = useState('Budalur');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('Paddy / Rice');
  const [landAcres, setLandAcres] = useState<number>(1.5);

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    const res = await registerBuyer({
      organizationName: orgName,
      category: buyerCategory,
      authorizedPurchaser: purchaserName,
      mobile: buyerMobile,
      email: buyerEmail,
      deliveryState,
      deliveryDistrict,
      businessRegistrationNumber: buyerRegNumber,
    });

    setSubmitting(false);
    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: `Application submitted for ${orgName}! Your verification documents are under review by Government administrators.`,
      });
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to submit buyer registration.' });
    }
  };

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    const res = await requestOnboarding({
      fullName: farmerName,
      phone: farmerPhone,
      state: farmerState,
      district: farmerDistrict,
      taluka: farmerTaluka,
      village: farmerVillage,
      primaryCrop,
      estimatedLandAcres: landAcres,
    });

    setSubmitting(false);
    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: `Registration request recorded for ${farmerName}! Assigned to ${res.data.assignedOfficerName}. The officer will visit your land for verification and generate your activation link.`,
      });
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to submit request.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Join the Pan-India B2B Marketplace
        </h1>
        <p className="text-sm text-slate-600">
          Select whether you are registering as an institutional B2B buyer or requesting officer onboarding as a farmer.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          onClick={() => {
            setActiveMode('buyer');
            setStatusMsg(null);
          }}
          className={`py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeMode === 'buyer'
              ? 'bg-white text-purple-900 shadow-md border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-600" />
          <span>B2B Buyer Registration</span>
        </button>

        <button
          onClick={() => {
            setActiveMode('farmer');
            setStatusMsg(null);
          }}
          className={`py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeMode === 'farmer'
              ? 'bg-white text-emerald-900 shadow-md border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>Farmer Assisted Onboarding</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-sm ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Buyer Registration Form */}
      {activeMode === 'buyer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">B2B Buyer Entity Application</h2>
            <p className="text-xs text-slate-500">
              Submit proof of business registration and authorized purchaser resolution.
            </p>
          </div>

          <form onSubmit={handleBuyerSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization / Store Name:</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Apex Food Processing Ltd."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Buyer Category:</label>
                <select
                  value={buyerCategory}
                  onChange={(e: any) => setBuyerCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Company / Processor">Company / Food Processor</option>
                  <option value="College / Institution">College / Educational Institution</option>
                  <option value="Retail Store">Retail Store / Supermarket Chain</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Authorized Purchaser Name:</label>
                <input
                  type="text"
                  value={purchaserName}
                  onChange={(e) => setPurchaserName(e.target.value)}
                  placeholder="e.g. Anand Varma (Procurement Head)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Mobile Number:</label>
                <input
                  type="text"
                  value={buyerMobile}
                  onChange={(e) => setBuyerMobile(e.target.value)}
                  placeholder="+91 98400 12345"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery State:</label>
                <input
                  type="text"
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery District:</label>
                <input
                  type="text"
                  value={deliveryDistrict}
                  onChange={(e) => setDeliveryDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Business Registration / GST / CIN:
              </label>
              <input
                type="text"
                value={buyerRegNumber}
                onChange={(e) => setBuyerRegNumber(e.target.value)}
                placeholder="CIN-U15400TN2020PLC123456 or GSTIN"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                required
              />
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Verification Document Checklist for {buyerCategory}</span>
              </div>
              <p className="text-[11px] text-purple-800">
                1. Registration / Incorporation proof • 2. Board resolution or proprietor authorization for buyer representative.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting Application...' : 'Submit B2B Buyer Application'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Farmer Onboarding Request Form */}
      {activeMode === 'farmer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Request Agricultural Officer Field Visit</h2>
            <p className="text-xs text-slate-500">
              Your local Agricultural Officer will inspect your land, verify production capacity, and generate your secure activation link.
            </p>
          </div>

          <form onSubmit={handleFarmerSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farmer Full Name:</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Selvam Ramasamy"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone Number:</label>
                <input
                  type="text"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="+91 94430 00000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State:</label>
                <input
                  type="text"
                  value={farmerState}
                  onChange={(e) => setFarmerState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">District:</label>
                <input
                  type="text"
                  value={farmerDistrict}
                  onChange={(e) => setFarmerDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Taluka / Block:</label>
                <input
                  type="text"
                  value={farmerTaluka}
                  onChange={(e) => setFarmerTaluka(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Village:</label>
                <input
                  type="text"
                  value={farmerVillage}
                  onChange={(e) => setFarmerVillage(e.target.value)}
                  placeholder="Village name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Crop:</label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                >
                  <option value="Paddy / Rice">Paddy / Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Banana (Sold by Kg Weight)">Banana (Sold by Kg Weight)</option>
                  <option value="Coconut (Sold by Kg Weight)">Coconut (Sold by Kg Weight)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Land Size (Acres):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={landAcres}
                  onChange={(e) => setLandAcres(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <b>Inclusive Eligibility Guarantee:</b> Zero minimum landholding requirement. Small farmers with 0.5 to 2 acres are verified and can sell through FPO aggregated lots.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Sprout className="w-4 h-4" />
              <span>{submitting ? 'Recording Request...' : 'Request Officer Land Verification'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
