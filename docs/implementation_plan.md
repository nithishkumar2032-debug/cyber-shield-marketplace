# Pan-India B2B Crop Marketplace (Prepared by Cyber Shield) - Implementation Plan

Building the Pan-India B2B Crop Marketplace based on `docs/Cyber_Shield_Antigravity_Build_Prompt.md` and `docs/Cyber_Shield_Pan_India_B2B_Crop_Marketplace_Revised.pdf`.

The project connects verified individual small/large farmers and FPO groups with registered B2B buyers across India, with officer-assisted onboarding, transparent bidding, atomic partial allocation, simulated banking partner escrow, OTP/QR pickup verification, grievance handling, and an AI help chatbot.

---

## User Review Required

> [!IMPORTANT]
> **Key Architectural and Scope Decisions**:
> 1. **Framework & Styling**: Next.js (App Router), TypeScript, and Tailwind CSS.
> 2. **Persistence Architecture**:
>    - Production schema: Complete PostgreSQL migrations (`supabase/migrations/`) with RLS policies, constraints, indexes, and seed files (`supabase/seed.sql`).
>    - Data Access Layer: Supports live Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). To satisfy the requirement that *operational records must survive refresh, sign-out, and server restart immediately out-of-the-box without Docker*, we implement a persistent file-backed transactional repository adapter (`data/store.json`) when Supabase remote credentials are not yet supplied.
> 3. **Demo Labels**: Every simulated payment screen and receipt will carry distinct `DEMO/SIMULATED` badges.
> 4. **AI Help Chatbot**: Strictly restricted to navigational guidance, portal instructions, FAQs, and officer contact lookup. Integrates with Google Gemini API if `GEMINI_API_KEY` is present, with an immediate fallback to structured knowledge FAQs.

---

## Proposed Page Map & Screen Layouts

The application will feature a unified design system with a clean, high-trust Indian agricultural aesthetic (Emerald, Deep Slate, Gold accents, accessible typography, high contrast):

### Page Map
1. **Public & Landing Pages**:
   - `/` - Home / Portal overview, mission, active public crop listings, live statistics, role entry points, Help Chatbot launcher.
   - `/explore` - India-wide Crop Discovery with State/District, Crop, Variety, and Availability filters.
   - `/bids` - Public Bidding Windows and transparent bids table (masked contact/bank details).
   - `/officers` - Public Taluka/District Agricultural Officer Directory.
   - `/auth/login` - Multi-role login & Secure Farmer Activation Link claim interface (`/auth/activate?token=...`).
   - `/auth/register` - Buyer registration with document uploads & Farmer onboarding request.
2. **Farmer & FPO Portal (`/farmer`)**:
   - `/farmer` - Farmer Dashboard: Active crop listings, bid notifications, orders awaiting choice, payout balance, assigned officer card.
   - `/farmer/listings` - View own listings & expected yields.
   - `/farmer/bids` - Select preferred buyer bids, propose kg allocations, view officer confirmation status.
   - `/farmer/orders` - Track orders, escrow funding status, scheduled pickup time, vehicle & driver details, OTP display for pickup.
   - `/farmer/fpo` - FPO Representative view: member roster, individual kg contributions, group lot creation, sales attribution.
   - `/farmer/grievances` - File complaint, view complaint status and officer responses.
3. **Agricultural Officer Portal (`/officer`)**:
   - `/officer` - Officer Dashboard: Assigned jurisdiction (State/District/Taluka), pending onboarding requests, active bidding approvals, pickup inspections.
   - `/officer/onboard` - Field visit intake form: GPS coordinates, land ownership/lease proof, crop/variety, estimated yield, photos, initial bank details. Generate secure single-use farmer access link.
   - `/officer/bidding` - Manage published bidding windows, review farmer allocations, record phone confirmation with buyer.
   - `/officer/pickup` - Handover verification: verify arriving driver/vehicle against assignment, check OTP/QR, record weight in kg, upload inspection notes & photos, mark `Dispatch Verified`.
   - `/officer/grievances` - Review assigned complaints, add investigation notes, escalate or resolve.
4. **Buyer Portal (`/buyer`)**:
   - `/buyer` - Buyer Dashboard: Account verification status, submitted bids, active orders, transport coordination.
   - `/buyer/browse` - Search listings, view reference prices (source/date), submit quantity-specific bids (kg, ₹/kg, pickup date).
   - `/buyer/demand` - Post specific crop demand requests (crop, kg needed, required date, delivery district).
   - `/buyer/orders/[id]` - View confirmed order, review terms snapshot, simulate escrow prepayment, assign transport partner, vehicle and driver.
   - `/buyer/orders/[id]/receipt` - View simulated bank escrow receipt and delivery confirmation.
5. **Government & Platform Administrator Portal (`/admin`)**:
   - `/admin` - Platform Administration Overview: User management, pending buyer verifications, officer jurisdiction assignments.
   - `/admin/buyers` - Review buyer business registration documents, approve or request corrections.
   - `/admin/catalogue` - Manage crops, varieties (paddy vs milled, bananas in kg, etc.), reference prices.
   - `/admin/policies` - Versioned bidding cutoffs, cancellation compensation rules, grace periods.
   - `/admin/audit` - Immutable audit log viewer (actor, action, timestamp, record ID, reason).

---

## Phased Implementation Plan

### Phase 1: Foundation, Documentation & Initial Layouts (Stage 1)
- Initialize Next.js 15+ App Router application with TypeScript and Tailwind CSS.
- Create tracking documentation:
  - `docs/REQUIREMENTS.md` (detailed verification checklist from both prompt and PDF).
  - `docs/DECISIONS.md` (assumptions, policy defaults, kg conventions).
  - `docs/BUILD_STATUS.md` (milestone tracking).
- Build the core design system (tokens, navigation header, status badges, responsive layout shell, role switcher).
- Implement initial screen layouts for Farmer, Agricultural Officer, Buyer, and Administrator with mock preview fixtures clearly labeled.
- Verify desktop and mobile layouts in browser.

### Phase 2: Database Schema, Migrations & Identity Onboarding (Stage 2)
- Create Supabase SQL migrations (`supabase/migrations/20260913000001_initial_schema.sql`):
  - Tables: `profiles`, `officer_jurisdictions`, `farmers`, `land_parcels`, `farmer_activation_tokens`, `fpos`, `fpo_members`, `fpo_contributions`, `buyer_organizations`, `buyer_documents`, `crop_catalogue`, `crop_varieties`, `listings`, `demands`, `bids`, `allocations`, `orders`, `escrow_transactions`, `transport_assignments`, `pickup_verifications`, `grievances`, `grievance_responses`, `audit_logs`, `platform_policies`.
  - Row Level Security (RLS) policies and security triggers.
- Implement transactional persistence repository layer (supports live Supabase client and file-backed fallback store).
- Officer-assisted onboarding workflow: field visit data entry, GPS coordinates, photo uploads, initial bank details capture (masked in routine UI).
- Expiring single-use farmer activation link generation & authentication.
- Buyer registration workflow with document upload and admin approval pipeline.
- Seed data (`supabase/seed.sql` and `scripts/seed.ts`) with realistic Indian crops, test farmers, FPO members, officers across districts, buyers, and admin.

### Phase 3: Crop Catalogue, Supply Listings & Discovery (Stage 3)
- Seed and manage catalogue: Cereals, pulses, vegetables, fruits, cash crops (paddy vs milled rice, wheat, bananas by kg weight, coconuts by kg weight).
- Farmer & FPO listing creation:
  - Individual bulk farmer listings.
  - FPO group aggregation: link member contributions in kg, prevent double allocation of the same quantity.
- India-wide marketplace discovery:
  - Unfiltered search across India.
  - State & District cascading filters (e.g. Tamil Nadu -> Thanjavur).
  - Crop and availability filters.
  - Reference price tags with date and source.
- Buyer demand board (post and view required crops and quantities).

### Phase 4: Transparent Bidding & Atomic Partial Allocation (Stage 4)
- Published short bidding window with live countdown timer.
- Quantity-specific bids (kg, price per kg, total amount, validity, proposed pickup date).
- Public bidding table showing transparent prices, quantities, timestamps (masked private contact info).
- Farmer bid selection & allocation interface:
  - Support the canonical 50 kg lot example (Buyer A: 10 kg @ ₹20/kg = ₹200; Buyer B: 20 kg @ ₹22/kg = ₹440; 20 kg remains available).
- Officer phone confirmation logging: officer records phone call timestamp, confirmation notes, verified terms.
- Buyer final acceptance step: buyer confirms final agreed quantity, price, and pickup schedule.
- Atomic reservation enforcement: PostgreSQL transaction / repository lock preventing overselling. Creation of separate order records for each accepted allocation.

### Phase 5: Demo Banking Escrow, Transport & Verified Pickup (Stage 5)
- Order digital agreement snapshot: immutable record of crop, variety, confirmed kg, unit price, quality terms, pickup deadline, custody transfer rule.
- Simulated Banking Escrow:
  - Persistent financial transaction ledger.
  - Clear `DEMO / SIMULATED ESCROW` notices on all payment screens and receipts.
  - Buyer prepays full amount into escrow -> funds marked `Held`.
  - Payment secured requirement before transport release.
- Transport Assignment:
  - Buyer enters transport company, vehicle number & capacity, driver/collector name & phone.
  - Farmer contact details unlocked for coordination upon order confirmation.
- Order-bound Pickup OTP / QR challenge:
  - Single-use, time-bound, cryptographically random verification code.
- Verified Handover Workflow:
  - Driver presents OTP / QR to officer and farmer at pickup site.
  - Officer weighs crop in kg, records scale reading, checks quality, captures field photos.
  - Shortage / quality exception handling recorded if actual weight differs from order.
  - Triple confirmation: Farmer, Driver, Officer submit approval -> status becomes `Dispatch Verified`.
  - Custody transfers to buyer; triggers automated release of held escrow to verified seller account.
  - Payment marked `Paid` with simulated bank transaction receipt.

### Phase 6: Exceptions, Grievances, Chatbot & Audit System (Stage 6)
- Staged cancellation policy:
  - Before acceptance: free withdrawal.
  - Confirmed unpaid: cancellation frees reserved quantity back to listing.
  - Secured pre-pickup: cancellation requires officer decision, triggers escrow refund.
  - Late cancellation / no-show: farmer compensation calculation from versioned policy.
- Grievance Portal:
  - Category, description, optional order/listing link, attachments, auto-generated complaint tracking ID.
  - Routing to assigned Taluka/District officer, response history, escalation to district supervisor.
- Help Chatbot:
  - Portal guidance assistant: answers questions on opening farmer profile, choosing bids, finding local officers, filing grievances, understanding escrow.
  - Integration with Gemini API when key is configured; built-in intelligent contextual FAQ engine when no key is set.
- Audit Log:
  - Immutable audit trail recording actor, action, timestamp, affected entity ID, and justification for every state change.

### Phase 7: Verification, Testing, Documentation & Handover (Stage 7)
- Automated unit/integration tests for:
  - Role isolation and unauthorized access prevention.
  - Atomic allocation preventing overselling (e.g., 50 kg limit).
  - FPO member contribution double-spend prevention.
  - Payment state idempotency (preventing duplicate escrow release).
  - Handover OTP verification and dispute hold.
- Browser E2E verification:
  - Farmer onboarding -> Activation link -> Listing crop -> Buyer bidding -> Allocation -> Officer confirmation -> Buyer confirmation -> Escrow funding -> Transport assignment -> OTP pickup verification -> Escrow release -> Order closure.
- Project documentation:
  - Updated `docs/REQUIREMENTS.md`, `docs/DECISIONS.md`, `docs/BUILD_STATUS.md`.
  - `.env.example` with clear documentation of external credentials (Supabase, Gemini).
  - Detailed `walkthrough.md` with screenshots and operational instructions.

---

## Verification Plan

### Automated Tests
- Run Next.js linting and TypeScript checks: `npm run lint` and `npx tsc --noEmit`.
- Run workflow test suite verifying:
  - 50 kg partial allocation math and remaining balance.
  - Bidding window expiry enforcement.
  - OTP verification and replay rejection.
  - Escrow release idempotency.

### Manual & Browser Verification
- Using the browser subagent, navigate through all key journeys:
  1. Desktop & Mobile view of public marketplace and landing page.
  2. Farmer and FPO listing workflow.
  3. Buyer browsing with location filters and placing bids.
  4. Farmer allocating bids and officer phone confirmation.
  5. Buyer escrow prepayment and transport assignment.
  6. Officer pickup verification with OTP and weight capture.
  7. Escrow payout receipt and order closure.
  8. Grievance filing and Help Chatbot interaction.
