import { Router, Request, Response } from 'express';
import { payloadStore } from './payloadStore.js';
import { requireAdmin, requirePayloadAccess } from '../middleware/authMiddleware.js';

const router = Router();

// Helper to extract & parse Payload 'where' query parameter whether passed as object or JSON string
function parsePayloadWhere(rawWhere: any, reqQuery: any): Record<string, any> {
  let whereObj: Record<string, any> = {};

  if (typeof rawWhere === 'string') {
    try {
      whereObj = JSON.parse(rawWhere);
    } catch {
      whereObj = {};
    }
  } else if (rawWhere && typeof rawWhere === 'object') {
    whereObj = { ...rawWhere };
  }

  // Support direct flat query parameters
  if (reqQuery.category && !whereObj.category) whereObj.category = reqQuery.category;
  if (reqQuery.brand && !whereObj.brand) whereObj.brand = reqQuery.brand;
  if (reqQuery.isFeatured !== undefined && whereObj.isFeatured === undefined) whereObj.isFeatured = reqQuery.isFeatured === 'true';
  if (reqQuery.isSale !== undefined && whereObj.isSale === undefined) whereObj.isSale = reqQuery.isSale === 'true';
  if (reqQuery.search && !whereObj.search) whereObj.search = String(reqQuery.search);
  if (reqQuery.minPrice && !whereObj.minPrice) whereObj.minPrice = Number(reqQuery.minPrice);
  if (reqQuery.maxPrice && !whereObj.maxPrice) whereObj.maxPrice = Number(reqQuery.maxPrice);
  if (reqQuery.inStockOnly && whereObj.inStockOnly === undefined) whereObj.inStockOnly = reqQuery.inStockOnly === 'true';
  if (reqQuery.status && !whereObj.status) whereObj.status = reqQuery.status;

  return whereObj;
}

// ============================================================================
// PRODUCTS COLLECTION ENDPOINTS
// ============================================================================

router.get('/products', (req: Request, res: Response): void => {
  try {
    const { sort, page, limit, where: rawWhere } = req.query;
    const where = parsePayloadWhere(rawWhere, req.query);

    const result = payloadStore.findProducts({
      where,
      sort: sort ? String(sort) : '-createdAt',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch Payload products' });
  }
});

router.get('/products/:idOrSlug', (req: Request, res: Response): void => {
  try {
    const doc = payloadStore.findProductByIdOrSlug(req.params.idOrSlug);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Payload product document not found' });
      return;
    }
    res.json({ success: true, doc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/products', requireAdmin, (req: Request, res: Response): void => {
  try {
    const doc = payloadStore.saveProduct(req.body);
    res.json({ success: true, doc, message: 'Payload product created successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch('/products/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const doc = payloadStore.saveProduct({ ...req.body, id: req.params.id });
    res.json({ success: true, doc, message: 'Payload product updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/products/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const success = payloadStore.deleteProduct(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Payload product deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// BULK OPERATIONS ENDPOINTS (PAYLOAD 3.88 BATCH API)
// ============================================================================

router.post('/products/bulk-price-update', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { percentageChange, fixedAdjustment, categorySlug, status } = req.body;
    const result = payloadStore.bulkUpdateProductPrices({
      percentageChange: Number(percentageChange) || 0,
      fixedAdjustment: Number(fixedAdjustment) || 0,
      categorySlug,
      status
    });
    res.json({ success: result.success, ...result, message: `Updated prices for ${result.modifiedCount} products.` });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/orders/bulk-status-update', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { orderIds, fulfillmentStatus, paymentStatus } = req.body;
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      res.status(400).json({ success: false, error: 'orderIds array is required for bulk order update.' });
      return;
    }
    const result = payloadStore.bulkUpdateOrderStatus({
      orderIds,
      fulfillmentStatus,
      paymentStatus
    });
    res.json({ success: result.success, ...result, message: `Updated status for ${result.modifiedCount} orders.` });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/products/bulk-delete-drafts', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const result = payloadStore.bulkDeleteDrafts();
    res.json({ success: result.success, ...result, message: `Purged ${result.modifiedCount} draft items.` });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ============================================================================
// MEDIA COLLECTION ENDPOINTS (PAYLOAD 3.88 ASSET STORAGE)
// ============================================================================

router.get('/media', (req: Request, res: Response): void => {
  try {
    const { sort, page, limit, where: rawWhere } = req.query;
    const where = parsePayloadWhere(rawWhere, req.query);

    const result = payloadStore.findMedia({
      where,
      sort: sort ? String(sort) : '-createdAt',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to query media documents' });
  }
});

router.get('/media/:id', (req: Request, res: Response): void => {
  try {
    const doc = payloadStore.findMediaById(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Media asset not found.' });
      return;
    }
    res.json({ success: true, doc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/media', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { alt, caption, filename, mimeType, filesize, width, height, url, focalX, focalY } = req.body;
    if (!filename || !url) {
      res.status(400).json({ success: false, error: 'filename and url are required for media uploads.' });
      return;
    }
    const doc = payloadStore.createMedia({
      alt: alt || filename,
      caption,
      filename,
      mimeType,
      filesize,
      width,
      height,
      url,
      focalX,
      focalY
    });
    res.status(201).json({ success: true, doc, message: 'Media document uploaded and size derivatives created.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/media/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const success = payloadStore.deleteMedia(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Media asset not found.' });
      return;
    }
    res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// FACETS & SEARCH AGGREGATIONS
// ============================================================================

router.get('/facets', (_req: Request, res: Response): void => {
  try {
    const facets = payloadStore.getFacets();
    res.json({ success: true, ...facets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// INVENTORY & LOW STOCK ALERTS
// ============================================================================

router.get('/inventory/low-stock', (_req: Request, res: Response): void => {
  try {
    const lowStockDocs = payloadStore.getLowStockProducts();
    res.json({
      success: true,
      docs: lowStockDocs,
      totalDocs: lowStockDocs.length,
      alertMessage: lowStockDocs.length > 0 ? `${lowStockDocs.length} items require inventory replenishment` : 'All inventory levels healthy'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// CATEGORIES COLLECTION ENDPOINTS
// ============================================================================

router.get('/categories', (_req: Request, res: Response): void => {
  try {
    const categories = payloadStore.findCategories();
    res.json({ success: true, docs: categories, totalDocs: categories.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/categories/:idOrSlug', (req: Request, res: Response): void => {
  try {
    const category = payloadStore.findCategoryByIdOrSlug(req.params.idOrSlug);
    if (!category) {
      res.status(404).json({ success: false, error: 'Payload category not found' });
      return;
    }
    res.json({ success: true, doc: category });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// REVIEWS & RATINGS COLLECTION ENDPOINTS
// ============================================================================

router.get('/reviews', (req: Request, res: Response): void => {
  try {
    const { productId } = req.query;
    const data = payloadStore.findReviews(productId ? String(productId) : undefined);
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/reviews', (req: Request, res: Response): void => {
  try {
    const { productId, rating, title, comment, authorName, authorEmail } = req.body;
    if (!productId || !rating || !comment) {
      res.status(400).json({ success: false, error: 'Product ID, rating (1-5), and review comment are required.' });
      return;
    }

    const review = payloadStore.createReview({
      productId,
      rating: Number(rating),
      title: title || 'Verified Patron Review',
      comment,
      authorName,
      authorEmail
    });

    res.status(201).json({
      success: true,
      doc: review,
      message: 'Verified review submitted to Payload CMS.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// PROMOTIONS & COUPONS ENDPOINTS
// ============================================================================

router.post('/promotions/validate', (req: Request, res: Response): void => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) {
      res.status(400).json({ success: false, error: 'Promotional code is required.' });
      return;
    }

    const validation = payloadStore.validateCoupon(code, Number(subtotal));
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        valid: false,
        error: validation.message,
        discountAmount: 0
      });
      return;
    }

    res.json({
      success: true,
      valid: true,
      coupon: validation.coupon,
      discountAmount: validation.discountAmount,
      message: validation.message
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// CART VALIDATION & CALCULATION ENDPOINT
// ============================================================================

router.post('/cart/validate', (req: Request, res: Response): void => {
  try {
    const { items = [], couponCode, shippingType = 'standard' } = req.body;

    let subtotal = 0;
    const validatedItems = [];
    const outOfStockItems = [];

    for (const it of items) {
      const prod = payloadStore.findProductByIdOrSlug(it.id);
      const unitPrice = prod?.numericPrice || 0;
      const qty = Math.max(1, it.quantity || 1);
      const lineSubtotal = unitPrice * qty;
      subtotal += lineSubtotal;

      const isStockAvailable = prod ? prod.inventory >= qty : true;
      if (!isStockAvailable) {
        outOfStockItems.push({
          id: it.id,
          title: prod?.title,
          requested: qty,
          available: prod?.inventory
        });
      }

      validatedItems.push({
        id: it.id,
        title: prod?.title || it.name,
        price: unitPrice,
        quantity: qty,
        subtotal: lineSubtotal,
        inventory: prod?.inventory ?? 20,
        inStock: isStockAvailable
      });
    }

    // Coupon calculation
    let discount = 0;
    let couponInfo = null;
    if (couponCode) {
      const val = payloadStore.validateCoupon(couponCode, subtotal);
      if (val.valid && val.coupon) {
        discount = val.discountAmount;
        couponInfo = val.coupon;
      }
    }

    const globals = payloadStore.getGlobalSettings();
    const isFreeShipping = (couponInfo?.discountType === 'free_shipping') || (subtotal >= globals.shipping.freeShippingThreshold);
    const shippingFee = isFreeShipping 
      ? 0 
      : (shippingType === 'express' ? globals.shipping.expressShippingRate : globals.shipping.standardShippingRate);

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * (globals.taxRatePercent / 100)).toFixed(2));
    const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

    res.json({
      success: true,
      valid: outOfStockItems.length === 0,
      financials: {
        subtotal: Number(subtotal.toFixed(2)),
        discount,
        shippingFee,
        tax,
        total,
        freeShippingThreshold: globals.shipping.freeShippingThreshold,
        qualifiesForFreeShipping: isFreeShipping
      },
      items: validatedItems,
      outOfStockItems,
      couponApplied: couponInfo
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// ORDERS COLLECTION ENDPOINTS
// ============================================================================

router.post('/orders', (req: Request, res: Response): void => {
  try {
    const { customer, items, shippingAddress, billingAddress, couponCode, paymentMethod, shippingType, notes } = req.body;

    if (!customer?.email || !items || items.length === 0 || !shippingAddress) {
      res.status(400).json({ success: false, error: 'Missing required order fields (customer email, items, or shipping address).' });
      return;
    }

    const order = payloadStore.createOrder({
      customer,
      items,
      shippingAddress,
      billingAddress,
      couponCode,
      paymentMethod,
      shippingType,
      notes
    });

    res.status(201).json({
      success: true,
      doc: order,
      message: `Payload Order ${order.orderNumber} successfully confirmed.`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/orders', (req: Request, res: Response): void => {
  try {
    const { email, customerId } = req.query;
    const orders = payloadStore.findOrdersByCustomer(email ? String(email) : undefined, customerId ? String(customerId) : undefined);
    res.json({ success: true, docs: orders, totalDocs: orders.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/orders/:idOrNumber', (req: Request, res: Response): void => {
  try {
    const order = payloadStore.findOrderById(req.params.idOrNumber);
    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }
    res.json({ success: true, doc: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/orders/:idOrNumber/status', (req: Request, res: Response): void => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ success: false, error: 'Fulfillment status is required.' });
      return;
    }

    const updated = payloadStore.updateOrderStatus(req.params.idOrNumber, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.json({
      success: true,
      doc: updated,
      message: `Order status advanced to ${status}. Live timeline updated.`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// DYNAMIC PAGE LAYOUT BLOCKS ENDPOINTS
// ============================================================================

router.get('/pages/:slug', (req: Request, res: Response): void => {
  try {
    const page = payloadStore.getPage(req.params.slug);
    if (!page) {
      res.status(404).json({ success: false, error: 'Page layout not found' });
      return;
    }
    res.json({ success: true, doc: page });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// GLOBALS ENDPOINTS
// ============================================================================

router.get('/globals', (_req: Request, res: Response): void => {
  try {
    const globals = payloadStore.getGlobalSettings();
    res.json({ success: true, globals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/globals', requireAdmin, (req: Request, res: Response): void => {
  try {
    const globals = payloadStore.updateGlobalSettings(req.body);
    payloadStore.logHookExecution('globals', 'afterChange', 'update', 'store-globals', 5, 'success', 'Updated global store configuration.');
    res.json({ success: true, globals, message: 'Payload Global Settings updated.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ============================================================================
// ACCESS CONTROL & RBAC (Payload 3.88)
// ============================================================================

router.get('/access-control/rules', (_req: Request, res: Response): void => {
  try {
    const rules = payloadStore.getAccessRules();
    res.json({ success: true, rules });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/access-control/evaluate', (req: Request, res: Response): void => {
  try {
    const { collection, operation, role = 'guest', userEmail } = req.body;
    if (!collection || !operation) {
      res.status(400).json({ success: false, error: 'Collection and operation required.' });
      return;
    }
    const evaluation = payloadStore.evaluateAccess(collection, operation, role, userEmail);
    res.json({ success: true, evaluation });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// LIFECYCLE HOOKS AUDIT TRAIL
// ============================================================================

router.get('/hooks/logs', (req: Request, res: Response): void => {
  try {
    const limit = Number(req.query.limit) || 30;
    const logs = payloadStore.getHookLogs(limit);
    res.json({ success: true, logs, total: logs.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/hooks/logs', requireAdmin, (_req: Request, res: Response): void => {
  try {
    payloadStore.clearHookLogs();
    res.json({ success: true, message: 'Lifecycle hook execution logs cleared.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// DRAFTS, VERSIONS & LIVE PREVIEW
// ============================================================================

router.get('/products/:id/versions', (req: Request, res: Response): void => {
  try {
    const versions = payloadStore.getProductVersions(req.params.id);
    res.json({ success: true, versions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/products/draft', requireAdmin, (req: Request, res: Response): void => {
  try {
    const draft = payloadStore.saveProductDraft(req.body, { email: 'admin@luxestore.com', name: 'Store Administrator' });
    res.json({ success: true, doc: draft, message: 'Product draft created and version snapshot preserved.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/products/:id/publish', requireAdmin, (req: Request, res: Response): void => {
  try {
    const published = payloadStore.publishProduct(req.params.id);
    if (!published) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, doc: published, message: 'Product published to live storefront.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/products/:id/restore/:versionId', requireAdmin, (req: Request, res: Response): void => {
  try {
    const restored = payloadStore.restoreProductVersion(req.params.id, req.params.versionId);
    if (!restored) {
      res.status(404).json({ success: false, error: 'Version not found for this product.' });
      return;
    }
    res.json({ success: true, doc: restored, message: `Product restored to version ${req.params.versionId}.` });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ============================================================================
// SECURITY & SCOPED API KEYS
// ============================================================================

router.get('/security/status', (_req: Request, res: Response): void => {
  try {
    const status = payloadStore.getSecurityStatus();
    res.json({ success: true, status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/security/keys', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const keys = payloadStore.getApiKeys();
    res.json({ success: true, keys });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/security/keys', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { name, role = 'editor', scopes = ['read:products'] } = req.body;
    if (!name) {
      res.status(400).json({ success: false, error: 'Key name is required.' });
      return;
    }
    const result = payloadStore.createApiKey(name, role, scopes);
    res.json({ success: true, ...result, message: 'Scoped API Key generated.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/security/keys/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const ok = payloadStore.revokeApiKey(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'API key not found.' });
      return;
    }
    res.json({ success: true, message: 'API key revoked.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ============================================================================
// WEBHOOKS ENDPOINTS (Stripe & Carriers)
// ============================================================================

router.get('/webhooks/events', requireAdmin, (req: Request, res: Response): void => {
  try {
    const limit = Number(req.query.limit) || 20;
    const events = payloadStore.getWebhookEvents(limit);
    res.json({ success: true, events });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/webhooks/stripe', (req: Request, res: Response): void => {
  try {
    const signature = req.headers['stripe-signature'] as string || 'header-signature-mock';
    const { event = 'payment_intent.succeeded', payload = req.body } = req.body;
    const eventRecord = payloadStore.processWebhook('stripe', event, payload, signature);
    res.json({ received: true, event: eventRecord });
  } catch (error: any) {
    res.status(400).json({ received: false, error: error.message });
  }
});

router.post('/webhooks/simulate', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { provider = 'stripe', event = 'payment_intent.succeeded', payload = {}, signature } = req.body;
    const eventRecord = payloadStore.processWebhook(provider, event, payload, signature || 'sig_verified_hmac_sha256');
    res.json({ success: true, event: eventRecord });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ============================================================================
// FORM BUILDER PLUGIN ENDPOINTS (PAYLOAD 3.88)
// ============================================================================

router.get('/forms', (_req: Request, res: Response): void => {
  try {
    const docs = payloadStore.findForms();
    res.json({ success: true, docs, totalDocs: docs.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/forms/:id', (req: Request, res: Response): void => {
  try {
    const doc = payloadStore.findFormById(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Form definition not found.' });
      return;
    }
    res.json({ success: true, doc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/forms', requireAdmin, (req: Request, res: Response): void => {
  try {
    const doc = payloadStore.saveForm(req.body);
    res.status(201).json({ success: true, doc, message: `Form "${doc.title}" saved.` });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/forms/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const success = payloadStore.deleteForm(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Form not found.' });
      return;
    }
    res.json({ success: true, message: 'Form definition removed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/forms/:id/submit', (req: Request, res: Response): void => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const result = payloadStore.submitForm(req.params.id, req.body, clientIp);
    res.status(201).json({ success: true, ...result, message: result.form.confirmationMessage || 'Submission received.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/forms/:id/submissions', requireAdmin, (req: Request, res: Response): void => {
  try {
    const limit = Number(req.query.limit) || 50;
    const docs = payloadStore.getFormSubmissions(req.params.id === 'all' ? undefined : req.params.id, limit);
    res.json({ success: true, docs, totalDocs: docs.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// REDIRECTS PLUGIN ENDPOINTS (PAYLOAD 3.88)
// ============================================================================

router.get('/redirects', (_req: Request, res: Response): void => {
  try {
    const docs = payloadStore.findRedirects();
    res.json({ success: true, docs, totalDocs: docs.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/redirects/lookup', (req: Request, res: Response): void => {
  try {
    const pathname = String(req.query.pathname || '');
    const redirect = payloadStore.lookupRedirect(pathname);
    res.json({ success: true, redirect });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/redirects', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { from, to, statusCode } = req.body;
    if (!from || !to) {
      res.status(400).json({ success: false, error: '"from" and "to" are required fields for a redirect rule.' });
      return;
    }
    const doc = payloadStore.saveRedirect({ from, to, statusCode });
    res.status(201).json({ success: true, doc, message: 'Redirect rule registered.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/redirects/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const success = payloadStore.deleteRedirect(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Redirect rule not found.' });
      return;
    }
    res.json({ success: true, message: 'Redirect rule deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// SEO SETTINGS & PLUGIN ENDPOINTS (PAYLOAD 3.88)
// ============================================================================

router.get('/seo', (_req: Request, res: Response): void => {
  try {
    const settings = payloadStore.getSEOSettings();
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/seo', requireAdmin, (req: Request, res: Response): void => {
  try {
    const settings = payloadStore.updateSEOSettings(req.body);
    res.json({ success: true, settings, message: 'SEO configuration updated.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
