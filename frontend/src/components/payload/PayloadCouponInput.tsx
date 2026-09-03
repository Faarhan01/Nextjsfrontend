'use client';

import React, { useState } from 'react';
import { Tag, Check, X, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { payload } from '../../services/payloadClient';
import { PayloadCouponDoc } from '../../types/payload';

interface PayloadCouponInputProps {
  subtotal: number;
  appliedCoupon: PayloadCouponDoc | null;
  discountAmount: number;
  onApplyCoupon: (coupon: PayloadCouponDoc, discount: number) => void;
  onRemoveCoupon: () => void;
  className?: string;
}

export function PayloadCouponInput({
  subtotal,
  appliedCoupon,
  discountAmount,
  onApplyCoupon,
  onRemoveCoupon,
  className = ''
}: PayloadCouponInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await payload.promotions.validate(code.trim(), subtotal);
      if (res.valid && res.coupon) {
        onApplyCoupon(res.coupon, res.discountAmount);
        setCode('');
      } else {
        setError(res.message || 'Invalid promotional code.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to validate coupon.');
    } finally {
      setLoading(false);
    }
  };

  const quickCodes = ['WELCOME10', 'LUXE50', 'FREESHIP'];

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          Payload Promo Code
        </label>
        {appliedCoupon && (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Applied
          </span>
        )}
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
              {appliedCoupon.code}
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400">
              ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% OFF` : appliedCoupon.discountType === 'fixed' ? `$${appliedCoupon.discountValue} OFF` : 'Free Shipping'})
            </span>
            {discountAmount > 0 && (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                -${discountAmount.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={onRemoveCoupon}
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
            title="Remove Promo Code"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="e.g. WELCOME10"
              className="flex-1 px-3 py-2 text-sm uppercase rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Apply
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </p>
          )}

          {/* Quick Click Suggestions */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 shrink-0 font-medium">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Available:
            </span>
            {quickCodes.map((qc) => (
              <button
                key={qc}
                type="button"
                onClick={() => {
                  setCode(qc);
                  setError(null);
                }}
                className="px-2 py-0.5 rounded border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-mono transition-colors shrink-0"
              >
                {qc}
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
}
