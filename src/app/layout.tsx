import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientLayoutShell } from '@/components/ClientLayoutShell';

export const metadata: Metadata = {
  title: 'Technologia | Next-Gen Electronics & Lifestyle Storefront',
  description: '100% Original Gadgets. Because the only thing worse than 1% battery is a fake power bank — Real Tech, Official Warranty, Zero "Trust Me Bro" Guarantees.',
  keywords: [
    'Electronics',
    'Power Banks',
    'GaN Fast Chargers',
    'Smart Watches',
    'Headphones',
    'Home Appliances',
    'Personal Care',
    'Anker',
    'Sony',
    'Xiaomi',
    'Philips',
    'Original Tech',
    'Cash on Delivery',
  ],
  authors: [{ name: 'Technologia Storefront' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  );
}

