'use client';

// Client Marketplace Context & State Manager
// Prepared by Cyber Shield | SIH 26033

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, CropListing, BidRecord, OrderRecord, EscrowRecord, FarmerRecord, BuyerRecord, OfficerJurisdiction, GrievanceRecord, AuditEvent } from '@/types';
import { DatabaseState } from '@/lib/store';

interface MarketplaceContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  state: DatabaseState | null;
  loading: boolean;
  refresh: () => Promise<void>;
  createListing: (data: any) => Promise<any>;
  submitBid: (data: any) => Promise<any>;
  proposeAllocation: (bidId: string, allocatedKg: number) => Promise<any>;
  officerConfirmAllocation: (allocationId: string, phoneNotes?: string) => Promise<any>;
  buyerAcceptAllocation: (allocationId: string) => Promise<any>;
  prepayEscrow: (orderId: string) => Promise<any>;
  assignTransport: (orderId: string, transportData: any) => Promise<any>;
  verifyPickup: (orderId: string, pickupData: any) => Promise<any>;
  closeOrder: (orderId: string) => Promise<any>;
  requestOnboarding: (farmerData: any) => Promise<any>;
  officerFieldVisit: (fieldVisitData: any) => Promise<any>;
  claimActivation: (token: string, phone: string) => Promise<any>;
  registerBuyer: (buyerData: any) => Promise<any>;
  verifyBuyer: (buyerId: string, newStatus: 'verified' | 'correction_required', reason?: string) => Promise<any>;
  submitGrievance: (grievanceData: any) => Promise<any>;
  respondGrievance: (grievanceId: string, message: string, newStatus?: string, resolutionNotes?: string) => Promise<any>;
  appointOfficer: (officerData: any) => Promise<any>;
  resetDatabase: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('guest');
  const [state, setState] = useState<DatabaseState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBootstrap = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bootstrap');
      const data = await res.json();
      if (data.success) {
        setState(data.data);
      }
    } catch (err) {
      console.error('Failed to load marketplace bootstrap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBootstrap();
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const createListing = async (listingData: any) => {
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const submitBid = async (bidData: any) => {
    const res = await fetch('/api/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bidData),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const proposeAllocation = async (bidId: string, allocatedKg: number) => {
    const res = await fetch('/api/allocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'farmer_select', bidId, allocatedKg, farmerId: 'fmr-1' }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const officerConfirmAllocation = async (allocationId: string, phoneNotes?: string) => {
    const res = await fetch('/api/allocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'officer_confirm',
        allocationId,
        officerId: 'usr-officer-1',
        officerName: 'Dr. Anbarasan V.',
        phoneNotes,
      }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const buyerAcceptAllocation = async (allocationId: string) => {
    const res = await fetch('/api/allocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'buyer_accept', allocationId, buyerId: 'byr-1' }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const prepayEscrow = async (orderId: string) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'prepay_escrow', orderId }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const assignTransport = async (orderId: string, transportData: any) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'assign_transport', orderId, ...transportData }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const verifyPickup = async (orderId: string, pickupData: any) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_pickup', orderId, ...pickupData }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const closeOrder = async (orderId: string) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'close_order', orderId }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const requestOnboarding = async (farmerData: any) => {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'farmer_request', ...farmerData }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const officerFieldVisit = async (fieldVisitData: any) => {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'officer_field_visit', ...fieldVisitData }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const claimActivation = async (token: string, phone: string) => {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'claim_activation', token, phone }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const registerBuyer = async (buyerData: any) => {
    const res = await fetch('/api/buyers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', ...buyerData }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const verifyBuyer = async (buyerId: string, newStatus: 'verified' | 'correction_required', reason?: string) => {
    const res = await fetch('/api/buyers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', buyerId, newStatus, correctionReason: reason }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const submitGrievance = async (grievanceData: any) => {
    const res = await fetch('/api/grievances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', ...grievanceData }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const respondGrievance = async (grievanceId: string, message: string, newStatus?: string, resolutionNotes?: string) => {
    const res = await fetch('/api/grievances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'respond', grievanceId, message, newStatus, resolutionNotes }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const appointOfficer = async (officerData: any) => {
    const res = await fetch('/api/officers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'appoint', ...officerData }),
    });
    const result = await res.json();
    await fetchBootstrap();
    return result;
  };

  const resetDatabase = async () => {
    await fetch('/api/reset', { method: 'POST' });
    await fetchBootstrap();
  };

  return (
    <MarketplaceContext.Provider
      value={{
        role,
        setRole,
        state,
        loading,
        refresh: fetchBootstrap,
        createListing,
        submitBid,
        proposeAllocation,
        officerConfirmAllocation,
        buyerAcceptAllocation,
        prepayEscrow,
        assignTransport,
        verifyPickup,
        closeOrder,
        requestOnboarding,
        officerFieldVisit,
        claimActivation,
        registerBuyer,
        verifyBuyer,
        submitGrievance,
        respondGrievance,
        appointOfficer,
        resetDatabase,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return ctx;
}
