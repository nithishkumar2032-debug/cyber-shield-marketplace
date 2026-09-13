# Cyber Shield - Antigravity Build Prompt

You are my full-stack development agent. Build the Pan-India B2B Crop Marketplace described below and in `Cyber_Shield_Pan_India_B2B_Crop_Marketplace_Revised.pdf` if that PDF is present in the project or its `docs` folder.

Produce a working application with persistent records and verified workflows. Banking partner escrow is a clearly labelled simulation until a real banking integration is separately configured. Use the project title above and the attribution `Prepared by Cyber Shield`.

## 1. Working approach

- Inspect the existing folder, repository, package files and project instructions before editing. Preserve useful existing work. If the folder is empty, initialise the project.
- Read the revised PDF when available and map its requirements to screens, database records, permissions and implementation stages. The requirements below also provide a standalone specification.
- Plan briefly, then implement. Do not finish with only a plan, landing page or disconnected screens.
- Separate mockups from Google Stitch or Figma are not prerequisites. Start with a page map and simple layouts inside the application. Reuse those components during development.
- Work through the stages in section 12 sequentially. After each stage, run the relevant checks, record progress and continue when dependencies permit. Let me provide feedback on screenshots without restarting the project.
- Put the requirement checklist in `docs/REQUIREMENTS.md`, unresolved decisions in `docs/DECISIONS.md`, and implemented/tested/blocked work in `docs/BUILD_STATUS.md`. Consult these files when resuming.
- Make routine reversible implementation choices yourself. If an external credential or material business decision is missing, explain the exact dependency, keep the affected integration clearly labelled, and continue independent work.
- Do not represent sample records, SMS delivery, AI responses or simulated transfers as live integrations. Do not claim deployment or test success without evidence.

## 2. Stack and application foundation

Use Next.js App Router, TypeScript, Tailwind CSS and Supabase for PostgreSQL, authentication and file storage. Use stable compatible versions and current official setup guidance. Use accessible reusable UI components and server-side input validation.

Implement current Supabase server-side authentication correctly. Enforce permissions in database row-level security (RLS), storage policies and server operations, not merely by hiding buttons. Keep secret/service-role keys and the chatbot API key server-side. Public users cannot grant themselves privileged roles.

Use SQL migrations and repeatable seed scripts. Operational records must survive refresh, sign-out and server restart. React state, localStorage, in-memory arrays and temporary server files cannot be the main database. Fixtures may be used for the initial layout preview, but label them and replace them in completed workflows.

Build a responsive mobile-friendly web application. Use plain English, clear status labels, large actions, accessible forms, useful validation, empty states and loading/error feedback. Prepare the structure for additional Indian languages. Full offline transactions are future scope.

## 3. Product boundaries

- Pan-India B2B crop procurement for both small and large farmers.
- Small farmers can combine produce through a Farmer Producer Organisation (FPO); bulk-capable farmers can list individually.
- The proposed Central Government role is application administration and oversight. Do not imply an existing government deployment or partnership.
- Agricultural officers conduct field visits, assist registration, verify records, support farmers and confirm transactions.
- Banking partners hold escrow funds and process settlement. Never label the service as government escrow.
- Buyers include companies/processors, colleges/institutions and retail stores. Buyer-arranged transport is included. Export-specific workflows are not yet approved.
- Crops only; exclude direct consumer retail, dairy, eggs and livestock from this build.
- AI is only a help chatbot. Do not implement AI crop matching, buyer selection, bid ranking, crop-quality scoring, demand forecasting or route optimisation.

## 4. Roles and access

Implement these roles with distinct dashboards and permission checks:

1. Farmer: view own profile, land/crop records, bids, allocations, orders, payment status and officer contacts; choose preferred bids and quantities; request corrections; submit grievances.
2. FPO representative: manage authorised membership and contributions, group listings and group-order records with member visibility and agreement.
3. Agricultural officer: access assigned farmers within the relevant jurisdiction, conduct visits, capture records, verify crop information, manage published bid deadlines, record buyer confirmations and verify pickup.
4. District/taluka supervisor: handle assigned escalations, officer directory/coverage and reassignment within authorised scope. This can be a permission level within the officer role.
5. Buyer: register, upload verification documents, browse approved listings, post demand, bid, confirm orders, fund demo escrow and assign transport.
6. Government/platform administrator: manage authorised officers, jurisdictions, buyer verification, crop catalogue, policies, support directory and audits.

Provide limited order-scoped access for an authorised collecting person if needed. It must not provide general farmer or marketplace administrative access. Treat the banking partner as an integration role, not a public self-registering administrator.

The baseline farmer permissions are those listed here. Extra editable farmer fields remain a configurable decision. Officers can capture initial bank details but cannot independently change payout routing or release funds. Subsequent bank changes require farmer confirmation and independent verification with an audit entry.

## 5. Officer-assisted farmer and FPO onboarding

Implement this flow:

1. Farmer requests registration or approaches the local agricultural officer.
2. Officer records a visit to the farmer's land.
3. Officer collects farmer name/contact, address, land location/map coordinates, ownership or valid lease evidence, crop and variety, expected yield in kg, harvest information and initial bank details.
4. Officer uploads supporting documents, field photographs and inspection notes.
5. Officer completes the verification or returns a correction request with reasons.
6. After successful registration, generate a secure farmer activation link for the registered mobile contact.
7. Farmer authenticates, views the uploaded record, requests corrections and accesses permitted actions.

Use an expiring, single-use activation/claim flow tied to the intended farmer and verified phone identity. A guessed record ID or an indefinitely reusable URL must not grant access. Use supported Supabase authentication and a configurable SMS delivery integration. If SMS is not configured, provide a clearly labelled local-development delivery/test mechanism; do not fake successful SMS delivery or expose test authentication in production.

Do not require a minimum landholding as a blanket entry rule. Verify the land and plausible production capacity. Any bulk-lot minimum must support combined FPO contributions.

For FPOs, record the representative, approved members, individual crop/variety/harvest contributions in kg, and the combined lot. Prevent the same member quantity being sold in both an individual lot and a group lot. Members must see their contribution and related sale records.

FPO payout routing and the distribution of sale earnings/profit have not been finalised. Model contribution and receipt records now. Do not invent an equal-split formula, commission or completed member transfer. Keep any demonstration allocation explicitly provisional.

## 6. Buyer onboarding, support and document privacy

Buyer registration collects category, organisation/store name, address, authorised purchaser, verified contact number and delivery state/district.

Use one or two documents per category, with configurable checklists:

| Category | Proposed proof | Additional proof when needed |
| --- | --- | --- |
| Company/processor | Business registration | Purchasing representative authorisation |
| College/institution | Institutional registration or recognition | Purchasing representative authorisation |
| Retail store | Shop/business registration | Proprietor or authorised purchaser identification |

These are portal verification examples, not claims about statutory requirements. An authorised administrator/verification officer reviews and activates the buyer. Unverified buyers cannot bid or order.

Store private verification files in protected storage. Restrict bank details and land evidence to authorised roles. Officers can access relevant farmer and buyer contact numbers. For the baseline, reveal the farmer's contact number to the buyer only after order confirmation; earlier access after placing a bid remains a decision to confirm. Do not expose phone numbers in public bid tables.

From the first farmer dashboard, show assigned officer, taluka/block officer and district officer contacts, with jurisdiction and contact details. Use administrator-maintained records; demo contacts must be clearly fictional.

## 7. Crop catalogue, listings and discovery

Create searchable crop and variety dropdowns covering cereals, pulses, vegetables, fruits and other supported crops, including rice, wheat, bananas and coconuts. Distinguish product forms such as paddy and milled rice where relevant.

Build a maintainable catalogue with admin editing, CSV import, duplicate checks and missing-variety requests. Use documented reliable sources for imported crop varieties and state/district records; do not invent varieties or claim that a small seed list contains every Indian crop variety. Document seed coverage and allow expansion.

All listing, contribution, bid and order quantities use kg. All unit prices use INR/kg. Banana bunches or coconut piece counts cannot silently become kg. Support fractional kg with defined precision and consistent monetary rounding.

A listing contains seller/FPO, crop, variety/product form, expected/available kg, crop images, expected harvest date, pickup window, source state/district, approximate pickup location, minimum price and any manually verified quality terms. Label expected yield as an estimate.

Support India-wide browsing with no location filter. Allow optional region, state and district filters; state selection must not require region selection first. Selecting Tamil Nadu and a district narrows the farmer/crop results to that district. Support crop and availability filters using ordinary database queries.

Record source and buyer delivery locations. Seller-selected destination-state coverage remains configurable and provisional. Provide map/address capture; document any map API dependency without pretending an unavailable map integration works.

Display reference prices with source and date. Use labelled demo values until a real reference-price feed is configured. Buyers may also post crop demand with requested kg, required date and delivery location.

## 8. Transparent bidding and partial allocation

- Officer publishes a short bidding window with clear opening/closing times. The exact duration is configurable; do not assume the previously mentioned 'one or two' means hours or days.
- Verified buyers submit requested kg, price per kg, total value, pickup date and validity.
- Show eligible participants comparable prices, quantities, totals and timestamps, without private contact or bank details. Preserve bid history and enforce deadlines server-side.
- Farmer chooses preferred bids and proposes allocations through their dashboard.
- Officer reviews the farmer's choices and records a phone confirmation with the buyer, including who confirmed, terms and timestamp. The application records the confirmation; it does not pretend to place a call.
- Buyer explicitly confirms the final quantity/price/pickup terms before the order is committed. If an offered quantity changes, obtain the buyer's confirmation of those revised terms.
- Create a separate order for each allocation. Release expired confirmation/payment reservations. Unsold quantity remains available.
- Enforce reservation and allocation limits atomically in PostgreSQL. Concurrent buyers or repeated requests must not oversell the lot. Protect FPO contribution balances as well.

Required example: a 50 kg lot receives an accepted bid for 10 kg at INR 20/kg and another for 20 kg at INR 22/kg. The orders are INR 200 and INR 440, and 20 kg remains available. Partial purchases are decided during bidding, before funding.

## 9. Demo banking escrow, pickup and settlement

Snapshot confirmed quantity, rate, product/quality terms, pickup deadline, policy version and custody rule in each order. Calculate the funded amount using decimal arithmetic and a consistent paise rounding rule.

Build a payment-provider interface with a development/demo adapter. Keep its funding, held balance, release, refund and dispute ledger persistent and auditable. Every simulated financial screen and receipt must say DEMO/SIMULATED. Do not generate a real payment destination or claim a bank partner exists.

Payment direction: buyer -> banking partner escrow -> verified seller after verified pickup. Refunds return to the buyer. Government users and officers do not hold the money.

Require secured funding before goods are released. The buyer registers its transport partner, vehicle number/capacity, driver or collecting person, contact details and arrival time against the order. Record and authorise changes to the assignment.

Use one simple order-bound pickup OTP or QR challenge with expiry, single-use verification and replay protection. Keep pickup authentication separate from account-login authentication.

At pickup, check the authorised collector/vehicle, weigh goods in kg and record manual quality checks, photographs, weight evidence, timestamp and location. Capture farmer/FPO representative, collector and officer confirmations before marking Dispatch Verified.

Verified pickup transfers custody to the buyer and triggers seller settlement. Full accepted order means full agreed payment. Record actual shortages or quality disputes as exceptions before releasing affected funds. Mark Paid only after the appropriate provider confirmation, or an explicitly simulated confirmation in demo mode. Ordinary buyer transport risk begins at accepted handover.

Make state transitions, event handling, release and refunds idempotent. Repeated clicks or repeated payment events must not duplicate a payout or refund. Permit closure after the buyer records arrival, while preserving the history.

## 10. Cancellations, grievances and chatbot

Implement distinct rules and status transitions for bid withdrawal, confirmed-unpaid cancellation, funded pre-pickup cancellation, late buyer cancellation/no-show and post-handover disputes. Reopen only uncollected, still-available stock; do not relist goods already dispatched.

Support late buyer-cancellation compensation to the farmer. Exact cutoffs, fees, grace periods and appeal times are unresolved: store them as versioned configuration, document assumptions and use labelled test policies for demonstrations. Do not present invented fees as approved policy.

Quality mismatch or short quantity pauses settlement of the disputed portion. Record evidence, officer review, resolution and any authorised refund. Support officer reassignment when unavailable.

Grievances need a category, description, optional listing/order link, attachments, complaint number, assigned officer, response history, status, escalation and resolution/appeal record. Route to appropriate taluka/district officers. Show users the status of their own complaints.

Provide a help chatbot using approved portal instructions and FAQs. Questions include opening a profile, choosing bids, finding an officer and submitting a complaint. Implement an optional server-side Gemini integration and a useful labelled FAQ fallback when no API key is configured. The chatbot must not decide bids/disputes, access unnecessary financial documents or invoke privileged actions.

Provide persistent in-app notifications. SMS/email adapters can be configured separately; delivery status must distinguish queued, failed and genuinely sent messages.

## 11. Data model and important constraints

Design related tables for profiles/roles, officer jurisdictions, farmers, land parcels, verification documents, private payout details, FPOs/members/contributions, crop/variety catalogue, geographic locations, listings, buyer organisations/documents, demand, bids, allocations, orders, versioned policies, payment events/ledger, vehicle assignments, pickup evidence/confirmations, grievances/responses, notifications and audit events.

Use foreign keys, quantity/amount constraints, useful indexes and explicit state transitions. Separate public marketplace fields from sensitive records; RLS alone does not hide individual columns. Restrict every server-side privileged operation by the authenticated actor and business rule.

Audit important changes with actor, time, affected record and reason. Ordinary application users cannot rewrite completed transaction history. Document the limits of the audit model rather than claiming cryptographic immutability without implementing it.

## 12. Build stages and evidence

**Stage 1 - Layouts and foundation:** inspect/init project, create requirement and page maps, scaffold shared components and simple farmer/officer/buyer/admin layouts. Show desktop and mobile screenshots. Temporary fixtures are only a layout aid.

**Stage 2 - Identity and registration:** implement database migrations, authentication, role/jurisdiction access, protected uploads, farmer activation, officer onboarding and buyer verification. Demonstrate persistent records.

**Stage 3 - Supply and discovery:** implement crop/variety import and dropdowns, verified listings, FPO contributions, kg units, harvest/images, location filters, officer directory and buyer demand.

**Stage 4 - Bidding and orders:** implement deadlines, transparent bids, farmer allocation, officer and buyer confirmation, atomic reservations and separate orders. Demonstrate the 50 kg example.

**Stage 5 - Fulfilment and demo payments:** implement persistent simulated banking escrow, transport assignment, OTP/QR pickup, manual inspection, settlement/refunds and order closure.

**Stage 6 - Support and exceptions:** implement grievances, escalation, cancellations, compensation configuration, notifications, chatbot/FAQ fallback and audit views.

**Stage 7 - End-to-end verification and handover:** test the complete journey, fix failures, verify responsive layouts, produce setup/deployment documentation and list integration gaps accurately.

Use meaningful tests for role and storage isolation, jurisdiction restrictions, activation expiry, server-enforced bidding deadlines, concurrent overselling, FPO double allocation, payment idempotency, unauthorised pickup, dispute holds and cancellation/relisting. Test cross-user access at the database/API level, not just navigation.

Seed clearly fictional examples: individual and small farmers, an FPO with member contributions, officers across more than one district/state, a company, institution and retailer, and listings including bananas/coconuts. Separate test accounts from production bootstrap.

Demonstrate that refresh and a new authenticated session preserve records; unauthorised accounts cannot read them; no-filter search spans India; and a complete accepted order reaches pickup and simulated seller payment exactly once.

Run the project's typecheck, lint, meaningful tests and production build where available. Use the browser for the principal user journeys and screenshots. Record actual results and any checks blocked by missing external setup.

## 13. Deliverables and setup instructions

Provide the working source, migrations, seed data, `.env.example`, setup/run/test commands, account/bootstrap instructions, screenshots, requirement checklist and build-status document. Explain which credentials I must configure locally; never ask me to publish secrets in a prompt or commit them.

If a hosted Supabase project is not configured, explain the precise setup steps or use a documented local Supabase setup when the environment supports it. Continue writing the schema and application code, but do not claim database-backed verification passed without running it.

Prepare deployment configuration and instructions for the chosen hosting environment. Clearly separate application readiness from deployment, official government adoption, live banking, SMS delivery and optional Gemini setup.

Keep future scope outside the current implementation: live banking integration, official land-record integration, full offline recovery, additional language/voice support and advanced transport integrations. AI remains confined to the help chatbot.

Start now by inspecting the workspace, producing the short implementation plan and beginning Stage 1. Continue through the staged build, keeping the progress files current and reporting concrete outcomes.

---

Official implementation references to consult as needed:

- Antigravity project setup: https://antigravity.google/docs/getting-started/
- Supabase server-side Next.js authentication: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase row-level security: https://supabase.com/docs/guides/database/postgres/row-level-security

The references support tool/framework setup. The marketplace requirements and proposed policies above come from this project's revised specification.
