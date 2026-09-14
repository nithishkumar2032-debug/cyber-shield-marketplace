// Persistent Transactional Store for Cyber Shield Pan-India B2B Crop Marketplace
// Prepared by Cyber Shield | SIH 26033
// Persists operational records to data/store.json to guarantee survival across server restarts and page refreshes.

import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  OfficerJurisdiction,
  CropCatalogueItem,
  FarmerRecord,
  FPORecord,
  FPOMemberContribution,
  BuyerRecord,
  CropListing,
  BidRecord,
  AllocationRecord,
  OrderRecord,
  EscrowRecord,
  TransportAssignment,
  PickupVerification,
  GrievanceRecord,
  AuditEvent,
  BuyerDemandRequest,
} from '@/types';
import {
  INITIAL_OFFICERS,
  CROP_CATALOGUE,
  INITIAL_FARMERS,
  INITIAL_FPOS,
  INITIAL_FPO_CONTRIBUTIONS,
  INITIAL_BUYERS,
  INITIAL_LISTINGS,
  INITIAL_BIDS,
  INITIAL_ORDERS,
  INITIAL_ESCROWS,
  INITIAL_GRIEVANCES,
  INITIAL_AUDIT_EVENTS,
} from './seed-data';

export interface DatabaseState {
  officers: OfficerJurisdiction[];
  catalogue: CropCatalogueItem[];
  farmers: FarmerRecord[];
  fpos: FPORecord[];
  fpoContributions: FPOMemberContribution[];
  buyers: BuyerRecord[];
  listings: CropListing[];
  bids: BidRecord[];
  allocations: AllocationRecord[];
  orders: OrderRecord[];
  escrows: EscrowRecord[];
  transports: TransportAssignment[];
  pickups: PickupVerification[];
  grievances: GrievanceRecord[];
  auditLogs: AuditEvent[];
  demands: BuyerDemandRequest[];
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
const SEED_PATH = path.join(process.cwd(), 'data', 'store.json');
const DATA_DIR = isServerless ? path.join(os.tmpdir(), 'cyber-shield-marketplace') : path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

function getDefaultState(): DatabaseState {
  return {
    officers: INITIAL_OFFICERS,
    catalogue: CROP_CATALOGUE,
    farmers: INITIAL_FARMERS,
    fpos: INITIAL_FPOS,
    fpoContributions: INITIAL_FPO_CONTRIBUTIONS,
    buyers: INITIAL_BUYERS,
    listings: INITIAL_LISTINGS,
    bids: INITIAL_BIDS,
    allocations: [],
    orders: INITIAL_ORDERS,
    escrows: INITIAL_ESCROWS,
    transports: [],
    pickups: [],
    grievances: INITIAL_GRIEVANCES,
    auditLogs: INITIAL_AUDIT_EVENTS,
    demands: [],
  };
}

export function getStore(): DatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(STORE_PATH)) {
      // In serverless environments, check if the pre-bundled seed file exists
      if (fs.existsSync(SEED_PATH)) {
        try {
          const seedContent = fs.readFileSync(SEED_PATH, 'utf-8');
          fs.writeFileSync(STORE_PATH, seedContent, 'utf-8');
          return JSON.parse(seedContent);
        } catch {
          // fall through to default state
        }
      }

      const defaultState = getDefaultState();
      fs.writeFileSync(STORE_PATH, JSON.stringify(defaultState, null, 2), 'utf-8');
      return defaultState;
    }

    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('[Store] Error reading store, returning default state:', err);
    return getDefaultState();
  }
}

export function saveStore(state: DatabaseState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Error writing store:', err);
  }
}

export function addAuditLog(
  actorId: string,
  actorName: string,
  actorRole: any,
  action: string,
  targetEntity: string,
  targetId: string,
  reason?: string,
  details?: Record<string, any>
): AuditEvent {
  const store = getStore();
  const event: AuditEvent = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    actorId,
    actorName,
    actorRole,
    action,
    targetEntity,
    targetId,
    reason,
    details,
  };
  store.auditLogs.unshift(event);
  saveStore(store);
  return event;
}

export function resetStore(): DatabaseState {
  const fresh = getDefaultState();
  saveStore(fresh);
  return fresh;
}
