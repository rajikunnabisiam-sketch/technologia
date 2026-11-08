import { CartItem, Product, PaymentMethod } from '@/types';

export const STORE_WHATSAPP_NUMBER = '8801712345678'; // Official WhatsApp Business Number

/**
 * Builds a direct HTTPS WhatsApp Click-to-Chat URL for a single product inquiry/order.
 * Enforces encodeURIComponent to safely handle special characters like '&', '+', and '%'.
 */
export function buildProductWhatsAppUrl(product: Product, storeNumber = STORE_WHATSAPP_NUMBER): string {
  const message = `Hello Technologia! 👋\nI want to order / inquire about:\n📦 *${product.title}*\n🏷️ Brand: *${product.brand}*\n💰 Price: *৳${product.price.toLocaleString()}*\n🛡️ Warranty: *${product.warranty}*\n\nPlease let me know the stock availability and delivery timeline!`;
  
  return `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a direct HTTPS WhatsApp Click-to-Chat URL for a full multi-item shopping cart.
 * Maps over all cart items to display a clean, numbered order breakdown with grand total.
 */
export function buildCartWhatsAppUrl(
  items: CartItem[],
  totalAmount: number,
  preferredPayment: PaymentMethod = 'COD',
  storeNumber = STORE_WHATSAPP_NUMBER
): string {
  if (items.length === 0) return `https://wa.me/${storeNumber}`;

  const itemsList = items
    .map((item, idx) => {
      const lineTotal = item.product.price * item.quantity;
      return `${idx + 1}. *${item.product.title}*\n   Qty: ${item.quantity} × ৳${item.product.price.toLocaleString()} = ৳${lineTotal.toLocaleString()} (${item.product.brand})`;
    })
    .join('\n\n');

  const paymentText = preferredPayment === 'COD' ? 'Cash on Delivery (COD)' : 'Advance Digital Payment';

  const message = `Hello Technologia! 🛒\nI would like to place an order for the following items:\n\n${itemsList}\n\n━━━━━━━━━━━━━━━━━━━━\n💵 *Grand Total:* ৳${totalAmount.toLocaleString()}\n💳 *Preferred Payment:* ${paymentText}\n\nPlease confirm availability and let me know the next steps for delivery!`;

  return `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds WhatsApp link when a user searches for an item that is currently not in the catalog.
 */
export function buildSearchFallbackWhatsAppUrl(query: string, storeNumber = STORE_WHATSAPP_NUMBER): string {
  const message = `Hello Technologia! 🔍\nI was searching for "*${query}*" on your store website but couldn't find it. Do you have this gadget in stock or can you source it for me?`;

  return `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`;
}

