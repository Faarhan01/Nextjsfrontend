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
  lookupOrder
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

// Medusa Store API surface
router.get('/health', handleHealth);

// Products
router.get('/products', listProducts);
router.get('/products/:id', retrieveProduct);

// Product categories
router.get('/product-categories', listProductCategories);

// Collections
router.get('/collections', listCollections);

// Brands
router.get('/brands', listBrands);

// Regions
router.get('/regions', listRegions);
router.get('/regions/:id', retrieveRegion);

// Shipping options
router.get('/shipping-options', listShippingOptions);
router.get('/shipping-options/:cartId', listShippingOptions);

// Carts
router.post('/carts', createCart);
router.get('/carts/:id', retrieveCart);
router.post('/carts/:id', updateCart);
router.post('/carts/:id/line-items', addLineItem);
router.post('/carts/:id/line-items/:lineId', updateLineItem);
router.delete('/carts/:id/line-items/:lineId', deleteLineItem);
router.post('/carts/:id/shipping-methods', addShippingMethod);
router.post('/carts/:id/payment-sessions', createPaymentSessions);
router.post('/carts/:id/complete', completeCart);

// Auth (customers)
router.post('/auth', handleLogin);
router.get('/auth', handleGetMe);
router.delete('/auth', handleLogout);
router.post('/auth/register', handleRegister);
router.get('/auth/users', handleGetAllUsers);

// Customers me routes
router.get('/customers/me', handleGetMe);
router.post('/customers/me', handleUpdateMe);
router.get('/customers/me/orders', handleGetCustomerOrders);

// Orders (read-only tracking)
router.get('/orders/:id', lookupOrder);

// AI concierge (auxiliary, kept under store namespace for Medusa-style discoverability)
router.post('/ai/concierge', handleConcierge);

// Database Synchronization across Google AI Studio and GitHub instances
router.get('/sync', getSyncStatus);
router.post('/sync', performSyncAction);

export default router;