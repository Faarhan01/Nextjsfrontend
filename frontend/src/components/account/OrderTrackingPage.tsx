'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from '../ui/SafeImage';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  ShoppingBag, 
  ChevronRight, 
  Mail, 
  HelpCircle,
  Phone,
  RefreshCw,
  Box,
  FileText
} from 'lucide-react';
import { sdk } from '../../lib/sdk';

interface OrderTrackingPageProps {
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
  onNavigate: (page: string) => void;
  showToast: (msg: string) => void;
  currentUser?: any;
}

interface OrderTimelineEvent {
  title: string;
  description: string;
  date: string;
  location?: string;
  completed: boolean;
  current?: boolean;
}

interface OrderDetails {
  id: string;
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
  }>;
  timeline: OrderTimelineEvent[];
}

// Dummy Database of Orders for Instant Lookup
const DUMMY_ORDERS: Record<string, OrderDetails> = {
  'LX-9901': {
    id: 'LX-9901',
    email: 'mrbulkza@gmail.com',
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
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400',
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
  'LX-8812': {
    id: 'LX-8812',
    email: 'sophia@example.com',
    status: 'In Transit',
    carrier: 'DHL VIP Express',
    trackingNumber: 'DHL-88129031',
    trackingUrl: 'https://www.dhl.com',
    orderDate: 'July 22, 2026',
    estimatedDelivery: 'July 27, 2026',
    shippingAddress: {
      name: 'Sophia Laurent',
      street: '884 Bel Air Road',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90077',
      country: 'United States'
    },
    paymentMethod: 'Amex Centurion ending in 8812',
    subtotal: 1200.00,
    shippingFee: 0.00,
    tax: 96.00,
    total: 1296.00,
    items: [
      {
        id: 'prod-2',
        name: 'Haute Couture Silk Evening Gown',
        price: 1200.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=400',
        variant: 'Emerald Silk'
      }
    ],
    timeline: [
      { title: 'Order Placed', description: 'VIP Order confirmed.', date: 'July 22, 2026 — 10:15 AM', location: 'Atelier Store', completed: true },
      { title: 'Custom Packaging', description: 'Hand-wrapped in garment casing.', date: 'July 23, 2026 — 03:00 PM', location: 'LA Atelier Hub', completed: true },
      { title: 'In Transit', description: 'En route to local courier depot.', date: 'July 25, 2026 — 11:00 AM', location: 'DHL Express LAX', completed: true, current: true },
      { title: 'Out for Delivery', description: 'Scheduled courier transport.', date: 'July 27, 2026', location: 'Bel Air Depot', completed: false },
      { title: 'Delivered', description: 'Final residence delivery.', date: 'July 27, 2026', location: 'Bel Air, CA', completed: false }
    ]
  },
  'LX-7402': {
    id: 'LX-7402',
    email: 'john@example.com',
    status: 'Delivered',
    carrier: 'UPS Express',
    trackingNumber: '1Z-74029102',
    trackingUrl: 'https://www.ups.com',
    orderDate: 'July 12, 2026',
    estimatedDelivery: 'July 15, 2026 (Delivered)',
    shippingAddress: {
      name: 'John Doe',
      street: '150 Industrial Rd, Crown North',
      city: 'Johannesburg',
      state: 'Gauteng',
      zip: '2092',
      country: 'South Africa'
    },
    paymentMethod: 'Mastercard ending in 0192',
    subtotal: 199.00,
    shippingFee: 0.00,
    tax: 15.92,
    total: 214.92,
    items: [
      {
        id: 'prod-3',
        name: 'Premium Wireless Noise-Canceling Headphones',
        price: 199.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=400',
        variant: 'Matte Black'
      }
    ],
    timeline: [
      { title: 'Order Placed', description: 'Order confirmed.', date: 'July 12, 2026 — 09:00 AM', location: 'Store Online', completed: true },
      { title: 'Packed', description: 'Item prepped for delivery.', date: 'July 12, 2026 — 02:00 PM', location: 'Fulfillment Center', completed: true },
      { title: 'In Transit', description: 'Package in transport.', date: 'July 13, 2026 — 08:30 AM', location: 'UPS Hub', completed: true },
      { title: 'Out for Delivery', description: 'On delivery vehicle.', date: 'July 15, 2026 — 07:45 AM', location: 'Johannesburg Depot', completed: true },
      { title: 'Delivered', description: 'Package delivered.', date: 'July 15, 2026 — 10:30 AM', location: 'Johannesburg, GP', completed: true, current: true }
    ]
  },
  'LX-9402': {
    id: 'LX-9402',
    email: 'mrbulkza@gmail.com',
    status: 'Delivered',
    carrier: 'FedEx Express Air',
    trackingNumber: 'FX-8839201923',
    trackingUrl: 'https://www.fedex.com',
    orderDate: 'July 20, 2026',
    estimatedDelivery: 'July 23, 2026 (Delivered)',
    shippingAddress: {
      name: 'Alexander Vance',
      street: '150 Industrial Rd, Crown North',
      city: 'Johannesburg',
      state: 'Gauteng',
      zip: '2092',
      country: 'South Africa'
    },
    paymentMethod: 'Visa ending in 4242',
    subtotal: 199.00,
    shippingFee: 0.00,
    tax: 15.92,
    total: 214.92,
    items: [
      {
        id: 'p1',
        name: 'Premium Wireless Noise-Canceling Headphones',
        price: 199.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400',
        variant: 'Space Black'
      }
    ],
    timeline: [
      {
        title: 'Order Placed',
        description: 'Payment authorized and order confirmed.',
        date: 'July 20, 2026 — 09:30 AM',
        location: 'Store Checkout System',
        completed: true
      },
      {
        title: 'Order Processed & Packed',
        description: 'Items inspect and packed at fulfillment center.',
        date: 'July 20, 2026 — 02:15 PM',
        location: 'Distribution Hub — Los Angeles, CA',
        completed: true
      },
      {
        title: 'In Transit via FedEx',
        description: 'Package departed carrier sorting facility.',
        date: 'July 21, 2026 — 08:45 AM',
        location: 'FedEx Freight Facility — Burbank, CA',
        completed: true
      },
      {
        title: 'Out for Delivery',
        description: 'Courier loaded package onto delivery vehicle.',
        date: 'July 23, 2026 — 07:10 AM',
        location: 'Johannesburg Courier Hub, GP',
        completed: true
      },
      {
        title: 'Delivered',
        description: 'Package handed directly to resident at front door.',
        date: 'July 23, 2026 — 11:42 AM',
        location: 'Johannesburg, GP 2092',
        completed: true,
        current: true
      }
    ]
  },
  'LX-9401': {
    id: 'LX-9401',
    email: 'sophia@example.com',
    status: 'Shipped',
    carrier: 'DHL Express Worldwide',
    trackingNumber: 'DHL-992018442',
    trackingUrl: 'https://www.dhl.com',
    orderDate: 'July 21, 2026',
    estimatedDelivery: 'July 24, 2026 by 5:00 PM',
    shippingAddress: {
      name: 'Sophia Laurent',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zip: '97477',
      country: 'United States'
    },
    paymentMethod: 'Mastercard ending in 8812',
    subtotal: 450.00,
    shippingFee: 25.00,
    tax: 36.00,
    total: 511.00,
    items: [
      {
        id: 'p2',
        name: 'Luxe Solid Oak Minimalist Desk',
        price: 450.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=400',
        variant: 'Natural Oak Finish'
      }
    ],
    timeline: [
      {
        title: 'Order Placed',
        description: 'Order confirmed and sent to warehouse.',
        date: 'July 21, 2026 — 10:14 AM',
        location: 'Online Store',
        completed: true
      },
      {
        title: 'Quality Check & Packaging',
        description: 'Inspected and secured with protective wooden crate.',
        date: 'July 21, 2026 — 04:30 PM',
        location: 'Furniture Distribution Hub — Seattle, WA',
        completed: true
      },
      {
        title: 'In Transit',
        description: 'Package in transit with regional transport hub.',
        date: 'July 22, 2026 — 09:00 AM',
        location: 'DHL Regional Logistics Hub — Portland, OR',
        completed: true,
        current: true
      },
      {
        title: 'Out for Delivery',
        description: 'Scheduled for local delivery courier.',
        date: 'Expected July 24, 2026',
        location: 'Springfield, OR Depot',
        completed: false
      },
      {
        title: 'Delivery Finalized',
        description: 'Awaiting signature upon arrival.',
        date: 'Expected July 24, 2026',
        location: 'Springfield, OR',
        completed: false
      }
    ]
  },
  'LX-9400': {
    id: 'LX-9400',
    email: 'elena@example.com',
    status: 'Processing',
    carrier: 'UPS Ground Service',
    trackingNumber: 'UPS-1Z9999999999999999',
    trackingUrl: 'https://www.ups.com',
    orderDate: 'July 22, 2026',
    estimatedDelivery: 'July 26, 2026',
    shippingAddress: {
      name: 'Elena Rostova',
      street: '88 Design Street, Apt 12B',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'United States'
    },
    paymentMethod: 'Apple Pay',
    subtotal: 320.00,
    shippingFee: 0.00,
    tax: 25.60,
    total: 345.60,
    items: [
      {
        id: 'p3',
        name: 'Modernist Brass Chandelier Pendant Light',
        price: 320.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400',
        variant: 'Brushed Brass'
      }
    ],
    timeline: [
      {
        title: 'Order Received',
        description: 'Order placed and payment validated.',
        date: 'July 22, 2026 — 03:45 PM',
        location: 'Store Fulfillment System',
        completed: true,
        current: true
      },
      {
        title: 'Assembling & Packaging',
        description: 'Item being picked and custom packaged.',
        date: 'In Progress',
        location: 'Warehouse — Chicago, IL',
        completed: false
      },
      {
        title: 'Handed to Carrier',
        description: 'Waiting for UPS carrier pick up scan.',
        date: 'Scheduled July 23',
        location: 'Chicago Hub',
        completed: false
      },
      {
        title: 'Out for Delivery',
        description: 'Destination route delivery scan.',
        date: 'Scheduled July 26',
        location: 'Chicago, IL',
        completed: false
      },
      {
        title: 'Delivered',
        description: 'Final delivery completion.',
        date: 'Scheduled July 26',
        location: 'Destination',
        completed: false
      }
    ]
  }
};

export default function OrderTrackingPage({
  themeColor,
  getThemeClasses,
  onNavigate,
  showToast,
  currentUser
}: OrderTrackingPageProps) {
  const currentTheme = getThemeClasses(themeColor);

  const lightBannerBg = {
    blue: 'bg-gradient-to-br from-blue-200/90 via-blue-100/75 to-blue-50/85 dark:from-blue-950/90 dark:via-blue-900/60 dark:to-blue-950/80 border-blue-300/80 dark:border-blue-700/60',
    indigo: 'bg-gradient-to-br from-indigo-200/90 via-indigo-100/75 to-indigo-50/85 dark:from-indigo-950/90 dark:via-indigo-900/60 dark:to-indigo-950/80 border-indigo-300/80 dark:border-indigo-700/60',
    emerald: 'bg-gradient-to-br from-emerald-200/90 via-emerald-100/75 to-emerald-50/85 dark:from-emerald-950/90 dark:via-emerald-900/60 dark:to-emerald-950/80 border-emerald-300/80 dark:border-emerald-700/60',
    rose: 'bg-gradient-to-br from-rose-200/90 via-rose-100/75 to-rose-50/85 dark:from-rose-950/90 dark:via-rose-900/60 dark:to-rose-950/80 border-rose-300/80 dark:border-rose-700/60',
    amber: 'bg-gradient-to-br from-amber-200/90 via-amber-100/75 to-amber-50/85 dark:from-amber-950/90 dark:via-amber-900/60 dark:to-amber-950/80 border-amber-300/80 dark:border-amber-700/60',
    slate: 'bg-gradient-to-br from-slate-200/90 via-slate-100/80 to-slate-50/90 dark:from-slate-800/90 dark:via-slate-850 dark:to-slate-800/80 border-slate-300/90 dark:border-slate-700/70',
  }[themeColor] || 'bg-gradient-to-br from-blue-200/90 via-blue-100/75 to-blue-50/85 dark:from-blue-950/90 dark:via-blue-900/60 dark:to-blue-950/80 border-blue-300/80 dark:border-blue-700/60';

  const ambientGlowClasses = {
    blue: 'bg-blue-400/20 dark:bg-blue-500/25',
    indigo: 'bg-indigo-400/20 dark:bg-indigo-500/25',
    emerald: 'bg-emerald-400/20 dark:bg-emerald-500/25',
    rose: 'bg-rose-400/20 dark:bg-rose-500/25',
    amber: 'bg-amber-400/20 dark:bg-amber-500/25',
    slate: 'bg-slate-400/20 dark:bg-slate-500/25',
  }[themeColor] || 'bg-blue-400/20 dark:bg-blue-500/25';

  // Form State
  const getDefaultOrderId = (user: any) => {
    if (!user) return 'LX-9402';
    if (user.id === 'usr-admin-01') return 'LX-9901';
    if (user.id === 'usr-vip-02') return 'LX-8812';
    if (user.id === 'usr-cust-03') return 'LX-7402';
    return 'LX-9402';
  };

  const initialOrderId = getDefaultOrderId(currentUser);
  const [orderInput, setOrderInput] = useState(initialOrderId);
  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  
  // Active Tracked Order State
  const [searchedOrderId, setSearchedOrderId] = useState<string>(initialOrderId);
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(DUMMY_ORDERS[initialOrderId] || DUMMY_ORDERS['LX-9402']);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const targetId = getDefaultOrderId(currentUser);
    setOrderInput(targetId);
    setSearchedOrderId(targetId);
    if (currentUser?.email) setEmailInput(currentUser.email);
    if (DUMMY_ORDERS[targetId]) {
      setCurrentOrder(DUMMY_ORDERS[targetId]);
    }
  }, [currentUser?.id]);

  // Search Submit Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderInput.trim().toUpperCase();

    if (!cleanId) {
      showToast('Please enter a valid Order ID (e.g. LX-9901).');
      return;
    }

    setIsSearching(true);
    setSearchedOrderId(cleanId);

    try {
      // 1. Query Medusa store order tracking endpoint
      const res = await sdk.orders.track(cleanId);
      if (res && res.order) {
        setCurrentOrder(res.order);
        showToast(`Found shipment tracking for #${cleanId}`);
        setIsSearching(false);
        return;
      }
    } catch (err) {
      // Backend didn't find or offline - check local fallbacks
    }

    // 2. Check DUMMY_ORDERS fallback
    if (DUMMY_ORDERS[cleanId]) {
      setCurrentOrder(DUMMY_ORDERS[cleanId]);
      showToast(`Found tracking details for order #${cleanId}`);
      setIsSearching(false);
      return;
    }

    // 3. Check localStorage saved orders
    if (currentUser?.id) {
      try {
        const storedOrdersRaw = localStorage.getItem(`luxestore_orders_${currentUser.id}`);
        if (storedOrdersRaw) {
          const storedOrders = JSON.parse(storedOrdersRaw);
          const found = storedOrders.find((o: any) => o.id === cleanId);
          if (found) {
            const formattedOrder: OrderDetails = {
              id: found.id,
              email: currentUser.email,
              status: found.status || 'In Transit',
              carrier: 'Mrbulk Express',
              trackingNumber: `MB-TRACK-${found.id}`,
              trackingUrl: 'https://www.fedex.com',
              orderDate: found.date,
              estimatedDelivery: '3-5 Business Days',
              shippingAddress: {
                name: currentUser.name,
                street: currentUser.address?.street || '150 Industrial Rd, Crown North',
                city: currentUser.address?.city || 'Johannesburg',
                state: currentUser.address?.state || 'GP',
                zip: currentUser.address?.zip || '2092',
                country: 'South Africa'
              },
              paymentMethod: 'Credit Card / Direct Transfer',
              subtotal: 250.00,
              shippingFee: 0,
              tax: 20.00,
              total: 270.00,
              items: (found.items || []).map((it: any, idx: number) => ({
                id: `it-${idx}`,
                name: it.name,
                price: typeof it.price === 'number' ? it.price : 120,
                quantity: it.qty || 1,
                image: it.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400'
              })),
              timeline: [
                { title: 'Order Placed', description: 'Payment verified.', date: found.date, location: 'Store Checkout System', completed: true },
                { title: 'In Transit', description: 'Package dispatched.', date: 'In Transport', location: 'Regional Hub', completed: true, current: true },
                { title: 'Out for Delivery', description: 'Final delivery run.', date: 'Scheduled', location: 'Destination Depot', completed: false },
                { title: 'Delivered', description: 'Handed to recipient.', date: 'Pending', location: 'Destination', completed: false }
              ]
            };
            setCurrentOrder(formattedOrder);
            showToast(`Found tracking details for order #${cleanId}`);
            setIsSearching(false);
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    setIsSearching(false);
    showToast(`No tracking records found for #${cleanId}. Showing dynamic mockup.`);

      // Fallback dynamic order details if order not found in mock store
      const dynamicOrder: OrderDetails = {
        id: cleanId,
        email: emailInput || currentUser?.email || 'customer@example.com',
        status: 'Shipped',
        carrier: 'FedEx Priority Track',
        trackingNumber: `FX-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        trackingUrl: 'https://www.fedex.com',
        orderDate: 'July 21, 2026',
        estimatedDelivery: 'July 25, 2026',
        shippingAddress: {
          name: currentUser?.name || 'Valued Store Customer',
          street: currentUser?.address?.street || '456 Innovation Way',
          city: currentUser?.address?.city || 'San Francisco',
          state: currentUser?.address?.state || 'CA',
          zip: currentUser?.address?.zip || '94105',
          country: 'United States'
        },
        paymentMethod: 'Credit Card (Instant Auth)',
        subtotal: 185.00,
        shippingFee: 12.00,
        tax: 14.80,
        total: 211.80,
        items: [
          {
            id: 'p-custom',
            name: 'Nordic Ergonomic Lounge Chair',
            price: 185.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=400',
            variant: 'Light Grey Felt'
          }
        ],
        timeline: [
          {
            title: 'Order Placed',
            description: 'Payment authorized successfully.',
            date: 'July 21, 2026',
            location: 'Online Store',
            completed: true
          },
          {
            title: 'Processing in Warehouse',
            description: 'Order picked and prepared for transport.',
            date: 'July 22, 2026',
            location: 'Central Fulfillment Facility',
            completed: true
          },
          {
            title: 'In Transit',
            description: 'En route to local distribution hub.',
            date: 'July 23, 2026',
            location: 'FedEx Hub',
            completed: true,
            current: true
          },
          {
            title: 'Delivered',
            description: 'Scheduled final delivery.',
            date: 'July 25, 2026',
            location: 'Destination',
            completed: false
          }
        ]
      };
      setCurrentOrder(dynamicOrder);
      showToast(`Tracking status initialized for #${cleanId}`);
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Tracking number ${code} copied to clipboard!`);
  };

  const handleAdvanceStatus = (nextStatus: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered') => {
    if (!currentOrder) return;
    const updatedTimeline = [...currentOrder.timeline];
    if (nextStatus === 'delivered') {
      updatedTimeline.forEach(t => { t.completed = true; t.current = false; });
      setCurrentOrder({ ...currentOrder, status: 'Delivered', timeline: updatedTimeline });
    } else if (nextStatus === 'in_transit' || nextStatus === 'shipped') {
      updatedTimeline[0].completed = true;
      if (updatedTimeline[1]) updatedTimeline[1].completed = true;
      if (updatedTimeline[2]) { updatedTimeline[2].completed = true; updatedTimeline[2].current = true; }
      setCurrentOrder({ ...currentOrder, status: 'In Transit', timeline: updatedTimeline });
    }
    showToast(`Order status updated to ${nextStatus}`);
  };

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Out for Delivery':
        return 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Shipped':
        return 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Processing':
        return 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-24 space-y-6 sm:space-y-8">
      
      {/* Header Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1 select-none">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 cursor-pointer font-semibold no-underline text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </a>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-extrabold">Track Order</span>
        </div>

        <div className={`relative w-full py-8 sm:py-12 px-4 sm:px-8 ${lightBannerBg} text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-80 h-80 ${ambientGlowClasses} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${ambientGlowClasses} rounded-full blur-2xl pointer-events-none`} />

          <div className="max-w-3xl mx-auto relative z-10 text-center space-y-4">
            
            {/* Badge Pill */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-xs ${currentTheme.text} backdrop-blur-xs select-text`}>
              <span>Live Shipment Dispatch</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white select-text">
              Track Your Order
            </h1>
            
            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed select-text">
              Enter your Store Order ID below to get live location updates, carrier status, and estimated delivery dates.
            </p>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-6 sm:space-y-8">
        
        {/* Search Bar & Instant Presets Card */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter Order ID (e.g., LX-9402, LX-9401, LX-9400)"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 font-bold uppercase tracking-wide text-slate-900 dark:text-white"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <div className="relative sm:w-64">
              <input
                type="email"
                placeholder="Email address (optional)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3.5 text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-800 dark:text-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className={`px-6 py-3.5 ${currentTheme.bg} text-white font-bold text-xs sm:text-sm rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-98 shrink-0`}
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Locating...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Track Package
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Buttons for Easy Testing */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              Quick Test Presets:
            </span>

            <button
              type="button"
              onClick={() => {
                setOrderInput('LX-9402');
                setCurrentOrder(DUMMY_ORDERS['LX-9402']);
                setSearchedOrderId('LX-9402');
                showToast('Loaded Delivered order #LX-9402');
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                searchedOrderId === 'LX-9402'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> LX-9402 (Delivered)
            </button>

            <button
              type="button"
              onClick={() => {
                setOrderInput('LX-9401');
                setCurrentOrder(DUMMY_ORDERS['LX-9401']);
                setSearchedOrderId('LX-9401');
                showToast('Loaded In-Transit order #LX-9401');
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                searchedOrderId === 'LX-9401'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> LX-9401 (In Transit)
            </button>

            <button
              type="button"
              onClick={() => {
                setOrderInput('LX-9400');
                setCurrentOrder(DUMMY_ORDERS['LX-9400']);
                setSearchedOrderId('LX-9400');
                showToast('Loaded Processing order #LX-9400');
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                searchedOrderId === 'LX-9400'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> LX-9400 (Processing)
            </button>
          </div>

        </div>

        {/* ORDER DETAILS & TIMELINE CARD */}
        {currentOrder && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentOrder.id}
            className="space-y-8"
          >
            {/* Top Shipment Status Header */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Order #{currentOrder.id}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusBadge(currentOrder.status)}`}>
                      {currentOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Placed on <strong className="text-slate-700 dark:text-slate-200">{currentOrder.orderDate}</strong> — Payment via {currentOrder.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyTracking(currentOrder.trackingNumber)}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Copy Tracking #
                  </button>

                  <a
                    href={currentOrder.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    Carrier Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Carrier & Delivery Estimate Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Truck className="w-3 h-3 text-blue-500" /> Courier & Carrier
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white block">{currentOrder.carrier}</span>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">{currentOrder.trackingNumber}</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-500" /> Estimated Delivery
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white block">{currentOrder.estimatedDelivery}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Standard On-Time Guarantee</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" /> Shipping Destination
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">{currentOrder.shippingAddress.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                    {currentOrder.shippingAddress.street}, {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zip}
                  </span>
                </div>

              </div>

            </div>

            {/* LIVE SHIPMENT TIMELINE PROGRESS */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" /> Live Package Tracking Timeline
                  </h3>
                  <p className="text-xs text-slate-400">Step-by-step dispatch and courier progress updates.</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Advance Stage:</span>
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus('processing')}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20 transition cursor-pointer"
                  >
                    Processing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus('in_transit')}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-500/20 transition cursor-pointer"
                  >
                    In Transit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus('out_for_delivery')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] border border-indigo-500/20 transition cursor-pointer"
                  >
                    Out for Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus('delivered')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20 transition cursor-pointer"
                  >
                    Delivered
                  </button>
                </div>
              </div>

              {/* Vertical / Horizontal Stepper Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {currentOrder.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 group">
                    
                    {/* Node Dot Icon */}
                    <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs z-10 ${
                      event.current
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50 animate-pulse'
                        : event.completed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700'
                    }`}>
                      {event.completed ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className={`text-xs sm:text-sm font-extrabold ${event.completed ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                          {event.title}
                        </h4>
                        <span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400">
                          {event.date}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {event.description}
                      </p>

                      {event.location && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
                          <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {event.location}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>

            {/* ORDERED ITEMS & PAYMENT BREAKDOWN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Itemized Product Table */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" /> Items in Package
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentOrder.items.length} Product(s)
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4">
                      <SafeImage 
                        src={item.image} 
                        alt={item.name} 
                        placeholderType="product"
                        fallbackTitle={item.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800" 
                      />
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                        {item.variant && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Variant: {item.variant}</span>
                        )}
                        <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Payment & Support Column */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Cost Summary Box */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                    Payment Summary
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">${currentOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Shipping Fee</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {currentOrder.shippingFee === 0 ? 'FREE' : `$${currentOrder.shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Estimated Tax</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">${currentOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 dark:text-white text-sm font-black pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Total Paid</span>
                      <span className="text-blue-600 dark:text-blue-400">${currentOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Need Help / Support Box */}
                <div className="bg-slate-900 dark:bg-slate-800/90 text-white p-6 rounded-3xl shadow-md space-y-3 border border-slate-800 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" /> Need Order Assistance?
                  </div>
                  <h4 className="text-sm font-bold text-white">Have questions about delivery?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our VIP store concierge team is available 24/7 for address changes or delivery updates.
                  </p>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => showToast('Opening Live Chat with Customer Care...')}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" /> Contact Support Concierge
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}

      </div>

    </div>
  );
}
