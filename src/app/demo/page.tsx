'use client';

import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import TransactionTimeline from '@/components/TransactionTimeline';
import { ShieldCheck, Sprout, Building2, Scale, Truck, Lock, FileText, AlertTriangle, BrainCircuit, Languages, WifiOff, MessageSquare, ArrowRight } from 'lucide-react';

const tx = {
  id:'CS-TN-2026-0001', farmer:'Murugan Karuppasamy',
  fpo:'Thanjavur Delta Farmers Producer Company Ltd.',
  crop:'Paddy / Rice — Ponni (Raw)', qty:5000, buyer:'AgroPure Foods & Processing Ltd.',
  price:25.2, total:126000, moisture:12.6, damaged:1.8, foreignMatter:0.3,
  pickup:'22 Sep 2026 • 07:00–09:00', driver:'Ravi Kumar • TN 49 AB 4821', otp:'4821'
};

const Card=({title,icon,children}:{title:string;icon:React.ReactNode;children:React.ReactNode})=>
  <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <h2 className="font-black flex items-center gap-2 text-slate-900">{icon}{title}</h2>{children}
  </section>;

export default function DemoPage(){
  const {state}=useMarketplace();
  const order=state?.orders.find(o=>o.orderNumber===tx.id);
  const buyer=state?.buyers.find(b=>b.organizationName===tx.buyer);
  const listing=state?.listings.find(l=>l.id==='lst-fpo-paddy-5000kg');
  const match=['Quantity','Grade','Distance','Pickup window','Verified FPO','Quality record'];

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
    <div className="rounded-2xl bg-slate-950 text-white p-6 sm:p-8">
      <span className="badge-demo">SIH 2026 END-TO-END DEMO</span>
      <h1 className="text-3xl sm:text-4xl font-black mt-3">Trusted Farm-Gate Transaction Layer</h1>
      <p className="text-slate-300 mt-2 max-w-3xl">One consistent transaction from verification → trade → quality → weight → logistics → settlement → invoice → audit.</p>
      <div className="mt-4 text-xs text-amber-300">Prototype: bank, government, payment and transaction values are simulated unless explicitly marked integrated.</div>
    </div>

    <TransactionTimeline completed={11}/>

    <div className="grid lg:grid-cols-3 gap-4">
      <Card title="Master transaction" icon={<Sprout className="w-5 h-5 text-emerald-600"/>}>
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div><small>Farmer</small><b className="block">{tx.farmer}</b></div><div><small>FPO</small><b className="block">{tx.fpo}</b></div>
          <div><small>Crop</small><b className="block">{tx.crop}</b></div><div><small>Quantity</small><b className="block">{tx.qty.toLocaleString()} kg (5 MT)</b></div>
          <div><small>Accepted price</small><b className="block text-emerald-700">₹{tx.price.toFixed(2)}/kg</b></div><div><small>Order value</small><b className="block">₹{tx.total.toLocaleString()}</b></div>
        </div>
      </Card>
      <Card title="Farmer net realization" icon={<Sprout className="w-5 h-5 text-emerald-600"/>}>
        <div className="mt-4 text-3xl font-black text-emerald-800">₹124,800</div>
        <p className="text-xs text-slate-500 mt-1">₹126,000 gross − ₹1,200 illustrative logistics/handling.</p>
      </Card>
      <Card title="Buyer reliability" icon={<Building2 className="w-5 h-5 text-purple-600"/>}>
        <div className="mt-4 text-sm"><b>AgroPure Foods & Processing Ltd.</b><div className="text-xs text-slate-500 mt-2">Verified — Prototype • history and reliability metrics are demo data.</div></div>
      </Card>
    </div>

    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="Buyer procurement + explainable matching" icon={<Building2 className="w-5 h-5 text-purple-600"/>}>
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">{[['Crop','Paddy / Ponni'],['Quantity','5,000 kg'],['Max moisture','≤14%'],['Pickup','07:00–09:00'],['Radius','≤50 km'],['Price','₹25.20/kg']].map(x=><div key={x[0]} className="p-3 bg-slate-50 rounded-xl"><span className="text-slate-400">{x[0]}</span><b className="block">{x[1]}</b></div>)}</div>
        <div className="mt-3 rounded-xl bg-purple-50 border border-purple-200 p-4 text-sm"><b>95% explainable match</b><div className="flex flex-wrap gap-1 mt-2">{match.map(x=><span key={x} className="px-2 py-1 rounded bg-white text-xs">✓ {x}</span>)}</div><p className="text-[11px] mt-2 text-purple-800">Rules-based prototype; no opaque “magic AI” claim.</p></div>
      </Card>

      <Card title="Quality inspection + LOCK QUALITY" icon={<Scale className="w-5 h-5 text-blue-600"/>}>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">{[['Grade','FAQ Grade'],['Moisture','12.6%'],['Damaged','1.8%'],['Foreign matter','0.3%']].map(x=><div key={x[0]} className="p-3 bg-slate-50 rounded-xl"><small>{x[0]}</small><b className="block">{x[1]}</b></div>)}</div>
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs"><b>QUALITY LOCKED</b> • 3 photos • Inspector OFF-TNJ-014 • timestamp recorded • edits require dispute workflow.</div>
      </Card>
    </div>

    <div className="grid lg:grid-cols-3 gap-5">
      <Card title="Verified weighing" icon={<Scale className="w-5 h-5 text-blue-600"/>}>
        <p className="text-sm mt-3"><b>WM-TN-DEMO-001 • 5,000 kg</b></p><p className="text-xs text-slate-500 mt-2">Verified/legal-metrology-compliant instrument → officer device → transaction ID → timestamp → GPS → photo → digital signature.</p>
        <div className="mt-3 p-3 rounded-xl bg-amber-50 text-xs">Manual fallback: reason + photo + officer approval + FPO confirmation + audit log.</div>
      </Card>
      <Card title="Logistics + route control" icon={<Truck className="w-5 h-5 text-orange-600"/>}>
        <p className="text-sm mt-3"><b>Pickup #CS001</b> • {tx.pickup}</p><p className="text-sm mt-1">{tx.driver} • OTP <b>{tx.otp}</b></p><div className="mt-3 p-3 rounded-xl bg-amber-50 border text-xs"><b>20 km route deviation</b> → alert + officer notification.</div>
      </Card>
      <Card title="Sandbox settlement" icon={<Lock className="w-5 h-5 text-indigo-600"/>}>
        <p className="text-sm mt-3"><b>₹126,000</b> • FUNDS SECURED — SANDBOX</p><div className="mt-3 p-3 rounded-xl bg-indigo-50 border text-xs">Payment-partner simulation. After handover: settlement instruction generated. Completion = SIMULATION.</div>
      </Card>
    </div>

    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="B2B invoice + compliance" icon={<FileText className="w-5 h-5 text-teal-600"/>}>
        <div className="mt-3 text-sm space-y-2"><b>Generate tax-compliant invoice where applicable</b><div>GSTIN • HSN • quantity • rate • tax • IRN where applicable.</div><p className="text-xs text-slate-500">No live GST/IRP integration is claimed by this prototype.</p></div>
      </Card>
      <Card title="Grievance matrix + SLA" icon={<AlertTriangle className="w-5 h-5 text-amber-600"/>}>
        <div className="grid sm:grid-cols-2 gap-2 mt-3 text-xs">{['Weight → Officer → Scale record','Quality → Quality officer → Photos + assay','Pickup → Logistics → GPS + OTP','Payment → Payment partner → Transaction ID','Damage → Buyer/FPO → Loading + delivery photos'].map(x=><div key={x} className="p-2 rounded-lg bg-slate-50">{x}</div>)}</div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">{['0h Complaint','24h FPO review','48h Officer review','72h Escalation'].map(x=><span key={x} className="px-2 py-1 rounded-full bg-amber-50 border">{x}</span>)}</div>
      </Card>
    </div>

    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="AI + fraud safeguards" icon={<BrainCircuit className="w-5 h-5 text-fuchsia-600"/>}>
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">{['Yield anomaly','Price intelligence','Fraud anomaly','Demand forecasting','Quality photo assistance'].map((x,i)=><div key={x} className="p-3 rounded-xl bg-fuchsia-50"><b>#{i+1}</b> {x}</div>)}</div>
        <p className="text-[11px] text-slate-500 mt-3">Fraud signals include duplicate listing, yield anomaly, bid manipulation and account mismatch. Quality AI is advisory only.</p>
      </Card>
      <Card title="Inclusion + resilience" icon={<ShieldCheck className="w-5 h-5 text-emerald-600"/>}>
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">{[['Tamil + English + Hindi','Multilingual onboarding + voice-ready'],['FPO-assisted','“I need help” → facilitator'],['Offline queue','Queue critical events when offline'],['SMS fallback','Critical status notification fallback']].map(x=><div key={x[0]} className="p-3 rounded-xl bg-emerald-50"><b>{x[0]}</b><div>{x[1]}</div></div>)}</div>
      </Card>
    </div>

    <Card title="Security, audit + pilot positioning" icon={<ShieldCheck className="w-5 h-5 text-emerald-600"/>}>
      <div className="grid md:grid-cols-3 gap-3 mt-3 text-xs">{['Timestamp + user + device + IP/session','Transaction ID + action + reason','Audit history + anomaly signals','e-NAM positioning as a transaction layer','Tamil Nadu pilot → FPO + officer + B2B buyers','Post-SIH: satellite, insurance, cold-chain, interstate adapters'].map(x=><div key={x} className="p-3 rounded-xl bg-slate-50">{x}</div>)}</div>
      <div className="flex flex-wrap gap-2 mt-5"><Link href="/farmer" className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold">Farmer <ArrowRight className="inline w-4"/></Link><Link href="/buyer" className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold">Buyer <ArrowRight className="inline w-4"/></Link><Link href="/officer" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold">Officer <ArrowRight className="inline w-4"/></Link><Link href="/grievances" className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-sm font-bold">Grievances <ArrowRight className="inline w-4"/></Link></div>
    </Card>

    <div className="text-[11px] text-slate-500">Bootstrap: {order?'master order loaded':'master order missing'} • {buyer?'buyer loaded':'buyer missing'} • {listing?'master listing loaded':'master listing missing'}.</div>
  </div>;
}
