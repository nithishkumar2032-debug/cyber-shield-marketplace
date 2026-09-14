// API: Help Chatbot (Portal Guidance & FAQ)
// Prepared by Cyber Shield | SIH 26033
// Adheres to specification: AI is strictly limited to navigational help and portal instructions.

import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

const KNOWLEDGE_FAQS = [
  {
    keywords: ['profile', 'activate', 'activation', 'login', 'account', 'open'],
    answer:
      'To open or activate your farmer profile, approach your local Village Agricultural Officer for a land verification visit. After the officer verifies your land and crop details, you will receive a secure single-use activation link (SMS / portal claim code). Visit /auth/login or click "Claim Farmer Access Link" to authenticate and review your records.',
    link: '/auth/login',
    actionText: 'Go to Farmer Login & Activation',
  },
  {
    keywords: ['bid', 'choose', 'allocation', 'offer', 'accept', 'partial'],
    answer:
      'In the Pan-India B2B Crop Marketplace, the farmer chooses the preferred bids! Buyers bid in kg quantities (partial procurement). From your Farmer Dashboard (/farmer/bids), select the bids and specify how many kg to allocate. Your assigned Agricultural Officer will then record a phone confirmation with the buyer before the order is finalized.',
    link: '/farmer',
    actionText: 'View Bids on Farmer Dashboard',
  },
  {
    keywords: ['officer', 'who is', 'contact', 'directory', 'phone', 'taluka', 'district'],
    answer:
      'You can find your assigned Village Agricultural Officer, Taluka Officer, and District Agricultural Officer in the Officer Directory. For Thanjavur, Dr. Anbarasan V. (+91 94431 82910) is the Village Officer and Smt. Meenakshi Sundaram (+91 94435 91823) is the Taluka Officer.',
    link: '/officers',
    actionText: 'Open Officer Directory',
  },
  {
    keywords: ['complaint', 'grievance', 'issue', 'problem', 'dispute', 'delay', 'shortage'],
    answer:
      'To file a grievance regarding pickup delays, quality disputes, or payment queries, open the Grievance Desk (/farmer/grievances). Select your issue category, link the order number if applicable, and describe the issue. It will be assigned directly to your Taluka Agricultural Officer for immediate investigation and resolution.',
    link: '/farmer',
    actionText: 'File a Grievance',
  },
  {
    keywords: ['escrow', 'payment', 'money', 'bank', 'protect', 'fund'],
    answer:
      'All transactions are protected by banking partner escrow. Before crop pickup begins, the buyer must prepay 100% of the confirmed order amount into escrow. Funds are securely held until verified handover (OTP + scale weighing + triple confirmation) at the farm gate. Only upon verified dispatch are funds released directly to your verified bank account.',
    link: '/explore',
    actionText: 'Learn About Protected Escrow',
  },
  {
    keywords: ['fpo', 'group', 'small farmer', 'combine', 'collective'],
    answer:
      'Small farmers can combine their crops into a bulk lot through a Farmer Producer Organisation (FPO), like the Aavin milk-society model! Each member\'s contribution in kg is recorded, and the system strictly prevents the same produce from being offered twice. Members can see their individual contributions and group sales directly in the portal.',
    link: '/farmer',
    actionText: 'View FPO Dashboard',
  },
  {
    keywords: ['banana', 'coconut', 'unit', 'kg', 'weight'],
    answer:
      'All quantities across this portal use kilograms (kg) and prices use INR/kg. Bananas and coconuts are strictly weighed by kg rather than sold by piece count or bunch, ensuring fair and standardized B2B trade.',
    link: '/explore',
    actionText: 'Browse Marketplace by kg',
  },
];

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        answer: 'Hello! I am the Cyber Shield Agri-Assistant. I can help you with portal navigation, farmer activation, choosing bids, finding your local agricultural officer, and filing grievances. What would you like assistance with?',
      });
    }

    const lower = query.toLowerCase();

    // 1. Try Keyword Matching against Approved Portal Instructions
    for (const faq of KNOWLEDGE_FAQS) {
      if (faq.keywords.some((k) => lower.includes(k))) {
        return NextResponse.json({
          success: true,
          answer: faq.answer,
          link: faq.link,
          actionText: faq.actionText,
          source: 'Approved Portal Guidelines',
        });
      }
    }

    // 2. If Gemini API Key is configured, use Gemini for conversational portal instructions
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `You are the Cyber Shield Pan-India B2B Crop Marketplace Help Assistant (SIH 26033).
Rules:
1. Provide only portal navigational guidance, workflow explanations, or instructions.
2. Under no circumstances should you choose buyers, rank bids, evaluate crop quality, resolve grievances, or release payments.
3. Be respectful, encouraging, and clear for Indian farmers and buyers.
User Question: "${query}"`;

        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({
              success: true,
              answer: generatedText,
              source: 'Gemini AI Assistant',
            });
          }
        }
      } catch (geminiErr) {
        console.error('Gemini call error:', geminiErr);
      }
    }

    // Default Fallback
    return NextResponse.json({
      success: true,
      answer:
        'I can help you navigate the Pan-India B2B Crop Marketplace. For assistance with farmer onboarding, choosing bids, contacting your agricultural officer, or tracking escrow payments, please select one of the quick options below or contact your local Taluka Agricultural Officer.',
      options: [
        'How do I activate my farmer profile?',
        'How do I choose a bid and allocate kg?',
        'Who is my local Agricultural Officer?',
        'How does simulated banking escrow work?',
        'How do small farmers participate in FPO lots?',
      ],
      link: '/officers',
      actionText: 'View Agricultural Officer Directory',
      source: 'Portal Helpdesk',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
