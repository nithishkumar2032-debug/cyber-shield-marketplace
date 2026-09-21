'use client';

import { CheckCircle2, Circle } from 'lucide-react';

const steps = [
  'Farmer verified',
  'Crop listed',
  'Buyer verified',
  'Bid accepted',
  'Funds secured',
  'Pickup scheduled',
  'Quality checked',
  'Weight confirmed',
  'Handover verified',
  'Settlement initiated',
  'Completed',
];

export default function TransactionTimeline({ completed = 8 }: { completed?: number }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">Master transaction</div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">CS-TN-2026-0001</h2>
        </div>
        <span className="badge-demo text-[10px]">Single transaction • simulated demo data</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {steps.map((step, index) => {
          const done = index < completed;
          return (
            <div key={step} className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 text-xs">
              {done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
              <span className={done ? 'font-semibold text-slate-800' : 'text-slate-400'}>{step}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
