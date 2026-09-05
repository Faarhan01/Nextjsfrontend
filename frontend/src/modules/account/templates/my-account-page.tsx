'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Settings, 
  Camera, 
  Check, 
  ChevronRight, 
  Package, 
  Clock, 
  CreditCard,
  ExternalLink,
  Plus,
  Trash2,
  Download,
  FileText,
  Star,
  MessageSquare,
  Edit3,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  Gift,
  FolderPlus,
  Folder,
  X,
  ChevronDown,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { LogOut, ShieldCheck, LogIn } from 'lucide-react';
import { MockProduct, UserProfile, CustomWishlist } from '@/types';

interface MyAccountPageProps {
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
  wishlist: string[];
  wishlistProducts: MockProduct[];
  handleToggleWishlist: (id: string, name: string) => void;
  handleAddToCart: (product: any) => void;
  showToast: (msg: string) => void;
  currentUser: UserProfile | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
  onNavigate: (page: string) => void;
  customWishlists?: CustomWishlist[];
  onCreateWishlist?: (name: string, description?: string, icon?: string) => CustomWishlist;
  onDeleteWishlist?: (listId: string) => void;
  onRenameWishlist?: (listId: string, newName: string) => void;
  onToggleProductInLists?: (productId: string, targetListIds: string[]) => void;
  onResetDefaultWishlists?: () => void;
  allProducts?: MockProduct[];
}

export default function MyAccountPage({
  themeColor,
  getThemeClasses,
  wishlist,
  wishlistProducts,
  handleToggleWishlist,
  handleAddToCart,
  showToast,
  currentUser,
  onSignOut,
  onOpenAuth,
  onNavigate,
  customWishlists = [],
  onCreateWishlist,
  onDeleteWishlist,
  onRenameWishlist,
  onToggleProductInLists,
  onResetDefaultWishlists,
  allProducts = []
}: MyAccountPageProps) {
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
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist' | 'reviews'>('profile');

  // Wishlist Tab Management State
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>('');
  const [showCreateListModal, setShowCreateListModal] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');
  const [newListDesc, setNewListDesc] = useState<string>('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Effective list array
  const listsToDisplay = useMemo(() => {
    if (customWishlists && customWishlists.length > 0) return customWishlists;
    return [
      {
        id: 'list-favourites',
        name: 'Favourites',
        description: 'Your primary saved items',
        icon: 'heart',
        productIds: wishlist,
        createdAt: new Date().toISOString(),
        isDefault: true
      },
      {
        id: 'list-gift-ideas',
        name: 'Gift Ideas',
        description: 'Presents for upcoming celebrations & holidays',
        icon: 'gift',
        productIds: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'list-dream-closet',
        name: 'Dream Closet',
        description: 'Luxury statement pieces saved for later',
        icon: 'sparkles',
        productIds: [],
        createdAt: new Date().toISOString()
      }
    ];
  }, [customWishlists, wishlist]);

  // Set default selected wishlist ID
  useEffect(() => {
    if (!selectedWishlistId && listsToDisplay.length > 0) {
      setSelectedWishlistId(listsToDisplay[0].id);
    }
  }, [listsToDisplay, selectedWishlistId]);

  const activeWishlist = useMemo(() => {
    return listsToDisplay.find(l => l.id === selectedWishlistId) || listsToDisplay[0];
  }, [listsToDisplay, selectedWishlistId]);

  // Catalog products for active wishlist
  const activeListProducts = useMemo(() => {
    if (!activeWishlist) return [];
    const sourceProducts = allProducts.length > 0 ? allProducts : wishlistProducts;
    return sourceProducts.filter(p => activeWishlist.productIds.includes(p.id));
  }, [activeWishlist, allProducts, wishlistProducts]);

  const handleFormCreateWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    if (onCreateWishlist) {
      const created = onCreateWishlist(newListName.trim(), newListDesc.trim());
      if (created) setSelectedWishlistId(created.id);
    } else {
      showToast(`Created wishlist "${newListName.trim()}"!`);
    }
    setNewListName('');
    setNewListDesc('');
    setShowCreateListModal(false);
  };

  const handleSaveRenameWishlist = (listId: string) => {
    if (!editingName.trim()) return;
    if (onRenameWishlist) {
      onRenameWishlist(listId, editingName.trim());
    } else {
      showToast(`Renamed list to "${editingName.trim()}"`);
    }
    setEditingListId(null);
    setEditingName('');
  };

  // Default order sets per demo account
  const getDefaultOrdersForUser = (user: UserProfile | null) => {
    if (!user) return [];
    if (user.id === 'usr-admin-01') {
      return [
        {
          id: 'LX-9901',
          date: 'July 24, 2026',
          total: 1300.00,
          status: 'Delivered',
          items: [
            { name: 'Luxury Gold Chronograph Watch', qty: 1, price: 450.00, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300' },
            { name: 'Italian Silk Business Suit', qty: 1, price: 850.00, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300' }
          ],
          steps: ['Ordered', 'Processed', 'Shipped', 'Delivered'],
          currentStep: 3
        },
        {
          id: 'LX-9850',
          date: 'July 18, 2026',
          total: 820.00,
          status: 'Delivered',
          items: [
            { name: 'Elegance Leather Handbag', qty: 1, price: 820.00, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300' }
          ],
          steps: ['Ordered', 'Processed', 'Shipped', 'Delivered'],
          currentStep: 3
        },
        {
          id: 'LX-9712',
          date: 'July 10, 2026',
          total: 750.00,
          status: 'In Transit',
          items: [
            { name: 'Designer Italian Wool Coat', qty: 1, price: 750.00, img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=300' }
          ],
          steps: ['Ordered', 'Processed', 'Shipped', 'Delivered'],
          currentStep: 2
        }
      ];
    }
    if (user.id === 'usr-vip-02') {
      return [
        {
          id: 'LX-8812',
          date: 'July 22, 2026',
          total: 1200.00,
          status: 'In Transit',
          items: [
            { name: 'Haute Couture Silk Evening Gown', qty: 1, price: 1200.00, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=300' }
          ],
          steps: ['Ordered', 'Processed', 'Shipped', 'Delivered'],
          currentStep: 2
        },
        {
          id: 'LX-8504',
          date: 'June 28, 2026',
          total: 2650.00,
          status: 'Delivered',
          items: [
            { name: '18K Gold Diamond Pendant Necklace', qty: 1, price: 2650.00, img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300' }
          ],
          steps: ['Ordered', 'Processed', 'Shipped', 'Delivered'],
          currentStep: 3
        }
      ];
    }
    if (user.id === 'usr-cust-03') {
      return [
        {
          id: 'LX-7402',
          date: 'July 12, 2026',
          total: 199.00,
          status: 'Delivered',
          items: [
            { name: 'Premium Wireless Noise-Canceling Headphones', qty: 1, price: 199.00, img: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=300' }
          ],
          steps: ['Ordered', 'Processed', 'Shipped', 'Delivered'],
          currentStep: 3
        },
        {
          id: 'LX-7110',
          date: 'July 15, 2026',
          total: 214.00,
          status: 'In Transit',
          items: [
            { name: 'Premium Leather Sneakers', qty: 1, price: 125.00, img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=300' },
            { name: 'Designer Retro Sunglasses', qty: 1, price: 89.00, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300' }
          ],
          steps: ['Ordered', 'Processed', 'Shipped', 'Delivered'],
          currentStep: 2
        }
      ];
    }
    return [];
  };

  // Default address sets per demo account
  const getDefaultAddressesForUser = (user: UserProfile | null) => {
    if (!user) return [];
    if (user.id === 'usr-admin-01') {
      return [
        {
          id: 'addr-adm-1',
          label: 'Executive Suite (Default)',
          fullName: 'Alexander Vance',
          street: '1 Executive Plaza, Suite 40B',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          phone: '+1 (555) 992-1083'
        },
        {
          id: 'addr-adm-2',
          label: 'Penthouse Residence',
          fullName: 'Alexander Vance',
          street: '740 Park Avenue, Apt 12A',
          city: 'New York',
          state: 'NY',
          zip: '10021',
          phone: '+1 (555) 992-1083'
        }
      ];
    }
    if (user.id === 'usr-vip-02') {
      return [
        {
          id: 'addr-vip-1',
          label: 'Bel Air Estate (Default)',
          fullName: 'Sophia Laurent',
          street: '884 Bel Air Road',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90077',
          phone: '+1 (555) 349-2041'
        }
      ];
    }
    if (user.id === 'usr-cust-03') {
      return [
        {
          id: 'addr-cust-1',
          label: 'Home (Default)',
          fullName: 'John Doe',
          street: '123 Luxury Avenue',
          city: 'Beverly Hills',
          state: 'CA',
          zip: '90210',
          phone: '+1 (555) 019-2834'
        },
        {
          id: 'addr-cust-2',
          label: 'Office Workspace',
          fullName: 'John Doe Ltd',
          street: '456 Innovation Boulevard, Suite 300',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          phone: '+1 (555) 492-9102'
        }
      ];
    }
    return [
      {
        id: `addr-${user.id}-1`,
        label: 'Primary Address',
        fullName: user.name,
        street: user.address?.street || '123 Main Street',
        city: user.address?.city || 'Beverly Hills',
        state: user.address?.state || 'CA',
        zip: user.address?.zip || '90210',
        phone: user.phone || '+1 (555) 000-0000'
      }
    ];
  };

  // Default review sets per demo account
  const getDefaultReviewsForUser = (user: UserProfile | null) => {
    if (!user) return [];
    if (user.id === 'usr-admin-01') {
      return [
        {
          id: 'rev-01',
          productId: 'prod-01',
          productName: 'Luxury Gold Chronograph Watch',
          productImg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300',
          rating: 5,
          title: 'Absolute masterpiece of craftsmanship!',
          comment: 'The gold finish and weight of this timepiece are unmatched. It draws compliments every time I wear it to executive meetings.',
          date: 'July 26, 2026',
          verified: true,
          helpfulCount: 18,
          status: 'Published'
        },
        {
          id: 'rev-02',
          productId: 'prod-02',
          productName: 'Italian Silk Business Suit',
          productImg: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300',
          rating: 5,
          title: 'Flawless tailoring & premium feel',
          comment: 'Fits like a glove straight out of the box. The silk-wool fabric breathes extremely well and stays wrinkle-free.',
          date: 'July 20, 2026',
          verified: true,
          helpfulCount: 12,
          status: 'Published'
        }
      ];
    }
    if (user.id === 'usr-vip-02') {
      return [
        {
          id: 'rev-03',
          productId: 'prod-03',
          productName: 'Haute Couture Silk Evening Gown',
          productImg: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=300',
          rating: 5,
          title: 'Elegance redefined!',
          comment: 'Wore this to a gala last week and was stopped multiple times. The drape and silhouette are stunning.',
          date: 'July 25, 2026',
          verified: true,
          helpfulCount: 24,
          status: 'Published'
        },
        {
          id: 'rev-04',
          productId: 'prod-04',
          productName: '18K Gold Diamond Pendant Necklace',
          productImg: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300',
          rating: 5,
          title: 'Sparkles brilliantly',
          comment: 'Exceeded my expectations. The diamond clarity is superb and the chain length is perfect.',
          date: 'July 02, 2026',
          verified: true,
          helpfulCount: 15,
          status: 'Published'
        }
      ];
    }
    if (user.id === 'usr-cust-03') {
      return [
        {
          id: 'rev-05',
          productId: 'prod-05',
          productName: 'Premium Wireless Noise-Canceling Headphones',
          productImg: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=300',
          rating: 4,
          title: 'Great noise cancellation & battery life',
          comment: 'Sound stage is rich and deep. Battery easily lasts 30+ hours on full charge.',
          date: 'July 18, 2026',
          verified: true,
          helpfulCount: 9,
          status: 'Published'
        },
        {
          id: 'rev-06',
          productId: 'prod-06',
          productName: 'Premium Leather Sneakers',
          productImg: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=300',
          rating: 5,
          title: 'Unbelievably comfortable',
          comment: 'Soft leather lining makes these feel like clouds. True to size and stylish with any outfit.',
          date: 'July 16, 2026',
          verified: true,
          helpfulCount: 7,
          status: 'Published'
        }
      ];
    }
    return [
      {
        id: `rev-${user.id}-1`,
        productId: 'prod-01',
        productName: 'Handcrafted Leather Tote Bag',
        productImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300',
        rating: 5,
        title: 'Top quality leather',
        comment: 'Excellent craftsmanship and spacious compartments.',
        date: 'July 15, 2026',
        verified: true,
        helpfulCount: 4,
        status: 'Published'
      }
    ];
  };

  // Local state for profile form initialized with currentUser data
  const [profile, setProfile] = useState({
    firstName: currentUser ? currentUser.name.split(' ')[0] : 'Guest',
    lastName: currentUser && currentUser.name.split(' ').length > 1 ? currentUser.name.split(' ').slice(1).join(' ') : '',
    email: currentUser ? currentUser.email : '',
    phone: currentUser?.phone || '+1 (555) 019-2834',
    billingAddress: currentUser?.address?.street || '123 Luxury Avenue',
    billingCity: currentUser?.address?.city || 'Beverly Hills',
    billingState: currentUser?.address?.state || 'CA',
    billingZip: currentUser?.address?.zip || '90210'
  });

  const [addresses, setAddresses] = useState(() => {
    if (!currentUser) return [];
    try {
      const saved = localStorage.getItem(`luxestore_addresses_${currentUser.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getDefaultAddressesForUser(currentUser);
  });

  const [orders, setOrders] = useState(() => {
    if (!currentUser) return [];
    try {
      const saved = localStorage.getItem(`luxestore_orders_${currentUser.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getDefaultOrdersForUser(currentUser);
  });

  const [reviews, setReviews] = useState<any[]>(() => {
    if (!currentUser) return [];
    try {
      const saved = localStorage.getItem(`luxestore_reviews_${currentUser.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getDefaultReviewsForUser(currentUser);
  });

  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [reviewForm, setReviewForm] = useState({
    productName: 'Handcrafted Leather Tote Bag',
    productImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300',
    rating: 5,
    title: '',
    comment: ''
  });

  // Re-sync user data when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setAddresses([]);
      setReviews([]);
      setProfile({
        firstName: 'Guest',
        lastName: '',
        email: '',
        phone: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingZip: ''
      });
      return;
    }

    // Orders
    try {
      const savedOrders = localStorage.getItem(`luxestore_orders_${currentUser.id}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(getDefaultOrdersForUser(currentUser));
      }
    } catch (e) {
      setOrders(getDefaultOrdersForUser(currentUser));
    }

    // Addresses
    try {
      const savedAddresses = localStorage.getItem(`luxestore_addresses_${currentUser.id}`);
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        setAddresses(getDefaultAddressesForUser(currentUser));
      }
    } catch (e) {
      setAddresses(getDefaultAddressesForUser(currentUser));
    }

    // Reviews
    try {
      const savedReviews = localStorage.getItem(`luxestore_reviews_${currentUser.id}`);
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        setReviews(getDefaultReviewsForUser(currentUser));
      }
    } catch (e) {
      setReviews(getDefaultReviewsForUser(currentUser));
    }

    // Profile
    setProfile({
      firstName: currentUser.name.split(' ')[0] || '',
      lastName: currentUser.name.split(' ').slice(1).join(' ') || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '+1 (555) 019-2834',
      billingAddress: currentUser.address?.street || '123 Luxury Avenue',
      billingCity: currentUser.address?.city || 'Beverly Hills',
      billingState: currentUser.address?.state || 'CA',
      billingZip: currentUser.address?.zip || '90210'
    });
  }, [currentUser?.id]);

  // Persist addresses on modification
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(`luxestore_addresses_${currentUser.id}`, JSON.stringify(addresses));
      } catch (e) {
        console.error(e);
      }
    }
  }, [addresses, currentUser?.id]);

  // Persist reviews on modification
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(`luxestore_reviews_${currentUser.id}`, JSON.stringify(reviews));
      } catch (e) {
        console.error(e);
      }
    }
  }, [reviews, currentUser?.id]);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile details updated successfully!");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.label || !newAddr.fullName || !newAddr.street) {
      showToast("Please fill in required address fields.");
      return;
    }
    setAddresses(prev => [
      ...prev,
      {
        id: `addr-${Date.now()}`,
        ...newAddr
      }
    ]);
    setShowAddAddressModal(false);
    setNewAddr({ label: '', fullName: '', street: '', city: '', state: '', zip: '', phone: '' });
    showToast("New shipping address added!");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast("Address deleted successfully.");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      showToast("Please provide both a headline and detailed feedback.");
      return;
    }

    if (editingReview) {
      setReviews(prev => prev.map(r => r.id === editingReview.id ? {
        ...r,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        productName: reviewForm.productName
      } : r));
      showToast("Review updated successfully!");
    } else {
      const newRev = {
        id: `rev-${Date.now()}`,
        productId: `prod-${Date.now()}`,
        productName: reviewForm.productName,
        productImg: reviewForm.productImg || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300',
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        verified: true,
        helpfulCount: 0,
        status: 'Published'
      };
      setReviews(prev => [newRev, ...prev]);
      showToast("Review submitted successfully!");
    }

    setShowWriteReviewModal(false);
    setEditingReview(null);
  };

  const handleDownloadInvoice = (order: any) => {
    const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${order.id} - Mrbulk</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 26px; font-weight: 800; color: #1d4ed8; letter-spacing: -0.02em; }
    .invoice-title { font-size: 22px; font-weight: 800; text-align: right; color: #0f172a; }
    .sub { font-size: 13px; color: #64748b; margin-top: 4px; font-weight: normal; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 13px; }
    .info-box { background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
    .info-box h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f1f5f9; padding: 12px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; border-bottom: 1px solid #cbd5e1; }
    td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .total-row td { font-size: 16px; font-weight: 800; background: #f8fafc; color: #0f172a; border-top: 2px solid #cbd5e1; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; }
    .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Mrbulk</div>
      <div class="sub">Official Purchase Invoice • Operated by Mr Cheap General Dealer ZA</div>
    </div>
    <div class="invoice-title">
      INVOICE
      <div class="sub">Order ID: #${order.id}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h4>Billed & Shipped To</h4>
      <strong>${profile.firstName} ${profile.lastName}</strong><br />
      ${profile.billingAddress || '150 Industrial Rd, Crown North'}<br />
      ${profile.billingCity || 'Johannesburg'}, ${profile.billingState || 'Gauteng'} ${profile.billingZip || '2092'}<br />
      Email: ${profile.email}<br />
      Phone: ${profile.phone}
    </div>
    <div class="info-box">
      <h4>Order Details</h4>
      <strong>Date:</strong> ${order.date}<br />
      <strong>Payment Status:</strong> Paid (EFT / Card)<br />
      <strong>Shipping Status:</strong> <span class="badge">${order.status}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item: any) => `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td style="text-align: center;">${item.qty}</td>
          <td style="text-align: right;">R${item.price.toFixed(2)}</td>
          <td style="text-align: right;">R${(item.qty * item.price).toFixed(2)}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="3" style="text-align: right;">Grand Total:</td>
        <td style="text-align: right;">R${order.total.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    Thank you for shopping with Mrbulk (mrbulk.co.za). For questions regarding this order, please contact support@mrbulk.co.za.
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded invoice for Order #${order.id}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-10 sm:pb-16 space-y-6 sm:space-y-8">
      
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
        <span className="text-slate-900 dark:text-white font-extrabold">My Account</span>
      </div>

      {/* Header Profile Dashboard Widget */}
      <div className={`${lightBannerBg} rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden text-slate-900 dark:text-white`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Avatar Area */}
          <div className="relative group shrink-0">
            <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex items-center justify-center relative">
              <User className="w-10 sm:w-12 h-10 sm:h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white shadow-xs hover:scale-105 transition cursor-pointer">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentUser ? currentUser.name : 'Guest Account'}
              </h1>
              {currentUser && (
                <span className={`inline-block mx-auto sm:mx-0 self-center text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  currentUser.role === 'admin' 
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' 
                    : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}>
                  {currentUser.role === 'admin' ? 'Store Admin' : `${currentUser.status.toUpperCase()} Member`}
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              {currentUser ? currentUser.email : 'You are currently browsing as a guest.'}
            </p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" /> Open Admin Suite
                </button>
              )}

              {currentUser ? (
                <button
                  onClick={onSignOut}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-400 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs"
                >
                  <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <LogIn className="w-4 h-4" /> Sign In / Register
                </button>
              )}
            </div>
          </div>

          {/* Micro Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full sm:w-auto border-t border-slate-200/80 dark:border-slate-800 sm:border-t-0 sm:border-l sm:border-slate-200/80 dark:sm:border-slate-800 pt-6 sm:pt-0 sm:pl-10">
            <div className="text-center">
              <span className="block text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                {orders.filter(o => o.status !== 'Delivered').length.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider font-extrabold">Active Orders</span>
            </div>
            <div className="text-center">
              <span className="block text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{wishlist.length.toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider font-extrabold">Wishlisted</span>
            </div>
            <div className="text-center">
              <span className="block text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider font-extrabold">Spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Navigation & Content panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar: Horizontal scroll on mobile/tablet, sticky vertical card on desktop */}
        <div className="lg:col-span-3 self-start lg:sticky lg:top-24 w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs flex lg:flex-col items-center lg:items-stretch gap-2 lg:gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none w-full">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-auto lg:w-full shrink-0 whitespace-nowrap flex items-center justify-between gap-2.5 sm:gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition text-left cursor-pointer outline-none ${
                activeTab === 'profile' 
                  ? `${currentTheme.lightBg} font-bold shadow-2xs` 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-slate-50/80 dark:bg-slate-800/80 lg:bg-transparent dark:lg:bg-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 sm:gap-3.5">
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-slate-700 dark:text-slate-300" />
                Profile Details
              </span>
              <ChevronRight className={`w-4 h-4 hidden lg:block transition-transform ${activeTab === 'profile' ? 'translate-x-0.5 opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0'}`} />
            </button>
            
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-auto lg:w-full shrink-0 whitespace-nowrap flex items-center justify-between gap-2.5 sm:gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition text-left cursor-pointer outline-none ${
                activeTab === 'orders' 
                  ? `${currentTheme.lightBg} font-bold shadow-2xs` 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-slate-50/80 dark:bg-slate-800/80 lg:bg-transparent dark:lg:bg-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 sm:gap-3.5">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-slate-700 dark:text-slate-300" />
                Order History
              </span>
              {orders.length > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {orders.length}
                </span>
              ) : (
                <ChevronRight className={`w-4 h-4 hidden lg:block transition-transform ${activeTab === 'orders' ? 'translate-x-0.5 opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0'}`} />
              )}
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-auto lg:w-full shrink-0 whitespace-nowrap flex items-center justify-between gap-2.5 sm:gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition text-left cursor-pointer outline-none ${
                activeTab === 'addresses' 
                  ? `${currentTheme.lightBg} font-bold shadow-2xs` 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-slate-50/80 dark:bg-slate-800/80 lg:bg-transparent dark:lg:bg-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 sm:gap-3.5">
                <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-slate-700 dark:text-slate-300" />
                Saved Addresses
              </span>
              {addresses.length > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {addresses.length}
                </span>
              ) : (
                <ChevronRight className={`w-4 h-4 hidden lg:block transition-transform ${activeTab === 'addresses' ? 'translate-x-0.5 opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0'}`} />
              )}
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-auto lg:w-full shrink-0 whitespace-nowrap flex items-center justify-between gap-2.5 sm:gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition text-left cursor-pointer outline-none ${
                activeTab === 'wishlist' 
                  ? `${currentTheme.lightBg} font-bold shadow-2xs` 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-slate-50/80 dark:bg-slate-800/80 lg:bg-transparent dark:lg:bg-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 sm:gap-3.5">
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-slate-700 dark:text-slate-300" />
                My Wishlist
              </span>
              {wishlist.length > 0 ? (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentTheme.bg} text-white`}>
                  {wishlist.length}
                </span>
              ) : (
                <ChevronRight className={`w-4 h-4 hidden lg:block transition-transform ${activeTab === 'wishlist' ? 'translate-x-0.5 opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0'}`} />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-auto lg:w-full shrink-0 whitespace-nowrap flex items-center justify-between gap-2.5 sm:gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition text-left cursor-pointer outline-none ${
                activeTab === 'reviews' 
                  ? `${currentTheme.lightBg} font-bold shadow-2xs` 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-slate-50/80 dark:bg-slate-800/80 lg:bg-transparent dark:lg:bg-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 sm:gap-3.5">
                <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-amber-500 fill-amber-500" />
                My Reviews
              </span>
              {reviews.length > 0 ? (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentTheme.bg} text-white`}>
                  {reviews.length}
                </span>
              ) : (
                <ChevronRight className={`w-4 h-4 hidden lg:block transition-transform ${activeTab === 'reviews' ? 'translate-x-0.5 opacity-100 text-blue-600 dark:text-blue-400' : 'opacity-0'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="lg:col-span-9 w-full">
          
          {/* PROFILE DETAILS TAB */}
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full min-h-[560px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" /> Personal Profile Settings
                </h2>
                
                <form onSubmit={handleProfileSave} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">First Name</label>
                      <input 
                        type="text" 
                        value={profile.firstName}
                        onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Last Name</label>
                      <input 
                        type="text" 
                        value={profile.lastName}
                        onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        value={profile.email}
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-not-allowed rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Account emails cannot be changed in sandbox.</span>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Mobile Phone</label>
                      <input 
                        type="text" 
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Default Billing Coordinates</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Billing Street Address</label>
                        <input 
                          type="text" 
                          value={profile.billingAddress}
                          onChange={(e) => setProfile(prev => ({ ...prev, billingAddress: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none transition"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1.5">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">City</label>
                          <input 
                            type="text" 
                            value={profile.billingCity}
                            onChange={(e) => setProfile(prev => ({ ...prev, billingCity: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 transition"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">State</label>
                          <input 
                            type="text" 
                            value={profile.billingState}
                            onChange={(e) => setProfile(prev => ({ ...prev, billingState: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 transition"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Zip</label>
                          <input 
                            type="text" 
                            value={profile.billingZip}
                            onChange={(e) => setProfile(prev => ({ ...prev, billingZip: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className={`px-6 py-3 rounded-xl text-white font-semibold text-xs transition cursor-pointer ${currentTheme.bg}`}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ORDER HISTORY TAB */}
          {activeTab === 'orders' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full min-h-[560px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-500" /> Recent Purchase History
                </h2>

                <div className="mt-6 space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow transition bg-white dark:bg-slate-900">
                      
                      {/* Order Info Row */}
                      <div className="bg-slate-50 dark:bg-slate-800/70 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-slate-400 dark:text-slate-500 block font-medium">Order Number</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">#{order.id}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-500 block font-medium">Date Placed</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{order.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 dark:text-slate-500 block font-medium">Total Amount</span>
                          <span className="font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="p-4 space-y-3.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <SafeImage src={item.img} className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" alt={item.name} placeholderType="product" fallbackTitle={item.name} />
                            <div className="flex-1 min-w-0 text-xs">
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</h4>
                              <p className="text-slate-400 dark:text-slate-500 mt-0.5">Quantity: {item.qty} &bull; Price: ${item.price.toFixed(2)} each</p>
                            </div>
                            <button 
                              onClick={() => handleAddToCart({ id: `prod-${idx + 1}`, name: item.name, price: item.price, imageUrl: item.img })}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-semibold cursor-pointer"
                            >
                              Buy Again
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Live Shipping Progress & Actions */}
                      <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Live Shipping Progress:</span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                            {order.status}
                          </span>
                        </div>

                        <button 
                          onClick={() => handleDownloadInvoice(order)}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold shadow-2xs transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-500" />
                          Download Invoice
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SAVED ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full min-h-[560px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col space-y-6"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" /> Saved Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-800 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Address
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 bg-white dark:bg-slate-850 shadow-sm flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-700 transition">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{addr.label}</span>
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{addr.fullName}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">{addr.street}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{addr.city}, {addr.state} {addr.zip}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-3">Phone: {addr.phone}</p>
                      </div>
                      <div className="mt-4 border-t border-slate-50 dark:border-slate-800 pt-3.5 flex justify-end">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer">Edit Address</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Address Modal Overlay */}
              {showAddAddressModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-800 dark:text-slate-100"
                  >
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4">Add shipping address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-400 dark:text-slate-500 mb-1">Address Label (e.g. Home, Office)</label>
                        <input 
                          type="text" 
                          placeholder="Home"
                          value={newAddr.label}
                          onChange={(e) => setNewAddr(p => ({ ...p, label: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-400 dark:text-slate-500 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr(p => ({ ...p, fullName: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-400 dark:text-slate-500 mb-1">Street Address</label>
                        <input 
                          type="text" 
                          placeholder="123 Luxury Ave"
                          value={newAddr.street}
                          onChange={(e) => setNewAddr(p => ({ ...p, street: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-400 dark:text-slate-500 mb-1">City</label>
                          <input 
                            type="text" 
                            placeholder="Beverly Hills"
                            value={newAddr.city}
                            onChange={(e) => setNewAddr(p => ({ ...p, city: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 dark:text-slate-500 mb-1">State</label>
                          <input 
                            type="text" 
                            placeholder="CA"
                            value={newAddr.state}
                            onChange={(e) => setNewAddr(p => ({ ...p, state: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 dark:text-slate-500 mb-1">Zip Code</label>
                          <input 
                            type="text" 
                            placeholder="90210"
                            value={newAddr.zip}
                            onChange={(e) => setNewAddr(p => ({ ...p, zip: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-400 dark:text-slate-500 mb-1">Contact Phone</label>
                        <input 
                          type="text" 
                          placeholder="+1 (555) 019-2834"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr(p => ({ ...p, phone: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="flex gap-2.5 pt-4">
                        <button 
                          type="button" 
                          onClick={() => setShowAddAddressModal(false)}
                          className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className={`flex-1 py-3 text-white rounded-xl font-bold cursor-pointer ${currentTheme.bg}`}
                        >
                          Add Address
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}

            </motion.div>
          )}

          {/* MY WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full min-h-[560px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col space-y-6"
            >
              <div className="space-y-6">
                
                {/* Header & Primary Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" /> My Wishlist Collections
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-xs">
                        {listsToDisplay.length} {listsToDisplay.length === 1 ? 'list' : 'lists'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Organize saved catalog items into personalized collections and custom shopping lists.</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onResetDefaultWishlists && (
                      <button
                        type="button"
                        onClick={onResetDefaultWishlists}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        title="Add basic starter lists like Favourites and Gift Ideas"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden sm:inline">Add Basic Lists</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowCreateListModal(true)}
                      className={`px-4 py-2 rounded-xl text-white text-xs font-extrabold shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5 ${currentTheme.bg}`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New List</span>
                    </button>
                  </div>
                </div>

                {/* Wishlist Collections Tabs Grid / Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {listsToDisplay.map((list) => {
                    const isSelected = list.id === activeWishlist?.id;
                    const isEditing = editingListId === list.id;
                    return (
                      <div
                        key={list.id}
                        onClick={() => setSelectedWishlistId(list.id)}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                          isSelected
                            ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 shadow-2xs ring-1 ring-rose-200 dark:ring-rose-800'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`p-2 rounded-xl border ${isSelected ? 'bg-rose-500 text-white border-rose-400' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                <Heart className={`w-4 h-4 ${isSelected ? 'fill-white' : ''}`} />
                              </div>
                              {isEditing ? (
                                <div className="flex items-center gap-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    autoFocus
                                    className="px-2 py-1 text-xs font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-28 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveRenameWishlist(list.id)}
                                    className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="min-w-0">
                                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                    <span>{list.name}</span>
                                    {list.isDefault && (
                                      <span className="px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-extrabold text-[9px] uppercase tracking-wider shrink-0">Basic</span>
                                    )}
                                  </h4>
                                </div>
                              )}
                            </div>

                            {/* List Actions */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setEditingListId(list.id);
                                  setEditingName(list.name);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700 transition cursor-pointer"
                                title="Rename List"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {(!list.isDefault || listsToDisplay.length > 1) && onDeleteWishlist && (
                                <button
                                  onClick={() => onDeleteWishlist(list.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white/80 dark:hover:bg-slate-700 transition cursor-pointer"
                                  title="Delete List"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {list.description && (
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">{list.description}</p>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] font-extrabold">
                          <span className={isSelected ? 'text-rose-700 dark:text-rose-300' : 'text-slate-500 dark:text-slate-400'}>
                            {list.productIds.length} {list.productIds.length === 1 ? 'item saved' : 'items saved'}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-400 dark:text-slate-500'}`}>
                            {isSelected ? 'Active Collection' : 'View Items'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Wishlist Items Content Section */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/40 dark:bg-slate-850 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{activeWishlist?.name}</span>
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({activeListProducts.length} items)</span>
                      </h3>
                      {activeWishlist?.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeWishlist.description}</p>
                      )}
                    </div>

                    {activeListProducts.length > 0 && (
                      <button
                        onClick={() => {
                          activeListProducts.forEach(p => handleAddToCart({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl }));
                          showToast(`Added all ${activeListProducts.length} items from "${activeWishlist?.name}" to cart!`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add All to Cart</span>
                      </button>
                    )}
                  </div>

                  {/* Product Cards Grid */}
                  {activeListProducts.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 mx-auto">
                        <Heart className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <div className="max-w-xs mx-auto">
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">No products saved in "{activeWishlist?.name}"</h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Browse catalog products and click the heart button to add them directly to this list!</p>
                      </div>
                      <button
                        onClick={() => onNavigate('shop')}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-extrabold transition cursor-pointer shadow-2xs ${currentTheme.bg}`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Explore Shop Catalog</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeListProducts.map((prod) => (
                        <div key={prod.id} className="flex gap-4 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition p-3.5 rounded-2xl relative group shadow-2xs hover:shadow-xs">
                          <SafeImage src={prod.imageUrl} className="w-18 h-18 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0" alt={prod.name} placeholderType="product" fallbackTitle={prod.name} />
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate leading-tight">{prod.name}</h4>
                              <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 block mt-1">{prod.price}</span>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                              <button 
                                onClick={() => handleAddToCart({ id: prod.id, name: prod.name, price: prod.price, imageUrl: prod.imageUrl })}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-white transition cursor-pointer flex items-center gap-1 ${currentTheme.bg}`}
                              >
                                <ShoppingBag className="w-3 h-3" /> Add to Cart
                              </button>

                              <button 
                                onClick={() => {
                                  if (onToggleProductInLists && activeWishlist) {
                                    // Remove from this active list
                                    const otherListsWithProduct = listsToDisplay
                                      .filter(l => l.id !== activeWishlist.id && l.productIds.includes(prod.id))
                                      .map(l => l.id);
                                    onToggleProductInLists(prod.id, otherListsWithProduct);
                                  } else {
                                    handleToggleWishlist(prod.id, prod.name);
                                  }
                                }}
                                className="text-[10px] font-bold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          )}

          {/* Create Wishlist Modal Popup */}
          {showCreateListModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 text-slate-800 dark:text-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400">
                      <FolderPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Create New Wishlist</h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Name your custom collection</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateListModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleFormCreateWishlist} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Wishlist Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Birthday Wishlist, Summer Essentials"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      autoFocus
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief note about what items belong in this list..."
                      value={newListDesc}
                      onChange={(e) => setNewListDesc(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowCreateListModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newListName.trim()}
                      className={`px-5 py-2.5 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md transition cursor-pointer ${currentTheme.bg}`}
                    >
                      Create List
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* MY REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full min-h-[560px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col space-y-6"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> My Submitted Reviews ({reviews.length})
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Ratings and feedback you have shared on store products.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingReview(null);
                      setReviewForm({
                        productName: orders.length > 0 && orders[0].items.length > 0 ? orders[0].items[0].name : 'Handcrafted Designer Tote Bag',
                        productImg: orders.length > 0 && orders[0].items.length > 0 ? orders[0].items[0].img : 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300',
                        rating: 5,
                        title: '',
                        comment: ''
                      });
                      setShowWriteReviewModal(true);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-xs self-start sm:self-auto ${currentTheme.bg}`}
                  >
                    <Plus className="w-4 h-4" /> Write a Review
                  </button>
                </div>

                {/* Empty State */}
                {reviews.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500 mx-auto">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">You haven't written any reviews yet</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">Share your experiences on products you have purchased to help other shoppers in our community!</p>
                    <button
                      onClick={() => {
                        setEditingReview(null);
                        setReviewForm({
                          productName: 'Handcrafted Designer Tote Bag',
                          productImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300',
                          rating: 5,
                          title: '',
                          comment: ''
                        });
                        setShowWriteReviewModal(true);
                      }}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer ${currentTheme.bg}`}
                    >
                      <Plus className="w-4 h-4" /> Write Your First Review
                    </button>
                  </div>
                ) : (
                  /* Reviews List */
                  <div className="space-y-4 mt-6">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition space-y-3.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-3">
                            <SafeImage src={rev.productImg} className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0" alt={rev.productName} placeholderType="product" fallbackTitle={rev.productName} />
                            <div>
                              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{rev.productName}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-0.5 text-amber-500">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
                                    />
                                  ))}
                                </span>
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{rev.rating}.0 / 5.0</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verified Buyer
                              </span>
                            )}
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full font-bold">
                              {rev.status || 'Published'}
                            </span>
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="space-y-1.5">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{rev.title}</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">{rev.comment}</p>
                        </div>

                        {/* Footer details & actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800">
                          <div className="flex items-center gap-4">
                            <span>Reviewed on <strong>{rev.date}</strong></span>
                            {rev.helpfulCount > 0 && (
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
                                <ThumbsUp className="w-3 h-3 text-blue-500" /> {rev.helpfulCount} people found this helpful
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingReview(rev);
                                setReviewForm({
                                  productName: rev.productName,
                                  productImg: rev.productImg,
                                  rating: rev.rating,
                                  title: rev.title,
                                  comment: rev.comment
                                });
                                setShowWriteReviewModal(true);
                              }}
                              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-[10px] rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                setReviews(prev => prev.filter(r => r.id !== rev.id));
                                showToast("Review deleted.");
                              }}
                              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-[10px] rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Write Review Modal Popup */}
      {showWriteReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 text-slate-800 dark:text-slate-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {editingReview ? 'Edit Your Review' : 'Write a Product Review'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Share your genuine shopping feedback</p>
                </div>
              </div>
              <button
                onClick={() => setShowWriteReviewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Product
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.productName}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, productName: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="p-1 transition hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exceptional quality, fits perfectly!"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Detailed Feedback *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell others what you loved about this product..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWriteReviewModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md transition cursor-pointer ${currentTheme.bg}`}
                >
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
