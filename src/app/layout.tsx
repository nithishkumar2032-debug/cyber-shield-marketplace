import type { Metadata } from 'next';
import './globals.css';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatbotModal from '@/components/ChatbotModal';

export const metadata: Metadata = {
  title: 'Pan-India B2B Crop Marketplace | Cyber Shield (SIH 26033)',
  description:
    'Collective selling, transparent quantity-specific bids, and protected banking partner escrow for small and large farmers across India. Prepared by Cyber Shield for Smart India Hackathon 2026.',
  keywords: [
    'Pan-India B2B Crop Marketplace',
    'Cyber Shield',
    'Smart India Hackathon 2026',
    'SIH 26033',
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
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 flex flex-col min-h-screen antialiased">
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
