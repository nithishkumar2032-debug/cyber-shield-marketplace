# Pan-India B2B Crop Marketplace - Requirements Checklist

**Project:** Pan-India B2B Crop Marketplace  
**Prepared by:** Cyber Shield  
**Scope:** SIH 2026 Revised Problem Statement, Workflow and Prototype Scope  

---

## 1. Platform Boundaries & Operating Model
- [x] **Target:** Pan-India B2B crop procurement for individual farmers and FPO groups.
- [x] **Crops Only:** Direct consumer sales, dairy, eggs, and livestock excluded from this version.
- [x] **Inclusive Eligibility:** No minimum landholding required for onboarding; production capacity verified on-site.
- [x] **FPO Aggregation:** Small farmers combine produce into a verified bulk lot; individual bulk farmers list directly.
- [x] **Central Government Role:** Application administration, jurisdictional setup, and oversight (proposed SIH prototype, not live deployment claim).
- [x] **Banking Partner Escrow:** Protected escrow holding and payout (simulated with clear `DEMO/SIMULATED` markings).
- [x] **AI Assistance Scope:** Confined strictly to the Help Chatbot for guidance/instructions; no AI ranking, pricing, or buyer-picking.

---

## 2. Roles, Permissions and Data Access
- [x] **Farmer:** View own profile, land, crops, bids, allocations, orders, payments, assigned officers; select bids; request corrections; file grievances.
- [x] **FPO Representative:** Manage verified members, record individual kg contributions, list group lots, view group sales and member distributions.
- [x] **Agricultural Officer:** Visit land, capture GPS/land/crop/bank records, verify field facts, manage bidding windows, record phone confirmations, verify pickup.
- [x] **District/Taluka Supervisor:** Handle escalations, view directory and jurisdictional coverage.
- [x] **Buyer:** Register with category documents, browse approved listings, post demand, bid in kg, confirm orders, fund demo escrow, assign transport.
- [x] **Platform Administrator:** Manage crop catalogue, verify buyers, assign officer jurisdictions, manage platform policies, view immutable audit trail.
- [x] **Driver / Collector:** Limited order-scoped access to present OTP/QR and confirm custody at pickup.

---

## 3. Officer-Assisted Farmer & FPO Onboarding
- [x] Onboarding request submission by farmer.
- [x] Agricultural officer field visit record with GPS coordinates and inspection notes.
- [x] Capture ownership/lease evidence, crop, variety, estimated yield in kg, initial bank details (masked in routine UI).
- [x] Officer verification approval or correction request with recorded reasons.
- [x] Expiring, single-use secure activation link generated for registered phone.
- [x] Farmer activation and profile review.
- [x] FPO member roster, crop/variety/kg contribution capture, double-selling prevention.

---

## 4. Buyer Registration and Officer Support
- [x] Category-based registration (Company/processor, College/institution, Retail store).
- [x] Document upload (Business registration proof, purchaser authorization, etc.).
- [x] Admin/verification officer review, correction request, or approval.
- [x] Public Taluka and District Agricultural Officer Directory.
- [x] Farmer dashboard assigned officer card (village, taluka, district contacts).

---

## 5. Crop Catalogue, Supply Listings & Discovery
- [x] Crop and variety catalogue (cereals, pulses, vegetables, fruits, rice paddy vs milled, wheat, bananas, coconuts).
- [x] All quantities in **kg**; all prices in **INR/kg** (bananas and coconuts weighed, not counted).
- [x] Verified crop listing creation (farmer/FPO, kg quantity, images, harvest date, pickup window, min price, location).
- [x] India-wide discovery with no location filter.
- [x] Cascading filters: Region/State, District, Crop, Availability.
- [x] Reference prices displayed with source and date (labelled demo).
- [x] Buyer demand posting (requested crop, kg, required date, delivery location).

---

## 6. Transparent Bidding & Atomic Partial Allocation
- [x] Short published bidding window with visible deadline timer.
- [x] Quantity-specific buyer bids (kg, price/kg, total amount, proposed pickup date, validity).
- [x] Transparent bidding table showing prices, quantities, timestamps (masked private contact info).
- [x] Farmer bid selection and kg allocation.
- [x] Canonical 50 kg example: 10 kg @ ₹20/kg (₹200) + 20 kg @ ₹22/kg (₹440) = 30 kg allocated, 20 kg remaining available.
- [x] Officer records buyer phone confirmation (contact person, agreed terms, timestamp).
- [x] Buyer final confirmation of revised/accepted allocation terms.
- [x] Atomic reservation to prevent overselling; separate orders generated per allocation.

---

## 7. Demo Banking Escrow, Transport & Verified Pickup
- [x] Digital order agreement snapshot (crop, variety, kg, unit price, quality terms, pickup deadline).
- [x] Simulated banking escrow payment request (confirmed kg × price/kg).
- [x] Buyer prepays into escrow -> funds held; order status becomes `Secured`.
- [x] Buyer registers transport partner, vehicle number/capacity, driver/collector name & contact.
- [x] Order-bound OTP / QR code challenge for pickup authorization.
- [x] Handover verification: scale weight capture in kg, inspection photos, quality check.
- [x] Exception handling for shortage or quality mismatch before custody transfer.
- [x] Triple confirmation (Farmer/FPO, Driver, Officer) -> `Dispatch Verified`.
- [x] Automated escrow payout release to seller account; order status `Paid`.
- [x] Buyer confirms delivery arrival -> order status `Closed`.

---

## 8. Cancellations, Grievances, Audit & Chatbot
- [x] Staged cancellation policy (pre-acceptance, confirmed unpaid, secured pre-pickup, late buyer cancellation with compensation).
- [x] Grievance mechanism: complaint number, category, description, linked order, evidence, assigned officer, taluka/district escalation, closure notes.
- [x] AI Help Chatbot: portal guidance, officer contacts, FAQs, complaint navigation; Gemini API integration with instant FAQ fallback.
- [x] Immutable audit logging: actor, timestamp, affected record, and reason for all transitions.
