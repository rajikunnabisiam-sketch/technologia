'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order } from '@/types';
import { saveOrderToSupabase } from '@/services/orderService';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isMounted: boolean;
  orders: Order[];
  saveOrder: (order: Order) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;
}

const CART_STORAGE_KEY = 'gadget_store_cart_v1';
const ORDERS_STORAGE_KEY = 'gadget_store_orders_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial mock orders so users can test order tracking right away
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    orderId: 'ORD-84920',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    customer: {
      name: 'Ashikur Rahman',
      phone: '+8801711223344',
      address: 'House 42, Road 11, Banani, Dhaka',
    },
    paymentMethod: 'COD',
    items: [
      {
        productId: 'prod-pb-01',
        title: 'Anker Prime 20,000mAh 200W Multi-Port Power Bank',
        brand: 'Anker',
        quantity: 1,
        unitPrice: 8500,
        image: 'https://images.unsplash.com/photo-1609592426868-d06efd396a57?auto=format&fit=crop&w=800&q=80',
      },
      {
        productId: 'prod-ch-02',
        title: 'Baseus GaN5 Pro 65W Dual USB-C Fast Wall Charger',
        brand: 'Baseus',
        quantity: 1,
        unitPrice: 2950,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      },
    ],
    subtotal: 11450,
    shippingFee: 70,
    totalAmount: 11520,
    status: 'Out for Delivery',
    estimatedDelivery: 'Today by 6:00 PM',
  },
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_DEMO_ORDERS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart and orders from localStorage upon client mount to avoid SSR hydration mismatches (ISS-NAV-04)
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  }, []);

  // Sync cart changes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, isMounted]);

  // Sync orders to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  }, [orders, isMounted]);

  // Calculate live totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 15000 || subtotal === 0 ? 0 : 70; // Free shipping over 15,000
  const totalAmount = subtotal + shippingFee;

  /**
   * Adds an item to the cart. If already present, increments quantity (ISS-CHK-02).
   */
  const addToCart = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prevItems, { product, quantity }];
    });
  };

  /**
   * Removes an item from the cart.
   */
  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  /**
   * Updates the quantity of a cart item (minimum 1).
   */
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clears the cart completely and resets localStorage (ISS-CHK-05).
   */
  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    }
  };

  /**
   * Saves confirmed order into history and Supabase database
   */
  const saveOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();

    // Persist to Supabase database (async non-blocking)
    saveOrderToSupabase(newOrder).catch((err) => {
      console.warn('Background Supabase order sync error:', err);
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        shippingFee,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isMounted,
        orders,
        saveOrder,
        lastCreatedOrder,
        setLastCreatedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

