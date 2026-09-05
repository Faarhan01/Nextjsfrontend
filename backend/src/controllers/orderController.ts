import { Response } from 'express';
import { createOrder, getOrderById, getOrdersByUser, updateOrderStatus, getStoreStats } from '../services/orderStore.ts';
import { AuthenticatedRequest } from '../types/index.ts';

export function handleCreateOrder(req: AuthenticatedRequest, res: Response): void {
  try {
    const { items, shippingAddress, subtotal, shippingFee, tax, total, paymentMethod, email } = req.body || {};
    
    if (!items || !items.length) {
      res.status(400).json({ success: false, error: 'Cart items are required to place an order.' });
      return;
    }

    const orderEmail = email || req.user?.email || 'customer@example.com';
    const order = createOrder({
      userId: req.user?.id,
      email: orderEmail,
      shippingAddress,
      items,
      subtotal: subtotal || total || 0,
      shippingFee,
      tax,
      total: total || subtotal || 0,
      paymentMethod
    });

    res.json({ success: true, order, message: `Order #${order.id} placed successfully!` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create order.' });
  }
}

export function handleTrackOrder(req: AuthenticatedRequest, res: Response): void {
  try {
    const order = getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, error: `No active shipment found for Order ID #${req.params.id}.` });
      return;
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Tracking lookup failed.' });
  }
}

export function handleGetUserOrders(req: AuthenticatedRequest, res: Response): void {
  try {
    const email = (req.query.email as string) || req.user?.email;
    const userId = req.user?.id;
    const orders = getOrdersByUser(userId, email);
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch user orders.' });
  }
}

export function handleUpdateOrderStatus(req: AuthenticatedRequest, res: Response): void {
  try {
    const { status } = req.body || {};
    const updated = updateOrderStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }
    res.json({ success: true, order: updated, message: `Order status updated to ${status}.` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update order status.' });
  }
}

export function handleGetStoreStats(req: AuthenticatedRequest, res: Response): void {
  try {
    const stats = getStoreStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to load store statistics.' });
  }
}
