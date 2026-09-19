---
name: AgroShield Exchange
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4943'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7a73'
  outline-variant: '#bdc9c1'
  surface-tint: '#006c4e'
  primary: '#005d42'
  on-primary: '#ffffff'
  primary-container: '#047857'
  on-primary-container: '#9ffdd3'
  inverse-primary: '#7bd8b1'
  secondary: '#4e45d5'
  on-secondary: '#ffffff'
  secondary-container: '#6860ef'
  on-secondary-container: '#fffbff'
  tertiary: '#7129ae'
  on-tertiary: '#ffffff'
  tertiary-container: '#8b46c9'
  on-tertiary-container: '#f5e3ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#97f5cc'
  primary-fixed-dim: '#7bd8b1'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#00513a'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#100069'
  on-secondary-fixed-variant: '#372abf'
  tertiary-fixed: '#f1dbff'
  tertiary-fixed-dim: '#dfb7ff'
  on-tertiary-fixed: '#2d0050'
  on-tertiary-fixed-variant: '#661aa3'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  data-metric-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  data-metric-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system embodies the intersection of sovereign-grade GovTech infrastructure and high-velocity B2B institutional exchange. Tailored for agricultural buyers, institutional procurers, mandi aggregators, and regulatory overseers across India, the interface prioritizes absolute clarity, transactional legitimacy, and frictionless data processing.

The aesthetic philosophy draws from **High-Utility Corporate Modernism with Tactical Data Density**:
- **Authoritative & Uncompromising:** Visual weight and structural rigor emulate high-security financial infrastructure and state portals without the legacy bureaucratic bloat.
- **Zero-Clutter Precision:** Decorative ornament is removed in favor of strict data hierarchies, high-contrast legibility in field conditions, and unambiguous state feedback.
- **Institutional Legitimacy:** The palette and structural framing establish immediate psychological assurance for high-volume transactions, multi-party escrow clearing, and compliance verifications.

## Colors

The palette establishes an immediate division of concerns between agrarian commerce and cryptographic institutional settlement:

- **Primary Core (`#047857` Emerald, resting on `#065f46` for high-contrast interactive states):** Signifies agrarian yield, legitimate trade, verified crop batches, and finalized escrow releases.
- **Secondary & Escrow Architecture (`#4338ca` Royal Indigo and `#6b21a8` Deep Purple):** Exclusively reserved for sovereign authentication, multi-signature banking, institutional escrows, automated clearing, and smart routing logic.
- **Surface Canvas:** Neutral base `#f8fafc` serves as the structural floor, against which pure white `#ffffff` elevated data cards and transaction blocks sit with optical crispness. Text ink sits primarily at `#0f172a` (Slate 900) for uncompromised WCAG AAA compliance, supported by `#475569` (Slate 600) for technical subtext.
- **Deterministic Transactional States:**
  - **Bidding / In-Transit / Escrow Locked:** `#d97706` (Amber 600) on `#fef3c7` tint.
  - **Secured / Verified / Cleared:** `#059669` (Emerald 600) on `#ecfdf5` tint.
  - **Grievance / Dispute / Breached Threshold:** `#e11d48` (Rose 600) on `#ffe4e6` tint.
  - **Archived / Dormant / Settled:** `#64748b` (Slate 500) on `#f1f5f9` tint.

## Typography

The type scale combines **Outfit** for structural headings and high-visibility data panels with **Inter** for transactional legibility, forms, and analytical surfaces.

Key typographical mandates:
- **Tabular Figures for Financials & Weights:** All occurrences of monetary figures (`₹/Quintal`, `₹/kg`), lot sizes, moisture percentages, and escrow transaction hashes must declare `font-variant-numeric: tabular-nums lining-nums` to guarantee vertical baseline alignment across comparative trade panels and auction order books.
- **Operational Micro-Labels:** `label-caps` is rendered in uppercase with wide tracking (`0.06em`) for regulatory taggings, state flags, and protocol attributes.
- **Legibility Guarantees:** Headings stay low-contrast in weight transitions (bolding only for semantic emphasis) to prevent visual fatigue during sustained inventory audits.

## Layout & Spacing

The layout is architected around a strict **12-column responsive fluid grid** with strict max-width constraints on analytic views:
- **Desktop (>= 1280px):** 12 columns, `1.5rem` gutters, `2rem` outer canvas padding, maximum container width `1440px`. Dedicated sticky left-rail for platform navigation and protocol telemetry.
- **Tablet (768px - 1279px):** 8 columns, `1rem` gutters, `1.5rem` outer margins. Dynamic aggregation of multi-metric cards into paired horizontal blocks.
- **Mobile (< 768px):** 4 columns, `0.75rem` gutters, `1rem` margins. Order grids collapse into vertically stacked verification manifests.

Vertical rhythm adheres strictly to an 8-point system (scaled down to 4-point for micro-elements like input icons and inline status markers). Components prioritize high data density without compounding cognitive load, isolating actionable trading parameters with deliberate micro-gutters (`space-sm` to `space-md`).

## Elevation & Depth

This system avoids expressive blur-heavy skeuomorphism, relying instead on **structural border definition and calibrated tonal layering**:

- **Low-Contrast Structural Borders:** Surface separation is primary driven by 1px borders using `#e2e8f0` (Slate 200) for standard containers and `#cbd5e1` (Slate 300) for interactive focus boundaries.
- **Base Level (Canvas):** `#f8fafc`. Background on which all structural layouts are anchored.
- **Level 1 (Operational Cards & Data Rows):** `#ffffff` with a subtle hairline edge (`1px solid #e2e8f0`) and zero diffuse blur. Hover elevates with a targeted mechanical shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.08)`.
- **Level 2 (Active Escrow Drawers, Bidding Modals, Verification Flyouts):** `#ffffff` with structural boundary `1px solid #94a3b8` accompanied by ambient occlusion: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **State Overlays (Dispute & Freeze):** Subtle inset tinted rim boundaries (e.g., `box-shadow: inset 0 0 0 1px #e11d48`) rather than sweeping screen-wide masks.

## Shapes

The interface adopts a disciplined **Soft (`1`) shape geometry**, emphasizing programmatic efficiency and industrial software heritage:

- **Inputs, Buttons, and Data Cells:** Built with `0.25rem` (4px) radii. This creates clean, sharp intersections that preserve vertical and horizontal alignment lines in dense tables.
- **Cards, Audit Modals, and Surface Panels:** Standardized on `rounded-lg` (`0.5rem` / 8px).
- **Institutional Badges & Escrow Indicators:** Standardized on compact `0.25rem` (4px) boundaries or full pills strictly reserved for transient state badges to differentiate them from actionable click surfaces.

## Components

### Action Buttons
- **Primary Institutional Action (Place Bid, Confirm Release):** High-contrast `#047857` background, white label, weight 600, 40px height for desktop, 4px border radius. Hover: `#065f46`. Active: `#064e3b`. Inset focus ring: 2px offset with `#10b981`.
- **Escrow & Protocol Action (Authorize Escrow, Verify Signatures):** `#4338ca` background, `#ffffff` label. Focus ring: `#818cf8`.
- **Secondary Outlined:** Transparent background, `1px solid #cbd5e1`, label `#0f172a`. Hover: `#f1f5f9`.
- **Destructive Action (Dispute Trade, Freeze Lot):** Transparent background, `1px solid #fecdd3`, label `#e11d48`. Hover: `#fff1f2`.

### Institutional Verification Badges
Micro-indicators engineered for quick parsing in high-volume trade logs:
- **`DEMO BANKING ESCROW`:** Royal Indigo theme (`bg: #e0e7ff`, `border: 1px solid #c7d2fe`, `text: #3730a3`), `label-caps` typography, left-aligned padlock icon.
- **`AI DYNAMIC RATES`:** Purple theme (`bg: #f3e8ff`, `border: 1px solid #e9d5ff`, `text: #6b21a8`), real-time sync pulse dot.
- **`OFFICER VERIFIED`:** Emerald theme (`bg: #d1fae5`, `border: 1px solid #a7f3d0`, `text: #065f46`), check-shield icon pairing.
- **`DISPUTED / AUDIT`:** Rose theme (`bg: #ffe4e6`, `border: 1px solid #fecdd3`, `text: #9f1239`).

### Input Fields & Price Negotiators
- **Standard Input:** 40px height, 1px `#cbd5e1` border, `#ffffff` background, `0.25rem` corner radius, `Inter 14px` body. Focus state transitions border to `#047857` with an exterior `0 0 0 1px #047857` shadow.
- **Metric Input Pairs (Quantity + Unit):** Split control attaching numeric entry directly to an immutable dropdown selector (`Quintal`, `Metric Ton`, `Kg`) via unified border grouping.
- **Currency Entry (`₹`):** Fixed left prefix with `#475569` tabular notation and right-aligned numeric entry.

### Crop Batch & Auction Cards
- Container built on `#ffffff`, framed by `1px solid #e2e8f0`.
- Top rail: Displays Government Mandi code, Lot Tracking ID, and verification badge.
- Center section: Split metric presentation featuring dynamic price tick (`₹/kg`), total bulk weight, moisture content %, and grading level (e.g., Grade A - Sharbati).
- Base rail: Two-tier actionable bar displaying current active bidder count, time-to-settlement countdown timer, and instantaneous primary trigger for counter-bidding or escrow execution.

### Data Tables & Ledger Manifests
- Dense, zero-margin cellular structure. Header row utilizes `#f8fafc` with `11px label-caps` colored `#475569`.
- Row height fixed at 48px with alternating divider lines of `1px solid #f1f5f9`.
- Numerical columns right-aligned with monospace/tabular lining; contextual badges vertically centered.