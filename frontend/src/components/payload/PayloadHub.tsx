'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  ShoppingBag, 
  Star, 
  FileText, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Filter, 
  PackageCheck,
  Shield,
  Activity,
  History,
  Key,
  Webhook,
  Play,
  RotateCcw,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Lock,
  Eye,
  Image as ImageIcon,
  Sliders,
  Send,
  Share2,
  Compass,
  Globe,
  ArrowRight,
  UploadCloud,
  CheckCircle,
  Copy
} from 'lucide-react';
import { payload } from '../../services/payloadClient';
import { 
  PayloadProductDoc, 
  PayloadCategoryDoc, 
  PayloadOrderDoc, 
  PayloadReviewDoc, 
  PayloadPageDoc, 
  PayloadGlobalSettings,
  PayloadFacetsResponse,
  PayloadAccessRule,
  PayloadAccessEvaluation,
  PayloadRole,
  PayloadHookExecutionLog,
  PayloadVersionDoc,
  PayloadApiKeyDoc,
  PayloadWebhookEvent,
  PayloadSecurityStatus,
  PayloadMediaDoc,
  PayloadBulkOperationResult,
  PayloadFormDoc,
  PayloadFormSubmissionDoc,
  PayloadRedirectDoc,
  PayloadSEOSettings
} from '../../types/payload';

export function PayloadHub() {
  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'orders' | 'reviews' | 'coupons' | 'pages' | 'globals' | 'facets' | 'access-control' | 'hooks' | 'versions' | 'security-webhooks' | 'media' | 'bulk' | 'forms' | 'redirects-seo'
  >('products');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data states
  const [products, setProducts] = useState<PayloadProductDoc[]>([]);
  const [categories, setCategories] = useState<PayloadCategoryDoc[]>([]);
  const [orders, setOrders] = useState<PayloadOrderDoc[]>([]);
  const [reviews, setReviews] = useState<PayloadReviewDoc[]>([]);
  const [homePage, setHomePage] = useState<PayloadPageDoc | null>(null);
  const [globals, setGlobals] = useState<PayloadGlobalSettings | null>(null);
  const [facets, setFacets] = useState<PayloadFacetsResponse | null>(null);
  const [lowStock, setLowStock] = useState<PayloadProductDoc[]>([]);

  // RBAC & Access Control
  const [accessRules, setAccessRules] = useState<PayloadAccessRule[]>([]);
  const [testCollection, setTestCollection] = useState('products');
  const [testOperation, setTestOperation] = useState<'read' | 'create' | 'update' | 'delete'>('create');
  const [testRole, setTestRole] = useState<PayloadRole>('guest');
  const [testUserEmail, setTestUserEmail] = useState('patron@example.com');
  const [accessEvaluation, setAccessEvaluation] = useState<PayloadAccessEvaluation | null>(null);

  // Lifecycle Hooks
  const [hookLogs, setHookLogs] = useState<PayloadHookExecutionLog[]>([]);

  // Versions & Drafts
  const [selectedProductForVersions, setSelectedProductForVersions] = useState<string>('');
  const [productVersions, setProductVersions] = useState<PayloadVersionDoc<PayloadProductDoc>[]>([]);
  const [newDraftTitle, setNewDraftTitle] = useState('Draft Artisan Edition 2026');
  const [newDraftPrice, setNewDraftPrice] = useState('450');

  // Security & Webhooks
  const [securityStatus, setSecurityStatus] = useState<PayloadSecurityStatus | null>(null);
  const [apiKeys, setApiKeys] = useState<PayloadApiKeyDoc[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<PayloadWebhookEvent[]>([]);
  const [newKeyName, setNewKeyName] = useState('Mobile App Integration');
  const [newKeyRole, setNewKeyRole] = useState<PayloadRole>('editor');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  // Media Collection (Payload 3.88)
  const [mediaList, setMediaList] = useState<PayloadMediaDoc[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<PayloadMediaDoc | null>(null);
  const [newMediaFilename, setNewMediaFilename] = useState('bespoke-silk-scarf.webp');
  const [newMediaUrl, setNewMediaUrl] = useState('https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200');
  const [newMediaAlt, setNewMediaAlt] = useState('Pure Mulberry Silk Scarf in Royal Midnight');
  const [newMediaCaption, setNewMediaCaption] = useState('Hand-stitched hems photographed in Paris atelier');

  // Bulk Operations (Payload 3.88)
  const [bulkPercentChange, setBulkPercentChange] = useState<number>(10);
  const [bulkCategoryFilter, setBulkCategoryFilter] = useState<string>('');
  const [bulkOrderStatusTarget, setBulkOrderStatusTarget] = useState<PayloadOrderDoc['fulfillmentStatus']>('shipped');
  const [bulkOpResult, setBulkOpResult] = useState<PayloadBulkOperationResult | null>(null);

  // Form Builder (Payload 3.88 Plugin)
  const [formsList, setFormsList] = useState<PayloadFormDoc[]>([]);
  const [selectedForm, setSelectedForm] = useState<PayloadFormDoc | null>(null);
  const [formSubmissions, setFormSubmissions] = useState<PayloadFormSubmissionDoc[]>([]);
  const [formFieldValues, setFormFieldValues] = useState<Record<string, any>>({});
  const [formSubmitResult, setFormSubmitResult] = useState<any>(null);

  // Redirects & SEO (Payload 3.88 Plugin)
  const [redirectsList, setRedirectsList] = useState<PayloadRedirectDoc[]>([]);
  const [seoSettings, setSeoSettings] = useState<PayloadSEOSettings | null>(null);
  const [testRedirectPath, setTestRedirectPath] = useState('/deals');
  const [testRedirectResult, setTestRedirectResult] = useState<PayloadRedirectDoc | null>(null);
  const [newRedirectFrom, setNewRedirectFrom] = useState('/sale');
  const [newRedirectTo, setNewRedirectTo] = useState('/shop?isSale=true');
  const [newRedirectStatus, setNewRedirectStatus] = useState<301 | 302>(301);

  // Interactive tester states
  const [testCouponCode, setTestCouponCode] = useState('WELCOME10');
  const [testSubtotal, setTestSubtotal] = useState(250);
  const [testCouponResult, setTestCouponResult] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getProductImage = (p: PayloadProductDoc): string => {
    if (!p.images || p.images.length === 0) return '';
    const img = p.images[0];
    return typeof img === 'string' ? img : img.url;
  };

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [
        prodRes, catRes, ordRes, revRes, pageRes, globRes, facetRes, stockRes,
        rulesRes, hooksRes, secRes, keysRes, whRes, mediaRes, formsRes, subsRes, redRes, seoRes
      ] = await Promise.allSettled([
        payload.products.find({ limit: 50 }),
        payload.categories.find(),
        payload.orders.findForCustomer(),
        payload.reviews.find(),
        payload.pages.getBySlug('home'),
        payload.globals.get(),
        payload.facets.get(),
        payload.inventory.getLowStock(),
        payload.accessControl.getRules(),
        payload.hooks.getLogs(30),
        payload.security.getStatus(),
        payload.security.getKeys(),
        payload.webhooks.getEvents(20),
        payload.media.find(),
        payload.forms.find(),
        payload.forms.getSubmissions(),
        payload.redirects.find(),
        payload.seo.get()
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.docs) {
        setProducts(prodRes.value.docs);
        if (prodRes.value.docs.length > 0 && !selectedProductForVersions) {
          setSelectedProductForVersions(prodRes.value.docs[0].id);
          loadVersionsForProduct(prodRes.value.docs[0].id);
        }
      }
      if (catRes.status === 'fulfilled' && catRes.value.docs) setCategories(catRes.value.docs);
      if (ordRes.status === 'fulfilled' && ordRes.value.docs) setOrders(ordRes.value.docs);
      if (revRes.status === 'fulfilled' && revRes.value.docs) setReviews(revRes.value.docs);
      if (pageRes.status === 'fulfilled' && pageRes.value.doc) setHomePage(pageRes.value.doc);
      if (globRes.status === 'fulfilled' && globRes.value.globals) setGlobals(globRes.value.globals);
      if (facetRes.status === 'fulfilled') setFacets(facetRes.value);
      if (stockRes.status === 'fulfilled' && stockRes.value.docs) setLowStock(stockRes.value.docs);
      if (rulesRes.status === 'fulfilled' && rulesRes.value.rules) setAccessRules(rulesRes.value.rules);
      if (hooksRes.status === 'fulfilled' && hooksRes.value.logs) setHookLogs(hooksRes.value.logs);
      if (secRes.status === 'fulfilled' && secRes.value.status) setSecurityStatus(secRes.value.status);
      if (keysRes.status === 'fulfilled' && keysRes.value.keys) setApiKeys(keysRes.value.keys);
      if (whRes.status === 'fulfilled' && whRes.value.events) setWebhookEvents(whRes.value.events);
      if (mediaRes.status === 'fulfilled' && mediaRes.value.docs) {
        setMediaList(mediaRes.value.docs);
        if (mediaRes.value.docs.length > 0 && !selectedMedia) {
          setSelectedMedia(mediaRes.value.docs[0]);
        }
      }
      if (formsRes.status === 'fulfilled' && formsRes.value.docs) {
        setFormsList(formsRes.value.docs);
        if (formsRes.value.docs.length > 0 && !selectedForm) {
          setSelectedForm(formsRes.value.docs[0]);
        }
      }
      if (subsRes.status === 'fulfilled' && subsRes.value.docs) setFormSubmissions(subsRes.value.docs);
      if (redRes.status === 'fulfilled' && redRes.value.docs) setRedirectsList(redRes.value.docs);
      if (seoRes.status === 'fulfilled' && seoRes.value.settings) setSeoSettings(seoRes.value.settings);

      showToast('Payload CMS 3.88 architecture synchronized');
    } catch (err: any) {
      console.error('Failed to load Payload data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVersionsForProduct = async (prodId: string) => {
    if (!prodId) return;
    try {
      const res = await payload.versions.getForProduct(prodId);
      if (res.success) {
        setProductVersions(res.versions);
      }
    } catch (err) {
      console.error('Failed to load product versions:', err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleTestCoupon = async () => {
    try {
      const res = await payload.promotions.validate(testCouponCode, testSubtotal);
      setTestCouponResult(res);
      if (res.valid) {
        showToast(`Coupon valid! Discount: $${res.discountAmount.toFixed(2)}`);
      } else {
        showToast(`Coupon invalid: ${res.message}`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleEvaluateAccess = async () => {
    try {
      const res = await payload.accessControl.evaluate(testCollection, testOperation, testRole, testUserEmail);
      if (res.success) {
        setAccessEvaluation(res.evaluation);
        showToast(res.evaluation.allowed ? 'Access GRANTED' : 'Access DENIED by policy');
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleClearHookLogs = async () => {
    try {
      await payload.hooks.clearLogs();
      setHookLogs([]);
      showToast('Lifecycle hook logs cleared');
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleCreateDraft = async () => {
    try {
      const res = await payload.versions.createDraft({
        title: newDraftTitle,
        price: Number(newDraftPrice) || 100,
        numericPrice: Number(newDraftPrice) || 100,
        description: 'Artisan draft crafted with Payload CMS 3.88 schema standards.'
      });
      if (res.success) {
        showToast(`Created draft: "${res.doc.title}"`);
        loadAll();
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handlePublishProduct = async (prodId: string) => {
    try {
      const res = await payload.versions.publish(prodId);
      if (res.success) {
        showToast(`Published product "${res.doc.title}" to live catalog!`);
        loadAll();
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleRestoreVersion = async (prodId: string, verId: string) => {
    try {
      const res = await payload.versions.restore(prodId, verId);
      if (res.success) {
        showToast(`Restored product version snapshot ${verId}`);
        loadAll();
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleCreateApiKey = async () => {
    try {
      const res = await payload.security.createKey(newKeyName, newKeyRole, ['read:products', 'write:orders']);
      if (res.success) {
        setGeneratedSecret(res.secretKey);
        showToast(`API Key created: ${res.doc.name}`);
        const keysRes = await payload.security.getKeys();
        if (keysRes.success) setApiKeys(keysRes.keys);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    try {
      await payload.security.revokeKey(keyId);
      showToast('API Key revoked');
      const keysRes = await payload.security.getKeys();
      if (keysRes.success) setApiKeys(keysRes.keys);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleSimulateWebhook = async (provider: 'stripe' | 'fedex') => {
    try {
      const payloadData = provider === 'stripe' 
        ? { id: `pi_test_${Date.now()}`, amount: 25000, status: 'succeeded', metadata: { orderId: orders[0]?.orderNumber || 'LX-9901' } }
        : { trackingNumber: 'FX-9830219842', status: 'OUT_FOR_DELIVERY', location: 'Metropolitan District' };

      const res = await payload.webhooks.simulate(
        provider,
        provider === 'stripe' ? 'payment_intent.succeeded' : 'shipment.out_for_delivery',
        payloadData,
        `sig_hmac_sha256_${Date.now()}`
      );

      if (res.success) {
        showToast(`Simulated ${provider.toUpperCase()} webhook processed!`);
        loadAll();
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleUpdateGlobalShipping = async (threshold: number) => {
    try {
      const res = await payload.globals.update({
        shipping: {
          freeShippingThreshold: threshold,
          standardShippingRate: 15,
          expressShippingRate: 35
        }
      });
      if (res.success) {
        setGlobals(res.globals);
        showToast(`Global free shipping threshold updated to $${threshold}!`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // --- MEDIA HANDLERS ---
  const handleCreateMedia = async () => {
    try {
      const res = await payload.media.create({
        filename: newMediaFilename,
        url: newMediaUrl,
        alt: newMediaAlt,
        caption: newMediaCaption,
        mimeType: 'image/webp',
        filesize: 245000,
        width: 1920,
        height: 1080,
        focalX: 50,
        focalY: 50
      });
      if (res.success) {
        showToast(`Media item "${res.doc.alt}" uploaded with 4 derivative sizes!`);
        loadAll();
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const res = await payload.media.delete(id);
      if (res.success) {
        showToast('Media asset removed from collection.');
        loadAll();
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // --- BULK OPERATIONS HANDLERS ---
  const handleBulkPriceAdjustment = async () => {
    try {
      const res = await payload.bulk.updatePrices({
        percentageChange: bulkPercentChange,
        categorySlug: bulkCategoryFilter || undefined
      });
      setBulkOpResult(res);
      showToast(res.message);
      loadAll();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleBulkOrderStatusTransition = async () => {
    try {
      const allIds = orders.map(o => o.id);
      const res = await payload.bulk.updateOrderStatus({
        orderIds: allIds,
        fulfillmentStatus: bulkOrderStatusTarget
      });
      setBulkOpResult(res);
      showToast(res.message);
      loadAll();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleBulkPurgeDrafts = async () => {
    try {
      const res = await payload.bulk.deleteDrafts();
      setBulkOpResult(res);
      showToast(res.message);
      loadAll();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // --- FORM BUILDER HANDLERS ---
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;
    try {
      const res = await payload.forms.submit(selectedForm.id, formFieldValues);
      setFormSubmitResult(res);
      showToast(res.message);
      setFormFieldValues({});
      loadAll();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // --- REDIRECTS & SEO HANDLERS ---
  const handleLookupRedirect = async () => {
    try {
      const res = await payload.redirects.lookup(testRedirectPath);
      setTestRedirectResult(res.redirect);
      if (res.redirect) {
        showToast(`Redirect matched: ${res.redirect.from} -> ${res.redirect.to.url}`);
      } else {
        showToast(`No active redirect for ${testRedirectPath}`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleSaveRedirect = async () => {
    try {
      const res = await payload.redirects.save({
        from: newRedirectFrom,
        to: { type: 'custom', url: newRedirectTo },
        statusCode: newRedirectStatus
      });
      if (res.success) {
        showToast(`Redirect rule saved: ${res.doc.from} -> ${res.doc.to.url}`);
        loadAll();
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    try {
      const res = await payload.redirects.delete(id);
      if (res.success) {
        showToast('Redirect rule removed.');
        loadAll();
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleSaveSEO = async (patch: Partial<PayloadSEOSettings>) => {
    try {
      const res = await payload.seo.update(patch);
      if (res.success) {
        setSeoSettings(res.settings);
        showToast('SEO configuration synchronized with Payload 3.88 global store.');
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" /> Payload CMS 3.88 Full Architecture Suite
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Payload CMS E-Commerce & Architecture Inspector
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
            Live inspect collection schemas, field-level RBAC rules, lifecycle hooks audit logs, version histories, scoped API keys, and verified webhooks.
          </p>
        </div>

        <button
          onClick={loadAll}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Payload Engine</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {[
          { id: 'products', label: 'Products', count: products.length, icon: ShoppingBag },
          { id: 'media', label: 'Media & Focal Points', count: mediaList.length, icon: ImageIcon },
          { id: 'bulk', label: 'Bulk Operations Engine', icon: Sliders },
          { id: 'forms', label: 'Form Builder', count: formsList.length, icon: Send },
          { id: 'redirects-seo', label: 'Redirects & SEO', count: redirectsList.length, icon: Globe },
          { id: 'access-control', label: 'Access Control (RBAC)', count: accessRules.length, icon: Shield },
          { id: 'hooks', label: 'Lifecycle Hooks', count: hookLogs.length, icon: Activity },
          { id: 'versions', label: 'Drafts & Versions', count: productVersions.length, icon: History },
          { id: 'security-webhooks', label: 'Security & Webhooks', count: webhookEvents.length, icon: Lock },
          { id: 'orders', label: 'Orders', count: orders.length, icon: PackageCheck },
          { id: 'categories', label: 'Categories', count: categories.length, icon: Layers },
          { id: 'reviews', label: 'Reviews', count: reviews.length, icon: Star },
          { id: 'coupons', label: 'Coupons & Promos', icon: Sparkles },
          { id: 'pages', label: 'Layout Blocks', icon: FileText },
          { id: 'facets', label: 'Faceted Filters', icon: Filter },
          { id: 'globals', label: 'Globals Config', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        
        {/* ACCESS CONTROL & RBAC TAB */}
        {activeTab === 'access-control' && (
          <div className="space-y-6">
            {/* RBAC Policy Simulator */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Payload 3.88 Access Control (RBAC) Engine</h3>
              </div>
              <p className="text-xs text-slate-500">
                Simulate role-based access rules for collections in real-time according to Payload CMS 3.88 security definitions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Collection</label>
                  <select 
                    value={testCollection} 
                    onChange={(e) => setTestCollection(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="products">products</option>
                    <option value="orders">orders</option>
                    <option value="reviews">reviews</option>
                    <option value="coupons">coupons</option>
                    <option value="globals">globals</option>
                    <option value="webhooks">webhooks</option>
                    <option value="apiKeys">apiKeys</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Operation</label>
                  <select 
                    value={testOperation} 
                    onChange={(e) => setTestOperation(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="read">read</option>
                    <option value="create">create</option>
                    <option value="update">update</option>
                    <option value="delete">delete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Role</label>
                  <select 
                    value={testRole} 
                    onChange={(e) => setTestRole(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="admin">admin (Full Super Admin)</option>
                    <option value="editor">editor (Catalog Manager)</option>
                    <option value="customer">customer (Authenticated Patron)</option>
                    <option value="guest">guest (Anonymous Browser)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleEvaluateAccess}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Play className="w-3.5 h-3.5" /> Evaluate Access
                  </button>
                </div>
              </div>

              {accessEvaluation && (
                <div className={`p-4 rounded-2xl border flex items-start gap-3 mt-4 ${
                  accessEvaluation.allowed
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300'
                }`}>
                  {accessEvaluation.allowed ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
                  <div className="space-y-1">
                    <div className="text-xs font-bold">
                      {accessEvaluation.allowed ? 'PERMISSION ALLOWED' : 'PERMISSION DENIED'} — {accessEvaluation.operation.toUpperCase()} on {accessEvaluation.collection}
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">{accessEvaluation.reason}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Access Rules Table */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Registered Payload Access Control Rules</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <th className="pb-3 font-semibold">Collection</th>
                      <th className="pb-3 font-semibold">Operation</th>
                      <th className="pb-3 font-semibold">Allowed Roles</th>
                      <th className="pb-3 font-semibold">Condition Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {accessRules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 font-mono font-bold text-slate-900 dark:text-white">{rule.collection}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                            {rule.operation}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {rule.allowedRoles.map((r, i) => (
                              <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                r === 'admin' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                                : r === 'editor' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                : r === 'customer' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-400">{rule.conditionDescription || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LIFECYCLE HOOKS AUDIT TRAIL TAB */}
        {activeTab === 'hooks' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Payload 3.88 Lifecycle Hooks Audit Trail
                </h3>
                <p className="text-xs text-slate-500">Live execution history of beforeValidate, beforeChange, afterChange, and afterRead hooks.</p>
              </div>
              <button
                onClick={handleClearHookLogs}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Clear Audit Trail
              </button>
            </div>

            <div className="space-y-2.5">
              {hookLogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">No lifecycle hooks recorded yet. Perform storefront actions to observe triggers.</div>
              ) : (
                hookLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{log.collection}</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold">
                          {log.hookName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {log.operation}
                        </span>
                        <span className="text-[10px] text-slate-400">{log.durationMs}ms</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{log.summary}</p>
                    </div>
                    <div className="text-[11px] text-slate-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* DRAFTS, VERSIONS & LIVE PREVIEW TAB */}
        {activeTab === 'versions' && (
          <div className="space-y-6">
            {/* Create Draft Box */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Payload 3.88 Drafts & Version Snapshots
              </h3>
              <p className="text-xs text-slate-500">
                Create draft documents in staging, autosave changes, and publish with complete immutable rollback histories.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Draft Product Title</label>
                  <input
                    type="text"
                    value={newDraftTitle}
                    onChange={(e) => setNewDraftTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Price ($)</label>
                  <input
                    type="number"
                    value={newDraftPrice}
                    onChange={(e) => setNewDraftPrice(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCreateDraft}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Draft Product
                  </button>
                </div>
              </div>
            </div>

            {/* Product Version Inspector */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Product Version History</h4>
                  <p className="text-xs text-slate-500">Select a catalog document to inspect versions and restore past snapshots.</p>
                </div>
                <select
                  value={selectedProductForVersions}
                  onChange={(e) => {
                    setSelectedProductForVersions(e.target.value);
                    loadVersionsForProduct(e.target.value);
                  }}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white max-w-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.status})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2">
                {productVersions.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">No version snapshots recorded for this product. Edit or publish to create snapshots.</div>
                ) : (
                  productVersions.map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{v.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                          }`}>
                            {v.status}
                          </span>
                          <span className="text-slate-500">by {v.author?.email || 'Admin'}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">Snapshot: "{v.version?.title}" — ${v.version?.price}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestoreVersion(selectedProductForVersions, v.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
                        >
                          <RotateCcw className="w-3 h-3 text-blue-500" /> Restore Snapshot
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECURITY & WEBHOOKS TAB */}
        {activeTab === 'security-webhooks' && (
          <div className="space-y-6">
            {/* Security Status Cards */}
            {securityStatus && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">CSRF & Origin Policy</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Active & Enforced
                  </div>
                  <div className="text-[11px] text-slate-500">{securityStatus.corsOriginPolicy}</div>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Rate Limiting</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 100 req/min
                  </div>
                  <div className="text-[11px] text-slate-500">DDoS & brute-force mitigation</div>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Active Scoped API Keys</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{securityStatus.activeApiKeysCount} Scoped Keys</div>
                  <div className="text-[11px] text-slate-500">Fine-grained access tokens</div>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Processed Webhooks</div>
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{securityStatus.totalWebhooksProcessed} Ingested Events</div>
                  <div className="text-[11px] text-slate-500">HMAC-SHA256 verified</div>
                </div>
              </div>
            )}

            {/* Scoped API Keys Manager */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Payload 3.88 Scoped API Keys
                  </h3>
                  <p className="text-xs text-slate-500">Generate fine-grained API credentials for mobile clients, third-party integrations, and microservices.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Key Description</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Role Privilege</label>
                  <select
                    value={newKeyRole}
                    onChange={(e) => setNewKeyRole(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="editor">Editor (Catalog & Products)</option>
                    <option value="admin">Admin (Full Access)</option>
                    <option value="customer">Customer (Order Scoped)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCreateApiKey}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> Generate Scoped Key
                  </button>
                </div>
              </div>

              {generatedSecret && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 space-y-1">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300">Generated Secret Key (Copy Now — Not Displayed Again):</div>
                  <div className="font-mono text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-2 rounded-lg border border-amber-200 dark:border-amber-800 select-all">
                    {generatedSecret}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <span>{k.name}</span>
                        <span className="font-mono text-[11px] text-slate-500">{k.keyPrefix}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">{k.role}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {k.scopes.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px] text-slate-600 dark:text-slate-300">{s}</span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRevokeApiKey(k.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhooks Ingestion Simulator */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Webhook className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Payment & Carrier Webhook Dispatcher
                  </h3>
                  <p className="text-xs text-slate-500">Test incoming Stripe payment signatures and FedEx carrier tracking updates with full idempotency.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateWebhook('stripe')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Play className="w-3 h-3" /> Simulate Stripe Payment
                  </button>
                  <button
                    onClick={() => handleSimulateWebhook('fedex')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Play className="w-3 h-3" /> Simulate FedEx Tracking
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {webhookEvents.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-mono">{ev.provider}</span>
                        <span className="font-mono">{ev.event}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                          <Check className="w-3 h-3" /> HMAC Signature Verified
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{ev.responseSummary}</p>
                    </div>
                    <div className="text-[11px] text-slate-400 shrink-0">
                      {new Date(ev.processedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Products Catalog ({products.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="h-40 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <img src={getProductImage(p)} alt={p.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">{p.category?.title}</div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{p.title}</h4>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">${p.numericPrice || p.price}</span>
                      <span className="text-xs text-slate-500">Stock: {p.inventory}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Payload Order Documents ({orders.length})
            </h3>
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      Order {o.orderNumber}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold uppercase text-[10px]">
                        {o.fulfillmentStatus}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold uppercase text-[10px]">
                        {o.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Customer: </span>
                      {o.customer.name} ({o.customer.email})
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Total: </span>
                      ${o.financials.total} {o.financials.currency}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Carrier: </span>
                      {o.shippingCarrier || 'FedEx'} ({o.trackingNumber || 'Pending'})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h4>
                <p className="text-xs text-slate-500">{c.description || 'Collection category'}</p>
                <div className="text-xs font-mono text-blue-600 dark:text-blue-400 pt-2">slug: /{c.slug}</div>
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-white">{r.author?.name || 'Verified Patron'}</div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white">{r.title}</h5>
                <p className="text-slate-600 dark:text-slate-400">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Payload Promotions & Coupon Engine</h3>
            <p className="text-xs text-slate-500">Test promo codes in real time with min order thresholds and discounts.</p>
            <div className="flex gap-3 max-w-md">
              <input
                type="text"
                value={testCouponCode}
                onChange={(e) => setTestCouponCode(e.target.value.toUpperCase())}
                placeholder="PROMO CODE"
                className="text-xs font-bold uppercase px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                onClick={handleTestCoupon}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all"
              >
                Validate Code
              </button>
            </div>
            {testCouponResult && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <pre className="font-mono text-[11px]">{JSON.stringify(testCouponResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* PAGES & LAYOUT BLOCKS TAB */}
        {activeTab === 'pages' && homePage && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Dynamic Page Layout Blocks ({homePage.layout?.length || 0})</h3>
            <div className="space-y-2">
              {homePage.layout?.map((block, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">blockType: {block.blockType}</span>
                  </div>
                  <span className="text-slate-400">Block #{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FACETED FILTERS TAB */}
        {activeTab === 'facets' && facets && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Payload Faceted Catalog Aggregations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-slate-500 font-bold">Total Products</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{facets.totalProducts}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-slate-500 font-bold">In-Stock Count</div>
                <div className="text-xl font-bold text-emerald-600">{facets.inStockCount}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-slate-500 font-bold">Price Range</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">${facets.priceRange.min} - ${facets.priceRange.max}</div>
              </div>
            </div>
          </div>
        )}

        {/* GLOBALS TAB */}
        {activeTab === 'globals' && globals && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Payload Global Settings</h3>
              <p className="text-xs text-slate-500">Site-wide e-commerce configuration document stored in Payload Globals.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs text-slate-500">Store Name</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{globals.storeName}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs text-slate-500">Free Shipping Minimum Threshold</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">${globals.shipping?.freeShippingThreshold}</span>
                  <button
                    onClick={() => handleUpdateGlobalShipping(globals.shipping?.freeShippingThreshold === 150 ? 100 : 150)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-all"
                  >
                    Toggle $100 / $150
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs text-slate-500">Store Currency</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{globals.currency?.code} ({globals.currency?.symbol})</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs text-slate-500">Standard Tax Rate</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{globals.taxRatePercent}% VAT / Sales Tax</div>
              </div>
            </div>
          </div>
        )}

        {/* MEDIA COLLECTION & RESPONSIVE DERIVATIVES TAB (PAYLOAD 3.88) */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Payload Media Collection & Focal Point Engine</h3>
                  <p className="text-xs text-slate-500">
                    Automated generation of 4 responsive derivative sizes (thumbnail, card, tablet, full) and dynamic focal point cropping.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
                  <ImageIcon className="w-4 h-4" /> {mediaList.length} Managed Assets
                </div>
              </div>

              {/* Upload New Asset Simulator */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span>Register / Upload Asset to Payload Media Collection</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={newMediaAlt}
                      onChange={(e) => setNewMediaAlt(e.target.value)}
                      placeholder="Accessibility description"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Filename</label>
                    <input
                      type="text"
                      value={newMediaFilename}
                      onChange={(e) => setNewMediaFilename(e.target.value)}
                      placeholder="asset-name.webp"
                      className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCreateMedia}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> Upload & Process
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Asset Browser & Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assets Grid */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Catalog</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mediaList.map((item) => {
                      const isSelected = selectedMedia?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMedia(item)}
                          className={`cursor-pointer group p-3 rounded-2xl border transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative mb-2">
                            <img
                              src={item.sizes?.card?.url || item.url}
                              alt={item.alt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-[10px] font-mono text-white">
                              {item.width}x{item.height}
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-blue-600/80 backdrop-blur-md text-[10px] font-semibold text-white">
                              {item.mimeType?.replace('image/', '')}
                            </div>
                          </div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.alt}</div>
                              <div className="text-[11px] font-mono text-slate-500 line-clamp-1">{item.filename}</div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMedia(item.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                              title="Delete asset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Asset Responsive Sizes & Focal Point Inspector */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Derivative Inspection</div>
                  {selectedMedia ? (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                      {/* Focal Point Visualizer */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-2">
                          <span className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-blue-600" /> Focal Point Position
                          </span>
                          <span className="font-mono text-blue-600">X: {selectedMedia.focalX || 50}% | Y: {selectedMedia.focalY || 50}%</span>
                        </div>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700">
                          <img
                            src={selectedMedia.url}
                            alt={selectedMedia.alt}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 shadow-lg animate-pulse"
                            style={{
                              left: `${selectedMedia.focalX || 50}%`,
                              top: `${selectedMedia.focalY || 50}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Derivative Sizes list */}
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-[11px] font-bold text-slate-500 uppercase">Generated Image Sizes</div>
                        {selectedMedia.sizes && Object.entries(selectedMedia.sizes).map(([sizeKey, sizeVal]) => (
                          <div key={sizeKey} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white capitalize">{sizeKey}</span>
                              <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({sizeVal.width}x{sizeVal.height})</span>
                            </div>
                            <a
                              href={sizeVal.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      Select an asset to inspect responsive crops and focal point data.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BULK OPERATIONS ENGINE TAB (PAYLOAD 3.88) */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Payload Bulk Operations Engine</h3>
                <p className="text-xs text-slate-500">
                  Atomic multi-document mutations, price matrix updates, batch order fulfillment workflows, and catalog cleanup routines.
                </p>
              </div>

              {/* Bulk Operation Execution Banner if exists */}
              {bulkOpResult && (
                <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-4 ${
                  bulkOpResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{bulkOpResult.message}</span>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-current">
                    Affected: {bulkOpResult.affectedCount} docs
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Bulk Catalog Price Adjuster */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Bulk Price Matrix Adjuster</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Apply positive/negative price adjustments across catalog products with category targeting.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Percentage Change (%)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={bulkPercentChange}
                          onChange={(e) => setBulkPercentChange(Number(e.target.value))}
                          className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Category Target</label>
                      <select
                        value={bulkCategoryFilter}
                        onChange={(e) => setBulkCategoryFilter(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="">All Categories ({products.length} products)</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleBulkPriceAdjustment}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5" /> Execute Price Adjustment
                    </button>
                  </div>
                </div>

                {/* 2. Bulk Order Status Processor */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <PackageCheck className="w-4 h-4 text-emerald-600" />
                    <span>Batch Order Status Transition</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bulk advance all pending patron orders into fulfillment pipeline.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Fulfillment Status</label>
                      <select
                        value={bulkOrderStatusTarget}
                        onChange={(e) => setBulkOrderStatusTarget(e.target.value as any)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="processing">processing</option>
                        <option value="shipped">shipped (Out for Delivery)</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
                      Targeting <span className="font-bold text-slate-900 dark:text-white">{orders.length} active orders</span> in customer queue.
                    </div>

                    <button
                      onClick={handleBulkOrderStatusTransition}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Batch Transition Orders
                    </button>
                  </div>
                </div>

                {/* 3. Bulk Draft Catalog Cleanup */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Trash2 className="w-4 h-4 text-amber-600" />
                    <span>Catalog Draft Purge</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bulk purge orphaned draft product documents from catalog collection.
                  </p>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
                    Removes all unpublished staging revisions while preserving live catalog versions.
                  </div>

                  <button
                    onClick={handleBulkPurgeDrafts}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Purge Staging Drafts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FORM BUILDER & SUBMISSIONS INBOX TAB (PAYLOAD 3.88 PLUGIN) */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Payload Form Builder Plugin</h3>
                  <p className="text-xs text-slate-500">
                    Dynamic block-based forms with automated schema validation, email dispatch routing, and inbound submission inbox.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
                  <Send className="w-4 h-4" /> {formsList.length} Active Forms
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Definition & Live Submission Sandbox */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Interactive Form Sandbox</div>
                    <select
                      value={selectedForm?.id || ''}
                      onChange={(e) => {
                        const f = formsList.find(item => item.id === e.target.value);
                        setSelectedForm(f || null);
                        setFormFieldValues({});
                        setFormSubmitResult(null);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      {formsList.map(f => (
                        <option key={f.id} value={f.id}>{f.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedForm && (
                    <form onSubmit={handleFormSubmit} className="space-y-3 pt-2">
                      <div className="text-xs text-slate-500 font-mono">slug: /{selectedForm.slug}</div>
                      {selectedForm.fields.map((field) => (
                        <div key={field.name} className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>

                          {field.blockType === 'text' || field.blockType === 'email' || field.blockType === 'number' ? (
                            <input
                              type={field.blockType}
                              required={field.required}
                              placeholder={field.placeholder}
                              value={formFieldValues[field.name] || ''}
                              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.name]: e.target.value })}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          ) : field.blockType === 'textarea' ? (
                            <textarea
                              rows={3}
                              required={field.required}
                              placeholder={field.placeholder}
                              value={formFieldValues[field.name] || ''}
                              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.name]: e.target.value })}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          ) : field.blockType === 'select' ? (
                            <select
                              required={field.required}
                              value={formFieldValues[field.name] || field.defaultValue || ''}
                              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.name]: e.target.value })}
                              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            >
                              {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          ) : field.blockType === 'checkbox' ? (
                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                              <input
                                type="checkbox"
                                checked={formFieldValues[field.name] ?? field.defaultValue ?? false}
                                onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.name]: e.target.checked })}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                              />
                              <span className="text-xs text-slate-600 dark:text-slate-400">{field.label}</span>
                            </label>
                          ) : null}
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> {selectedForm.submitButtonLabel || 'Submit Form'}
                      </button>
                    </form>
                  )}

                  {formSubmitResult && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {formSubmitResult.message}
                      </div>
                      <div className="text-[10px] font-mono mt-1 text-emerald-600 dark:text-emerald-400">
                        Submission ID: {formSubmitResult.submission?.id}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submissions Inbox */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inbound Submissions ({formSubmissions.length})</div>
                    <button
                      onClick={loadAll}
                      className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {formSubmissions.map((sub) => (
                      <div key={sub.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">{sub.formTitle}</span>
                          <span className="text-[10px] font-mono text-slate-400">{new Date(sub.submittedAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                          {Object.entries(sub.submissionData).map(([k, v]) => (
                            <div key={k} className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-slate-500 text-[11px]">{k}:</span>
                              <span className="font-mono text-slate-800 dark:text-slate-200 text-right">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>IP: {sub.ipAddress}</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold">{sub.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REDIRECTS & SEO STUDIO TAB (PAYLOAD 3.88 PLUGIN) */}
        {activeTab === 'redirects-seo' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Payload Redirects & SEO Engine</h3>
                <p className="text-xs text-slate-500">
                  HTTP 301/302 URL forwarding rules, dynamic OpenGraph previews, Twitter card meta generators, and JSON-LD schema builder.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Redirect Rules Engine */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>301/302 Redirect Route Rules</span>
                  </div>

                  {/* Add redirect rule */}
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={newRedirectFrom}
                          onChange={(e) => setNewRedirectFrom(e.target.value)}
                          placeholder="/from-path"
                          className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={newRedirectTo}
                          onChange={(e) => setNewRedirectTo(e.target.value)}
                          placeholder="/to-destination"
                          className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <select
                          value={newRedirectStatus}
                          onChange={(e) => setNewRedirectStatus(Number(e.target.value) as 301 | 302)}
                          className="w-full text-xs font-bold px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value={301}>301 (Perm)</option>
                          <option value={302}>302 (Temp)</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveRedirect}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" /> Register Redirect Rule
                    </button>
                  </div>

                  {/* Test lookup */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Test Path Forwarding</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testRedirectPath}
                        onChange={(e) => setTestRedirectPath(e.target.value)}
                        placeholder="/deals"
                        className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={handleLookupRedirect}
                        className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all"
                      >
                        Lookup
                      </button>
                    </div>
                    {testRedirectResult && (
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-blue-600">{testRedirectResult.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-emerald-600">{testRedirectResult.to.url}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[10px]">HTTP {testRedirectResult.statusCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Active Redirects list */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Active Redirect Map</div>
                    {redirectsList.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-semibold text-slate-900 dark:text-white">{r.from}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="text-blue-600 dark:text-blue-400">{r.to.url || r.to.reference?.value}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{r.statusCode}</span>
                          <button
                            onClick={() => handleDeleteRedirect(r.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. SEO & Social Graph Preview */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Social OpenGraph Card Preview</div>
                  {seoSettings && (
                    <div className="space-y-4">
                      {/* Card visualizer */}
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-lg">
                        <div className="aspect-video w-full relative bg-slate-900">
                          <img
                            src={seoSettings.ogImageDefault}
                            alt="OpenGraph Default"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                            {seoSettings.twitterCardType}
                          </div>
                        </div>
                        <div className="p-4 space-y-1.5">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{seoSettings.canonicalBaseUrl.replace('https://', '')}</div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {seoSettings.metaTitleTemplate.replace('%s', 'Flagship Chronograph')}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {seoSettings.defaultMetaDescription}
                          </p>
                        </div>
                      </div>

                      {/* SEO Settings Form */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">Payload 3.88 SEO Metadata Schema</div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Title Template (%s = page)</label>
                          <input
                            type="text"
                            value={seoSettings.metaTitleTemplate}
                            onChange={(e) => handleSaveSEO({ metaTitleTemplate: e.target.value })}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Twitter / X Handle</label>
                          <input
                            type="text"
                            value={seoSettings.twitterHandle}
                            onChange={(e) => handleSaveSEO({ twitterHandle: e.target.value })}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
