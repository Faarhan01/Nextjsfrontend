'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Check, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import { PayloadAddress } from '../../types/payload';

interface PayloadAddressBookProps {
  selectedAddressId?: string;
  onSelectAddress: (address: PayloadAddress) => void;
  className?: string;
}

const DEFAULT_ADDRESSES: PayloadAddress[] = [
  {
    id: 'addr-1',
    label: 'Primary Residence',
    name: 'Alexander Vance',
    street: '1 Executive Plaza, Suite 40B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    phone: '+1 (555) 992-1083',
    isDefaultShipping: true,
    isDefaultBilling: true
  },
  {
    id: 'addr-2',
    label: 'Vacation Villa',
    name: 'Alexander Vance',
    street: '884 Bel Air Road',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90077',
    country: 'United States',
    phone: '+1 (555) 349-2041',
    isDefaultShipping: false,
    isDefaultBilling: false
  }
];

export function PayloadAddressBook({
  selectedAddressId,
  onSelectAddress,
  className = ''
}: PayloadAddressBookProps) {
  const [addresses, setAddresses] = useState<PayloadAddress[]>(DEFAULT_ADDRESSES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState<Partial<PayloadAddress>>({
    label: 'Home',
    country: 'United States'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.street || !newAddr.city || !newAddr.state || !newAddr.zip) return;

    const created: PayloadAddress = {
      id: `addr-${Date.now()}`,
      label: newAddr.label || 'Other',
      name: newAddr.name,
      street: newAddr.street,
      apartment: newAddr.apartment,
      city: newAddr.city,
      state: newAddr.state,
      zip: newAddr.zip,
      country: newAddr.country || 'United States',
      phone: newAddr.phone,
      isDefaultShipping: false,
      isDefaultBilling: false
    };

    setAddresses([...addresses, created]);
    onSelectAddress(created);
    setShowAddModal(false);
    setNewAddr({ label: 'Home', country: 'United States' });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    if (selectedAddressId === id && updated.length > 0) {
      onSelectAddress(updated[0]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Shipping Address (Payload Address Book)
        </label>
        <button
          type="button"
          onClick={() => setShowAddModal(!showAddModal)}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Address
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId ? selectedAddressId === addr.id : addr.isDefaultShipping;

          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress(addr)}
              className={`relative p-4 rounded-xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {addr.label || 'Address'}
                  </span>
                  {addr.isDefaultShipping && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Default
                    </span>
                  )}
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                <p className="font-semibold text-slate-900 dark:text-slate-200">{addr.name}</p>
                <p>{addr.street}</p>
                {addr.apartment && <p>{addr.apartment}</p>}
                <p>{addr.city}, {addr.state} {addr.zip}</p>
                <p>{addr.country}</p>
                {addr.phone && <p className="text-slate-500">{addr.phone}</p>}
              </div>

              {addresses.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => handleDelete(addr.id, e)}
                  className="absolute bottom-3 right-3 text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Remove Address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Address Modal / Form */}
      {showAddModal && (
        <form onSubmit={handleAdd} className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Add New Delivery Address
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Label</label>
              <input
                type="text"
                placeholder="e.g. Office, Home"
                value={newAddr.label || ''}
                onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Recipient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jane Smith"
                value={newAddr.name || ''}
                onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Street Address *</label>
              <input
                type="text"
                required
                placeholder="123 Luxury Ave, Apt 4B"
                value={newAddr.street || ''}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">City *</label>
              <input
                type="text"
                required
                placeholder="Beverly Hills"
                value={newAddr.city || ''}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">State *</label>
                <input
                  type="text"
                  required
                  placeholder="CA"
                  value={newAddr.state || ''}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">ZIP *</label>
                <input
                  type="text"
                  required
                  placeholder="90210"
                  value={newAddr.zip || ''}
                  onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Address
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
