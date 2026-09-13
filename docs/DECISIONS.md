# Pan-India B2B Crop Marketplace - Decisions & Assumptions

**Project:** Pan-India B2B Crop Marketplace  
**Prepared by:** Cyber Shield  
**Document Version:** 1.0 (Prototype Specification)  

---

## 1. Technical Architecture & Persistence Strategy

### Decision 1.1: Database Persistence Strategy
- **Decision:** Full Supabase PostgreSQL schema with migrations (`supabase/migrations/`) and seeds (`supabase/seed.sql`).
- **Development/Prototype Mode:** In environments without an active Supabase project URL or Docker daemon, an embedded transactional JSON repository adapter (`data/store.json`) persists records across server restarts and browser refreshes. When `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided, the application connects directly to Supabase.
- **Rationale:** Ensures operational records survive restart and refresh immediately without requiring Docker to be running on the host machine, while providing 100% compliant PostgreSQL DDL for production deployment.

### Decision 1.2: UI and Styling Framework
- **Decision:** Next.js 15+ App Router with TypeScript and Tailwind CSS.
- **Design System:** Deep emerald `#064e3b`, rich forest green `#047857`, vibrant mint `#10b981`, earthy warm gold `#d97706`, and clean slate cards `#0f172a`.
- **Aesthetic:** High-trust, professional, responsive mobile-first Indian agricultural portal with accessible typography, status chips, and crisp contrast.

---

## 2. Policy Defaults & Open Settings

### Decision 2.1: Bidding Window Defaults
- **Assumption:** The officer can set a custom bidding duration (default 24 hours, with options for 2 hours, 6 hours, 12 hours, 24 hours, or 48 hours for prototype demonstration).
- **Enforcement:** Enforced server-side. Once the closing timestamp passes, new bids are blocked.

### Decision 2.2: Late Cancellation Compensation
- **Assumption:** If a buyer cancels an order after payment is secured and within 12 hours of the scheduled pickup window, or fails to arrive (no-show), a 10% compensation fee is paid to the farmer from the held escrow balance, and the remaining 90% is refunded to the buyer. Uncollected produce is released back to the farmer.
- **Label:** Clearly marked as `PROTOTYPE POLICY DEFAULT (10%)`.

### Decision 2.3: Contact Disclosure Timing
- **Decision:** Farmer contact details are revealed to the buyer strictly *after* the order is confirmed and funded into escrow. Contact details are masked in public bidding lists.

### Decision 2.4: Unit Conventions
- **Decision:** All supply, bids, contributions, allocations, and handover weighing use **kilograms (kg)** with up to 2 decimal places. Unit prices are in **INR per kg (₹/kg)**. Fruits traditionally sold in pieces or bunches (bananas, coconuts) are strictly converted to kg weight.

### Decision 2.5: Simulated Escrow & Banking Integration
- **Decision:** All banking escrow operations (funds receipt, hold, seller payout release, and buyer refund) are executed through a persistent transactional simulation ledger. All payment receipts and cards bear the label: `DEMO/SIMULATED BANKING ESCROW`.

### Decision 2.6: AI Help Chatbot Scope
- **Decision:** The chatbot provides informational guidance, onboarding assistance, officer lookup, and FAQ answers. It has zero authority to accept bids, alter prices, resolve grievances, or release funds. Works via Gemini API if configured, with an instant built-in FAQ knowledge fallback if no API key is set.
