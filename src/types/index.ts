// Types for Cyber Shield Pan-India B2B Crop Marketplace
// Aligned with SIH 26033 Specification and Antigravity Build Guidelines

export type UserRole =
  | 'guest'
  | 'farmer'
  | 'fpo_representative'
  | 'officer'
  | 'supervisor'
  | 'buyer'
  | 'admin'
  | 'collector';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  email?: string;
  state?: string;
  district?: string;
  taluka?: string;
  organizationName?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface OfficerJurisdiction {
  id: string;
  officerId: string;
  officerName: string;
  roleTitle: 'Village Agriculture Officer' | 'Taluka Agriculture Officer' | 'District Agricultural Officer';
  state: string;
  district: string;
  taluka?: string;
  phone: string;
  email: string;
  officeAddress: string;
  backupOfficerName?: string;
}

export type FarmerStatus =
  | 'onboarding_requested'
  | 'field_visit_done'
  | 'submitted'
  | 'verified'
  | 'correction_required';

export interface FarmerRecord {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  gpsCoordinates?: { lat: number; lng: number };
  landSizeAcres: number;
  ownershipType: 'Owner' | 'Valid Lease';
  primaryCrops: string[];
  expectedYieldKg: number;
  bankAccountMasked: string; // e.g. "•••• •••• 4821"
  ifscCode: string;
  bankName: string;
  status: FarmerStatus;
  correctionReason?: string;
  assignedOfficerId: string;
  assignedOfficerName: string;
  activationToken?: string;
  activationExpiresAt?: string;
  isActivated: boolean;
  fieldNotes?: string;
  documentProofs: string[];
  fieldPhotos: string[];
  createdAt: string;
}

export interface FPORecord {
  id: string;
  name: string;
  registrationNumber: string;
  representativeId: string;
  representativeName: string;
  representativePhone: string;
  state: string;
  district: string;
  memberCount: number;
  createdAt: string;
}

export interface FPOMemberContribution {
  id: string;
  fpoId: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  variety: string;
  expectedKg: number;
  harvestWindow: string;
  allocatedKg: number;
  remainingKg: number;
  status: 'available' | 'committed' | 'dispatched';
}

export type BuyerCategory = 'Company / Processor' | 'College / Institution' | 'Retail Store';
export type BuyerStatus = 'submitted' | 'under_review' | 'verified' | 'correction_required';

export interface BuyerRecord {
  id: string;
  organizationName: string;
  category: BuyerCategory;
  authorizedPurchaser: string;
  mobile: string;
  email: string;
  address: string;
  deliveryState: string;
  deliveryDistrict: string;
  businessRegistrationNumber: string;
  documents: { title: string; filename: string; verified: boolean }[];
  status: BuyerStatus;
  correctionReason?: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface CropVariety {
  name: string;
  productForm?: string; // e.g., 'Paddy' vs 'Milled Rice'
}

export interface CropCatalogueItem {
  id: string;
  cropName: string;
  category: 'Cereals' | 'Pulses' | 'Vegetables' | 'Fruits' | 'Cash Crops';
  varieties: CropVariety[];
  referencePricePerKg: number; // in INR
  referenceSource: string; // e.g. "Agmarknet / NAFED Reference"
  referenceDate: string;
}

export type ListingStatus =
  | 'draft'
  | 'open_for_bids'
  | 'partially_allocated'
  | 'fully_allocated'
  | 'expired'
  | 'cancelled';

export interface CropListing {
  id: string;
  listingCode: string;
  sellerType: 'individual' | 'fpo';
  sellerId: string;
  sellerName: string;
  crop: string;
  variety: string;
  productForm?: string;
  totalQuantityKg: number;
  allocatedQuantityKg: number;
  availableQuantityKg: number;
  minimumPricePerKg: number; // in INR
  expectedHarvestDate: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  state: string;
  district: string;
  approximatePickupArea: string;
  qualityTerms: string;
  images: string[];
  status: ListingStatus;
  biddingDeadline: string;
  officerInspectionNotes?: string;
  fpoContributionIds?: string[];
  createdAt: string;
}

export type BidStatus =
  | 'submitted'
  | 'selected_by_farmer'
  | 'officer_confirmed'
  | 'accepted_by_buyer'
  | 'rejected'
  | 'expired';

export interface BidRecord {
  id: string;
  listingId: string;
  listingCode: string;
  crop: string;
  variety: string;
  buyerId: string;
  buyerOrgName: string;
  buyerCategory: BuyerCategory;
  requestedQuantityKg: number;
  offeredPricePerKg: number;
  totalBidAmount: number;
  proposedPickupDate: string;
  bidValidityDeadline: string;
  status: BidStatus;
  createdAt: string;
}

export interface AllocationRecord {
  id: string;
  listingId: string;
  bidId: string;
  buyerId: string;
  buyerOrgName: string;
  allocatedKg: number;
  agreedPricePerKg: number;
  totalOrderValue: number;
  farmerSelectedAt: string;
  officerConfirmedAt?: string;
  officerPhoneNotes?: string;
  buyerConfirmedAt?: string;
  status: 'proposed' | 'officer_confirmed' | 'buyer_accepted' | 'converted_to_order' | 'cancelled';
}

export type OrderStatus =
  | 'awaiting_confirmation'
  | 'awaiting_payment'
  | 'secured'
  | 'vehicle_assigned'
  | 'inspection'
  | 'dispatch_verified'
  | 'paid'
  | 'closed'
  | 'cancelled'
  | 'disputed';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  listingId: string;
  allocationId: string;
  buyerId: string;
  buyerOrgName: string;
  buyerPhone?: string; // Revealed after confirmation
  sellerId: string;
  sellerName: string;
  sellerType: 'individual' | 'fpo';
  sellerPhone?: string; // Revealed after confirmation
  crop: string;
  variety: string;
  confirmedQuantityKg: number;
  agreedPricePerKg: number;
  totalOrderAmount: number; // in INR
  qualityTermsSnapshot: string;
  pickupDeadline: string;
  custodyRule: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type EscrowStatus =
  | 'awaiting'
  | 'received'
  | 'held'
  | 'released'
  | 'partial_refund'
  | 'full_refund'
  | 'disputed';

export interface EscrowRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  buyerId: string;
  sellerId: string;
  heldAmount: number;
  releasedAmount?: number;
  refundedAmount?: number;
  simulationBadge: 'DEMO/SIMULATED';
  status: EscrowStatus;
  paymentReference: string;
  fundedAt?: string;
  settledAt?: string;
  disputeHoldReason?: string;
}

export interface TransportAssignment {
  id: string;
  orderId: string;
  transportPartner: string;
  vehicleNumber: string;
  vehicleCapacityKg: number;
  driverName: string;
  driverPhone: string;
  estimatedArrival: string;
  status: 'assigned' | 'arrived' | 'departed';
  assignedAt: string;
}

export interface PickupVerification {
  id: string;
  orderId: string;
  orderNumber: string;
  pickupOtp: string;
  qrChallengeCode: string;
  scaleWeightKg: number;
  shortageQuantityKg?: number;
  inspectionNotes: string;
  photoEvidenceUrls: string[];
  farmerConfirmed: boolean;
  collectorConfirmed: boolean;
  officerConfirmed: boolean;
  verifyingOfficerId: string;
  verifyingOfficerName: string;
  isDispatched: boolean;
  verifiedAt?: string;
}

export type GrievanceStatus =
  | 'opened'
  | 'assigned'
  | 'under_review'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'appealed';

export interface GrievanceRecord {
  id: string;
  complaintNumber: string;
  complainantId: string;
  complainantName: string;
  complainantRole: UserRole;
  complainantPhone: string;
  category: 'Shortage at Pickup' | 'Quality Dispute' | 'Payment Delay' | 'Vehicle / Logistics No-Show' | 'Officer Verification' | 'Portal Navigation';
  description: string;
  linkedOrderId?: string;
  linkedListingId?: string;
  evidenceFiles: string[];
  assignedOfficerId: string;
  assignedOfficerName: string;
  hierarchyLevel: 'Taluka' | 'District' | 'State Administration';
  status: GrievanceStatus;
  responses: {
    authorName: string;
    authorRole: string;
    message: string;
    timestamp: string;
  }[];
  resolutionNotes?: string;
  createdAt: string;
  closedAt?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  targetId: string;
  reason?: string;
  details?: Record<string, any>;
}

export interface BuyerDemandRequest {
  id: string;
  buyerId: string;
  buyerOrgName: string;
  crop: string;
  variety: string;
  neededQuantityKg: number;
  targetPricePerKg?: number;
  requiredDate: string;
  deliveryState: string;
  deliveryDistrict: string;
  status: 'open' | 'matched' | 'fulfilled' | 'closed';
  createdAt: string;
}
