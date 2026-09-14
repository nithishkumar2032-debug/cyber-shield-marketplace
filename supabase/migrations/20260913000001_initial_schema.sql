-- Cyber Shield Pan-India B2B Crop Marketplace
-- Initial PostgreSQL Migration (Supabase Compatible)
-- Prepared by Cyber Shield | SIH 26033

-- 1. Custom Enums
CREATE TYPE user_role AS ENUM (
  'guest',
  'farmer',
  'fpo_representative',
  'officer',
  'supervisor',
  'buyer',
  'admin',
  'collector'
);

CREATE TYPE farmer_status AS ENUM (
  'onboarding_requested',
  'field_visit_done',
  'submitted',
  'verified',
  'correction_required'
);

CREATE TYPE buyer_category AS ENUM (
  'company_processor',
  'college_institution',
  'retail_store'
);

CREATE TYPE buyer_status AS ENUM (
  'submitted',
  'under_review',
  'verified',
  'correction_required'
);

CREATE TYPE listing_status AS ENUM (
  'draft',
  'open_for_bids',
  'partially_allocated',
  'fully_allocated',
  'expired',
  'cancelled'
);

CREATE TYPE bid_status AS ENUM (
  'submitted',
  'selected_by_farmer',
  'officer_confirmed',
  'accepted_by_buyer',
  'rejected',
  'expired'
);

CREATE TYPE order_status AS ENUM (
  'awaiting_confirmation',
  'awaiting_payment',
  'secured',
  'vehicle_assigned',
  'inspection',
  'dispatch_verified',
  'paid',
  'closed',
  'cancelled',
  'disputed'
);

CREATE TYPE escrow_status AS ENUM (
  'awaiting',
  'received',
  'held',
  'released',
  'partial_refund',
  'full_refund',
  'disputed'
);

-- 2. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'farmer',
  state TEXT,
  district TEXT,
  taluka TEXT,
  organization_name TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Officer Jurisdictions
CREATE TABLE officer_jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  taluka TEXT,
  phone TEXT NOT NULL,
  office_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Farmers Table
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  taluka TEXT NOT NULL,
  village TEXT NOT NULL,
  gps_lat NUMERIC(9, 6),
  gps_lng NUMERIC(9, 6),
  land_size_acres NUMERIC(6, 2) NOT NULL,
  ownership_type TEXT NOT NULL,
  primary_crops TEXT[] NOT NULL DEFAULT '{}',
  expected_yield_kg NUMERIC(10, 2) NOT NULL CHECK (expected_yield_kg >= 0),
  bank_account_masked TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  status farmer_status NOT NULL DEFAULT 'onboarding_requested',
  correction_reason TEXT,
  assigned_officer_id UUID REFERENCES profiles(id),
  activation_token TEXT UNIQUE,
  activation_expires_at TIMESTAMPTZ,
  is_activated BOOLEAN NOT NULL DEFAULT false,
  field_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. FPO & Aggregation
CREATE TABLE fpos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  representative_id UUID NOT NULL REFERENCES profiles(id),
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fpo_member_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fpo_id UUID NOT NULL REFERENCES fpos(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  variety TEXT NOT NULL,
  expected_kg NUMERIC(10, 2) NOT NULL CHECK (expected_kg > 0),
  harvest_window TEXT NOT NULL,
  allocated_kg NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (allocated_kg >= 0),
  remaining_kg NUMERIC(10, 2) GENERATED ALWAYS AS (expected_kg - allocated_kg) STORED,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_no_oversell CHECK (allocated_kg <= expected_kg)
);

-- 6. Crop Catalogue
CREATE TABLE crop_catalogue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  reference_price_per_kg NUMERIC(8, 2) NOT NULL,
  reference_source TEXT NOT NULL,
  reference_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE crop_varieties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES crop_catalogue(id) ON DELETE CASCADE,
  variety_name TEXT NOT NULL,
  product_form TEXT NOT NULL,
  UNIQUE(crop_id, variety_name)
);

-- 7. Buyer Organizations & Verification
CREATE TABLE buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organization_name TEXT NOT NULL,
  category buyer_category NOT NULL,
  authorized_purchaser TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  delivery_district TEXT NOT NULL,
  business_registration_number TEXT UNIQUE NOT NULL,
  status buyer_status NOT NULL DEFAULT 'submitted',
  correction_reason TEXT,
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Crop Listings (Strictly in kg and INR/kg)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_code TEXT UNIQUE NOT NULL,
  seller_type TEXT NOT NULL CHECK (seller_type IN ('individual', 'fpo')),
  seller_id UUID NOT NULL,
  crop TEXT NOT NULL,
  variety TEXT NOT NULL,
  product_form TEXT,
  total_quantity_kg NUMERIC(10, 2) NOT NULL CHECK (total_quantity_kg > 0),
  allocated_quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (allocated_quantity_kg >= 0),
  available_quantity_kg NUMERIC(10, 2) GENERATED ALWAYS AS (total_quantity_kg - allocated_quantity_kg) STORED,
  minimum_price_per_kg NUMERIC(8, 2) NOT NULL CHECK (minimum_price_per_kg > 0),
  expected_harvest_date DATE NOT NULL,
  pickup_window_start TIMESTAMPTZ NOT NULL,
  pickup_window_end TIMESTAMPTZ NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  approximate_pickup_area TEXT NOT NULL,
  quality_terms TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  status listing_status NOT NULL DEFAULT 'draft',
  bidding_deadline TIMESTAMPTZ NOT NULL,
  officer_inspection_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_listing_oversell CHECK (allocated_quantity_kg <= total_quantity_kg)
);

-- 9. Transparent Bids (Quantity specific in kg)
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  requested_quantity_kg NUMERIC(10, 2) NOT NULL CHECK (requested_quantity_kg > 0),
  offered_price_per_kg NUMERIC(8, 2) NOT NULL CHECK (offered_price_per_kg > 0),
  total_bid_amount NUMERIC(12, 2) NOT NULL,
  proposed_pickup_date DATE NOT NULL,
  bid_validity_deadline TIMESTAMPTZ NOT NULL,
  status bid_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Orders and Simulated Banking Escrow
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  listing_id UUID NOT NULL REFERENCES listings(id),
  bid_id UUID REFERENCES bids(id),
  buyer_id UUID NOT NULL REFERENCES buyers(id),
  seller_id UUID NOT NULL,
  seller_type TEXT NOT NULL,
  crop TEXT NOT NULL,
  variety TEXT NOT NULL,
  confirmed_quantity_kg NUMERIC(10, 2) NOT NULL CHECK (confirmed_quantity_kg > 0),
  agreed_price_per_kg NUMERIC(8, 2) NOT NULL CHECK (agreed_price_per_kg > 0),
  total_order_amount NUMERIC(12, 2) NOT NULL,
  quality_terms_snapshot TEXT NOT NULL,
  pickup_deadline TIMESTAMPTZ NOT NULL,
  custody_rule TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'awaiting_confirmation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES buyers(id),
  seller_id UUID NOT NULL,
  held_amount NUMERIC(12, 2) NOT NULL,
  released_amount NUMERIC(12, 2) DEFAULT 0,
  refunded_amount NUMERIC(12, 2) DEFAULT 0,
  simulation_badge TEXT NOT NULL DEFAULT 'DEMO/SIMULATED',
  status escrow_status NOT NULL DEFAULT 'awaiting',
  payment_reference TEXT UNIQUE NOT NULL,
  funded_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Transport Assignment & Pickup Verification
CREATE TABLE transport_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  transport_partner TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  vehicle_capacity_kg NUMERIC(10, 2) NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  estimated_arrival TIMESTAMPTZ NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pickup_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  pickup_otp TEXT NOT NULL,
  qr_challenge_code TEXT NOT NULL,
  scale_weight_kg NUMERIC(10, 2) NOT NULL CHECK (scale_weight_kg >= 0),
  shortage_quantity_kg NUMERIC(10, 2) DEFAULT 0,
  inspection_notes TEXT NOT NULL,
  photo_evidence_urls TEXT[] NOT NULL DEFAULT '{}',
  farmer_confirmed BOOLEAN NOT NULL DEFAULT false,
  collector_confirmed BOOLEAN NOT NULL DEFAULT false,
  officer_confirmed BOOLEAN NOT NULL DEFAULT false,
  verifying_officer_id UUID NOT NULL REFERENCES profiles(id),
  is_dispatched BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ
);

-- 12. Grievances and Immutable Audit Trail
CREATE TABLE grievances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number TEXT UNIQUE NOT NULL,
  complainant_id UUID NOT NULL REFERENCES profiles(id),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  linked_order_id UUID REFERENCES orders(id),
  linked_listing_id UUID REFERENCES listings(id),
  assigned_officer_id UUID REFERENCES profiles(id),
  hierarchy_level TEXT NOT NULL DEFAULT 'Taluka',
  status TEXT NOT NULL DEFAULT 'opened',
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_id UUID NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role user_role NOT NULL,
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT,
  details JSONB
);

-- 13. Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpo_member_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 14. Basic RLS Policies
-- Public Read on Catalogue & Open Listings
CREATE POLICY "Public Read Catalogue" ON crop_catalogue FOR SELECT USING (true);
CREATE POLICY "Public Read Listings" ON listings FOR SELECT USING (status != 'draft');

-- Authenticated Users can read their own profiles
CREATE POLICY "Read Own Profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Farmers see their own record
CREATE POLICY "Farmer Read Own" ON farmers FOR SELECT USING (profile_id = auth.uid());

-- Buyers see their own orders
CREATE POLICY "Buyer Read Own Orders" ON orders FOR SELECT USING (buyer_id IN (SELECT id FROM buyers WHERE profile_id = auth.uid()));

-- Escrow cannot be modified directly by public users
CREATE POLICY "Escrow Read Order Parties" ON escrows FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = escrows.order_id AND (orders.buyer_id IN (SELECT id FROM buyers WHERE profile_id = auth.uid()) OR orders.seller_id = auth.uid()))
);
