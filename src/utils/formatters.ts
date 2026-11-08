/**
 * Formats a numeric price into localized currency string (e.g., ৳8,500)
 */
export function formatCurrency(amount: number): string {
  return `৳${Number(amount || 0).toLocaleString('en-BD')}`;
}

/**
 * Generates an official 5-digit Order ID matching requirements (e.g., ORD-84920)
 */
export function generateOrderId(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${randomDigits}`;
}

/**
 * Calculates discount percentage
 */
export function getDiscountPercentage(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

