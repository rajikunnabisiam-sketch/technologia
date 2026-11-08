import { createClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { Order } from '@/types';

// Convert database row to Order interface
export function mapRowToOrder(row: any): Order {
  return {
    orderId: row.order_id,
    createdAt: row.created_at,
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      address: row.customer_address,
      city: row.customer_city || 'Dhaka',
      notes: row.customer_notes || undefined,
      advanceTxnId: row.advance_txn_id || undefined,
    },
    paymentMethod: row.payment_method,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee || 0),
    totalAmount: Number(row.total_amount),
    status: row.status,
    estimatedDelivery: row.estimated_delivery,
  };
}

// Convert Order interface to database row
export function mapOrderToRow(order: Order) {
  return {
    order_id: order.orderId,
    created_at: order.createdAt || new Date().toISOString(),
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_address: order.customer.address,
    customer_city: order.customer.city || 'Dhaka',
    customer_notes: order.customer.notes || null,
    advance_txn_id: order.customer.advanceTxnId || null,
    payment_method: order.paymentMethod,
    items: order.items,
    subtotal: order.subtotal,
    shipping_fee: order.shippingFee,
    total_amount: order.totalAmount,
    status: order.status,
    estimated_delivery: order.estimatedDelivery,
  };
}

/**
 * Save an order to Supabase
 */
export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }
  try {
    const supabase = createClient();
    const row = mapOrderToRow(order);
    const { error } = await supabase.from('orders').insert([row]);
    if (error) {
      console.warn('Failed to insert order into Supabase, storing in localStorage fallback:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saving order to Supabase:', err);
    return false;
  }
}

/**
 * Fetch an order by ID or Customer Phone for live tracking
 */
export async function getOrderFromSupabase(query: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const supabase = createClient();
    const cleanQuery = query.trim();
    
    // First try exact Order ID match
    const { data: byId } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', cleanQuery)
      .maybeSingle();

    if (byId) return mapRowToOrder(byId);

    // Then try phone match
    const { data: byPhone } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', cleanQuery)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byPhone) return mapRowToOrder(byPhone);

    return null;
  } catch (err) {
    console.warn('Error querying order from Supabase:', err);
    return null;
  }
}

/**
 * Fetch all orders for the Admin Dashboard
 */
export async function getAllOrdersFromSupabase(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map(mapRowToOrder);
  } catch (err) {
    console.warn('Error fetching all orders from Supabase:', err);
    return [];
  }
}

/**
 * Update order dispatch status (Admin)
 */
export async function updateOrderStatusInSupabase(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', orderId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating order status:', err);
    throw err;
  }
}
