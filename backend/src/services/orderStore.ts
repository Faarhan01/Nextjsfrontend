import { dbManager } from './dbManager.ts';

export interface OrderTimelineEvent {
  title: string;
  description: string;
  date: string;
  location?: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderRecord {
  id: string;
  userId?: string;
  email: string;
  status: 'Processing' | 'Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  orderDate: string;
  estimatedDelivery: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
    sellerId?: string;
    sellerName?: string;
    selectedOfferId?: string;
    condition?: string;
  }>;
  timeline: OrderTimelineEvent[];
}

export function getOrderById(orderId: string): OrderRecord | null {
  const cleanId = orderId.trim().toUpperCase();
  const found = dbManager.getOrderById(cleanId);
  if (found) return found;

  // Legacy LX prefix fallback
  if (cleanId.startsWith('LX-')) {
    const mbId = cleanId.replace('LX-', 'MB-');
    return dbManager.getOrderById(mbId);
  }
  return null;
}

export function getOrdersByUser(userId?: string, email?: string): OrderRecord[] {
  const all = dbManager.getOrders();
  if (userId) {
    return all.filter(o => o.userId === userId || (email && o.email.toLowerCase() === email.toLowerCase()));
  }
  if (email) {
    return all.filter(o => o.email.toLowerCase() === email.toLowerCase());
  }
  return all;
}

export function createOrder(data: {
  userId?: string;
  email: string;
  shippingAddress: any;
  items: any[];
  subtotal: number;
  shippingFee?: number;
  tax?: number;
  total: number;
  paymentMethod?: string;
}): OrderRecord {
  const orderId = `MB-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-ZA', { month: 'long', day: 'numeric', year: 'numeric' });
  const trackingNumber = `TCG-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const newOrder: OrderRecord = {
    id: orderId,
    userId: data.userId,
    email: data.email,
    status: 'Processing',
    carrier: 'The Courier Guy Standard Delivery',
    trackingNumber,
    trackingUrl: 'https://portal.thecourierguy.co.za/track',
    orderDate: dateStr,
    estimatedDelivery: '2-4 Business Days',
    shippingAddress: {
      name: data.shippingAddress?.name || 'Customer',
      street: data.shippingAddress?.street || '150 Industrial Rd, Crown North',
      city: data.shippingAddress?.city || 'Johannesburg',
      state: data.shippingAddress?.state || 'Gauteng',
      zip: data.shippingAddress?.zip || '2092',
      country: data.shippingAddress?.country || 'South Africa'
    },
    paymentMethod: data.paymentMethod || 'Credit Card / Visa',
    subtotal: data.subtotal,
    shippingFee: data.shippingFee || 0,
    tax: data.tax || Math.round(data.subtotal * 0.15 * 100) / 100,
    total: data.total,
    items: data.items.map((it, idx) => ({
      id: it.id || `it-${idx}`,
      name: it.name,
      price: typeof it.price === 'number' ? it.price : parseFloat(String(it.price).replace(/[^0-9.]/g, '')) || 0,
      quantity: it.quantity || it.qty || 1,
      image: it.image || it.imageUrl || it.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400',
      variant: it.variant
    })),
    timeline: [
      {
        title: 'Order Placed',
        description: 'Payment verified and order confirmed.',
        date: `${dateStr} — ${new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}`,
        location: 'Mrbulk Order System',
        completed: true,
        current: true
      },
      {
        title: 'Processing in Warehouse',
        description: 'Order queued for picking and custom packaging.',
        date: 'In Progress',
        location: 'Crown North Hub — Johannesburg',
        completed: false
      },
      {
        title: 'In Transit',
        description: 'Courier dispatch handover.',
        date: 'Scheduled',
        location: 'The Courier Guy Logistics Hub',
        completed: false
      },
      {
        title: 'Out for Delivery',
        description: 'Destination route delivery scan.',
        date: 'Pending',
        location: 'Local Courier Route',
        completed: false
      },
      {
        title: 'Delivered',
        description: 'Final handoff to customer.',
        date: 'Pending',
        location: 'Destination Address',
        completed: false
      }
    ]
  };

  dbManager.saveOrder(newOrder);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderRecord['status']): OrderRecord | null {
  const order = dbManager.getOrderById(orderId);
  if (!order) return null;

  order.status = status;
  // Update timeline current marker
  order.timeline.forEach(t => {
    if (t.title.toLowerCase().includes(status.toLowerCase())) {
      t.completed = true;
      t.current = true;
    }
  });

  dbManager.saveOrder(order);
  return order;
}

export function getStoreStats() {
  const allOrders = dbManager.getOrders();
  const totalSales = allOrders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = allOrders.length;
  
  return {
    totalSales,
    totalOrders,
    activeOrders: allOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
    deliveredOrders: allOrders.filter(o => o.status === 'Delivered').length,
    recentOrders: allOrders.slice(-5)
  };
}

