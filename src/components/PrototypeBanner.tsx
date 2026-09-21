'use client';

import { ShieldCheck } from 'lucide-react';

export default function PrototypeBanner() {
  return (
    <div className="w-full border-b border-amber-200 bg-amber-50 text-amber-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs">
        <div className="flex items-center gap-2 font-extrabold tracking-wide whitespace-nowrap">
          <ShieldCheck className="w-4 h-4" />
          <span>SIH 2026 PROTOTYPE</span>
        </div>
        <span className="text-amber-900/80">Bank, government, farmer, payment and transaction data shown in this demonstration are simulated unless explicitly marked as integrated.</span>
      </div>
    </div>
  );
}
