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

const INITIAL_ORDERS: Record<string, OrderRecord> = {
  'LX-9901': {
    id: 'LX-9901',
    userId: 'usr-admin-01',
    email: 'admin@luxestore.com',
    status: 'Delivered',
    carrier: 'FedEx Priority Air',
    trackingNumber: 'FX-990188231',
    trackingUrl: 'https://www.fedex.com',
    orderDate: 'July 24, 2026',
    estimatedDelivery: 'July 26, 2026 (Delivered)',
    shippingAddress: {
      name: 'Alexander Vance',
      street: '1 Executive Plaza, Suite 40B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    paymentMethod: 'Corporate Visa ending in 9901',
    subtotal: 1300.00,
    shippingFee: 0.00,
    tax: 104.00,
    total: 1404.00,
    items: [
      {
        id: 'prod-1',
        name: 'Luxury Gold Chronograph Watch',
        price: 450.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=400',
        variant: '18K Gold Dial'
      },
      {
        id: 'prod-4',
        name: 'Italian Silk Business Suit',
        price: 850.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400',
        variant: 'Midnight Navy'
      }
    ],
    timeline: [
      { title: 'Order Placed', description: 'Payment verified.', date: 'July 24, 2026 — 08:00 AM', location: 'Store System', completed: true },
      { title: 'Packed', description: 'Inspected and packed in luxury presentation box.', date: 'July 24, 2026 — 01:00 PM', location: 'NY Central Warehouse', completed: true },
      { title: 'In Transit', description: 'Departed sorting facility.', date: 'July 25, 2026 — 09:30 AM', location: 'FedEx NYC Hub', completed: true },
      { title: 'Out for Delivery', description: 'Loaded onto courier truck.', date: 'July 26, 2026 — 08:15 AM', location: 'Manhattan Depot', completed: true },
      { title: 'Delivered', description: 'Signed at Executive Suite desk.', date: 'July 26, 2026 — 11:20 AM', location: 'New York, NY', completed: true, current: true }
    ]
  },
  'LX-9402': {
    id: 'LX-9402',
    userId: 'usr-cust-03',
    email: 'john@example.com',
    status: 'Delivered',
    carrier: 'FedEx Express Air',
    trackingNumber: 'FX-8839201923',
    trackingUrl: 'https://www.fedex.com',
    orderDate: 'July 20, 2026',
    estimatedDelivery: 'July 23, 2026 (Delivered)',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Luxury Avenue, Suite 400',
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210',
      country: 'United States'
    },
    paymentMethod: 'Visa ending in 4242',
    subtotal: 199.00,
    shippingFee: 0.00,
    tax: 15.92,
    total: 214.92,
    items: [
      {
        id: 'prod-1',
        name: 'Premium Wireless Noise-Canceling Headphones',
        price: 199.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400',
        variant: 'Space Black'
      }
    ],
    timeline: [
      { title: 'Order Placed', description: 'Payment authorized and order confirmed.', date: 'July 20, 2026 — 09:30 AM', location: 'Store Checkout System', completed: true },
      { title: 'Order Processed & Packed', description: 'Items inspected and packed.', date: 'July 20, 2026 — 02:15 PM', location: 'Distribution Hub — Los Angeles, CA', completed: true },
      { title: 'In Transit via FedEx', description: 'Package departed carrier sorting facility.', date: 'July 21, 2026 — 08:45 AM', location: 'FedEx Freight Facility — Burbank, CA', completed: true },
      { title: 'Out for Delivery', description: 'Courier loaded package onto delivery vehicle.', date: 'July 23, 2026 — 07:10 AM', location: 'Beverly Hills Depot, CA', completed: true },
      { title: 'Delivered', description: 'Package handed directly to resident at front door.', date: 'July 23, 2026 — 11:42 AM', location: 'Beverly Hills, CA 90210', completed: true, current: true }
    ]
  }
};

const ordersDb = new Map<string, OrderRecord>(Object.entries(INITIAL_ORDERS));

export function getOrderById(orderId: string): OrderRecord | null {
  const cleanId = orderId.trim().toUpperCase();
  return ordersDb.get(cleanId) || null;
}

export function getOrdersByUser(userId?: string, email?: string): OrderRecord[] {
  const all = Array.from(ordersDb.values());
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
  const orderId = `LX-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const trackingNumber = `FX-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const newOrder: OrderRecord = {
    id: orderId,
    userId: data.userId,
    email: data.email,
    status: 'Processing',
    carrier: 'FedEx Priority Air',
    trackingNumber,
    trackingUrl: 'https://www.fedex.com',
    orderDate: dateStr,
    estimatedDelivery: '3-5 Business Days',
    shippingAddress: {
      name: data.shippingAddress?.name || 'Customer',
      street: data.shippingAddress?.street || '123 Main St',
      city: data.shippingAddress?.city || 'Beverly Hills',
      state: data.shippingAddress?.state || 'CA',
      zip: data.shippingAddress?.zip || '90210',
      country: data.shippingAddress?.country || 'United States'
    },
    paymentMethod: data.paymentMethod || 'Credit Card Express',
    subtotal: data.subtotal,
    shippingFee: data.shippingFee || 0,
    tax: data.tax || (data.subtotal * 0.08),
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
        date: `${dateStr} — ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        location: 'Store Order System',
        completed: true,
        current: true
      },
      {
        title: 'Processing in Warehouse',
        description: 'Order queued for picking and custom packaging.',
        date: 'In Progress',
        location: 'NY Fulfillment Facility',
        completed: false
      },
      {
        title: 'In Transit',
        description: 'Courier dispatch handover.',
        date: 'Scheduled',
        location: 'FedEx Logistics Hub',
        completed: false
      },
      {
        title: 'Out for Delivery',
        description: 'Destination route delivery scan.',
        date: 'Pending',
        location: 'Destination Depot',
        completed: false
      },
      {
        title: 'Delivered',
        description: 'Final handoff to resident.',
        date: 'Pending',
        location: 'Destination Address',
        completed: false
      }
    ]
  };

  ordersDb.set(orderId, newOrder);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderRecord['status']): OrderRecord | null {
  const order = ordersDb.get(orderId.trim().toUpperCase());
  if (!order) return null;

  order.status = status;
  // Update timeline current marker
  order.timeline.forEach(t => {
    if (t.title.toLowerCase().includes(status.toLowerCase())) {
      t.completed = true;
      t.current = true;
    }
  });

  return order;
}

export function getStoreStats() {
  const allOrders = Array.from(ordersDb.values());
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
