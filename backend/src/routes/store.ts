import { Router } from 'express';
import {
  listProducts,
  retrieveProduct,
  listProductCategories,
  listCollections,
  listRegions,
  retrieveRegion,
  createCart,
  retrieveCart,
  updateCart,
  addLineItem,
  updateLineItem,
  deleteLineItem,
  completeCart,
  listShippingOptions,
  addShippingMethod,
  createPaymentSessions,
  listBrands,
  lookupOrder,
  listSellers
} from '../controllers/storeController.ts';
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetMe,
  handleUpdateMe,
  handleGetCustomerOrders,
  handleGetAllUsers
} from '../controllers/authController.ts';
import { handleConcierge } from '../controllers/aiController.ts';
import { handleHealth } from '../controllers/healthController.ts';
import { getSyncStatus, performSyncAction } from '../controllers/syncController.ts';

const router = Router();

// Health check
router.get('/health', handleHealth);

// Products
router.get('/products', listProducts);
router.get('/products/:id', retrieveProduct);

// Categories
router.get('/categories', listProductCategories);
router.get('/product-categories', listProductCategories);

// Collections & Brands
router.get('/collections', listCollections);
router.get('/brands', listBrands);

// Sellers
router.get('/sellers', listSellers);

// Regions
router.get('/regions', listRegions);
router.get('/regions/:id', retrieveRegion);

// Shipping options
router.get('/shipping-options', listShippingOptions);
router.get('/shipping-options/:cartId', listShippingOptions);

// Cart
router.post('/carts', createCart);
router.get('/carts/:id', retrieveCart);
router.post('/carts/:id', updateCart);
router.post('/carts/:id/line-items', addLineItem);
router.post('/carts/:id/line-items/:lineId', updateLineItem);
router.delete('/carts/:id/line-items/:lineId', deleteLineItem);
router.post('/carts/:id/shipping-methods', addShippingMethod);
router.post('/carts/:id/payment-sessions', createPaymentSessions);
router.post('/carts/:id/complete', completeCart);

// Also alias /cart for simple REST
router.get('/cart/:id', retrieveCart);
router.post('/cart', createCart);
router.post('/cart/:id/items', addLineItem);
router.delete('/cart/:id/items/:lineId', deleteLineItem);

// Auth
router.post('/auth/login', handleLogin);
router.post('/auth/register', handleRegister);
router.post('/auth', handleLogin);
router.get('/auth', handleGetMe);
router.delete('/auth', handleLogout);
router.get('/auth/users', handleGetAllUsers);

// Customer account routes
router.get('/customers/me', handleGetMe);
router.post('/customers/me', handleUpdateMe);
router.get('/customers/me/orders', handleGetCustomerOrders);

// Orders
router.get('/orders/:id', lookupOrder);

// AI Concierge
router.post('/ai/concierge', handleConcierge);

// Database Synchronization
router.get('/sync', getSyncStatus);
router.post('/sync', performSyncAction);

export default router;
