'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock, PackageCheck, Truck, Home, ExternalLink } from 'lucide-react';
import { PayloadOrderDoc, PayloadOrderTimelineStep } from '../../types/payload';

interface PayloadOrderTimelineProps {
  order: PayloadOrderDoc;
  className?: string;
}

export function PayloadOrderTimeline({ order, className = '' }: PayloadOrderTimelineProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'shipped':
      case 'in_transit':
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Order {order.orderNumber}
            </h3>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(order.fulfillmentStatus)} capitalize`}>
              {order.fulfillmentStatus.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {order.trackingNumber && (
          <div className="flex items-center gap-2">
            <a
              href={order.trackingUrl || `https://www.fedex.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{order.shippingCarrier || 'FedEx'}: {order.trackingNumber}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="py-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {order.timeline.map((step: PayloadOrderTimelineStep, idx: number) => {
            const isCompleted = step.completed;
            const isCurrent = step.current;

            return (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white ring-4 ring-blue-50 dark:ring-blue-950/60'
                      : isCurrent
                      ? 'bg-amber-500 text-white ring-4 ring-amber-50 dark:ring-amber-950/60 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Clock className="w-3 h-3" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 fill-current" />
                  )}
                </div>

                <div className="pl-3">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {step.title}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {step.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {step.description}
                  </p>
                  {step.location && (
                    <span className="inline-block mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">
                      📍 {step.location}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financials & Summary */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Shipping Destination:
          </span>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {order.shippingAddress.name}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
          </p>
        </div>

        <div className="space-y-1 sm:text-right">
          <div className="flex sm:justify-end justify-between gap-4 text-slate-500 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-mono font-medium">${order.financials.subtotal.toFixed(2)}</span>
          </div>
          {order.financials.discount > 0 && (
            <div className="flex sm:justify-end justify-between gap-4 text-emerald-600 dark:text-emerald-400">
              <span>Discount ({order.couponApplied?.code}):</span>
              <span className="font-mono font-bold">-${order.financials.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex sm:justify-end justify-between gap-4 text-slate-500 dark:text-slate-400">
            <span>Shipping:</span>
            <span className="font-mono font-medium">{order.financials.shippingFee === 0 ? 'Free' : `$${order.financials.shippingFee.toFixed(2)}`}</span>
          </div>
          <div className="flex sm:justify-end justify-between gap-4 text-slate-500 dark:text-slate-400">
            <span>Tax (8%):</span>
            <span className="font-mono font-medium">${order.financials.tax.toFixed(2)}</span>
          </div>
          <div className="flex sm:justify-end justify-between gap-4 text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">
            <span>Total Paid:</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">${order.financials.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
