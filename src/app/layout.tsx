import type { Metadata } from 'next';
import './globals.css';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatbotModal from '@/components/ChatbotModal';
import PrototypeBanner from '@/components/PrototypeBanner';

export const metadata: Metadata = {
  title: 'Cyber Shield | Trusted Farm-Gate Transaction Layer | SIH 2026',
  description:
    'Cyber Shield is a Smart India Hackathon 2026 prototype for a trusted B2B farm-gate transaction workflow.',
  keywords: ['Cyber Shield', 'SIH 2026', 'Trusted Farm-Gate Transaction Layer', 'FPO', 'B2B agriculture'],
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
          <PrototypeBanner />
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <ChatbotModal />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
