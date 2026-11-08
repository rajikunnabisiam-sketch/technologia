'use client';

import React, { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { MenuDrawer } from '@/components/MenuDrawer';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { Footer } from '@/components/Footer';
import { Order } from '@/types';

export const ClientLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        
        {/* Sticky Global Top Header (FR-NAV-01) */}
        <Navbar onOpenMenu={() => setIsMenuOpen(true)} />

        {/* Corner Three-Bar (≡) Text-Only Drawer (FR-NAV-04, ADR-002, ISS-NAV-02) */}
        <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* Multi-Item Persistent Cart Drawer (FR-CHK-01) */}
        <CartDrawer />

        {/* Structured Checkout Modal (FR-CHK-02, ISS-CHK-03) */}
        <CheckoutModal onOrderSuccess={(order) => setConfirmedOrder(order)} />

        {/* Order Confirmation Receipt Modal */}
        <OrderSuccessModal 
          order={confirmedOrder} 
          onClose={() => setConfirmedOrder(null)} 
        />

        {/* Page Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Cross-Device Universal Footer (FR-FTR-01, FR-FTR-02) */}
        <Footer />

      </div>
    </CartProvider>
  );
};

