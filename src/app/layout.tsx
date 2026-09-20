import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatbotModal from '@/components/ChatbotModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pan-India B2B Crop Marketplace | Direct Mandi & Escrow Trading',
  description:
    'Collective selling, transparent quantity-specific bids, and protected banking partner escrow for small and large farmers across India.',
  keywords: [
    'Pan-India B2B Crop Marketplace',
    'FPO Aggregation',
    'Farmer B2B Escrow',
    'Agricultural Officer Verification',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-slate-50 text-slate-900 flex flex-col min-h-screen antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <MarketplaceProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <ChatbotModal />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
