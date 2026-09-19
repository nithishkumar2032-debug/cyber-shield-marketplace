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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-[#faf8ff] text-[#131b2e] flex flex-col min-h-screen antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <MarketplaceProvider>
          <Header />
          <main className="flex-1 w-full pt-32 sm:pt-36">{children}</main>
          <Footer />
          <ChatbotModal />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
